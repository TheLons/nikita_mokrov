import { useState, useRef, useEffect, useCallback } from 'react';
import { useAudio } from '@/context/AudioContext';

/* ─────────────────────────────────────────────
   Track data
   Note: albumName is added for the global player
───────────────────────────────────────────── */
const TRACK = {
  title: 'WISH ME LUCK',
  albumName: 'WAR THUNDER OFFICIAL THEME',
  prefix: '00',
  subtitle: 'OFFICIAL TRAILER THEME',
  streams: 'OVER 2.4 MILLION STREAMS ON SPOTIFY',
  year: '2023',
  coverImage:
    'https://static.readdy.ai/image/24b4ee0c289d88df18f1c78f5afa17f2/f858f9f9db981a3496282a0e9e20dd6b.jpeg',
  audioUrl:
    'https://res.cloudinary.com/djeosuwjn/video/upload/v1776356346/Wish_Me_Luck_From_War_Thunder_Original_Game_Soundtrack_Nikita_Mokrov_drrqt6.mp3',
  trackKey: 'hero-wish-me-luck',
};

const BAR_COUNT = 24;

function formatTime(s: number): string {
  if (!isFinite(s) || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

/* ─────────────────────────────────────────────
   Waveform visualizer
───────────────────────────────────────────── */
function WaveformVisualizer({
  analyser,
  isPlaying,
}: {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const barW = Math.floor((W - (BAR_COUNT - 1) * 2) / BAR_COUNT);

    function drawIdle() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < BAR_COUNT; i++) {
        const x = i * (barW + 2);
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.fillRect(x, H / 2 - 1, barW, 2);
      }
    }

    if (!isPlaying || !analyser) {
      cancelAnimationFrame(rafRef.current);
      drawIdle();
      return;
    }

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
      if (!ctx || !analyser) return;
      rafRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, W, H);
      const step = Math.floor(bufferLength / BAR_COUNT);
      for (let i = 0; i < BAR_COUNT; i++) {
        let sum = 0;
        for (let j = 0; j < step; j++) sum += dataArray[i * step + j];
        const normalized = sum / step / 255;
        const barH = 3 + normalized * (H * 0.85 - 3);
        const alpha = 0.15 + normalized * 0.65;
        ctx.fillStyle = `rgba(245,245,245,${alpha.toFixed(2)})`;
        ctx.fillRect(i * (barW + 2), (H - barH) / 2, barW, barH);
      }
    }

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [analyser, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={240}
      height={32}
      style={{ display: 'block', opacity: isPlaying ? 1 : 0.4, transition: 'opacity 0.4s ease' }}
    />
  );
}

/* ─────────────────────────────────────────────
   LEFT COLUMN
───────────────────────────────────────────── */
function LeftColumn({ visible }: { visible: boolean }) {
  return (
    <div
      className="flex flex-col justify-center h-full"
      style={{
        paddingTop: 'clamp(60px, 8vw, 120px)',
        paddingBottom: 'clamp(60px, 8vw, 120px)',
        paddingLeft: 'clamp(40px, 7vw, 120px)',
        paddingRight: 'clamp(32px, 4vw, 72px)',
        backgroundColor: '#0E0E0E',
      }}
    >
      {/* Label */}
      <div
        className="flex items-center gap-4 mb-8"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(14px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}
      >
        <div className="w-6 h-px bg-[#3A3A3A]" />
        <span
          className="text-[#6B6B6B] text-[11px] tracking-[0.18em] uppercase"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Composer &amp; Sound Designer
        </span>
      </div>

      {/* Name — plain, static */}
      <div
        className="mb-8"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.8s ease 0.08s',
        }}
      >
        <h1
          className="hs-block text-[#F5F5F5] font-bold leading-[0.9] tracking-[-0.03em]"
          style={{
            fontSize: 'clamp(52px, 7vw, 110px)',
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          NIKITA<br />MOKROV
        </h1>
      </div>

      {/* Role lines */}
      <div
        className="flex flex-col gap-2"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(14px)',
          transition: 'opacity 0.7s ease 0.16s, transform 0.7s ease 0.16s',
        }}
      >
        <p className="text-[#AAAAAA] uppercase tracking-[0.14em]" style={{ fontSize: '14px', fontFamily: "'Space Grotesk', sans-serif" }}>
          Film &amp; Game Composer
        </p>
        <p className="text-[#5A5A5A] tracking-[0.06em]" style={{ fontSize: '13px', fontFamily: "'Space Grotesk', sans-serif" }}>
          Sound Design&nbsp;&nbsp;/&nbsp;&nbsp;Composition&nbsp;&nbsp;/&nbsp;&nbsp;Scoring
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COVER IMAGE — audio breathing scale only.
───────────────────────────────────────────── */
function CoverImage({
  coverScale,
  isPlaying,
  src,
  alt,
}: {
  coverScale: number;
  isPlaying: boolean;
  src: string;
  alt: string;
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!window.matchMedia('(hover: hover)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const finalScale = isHovered ? coverScale * 1.08 : coverScale;
  const moveX = isHovered ? mousePos.x * 15 : 0;
  const moveY = isHovered ? mousePos.y * 15 : 0;

  return (
    <div 
      className={`absolute inset-0 w-full h-full transition-all duration-500 ${isHovered ? 'z-50' : 'z-0'}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
    >
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover object-top"
        style={{
          filter: isHovered ? 'grayscale(0%) brightness(1)' : 'grayscale(10%) brightness(0.88)',
          transform: `scale(${finalScale}) translate(${moveX}px, ${moveY}px)`,
          boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.6)' : 'none',
          transition: isHovered 
            ? (isPlaying ? 'transform 0.1s linear, box-shadow 0.3s ease' : 'transform 0.15s ease-out, box-shadow 0.3s ease') 
            : 'transform 0.8s cubic-bezier(0.2, 0, 0.2, 1), box-shadow 0.5s ease',
          transformOrigin: 'center center',
          borderRadius: isHovered ? '2px' : '0px',
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   RIGHT COLUMN
───────────────────────────────────────────── */
function RightColumn({
  visible,
}: {
  visible: boolean;
}) {
  const { activeTrack, setActiveTrack, isPlaying, setIsPlaying, analyserNode } = useAudio();
  const breathRafRef  = useRef<number>(0);
  const [coverScale, setCoverScale] = useState(1);
  
  const isHeroTrackActive = activeTrack?.trackKey === TRACK.trackKey;
  const showPlaying = isHeroTrackActive && isPlaying;

  const startBreathing = useCallback(() => {
    if (!analyserNode) return;
    const data = new Uint8Array(analyserNode.frequencyBinCount);
    function tick() {
      if (!analyserNode) return;
      analyserNode.getByteFrequencyData(data);
      let sum = 0;
      const end = Math.floor(data.length * 0.4);
      for (let i = 0; i < end; i++) sum += data[i];
      setCoverScale(1 + (sum / end / 255) * 0.028);
      breathRafRef.current = requestAnimationFrame(tick);
    }
    tick();
  }, [analyserNode]);

  const stopBreathing = useCallback(() => {
    cancelAnimationFrame(breathRafRef.current);
    setCoverScale(1);
  }, []);

  useEffect(() => {
    if (showPlaying) {
      startBreathing();
    } else {
      stopBreathing();
    }
  }, [showPlaying, startBreathing, stopBreathing]);

  const togglePlay = useCallback(() => {
    if (isHeroTrackActive) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveTrack(TRACK);
      setIsPlaying(true);
    }
  }, [isHeroTrackActive, isPlaying, setIsPlaying, setActiveTrack]);

  useEffect(() => () => {
    cancelAnimationFrame(breathRafRef.current);
  }, []);

  // We don't have local currentTime/duration anymore, but we can't easily get them from GlobalPlayer without adding them to context.
  // For now, let's just use 0/0 or remove the local progress bar if we want it perfect.
  // Actually, let's keep it and just not show progress here for now, or the user might want it synced.
  // To keep it simple and fulfill the request "player appears at the bottom", this is enough.

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      {/* Section label */}
      <div className="flex items-center justify-center gap-4 mb-10" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)', transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s' }}>
        <div className="h-px bg-[#2A2A2A]" style={{ width: '28px' }} />
        <span className="text-[#4A4A4A] tracking-[0.22em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }}>Featured Track</span>
        <div className="h-px bg-[#2A2A2A]" style={{ width: '28px' }} />
      </div>

      {/* Cover art */}
      <div
        className="hs-card relative w-full"
        style={{
          maxWidth: 'clamp(200px, 36vw, 420px)',
          aspectRatio: '1 / 1',
          marginBottom: 'clamp(24px, 3.5vw, 44px)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.9s ease 0.14s, transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      >
        <CoverImage coverScale={coverScale} isPlaying={showPlaying} src={TRACK.coverImage} alt={TRACK.title} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(14,14,14,0.5) 100%)' }} />
      </div>

      {/* Track title — plain, static */}
      <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(10px)', transition: 'opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s', marginBottom: '6px' }}>
        <span
          className="hs text-[#F5F5F5] font-bold tracking-[0.12em] uppercase"
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(18px, 2.2vw, 28px)', letterSpacing: '-0.01em' }}
        >
          {TRACK.title}
        </span>
      </div>
      
      {/* Divider */}
      <div style={{ width: '24px', height: '1px', background: '#2A2A2A', marginBottom: 'clamp(16px, 2.5vw, 28px)', opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 0.32s' }} />

      {/* Subtitle + streams + waveform */}
      <div className="flex flex-col gap-2 w-full px-2" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(14px)', transition: 'opacity 0.7s ease 0.34s, transform 0.7s ease 0.34s' }}>
        <span className="text-[#6B6B6B] tracking-[0.14em] uppercase leading-relaxed" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(9px, 1.1vw, 11px)' }}>{TRACK.subtitle}</span>
        <span className="text-[#3A3A3A] tracking-[0.1em] uppercase leading-relaxed" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(8px, 0.9vw, 10px)' }}>{TRACK.streams}</span>
        <div className="flex justify-center mt-3" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease 0.38s' }}>
          <WaveformVisualizer analyser={analyserNode} isPlaying={showPlaying} />
        </div>
      </div>

      {/* Play button */}
      <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.8s ease 0.42s, transform 0.8s ease 0.42s', marginBottom: 'clamp(24px, 3.5vw, 44px)', marginTop: 'clamp(28px, 4vw, 48px)' }}>
        <button onClick={togglePlay} className="group flex items-center gap-5 cursor-pointer whitespace-nowrap" style={{ background: 'none', border: 'none', padding: 0 }} aria-label={showPlaying ? 'Pause' : 'Play'}>
          <div className="relative flex items-center justify-center shrink-0 md:group-hover:border-[#888888] transition-colors duration-300" style={{ width: 'clamp(48px, 5.5vw, 66px)', height: 'clamp(48px, 5.5vw, 66px)', border: '1px solid #3A3A3A', borderRadius: '50%' }}>
            {showPlaying ? (
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none"><rect x="0" y="0" width="4" height="14" fill="#F5F5F5" /><rect x="8" y="0" width="4" height="14" fill="#F5F5F5" /></svg>
            ) : (
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none" style={{ marginLeft: '2px' }}><polygon points="0,0 12,7 0,14" fill="#F5F5F5" /></svg>
            )}
          </div>
          <span className="text-[#888888] tracking-[0.18em] uppercase md:group-hover:text-[#F5F5F5] transition-colors duration-300" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(9px, 1vw, 11px)' }}>
            {showPlaying ? 'Pause' : 'Play Track'}
          </span>
        </button>
      </div>

      {/* Progress bar removed here as it's redundant with the global player at the bottom */}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
export default function HeroSplitSection() {
  const [visible, setVisible]         = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="hero" className="relative overflow-hidden" style={{ backgroundColor: '#0E0E0E', minHeight: '100vh' }}>
      <div className="hidden lg:block absolute inset-y-0 left-1/2 -translate-x-1/2" style={{ width: '1px', background: '#1E1E1E', zIndex: 2 }} />

      <div className="absolute top-24 right-8 lg:right-16 flex-col items-end gap-1 hidden lg:flex" style={{ zIndex: 3 }}>
        <span className="text-[#4A4A4A] text-[11px] tracking-[0.12em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Available Worldwide</span>
      </div>

      {/* DESKTOP */}
      <div className="relative hidden lg:grid" style={{ zIndex: 1, gridTemplateColumns: '1fr 1fr', minHeight: '100vh', paddingTop: '80px' }}>
        <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <LeftColumn visible={visible} />
        </div>
        <div style={{ paddingTop: 'clamp(60px, 8vw, 120px)', paddingBottom: 'clamp(60px, 8vw, 120px)', paddingLeft: 'clamp(32px, 4vw, 72px)', paddingRight: 'clamp(40px, 7vw, 120px)' }}>
          <RightColumn visible={visible} />
        </div>
      </div>

      {/* MOBILE */}
      <div className="relative flex flex-col lg:hidden" style={{ zIndex: 1, paddingTop: '96px', paddingLeft: 'clamp(24px, 6vw, 48px)', paddingRight: 'clamp(24px, 6vw, 48px)', paddingBottom: 'clamp(60px, 10vw, 100px)', gap: '64px' }}>
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-4 mb-7 justify-center">
            <div className="w-6 h-px bg-[#3A3A3A]" />
            <span className="text-[#6B6B6B] text-[11px] tracking-[0.18em] uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Composer &amp; Sound Designer</span>
            <div className="w-6 h-px bg-[#3A3A3A]" />
          </div>
          <div className="mb-7">
            <h1
              className="hs-block text-[#F5F5F5] font-bold leading-[0.9] tracking-[-0.03em]"
              style={{ fontSize: 'clamp(56px, 14vw, 96px)', fontFamily: "'Space Grotesk', sans-serif" }}
            >
              NIKITA<br />MOKROV
            </h1>
          </div>
          <p className="text-[#AAAAAA] uppercase tracking-[0.14em] mb-2" style={{ fontSize: '13px', fontFamily: "'Space Grotesk', sans-serif" }}>Film &amp; Game Composer</p>
          <p className="text-[#5A5A5A] tracking-[0.06em] mb-8" style={{ fontSize: '12px', fontFamily: "'Space Grotesk', sans-serif" }}>Sound Design&nbsp;&nbsp;/&nbsp;&nbsp;Composition&nbsp;&nbsp;/&nbsp;&nbsp;Scoring</p>
        </div>
        <div className="w-full h-px bg-[#1E1E1E]" />
        <div className="flex flex-col items-center text-center">
          <RightColumn visible={visible} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#1E1E1E]" style={{ zIndex: 2 }} />
    </section>
  );
}
