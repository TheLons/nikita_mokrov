import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { worksSections, WorkItem, TrailerItem } from '@/mocks/works';
import { useAudio } from '@/context/AudioContext';

/* ─── Video Lightbox ────────────────────────────────────────── */
interface VideoLightboxProps {
  item: TrailerItem;
  onClose: () => void;
}

function VideoLightbox({ item, onClose }: VideoLightboxProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  /* Signal cursor: video is active → lock to dot mode */
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('cursor:video-active'));

    /* Also hide cursor when browser enters/exits native fullscreen */
    const onFullscreen = () => {
      if (document.fullscreenElement) {
        window.dispatchEvent(new CustomEvent('cursor:video-active'));
      } else {
        /* Still in lightbox — keep cursor hidden until lightbox closes */
        window.dispatchEvent(new CustomEvent('cursor:video-active'));
      }
    };
    document.addEventListener('fullscreenchange', onFullscreen);

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreen);
      window.dispatchEvent(new CustomEvent('cursor:video-inactive'));
    };
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 280);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ background: `rgba(0,0,0,${visible ? 0.94 : 0})`, transition: 'background 0.28s ease' }}
      onClick={handleClose}
    >
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 flex items-center justify-center cursor-pointer"
        style={{
          width: '44px', height: '44px', background: 'none',
          border: '1px solid rgba(245,245,245,0.2)', color: '#F5F5F5',
          opacity: visible ? 1 : 0, transition: 'opacity 0.28s ease',
        }}
        aria-label="Close video"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <line x1="1" y1="1" x2="13" y2="13" stroke="#F5F5F5" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="13" y1="1" x2="1" y2="13" stroke="#F5F5F5" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <div
        className="relative w-full"
        style={{
          maxWidth: 'min(90vw, 1280px)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.96)',
          transition: 'opacity 0.28s ease, transform 0.28s cubic-bezier(0.4,0,0.2,1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${item.videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="flex items-center justify-between mt-4" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.35s ease 0.1s' }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', color: '#AAAAAA' }}>{item.title}</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#4A4A4A' }}>{item.year}</span>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2" style={{ opacity: visible ? 0.35 : 0, transition: 'opacity 0.4s ease 0.2s' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#F5F5F5', letterSpacing: '0.12em' }}>
          ESC TO CLOSE
        </span>
      </div>
    </div>,
    document.body
  );
}

/* ─── Trailer Card ──────────────────────────────────────────── */
function TrailerCard({ item }: { item: TrailerItem }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Disable hover state on touch devices to prevent sticky hover
  const handleMouseEnter = () => {
    if (window.matchMedia('(hover: hover)').matches) {
      setHovered(true);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <div
          className="relative w-full overflow-hidden cursor-pointer"
          style={{ paddingBottom: '56.25%' }}
          onClick={() => setLightboxOpen(true)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => setHovered(false)}
        >
          <img
            src={item.thumbnail}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover object-top"
            style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)', transition: 'transform 350ms cubic-bezier(0.4,0,0.2,1)' }}
          />
          <div className="absolute inset-0 transition-colors duration-300" style={{ background: hovered ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.52)' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="flex items-center justify-center"
              style={{
                width: '48px', height: '48px',
                border: `1px solid rgba(245,245,245,${hovered ? 0.9 : 0.4})`,
                transform: hovered ? 'scale(1.08)' : 'scale(1)',
                transition: 'transform 0.3s ease, border-color 0.3s ease',
              }}
            >
              <div className="ml-1" style={{ width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '14px solid #F5F5F5' }} />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', color: '#AAAAAA' }}>{item.title}</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#4A4A4A' }}>{item.year}</span>
        </div>
      </div>
      {lightboxOpen && <VideoLightbox item={item} onClose={() => setLightboxOpen(false)} />}
    </>
  );
}

/* ─── Track Row ─────────────────────────────────────────────── */
interface TrackRowProps {
  number: string;
  title: string;
  coverImage: string;
  albumName: string;
  audioUrl?: string;
  trackKey: string;
}

function TrackRow({ number, title, coverImage, albumName, audioUrl, trackKey }: TrackRowProps) {
  const { activeTrack, setActiveTrack, isPlaying, setIsPlaying } = useAudio();
  const [hovered, setHovered] = useState(false);
  const isActive = activeTrack?.trackKey === trackKey;

  const handleMouseEnter = () => {
    if (window.matchMedia('(hover: hover)').matches) {
      setHovered(true);
    }
  };

  const handleClick = () => {
    if (!audioUrl) return;
    if (isActive) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveTrack({ title, albumName, coverImage, audioUrl, trackKey });
      setIsPlaying(true);
    }
  };

  return (
    <div
      className="group relative flex items-center border-b border-[#1A1A1A] overflow-hidden"
      style={{
        height: '56px',
        paddingLeft: 'clamp(24px, 4vw, 64px)',
        paddingRight: 'clamp(16px, 4vw, 64px)',
        cursor: audioUrl ? 'pointer' : 'default',
        background: isActive ? '#111111' : 'transparent',
        transition: 'background 0.2s ease',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Hover thumbnail */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: hovered && !isActive ? 1 : 0, transition: 'opacity 0.4s cubic-bezier(0.4,0,0.2,1)' }}
      >
        <div className="absolute inset-0 bg-[#0D0D0D]" />
        <img
          src={coverImage}
          alt=""
          className="absolute right-0 top-0 h-full w-40 object-cover object-top"
          style={{
            maskImage: 'linear-gradient(to left, rgba(0,0,0,0.22) 0%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.22) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* Active left accent */}
      {isActive && <div className="absolute left-0 top-0 bottom-0" style={{ width: '2px', background: '#F5F5F5' }} />}

      {/* Number */}
      <span
        className="relative text-[#3A3A3A] text-[11px] shrink-0 md:group-hover:text-[#5A5A5A] transition-colors duration-200"
        style={{ fontFamily: "'JetBrains Mono', monospace", minWidth: '28px' }}
      >
        {number}
      </span>

      {/* Micro play icon */}
      {audioUrl && (
        <span
          className="relative shrink-0 ml-4 mr-2 flex items-center justify-center transition-colors duration-200"
          style={{ width: '16px', height: '16px', color: isActive ? '#F5F5F5' : '#3A3A3A' }}
        >
          {isActive && isPlaying ? (
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
              <rect x="0" y="0" width="3" height="12" fill="currentColor" />
              <rect x="7" y="0" width="3" height="12" fill="currentColor" />
            </svg>
          ) : (
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
              <polygon points="0,0 10,6 0,12" fill="currentColor" />
            </svg>
          )}
        </span>
      )}

      {/* Title */}
      <span
        className="relative font-light tracking-[-0.01em] flex-1 ml-4 transition-colors duration-200 truncate pr-6"
        style={{
          fontSize: 'clamp(13px, 1.4vw, 15px)',
          fontFamily: "'Space Grotesk', sans-serif",
          color: isActive ? '#F5F5F5' : '#CCCCCC',
        }}
      >
        {title}
      </span>

      {/* Active indicator dot */}
      {isActive && (
        <span
          className="relative shrink-0"
          style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#F5F5F5', display: 'inline-block' }}
        />
      )}
    </div>
  );
}

/* ─── Work Item Row (album/event with cover image) ──────────── */
interface WorkItemRowProps {
  item: WorkItem;
  sectionId: string;
  isOpen: boolean;
  onToggle: () => void;
}

function WorkItemRow({ item, sectionId, isOpen, onToggle }: WorkItemRowProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!contentRef.current) return;
    setHeight(isOpen ? contentRef.current.scrollHeight : 0);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !contentRef.current) return;
    const ro = new ResizeObserver(() => {
      if (contentRef.current && isOpen) setHeight(contentRef.current.scrollHeight);
    });
    ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, [isOpen]);

  const isTrailers = item.trailers && item.trailers.length > 0;
  const isPermanentlyOpen = item.id === 'trailers' || sectionId === 'seasonal-events';

  return (
    <div className="border-b border-[#1A1A1A]">
      {/* Item header */}
      <div
        className={`group flex items-center transition-colors duration-200 ${isPermanentlyOpen ? 'cursor-default' : 'cursor-pointer md:hover:bg-[#161616]'}`}
        style={{
          paddingTop: 'clamp(12px, 1.5vw, 18px)',
          paddingBottom: 'clamp(12px, 1.5vw, 18px)',
          paddingLeft: 'clamp(20px, 4vw, 64px)',
          paddingRight: 'clamp(16px, 4vw, 64px)',
          minHeight: '80px',
        }}
        onClick={isPermanentlyOpen ? undefined : onToggle}
      >
        {/* Number */}
        <span
          className="text-[#3A3A3A] shrink-0 md:group-hover:text-[#5A5A5A] transition-colors duration-200 mr-5"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', minWidth: '24px' }}
        >
          {item.number}
        </span>

        {/* Square cover image */}
        <div
          className="hs-card shrink-0 mr-5"
          style={{ width: 'clamp(52px, 5.5vw, 72px)', height: 'clamp(52px, 5.5vw, 72px)' }}
        >
          <img
            src={item.coverImage}
            alt={item.name}
            className="w-full h-full object-cover object-center"
            style={{
              filter: item.colorThumbnail
                ? 'none'
                : item.dimThumbnail
                  ? 'grayscale(100%) brightness(0.6)'
                  : isOpen ? 'grayscale(0%) brightness(1)' : 'grayscale(100%) brightness(0.5)',
              opacity: item.dimThumbnail ? (isOpen ? 0.55 : 0.18) : 1,
              transition: 'filter 0.4s ease, opacity 0.4s ease',
            }}
          />
        </div>

        {/* Title + subtitle */}
        <div className="flex flex-col flex-1 min-w-0">
          <span
            className="text-[#DDDDDD] font-medium tracking-[-0.02em] md:group-hover:text-[#F5F5F5] transition-colors duration-200 leading-tight"
            style={{ fontSize: 'clamp(13px, 1.8vw, 18px)', fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {item.name}
          </span>
          {item.subtitle && (
            <span
              className="text-[#3A3A3A] tracking-[0.1em] uppercase mt-1"
              style={{ fontSize: 'clamp(9px, 0.75vw, 10px)', fontFamily: "'JetBrains Mono', monospace" }}
            >
              {item.subtitle}
            </span>
          )}
        </div>

        {/* Toggle indicator — hidden for permanently open items */}
        {!isPermanentlyOpen && (
          <span
            className="shrink-0 ml-5 transition-all duration-300"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '16px',
              color: isOpen ? '#F5F5F5' : '#3A3A3A',
              lineHeight: 1,
            }}
          >
            {isOpen ? '−' : '+'}
          </span>
        )}
      </div>

      {/* Expandable content */}
      <div style={{ height: `${height}px`, overflow: 'hidden', transition: 'height 0.5s cubic-bezier(0.4,0,0.2,1)' }}>
        <div ref={contentRef} style={{ background: '#0C0C0C' }}>
          {/* ── Spotify embed — shown only when spotifyEmbedUrl is set ── */}
          {item.spotifyEmbedUrl && (
            <div
              style={{
                paddingLeft: 'clamp(20px, 4vw, 64px)',
                paddingRight: 'clamp(20px, 4vw, 64px)',
                marginTop: '20px',
                marginBottom: '8px',
                overflow: 'hidden',
              }}
            >
              <iframe
                style={{ borderRadius: '12px', display: 'block' }}
                src="https://open.spotify.com/embed/album/1Z21Z1eW6NisqEAtH53D5K?utm_source=generator&theme=0"
                width="100%"
                height="352"
                frameBorder={0}
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                loading="lazy"
                title="WAR THUNDER: Mobile, Vol. 1 — Spotify"
              />
            </div>
          )}
          {isTrailers && item.trailers ? (
            <div
              className="grid gap-5 md:gap-6"
              style={{
                padding: 'clamp(20px, 3vw, 40px) clamp(20px, 4vw, 64px)',
                gridTemplateColumns: 'repeat(2, 1fr)',
              }}
            >
              {item.trailers.map((trailer) => (
                <TrailerCard key={trailer.id} item={trailer} />
              ))}
            </div>
          ) : (
            <div>
              {item.tracks?.map((track) => {
                const trackKey = `${sectionId}-${item.id}-${track.number}`;
                return (
                  <TrackRow
                    key={trackKey}
                    number={track.number}
                    title={track.title}
                    coverImage={item.coverImage}
                    albumName={item.name}
                    audioUrl={track.audioUrl}
                    trackKey={trackKey}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Section Block ─────────────────────────────────────────── */
interface SectionBlockProps {
  sectionId: string;
  sectionNumber: string;
  sectionTitle: string;
  items: WorkItem[];
}

function SectionBlock({ sectionId, sectionNumber, sectionTitle, items }: SectionBlockProps) {
  const [openItemIds, setOpenItemIds] = useState<Set<string>>(() => {
    // If seasonal-events, open all items by default
    if (sectionId === 'seasonal-events') {
      return new Set(items.map(item => item.id));
    }
    return new Set();
  });

  // If this is the trailers section, we show the grid directly without rows
  const isTrailersSection = sectionId === 'cinematic-trailers';

  const toggleItem = (id: string) => {
    if (sectionId === 'seasonal-events') return;
    setOpenItemIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        // Only allow closing if it's not the seasonal section or if you want to allow manual closing there too
        next.delete(id);
      } else {
        // If it's official-albums, we close all others first (accordion mode)
        if (sectionId === 'official-albums') {
          next.clear();
        }
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="border-t border-[#1E1E1E]">
      {/* Section header */}
      <div
        style={{
          paddingTop: 'clamp(32px, 4vw, 56px)',
          paddingBottom: 'clamp(20px, 2.5vw, 32px)',
          paddingLeft: 'clamp(16px, 4vw, 64px)',
          paddingRight: 'clamp(16px, 4vw, 64px)',
        }}
      >
        <div className="flex items-baseline gap-5">
          <span
            className="text-[#2E2E2E] tracking-[0.18em] uppercase"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(9px, 0.8vw, 11px)' }}
          >
            {sectionNumber}
          </span>
          <h3
            className="hs-block text-[#F5F5F5] font-bold tracking-[-0.03em] leading-none"
            style={{ fontSize: 'clamp(22px, 3.5vw, 44px)', fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {sectionTitle}
          </h3>
        </div>
        <div className="mt-4" style={{ width: '32px', height: '1px', background: '#2A2A2A' }} />
      </div>

      {/* Items list or Direct Trailers Grid */}
      <div>
        {isTrailersSection ? (
          <div
            className="grid gap-5 md:gap-6"
            style={{
              padding: '0 clamp(20px, 4vw, 64px) clamp(40px, 6vw, 80px) clamp(20px, 4vw, 64px)',
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            {items.flatMap(item => item.trailers || []).map((trailer) => (
              <TrailerCard key={trailer.id} item={trailer} />
            ))}
          </div>
        ) : (
          items.map((item) => (
            <WorkItemRow
              key={item.id}
              item={item}
              sectionId={sectionId}
              isOpen={openItemIds.has(item.id)}
              onToggle={() => toggleItem(item.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ─── Works Section ─────────────────────────────────────────── */
export default function WorksSection() {
  const { activeTrack } = useAudio();

  return (
    <section id="works" style={{ backgroundColor: '#121212', paddingBottom: activeTrack ? '80px' : '0' }}>
      {/* ── Section label ── */}
      <div
        style={{
          paddingLeft: 'clamp(16px, 4vw, 64px)',
          paddingRight: 'clamp(16px, 4vw, 64px)',
          paddingTop: 'clamp(64px, 8vw, 120px)',
          paddingBottom: '0',
        }}
      >
        <div className="flex items-center gap-4 mb-3">
          <div className="w-6 h-px bg-[#3A3A3A]" />
          <span
            className="text-[#6B6B6B] text-[11px] tracking-[0.18em] uppercase"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Selected Works
          </span>
        </div>
        <p
          className="text-[#2A2A2A] text-[10px] tracking-[0.1em] uppercase"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Click an album to expand — click a track to preview
        </p>
      </div>

      {/* ── Three sections ── */}
      {worksSections.map((section) => (
        <SectionBlock
          key={section.id}
          sectionId={section.id}
          sectionNumber={section.sectionNumber}
          sectionTitle={section.sectionTitle}
          items={section.items}
        />
      ))}
    </section>
  );
}
