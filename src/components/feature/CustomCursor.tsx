import { useEffect, useRef, useCallback } from 'react';

/**
 * CustomCursor
 *
 * BROWSING MODE (default):
 *   - Idle:  6px white dot
 *   - Hover: 40px white circle  (mix-blend-mode: difference → B&W inversion)
 *
 * VIDEO ACTIVE MODE (while lightbox is open):
 *   - Locked to 6px dot regardless of what's under the cursor
 *   - No expansion, no inversion circle — clean watch experience
 *   - Snaps back to full behaviour the instant the lightbox closes
 *
 * Signals:
 *   window.dispatchEvent(new CustomEvent('cursor:video-active'))   → lock
 *   window.dispatchEvent(new CustomEvent('cursor:video-inactive')) → unlock
 *
 * Performance:
 *   - translate3d → GPU compositing, zero layout/paint on move
 *   - contain: layout style paint → isolated render, no video pixel recalc
 *   - pointer-events: none → never blocks clicks or native controls
 *   - z-index: 2^31-1 → above everything except system fullscreen overlays
 *
 * Auto-hide:
 *   - Stationary for 2s → fade to opacity 0
 *   - Any movement → instant opacity 1
 */

const IDLE_SIZE  = 6;
const HOVER_SIZE = 40;
const HIDE_DELAY = 2000;

/**
 * Returns true if the device is touch-only or has a screen ≤ 1024px.
 * In that case the custom cursor should not be rendered at all.
 */
function isTouchOrMobile(): boolean {
  if (typeof window === 'undefined') return false;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const smallScreen   = window.innerWidth <= 1024;
  return coarsePointer || smallScreen;
}

const HOVER_SELECTOR = [
  'a', 'button', 'label', 'select', 'input',
  '[role="button"]', '[role="link"]', '[tabindex]',
  '[data-cursor-hover]',
  '.hs', '.hs-block', '.hs-card',
  'video', 'iframe', '.video-container', '.player',
  'svg', 'img',
].join(', ');

/** Inner component — only mounted on desktop pointer devices */
function DesktopCursor() {
  const dotRef        = useRef<HTMLDivElement>(null);
  const hoveredRef    = useRef(false);
  const videoActiveRef = useRef(false);   // true while lightbox is open
  const posRef        = useRef({ x: -200, y: -200 });
  const hideTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Position: direct style write, zero lerp ── */
  const applyPos = useCallback((x: number, y: number) => {
    const el = dotRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
  }, []);

  /* ── Opacity ── */
  const show = useCallback(() => {
    const el = dotRef.current;
    if (el) el.style.opacity = '1';
  }, []);

  const hide = useCallback(() => {
    const el = dotRef.current;
    if (el) el.style.opacity = '0';
  }, []);

  const resetHideTimer = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    show();
    hideTimerRef.current = setTimeout(hide, HIDE_DELAY);
  }, [show, hide]);

  /* ── Size: only transitions width/height ── */
  const setSize = useCallback((size: number) => {
    const el = dotRef.current;
    if (!el) return;
    el.style.width        = `${size}px`;
    el.style.height       = `${size}px`;
    el.style.borderRadius = '50%';
  }, []);

  const setHover = useCallback((on: boolean) => {
    if (hoveredRef.current === on) return;
    hoveredRef.current = on;
    /* In video-active mode, expansion is always blocked */
    if (videoActiveRef.current) {
      setSize(IDLE_SIZE);
      return;
    }
    setSize(on ? HOVER_SIZE : IDLE_SIZE);
  }, [setSize]);

  useEffect(() => {
    /* ── Mouse tracking ── */
    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      applyPos(e.clientX, e.clientY);
      resetHideTimer();
      const target = e.target as Element | null;
      setHover(target ? !!target.closest(HOVER_SELECTOR) : false);
    };

    const onLeave = () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      applyPos(-200, -200);
    };

    const onEnter = () => {
      applyPos(posRef.current.x, posRef.current.y);
      resetHideTimer();
    };

    /* ── Video lightbox signals ── */
    const onVideoActive = () => {
      videoActiveRef.current = true;
      /* Add class to <html> → CSS restores system cursor + hides dot */
      document.documentElement.classList.add('video-playing');
      setSize(IDLE_SIZE);
      hoveredRef.current = false;
    };

    const onVideoInactive = () => {
      videoActiveRef.current = false;
      /* Remove class → CSS hides system cursor + shows dot again */
      document.documentElement.classList.remove('video-playing');
      /* Re-evaluate hover at current position */
      const el = document.elementFromPoint(posRef.current.x, posRef.current.y);
      hoveredRef.current = false;
      setHover(el ? !!el.closest(HOVER_SELECTOR) : false);
    };

    document.addEventListener('mousemove',  onMove,  { passive: true });
    document.addEventListener('mouseleave', onLeave, { passive: true });
    document.addEventListener('mouseenter', onEnter, { passive: true });
    window.addEventListener('cursor:video-active',   onVideoActive);
    window.addEventListener('cursor:video-inactive', onVideoInactive);

    resetHideTimer();

    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      /* Always restore system cursor on unmount */
      document.documentElement.classList.remove('video-playing');
      document.removeEventListener('mousemove',  onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      window.removeEventListener('cursor:video-active',   onVideoActive);
      window.removeEventListener('cursor:video-inactive', onVideoInactive);
    };
  }, [applyPos, setHover, setSize, resetHideTimer]);

  return (
    <div
      ref={dotRef}
      className="custom-cursor-dot"
      aria-hidden="true"
      style={{
        position:        'fixed',
        top:             0,
        left:            0,
        width:           `${IDLE_SIZE}px`,
        height:          `${IDLE_SIZE}px`,
        borderRadius:    '50%',
        backgroundColor: '#ffffff',
        mixBlendMode:    'difference',
        zIndex:          2147483647,
        pointerEvents:   'none',
        transform:       'translate3d(-200px,-200px,0) translate(-50%,-50%)',
        willChange:      'transform, width, height, opacity',
        /* Isolated render — prevents video pixel recalc causing flicker */
        contain:         'layout style paint',
        transition: [
          'width   0.25s cubic-bezier(0.25,1,0.5,1)',
          'height  0.25s cubic-bezier(0.25,1,0.5,1)',
          'opacity 0.4s  ease',
        ].join(', '),
      }}
    />
  );
}

/**
 * Public export — renders nothing on touch/mobile devices.
 * The DesktopCursor inner component is only mounted when a fine pointer
 * (mouse) is detected AND the viewport is wider than 1024px.
 */
export default function CustomCursor() {
  if (isTouchOrMobile()) return null;
  return <DesktopCursor />;
}
