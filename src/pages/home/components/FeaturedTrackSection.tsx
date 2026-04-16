import { useState, useRef, useEffect, useCallback } from 'react';
import { useAudio } from '@/context/AudioContext';

const TRACK = {
  title: 'WISH ME LUCK',
  albumName: 'WAR THUNDER OFFICIAL THEME',
  prefix: '00',
  subtitle: 'OFFICIAL TRAILER THEME',
  streams: 'OVER 2.4 MILLION STREAMS ON SPOTIFY',
  year: '2023',
  coverImage: 'https://readdy.ai/api/search-image?query=wish%20me%20luck%20cinematic%20film%20trailer%20theme%20music%20album%20cover%20art%2C%20dark%20dramatic%20abstract%20composition%20with%20golden%20light%20rays%20breaking%20through%20deep%20black%20void%2C%20high%20contrast%20monochromatic%20with%20warm%20gold%20accent%2C%20premium%20square%20album%20artwork%2C%20epic%20cinematic%20atmosphere%2C%20no%20text%2C%20ultra%20detailed&width=800&height=800&seq=wish-me-luck-featured-01&orientation=squarish',
  audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/br_128k/v1776266538/wte_ground_track_01_Allies_ronjnm.mp3',
  trackKey: 'featured-wish-me-luck',
};

export default function FeaturedTrackSection() {
  const { activeTrack, setActiveTrack, isPlaying, setIsPlaying } = useAudio();
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  const isActive = activeTrack?.trackKey === TRACK.trackKey;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.06 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const togglePlay = useCallback(() => {
    if (isActive) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveTrack(TRACK);
      setIsPlaying(true);
    }
  }, [isActive, isPlaying, setIsPlaying, setActiveTrack]);

  return (
    <section
      ref={sectionRef}
      id="featured"
      className="relative border-t border-[#1E1E1E] overflow-hidden"
      style={{ backgroundColor: '#0E0E0E' }}
    >
      {/* ── Centered column — both mobile and desktop ── */}
      <div
        className="flex flex-col items-center text-center mx-auto w-full"
        style={{
          paddingTop: 'clamp(64px, 9vw, 140px)',
          paddingBottom: 'clamp(64px, 9vw, 140px)',
          paddingLeft: 'clamp(20px, 5vw, 48px)',
          paddingRight: 'clamp(20px, 5vw, 48px)',
          maxWidth: '860px',
        }}
      >
        {/* Section label */}
        <div
          className="flex items-center justify-center gap-4 mb-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div className="h-px bg-[#2A2A2A]" style={{ width: '32px' }} />
          <span
            className="text-[#4A4A4A] tracking-[0.22em] uppercase"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }}
          >
            Featured Track
          </span>
          <div className="h-px bg-[#2A2A2A]" style={{ width: '32px' }} />
        </div>

        {/* ── Cover Art — large, centered square ── */}
        <div
          className="relative overflow-hidden w-full"
          style={{
            maxWidth: 'clamp(260px, 52vw, 520px)',
            aspectRatio: '1 / 1',
            marginBottom: 'clamp(32px, 5vw, 56px)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
            transition: 'opacity 0.9s ease 0.08s, transform 0.9s cubic-bezier(0.4,0,0.2,1) 0.08s',
          }}
        >
          <img
            src={TRACK.coverImage}
            alt={TRACK.title}
            className="w-full h-full object-cover object-top"
            style={{ filter: 'grayscale(10%) brightness(0.88)' }}
          />
          {/* Subtle vignette */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 55%, rgba(14,14,14,0.55) 100%)',
            }}
          />
        </div>

        {/* Prefix */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s',
            marginBottom: '6px',
          }}
        >
          <span
            className="text-[#2E2E2E] tracking-[0.14em]"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(10px, 1.1vw, 13px)' }}
          >
            {TRACK.prefix}
          </span>
        </div>

        {/* ── Massive title ── */}
        <h2
          className="text-[#F5F5F5] font-bold leading-[0.88] tracking-[-0.04em] w-full"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(28px, 11vw, 112px)',
            wordBreak: 'keep-all',
            overflowWrap: 'normal',
            marginBottom: 'clamp(20px, 3vw, 36px)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(22px)',
            transition: 'opacity 0.85s ease 0.24s, transform 0.85s cubic-bezier(0.4,0,0.2,1) 0.24s',
          }}
        >
          {TRACK.title}
        </h2>

        {/* Thin divider */}
        <div
          style={{
            width: '28px',
            height: '1px',
            background: '#2A2A2A',
            marginBottom: 'clamp(20px, 3vw, 32px)',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.6s ease 0.32s',
          }}
        />

        {/* Subtitle + streams */}
        <div
          className="flex flex-col gap-2 w-full"
          style={{
            marginBottom: 'clamp(32px, 5vw, 56px)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(14px)',
            transition: 'opacity 0.7s ease 0.34s, transform 0.7s ease 0.34s',
          }}
        >
          <span
            className="text-[#6B6B6B] tracking-[0.14em] uppercase leading-relaxed"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 'clamp(9px, 2vw, 12px)',
            }}
          >
            {TRACK.subtitle}
          </span>
          <span
            className="text-[#3A3A3A] tracking-[0.1em] uppercase leading-relaxed"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 'clamp(8px, 1.7vw, 10px)',
            }}
          >
            {TRACK.streams}
          </span>
        </div>

        {/* ── Play button ── */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.8s ease 0.42s, transform 0.8s ease 0.42s',
            marginBottom: 'clamp(28px, 4vw, 48px)',
          }}
        >
          <button
            onClick={togglePlay}
            className="group flex items-center gap-5 cursor-pointer whitespace-nowrap"
            style={{ background: 'none', border: 'none', padding: 0 }}
            aria-label={isActive && isPlaying ? 'Pause' : 'Play'}
          >
            {/* Circle icon */}
            <div
              className="relative flex items-center justify-center shrink-0 md:group-hover:border-[#888888] transition-colors duration-300"
              style={{
                width: 'clamp(52px, 6.5vw, 72px)',
                height: 'clamp(52px, 6.5vw, 72px)',
                border: '1px solid #3A3A3A',
                borderRadius: '50%',
              }}
            >
              {isActive && isPlaying ? (
                <svg width="13" height="15" viewBox="0 0 13 15" fill="none">
                  <rect x="0" y="0" width="4" height="15" fill="#F5F5F5" />
                  <rect x="9" y="0" width="4" height="15" fill="#F5F5F5" />
                </svg>
              ) : (
                <svg width="13" height="15" viewBox="0 0 13 15" fill="none" style={{ marginLeft: '3px' }}>
                  <polygon points="0,0 13,7.5 0,15" fill="#F5F5F5" />
                </svg>
              )}
            </div>

            {/* Label */}
            <span
              className="text-[#888888] tracking-[0.18em] uppercase md:group-hover:text-[#F5F5F5] transition-colors duration-300"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 'clamp(9px, 1.6vw, 11px)',
              }}
            >
              {isActive && isPlaying ? 'Pause' : 'Play Track'}
            </span>
          </button>
        </div>

        {/* Local progress bar removed here as it's redundant with the global player at the bottom */}
      </div>

      <div className="w-full h-px bg-[#1A1A1A]" />
    </section>
  );
}
