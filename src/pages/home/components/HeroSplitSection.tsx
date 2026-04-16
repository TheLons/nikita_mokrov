import { useState, useRef, useEffect, useCallback } from 'react';

/* ─────────────────────────────────────────────
   Track data
───────────────────────────────────────────── */
const TRACK = {
  title: 'WISH ME LUCK',
  prefix: '00',
  subtitle: 'OFFICIAL TRAILER THEME',
  streams: 'OVER 2.4 MILLION STREAMS ON SPOTIFY',
  year: '2023',
  coverImage:
    'https://static.readdy.ai/image/24b4ee0c289d88df18f1c78f5afa17f2/f858f9f9db981a3496282a0e9e20dd6b.jpeg',
  audioUrl:
    'https://res.cloudinary.com/djeosuwjn/video/upload/v1776356346/Wish_Me_Luck_From_War_Thunder_Original_Game_Soundtrack_Nikita_Mokrov_drrqt6.mp3',
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
function LeftColumn({ visible, isPlaying, analyserNode }: { visible: boolean; isPlaying: boolean; analyserNode: AnalyserNode | null }) {
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

      {/* Year badge */}
      <div className="flex items-center gap-6 mt-10" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease 0.22s' }}>
        <span className="text-[#3A3A3A] text-[11px] tracking-[0.14em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Est. 2015</span>
        <div className="w-16 h-px bg-[#2A2A2A]" />
        <span className="text-[#3A3A3A] text-[11px] tracking-[0.14em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>50+ Projects</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COVER IMAGE — audio breathing scale only.
   Container (.cover-card) handles hover scale.
   Image fills the container, breathing is a
   subtle internal scale on top of the card scale.
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
  return (
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 w-full h-full object-cover object-top"
      style={{
        filter: 'grayscale(10%) brightness(0.88)',
        transform: `scale(${coverScale})`,
        transition: isPlaying ? 'transform 0.08s linear' : 'transform 0.6s ease',
        transformOrigin: 'center center',
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   RIGHT COLUMN
───────────────────────────────────────────── */
function RightColumn({
  visible,
  onPlayingChange,
  onAnalyserReady,
}: {
  visible: boolean;
  onPlayingChange: (playing: boolean) => void;
  onAnalyserReady: (node: AnalyserNode | null) => void;
}) {
  const audioRef      = useRef<HTMLAudioElement>(null);
  const progressRef   = useRef<HTMLDivElement>(null);
  const audioCtxRef   = useRef<AudioContext | null>(null);
  const analyserRef   = useRef<AnalyserNode | null>(null);
  const breathRafRef  = useRef<number>(0);

  const [isPlaying, setIsPlaying]   = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration]     = useState(0);
  const [loaded, setLoaded]         = useState(false);
  const [analyser, setAnalyser]     = useState<AnalyserNode | null>(null);
  const [coverScale, setCoverScale] = useState(1);

  const setupAudioContext = useCallback(() => {
    if (audioCtxRef.current || !audioRef.current) return;
    const ctx = new AudioContext();
    const analyserNode = ctx.createAnalyser();
    analyserNode.fftSize = 256;
    analyserNode.smoothingTimeConstant = 0.5;
    const source = ctx.createMediaElementSource(audioRef.current);
    source.connect(analyserNode);
    analyserNode.connect(ctx.destination);
    audioCtxRef.current = ctx;
    analyserRef.current = analyserNode;
    setAnalyser(analyserNode);
    onAnalyserReady(analyserNode);
  }, [onAnalyserReady]);

  const startBreathing = useCallback(() => {
    const node = analyserRef.current;
    if (!node) return;
    const data = new Uint8Array(node.frequencyBinCount);
    function tick() {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(data);
      let sum = 0;
      const end = Math.floor(data.length * 0.4);
      for (let i = 0; i < end; i++) sum += data[i];
      setCoverScale(1 + (sum / end / 255) * 0.028);
      breathRafRef.current = requestAnimationFrame(tick);
    }
    tick();
  }, []);

  const stopBreathing = useCallback(() => {
    cancelAnimationFrame(breathRafRef.current);
    setCoverScale(1);
  }, []);

  const handleTimeUpdate   = useCallback(() => { if (audioRef.current) setCurrentTime(audioRef.current.currentTime); }, []);
  const handleLoadedMetadata = useCallback(() => { if (audioRef.current) { setDuration(audioRef.current.duration); setLoaded(true); } }, []);
  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    onPlayingChange(false);
    setCurrentTime(0);
    stopBreathing();
  }, [stopBreathing, onPlayingChange]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      onPlayingChange(false);
      stopBreathing();
    } else {
      setupAudioContext();
      if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        onPlayingChange(true);
        startBreathing();
      }).catch(() => {});
    }
  }, [isPlaying, setupAudioContext, startBreathing, stopBreathing, onPlayingChange]);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  }, [duration]);

  useEffect(() => () => {
    cancelAnimationFrame(breathRafRef.current);
    audioCtxRef.current?.close();
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <audio
        ref={audioRef}
        src={TRACK.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
        crossOrigin="anonymous"
      />

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
        <CoverImage coverScale={coverScale} isPlaying={isPlaying} src={TRACK.coverImage} alt={TRACK.title} />
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

      {/* Prefix */}
      <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(10px)', transition: 'opacity 0.6s ease 0.22s, transform 0.6s ease 0.22s', marginBottom: '4px' }}>
        <span className="text-[#2E2E2E] tracking-[0.14em]" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(10px, 1vw, 12px)' }}>{TRACK.prefix}</span>
      </div>

      {/* Divider */}
      <div style={{ width: '24px', height: '1px', background: '#2A2A2A', marginBottom: 'clamp(16px, 2.5vw, 28px)', opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 0.32s' }} />

      {/* Subtitle + streams + waveform */}
      <div className="flex flex-col gap-2 w-full px-2" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(14px)', transition: 'opacity 0.7s ease 0.34s, transform 0.7s ease 0.34s' }}>
        <span className="text-[#6B6B6B] tracking-[0.14em] uppercase leading-relaxed" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(9px, 1.1vw, 11px)' }}>{TRACK.subtitle}</span>
        <span className="text-[#3A3A3A] tracking-[0.1em] uppercase leading-relaxed" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(8px, 0.9vw, 10px)' }}>{TRACK.streams}</span>
        <div className="flex justify-center mt-3" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease 0.38s' }}>
          <WaveformVisualizer analyser={analyser} isPlaying={isPlaying} />
        </div>
      </div>

      {/* Play button */}
      <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.8s ease 0.42s, transform 0.8s ease 0.42s', marginBottom: 'clamp(24px, 3.5vw, 44px)', marginTop: 'clamp(28px, 4vw, 48px)' }}>
        <button onClick={togglePlay} className="group flex items-center gap-5 cursor-pointer whitespace-nowrap" style={{ background: 'none', border: 'none', padding: 0 }} aria-label={isPlaying ? 'Pause' : 'Play'}>
          <div className="relative flex items-center justify-center shrink-0 md:group-hover:border-[#888888] transition-colors duration-300" style={{ width: 'clamp(48px, 5.5vw, 66px)', height: 'clamp(48px, 5.5vw, 66px)', border: '1px solid #3A3A3A', borderRadius: '50%' }}>
            {isPlaying ? (
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none"><rect x="0" y="0" width="4" height="14" fill="#F5F5F5" /><rect x="8" y="0" width="4" height="14" fill="#F5F5F5" /></svg>
            ) : (
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none" style={{ marginLeft: '2px' }}><polygon points="0,0 12,7 0,14" fill="#F5F5F5" /></svg>
            )}
          </div>
          <span className="text-[#888888] tracking-[0.18em] uppercase md:group-hover:text-[#F5F5F5] transition-colors duration-300" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(9px, 1vw, 11px)' }}>
            {isPlaying ? 'Pause' : 'Play Track'}
          </span>
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full" style={{ maxWidth: '340px', opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        <div ref={progressRef} className="relative cursor-pointer group/bar mb-3" style={{ height: '20px', display: 'flex', alignItems: 'center' }} onClick={handleProgressClick}>
          <div className="w-full relative" style={{ height: '1px', background: '#1E1E1E' }}>
            <div className="absolute left-0 top-0 h-full" style={{ width: `${progress}%`, background: '#F5F5F5', transition: 'width 0.1s linear' }} />
            <div className="absolute top-1/2 opacity-0 md:group-hover/bar:opacity-100 transition-opacity duration-200" style={{ left: `${progress}%`, transform: 'translateX(-50%) translateY(-50%)', width: '5px', height: '5px', borderRadius: '50%', background: '#F5F5F5' }} />
          </div>
        </div>
        <div className="flex justify-between">
          <span className="tabular-nums" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#4A4A4A', letterSpacing: '0.06em' }}>{formatTime(currentTime)}</span>
          <span className="tabular-nums" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#2E2E2E', letterSpacing: '0.06em' }}>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Year */}
      <div className="mt-8" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease 0.6s' }}>
        <span className="text-[#252525] tracking-[0.1em]" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }}>{TRACK.year}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
export default function HeroSplitSection() {
  const [visible, setVisible]         = useState(false);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="hero" className="relative overflow-hidden" style={{ backgroundColor: '#0E0E0E', minHeight: '100vh' }}>
      <div className="hidden lg:block absolute inset-y-0 left-1/2 -translate-x-1/2" style={{ width: '1px', background: '#1E1E1E', zIndex: 2 }} />

      <div className="absolute top-24 right-8 lg:right-16 flex-col items-end gap-1 hidden lg:flex" style={{ zIndex: 3 }}>
        <span className="text-[#4A4A4A] text-[11px] tracking-[0.12em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Nha Trang, Vietnam</span>
        <span className="text-[#4A4A4A] text-[11px] tracking-[0.12em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Available Worldwide</span>
      </div>

      {/* DESKTOP */}
      <div className="relative hidden lg:grid" style={{ zIndex: 1, gridTemplateColumns: '1fr 1fr', minHeight: '100vh', paddingTop: '80px' }}>
        <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <LeftColumn visible={visible} isPlaying={isPlaying} analyserNode={analyserNode} />
        </div>
        <div style={{ paddingTop: 'clamp(60px, 8vw, 120px)', paddingBottom: 'clamp(60px, 8vw, 120px)', paddingLeft: 'clamp(32px, 4vw, 72px)', paddingRight: 'clamp(40px, 7vw, 120px)' }}>
          <RightColumn visible={visible} onPlayingChange={setIsPlaying} onAnalyserReady={setAnalyserNode} />
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
          <div className="flex items-center gap-6 justify-center">
            <span className="text-[#3A3A3A] text-[11px] tracking-[0.14em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Est. 2015</span>
            <div className="w-12 h-px bg-[#2A2A2A]" />
            <span className="text-[#3A3A3A] text-[11px] tracking-[0.14em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>50+ Projects</span>
          </div>
        </div>
        <div className="w-full h-px bg-[#1E1E1E]" />
        <div className="flex flex-col items-center text-center">
          <RightColumn visible={visible} onPlayingChange={setIsPlaying} onAnalyserReady={setAnalyserNode} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#1E1E1E]" style={{ zIndex: 2 }} />
    </section>
  );
}
