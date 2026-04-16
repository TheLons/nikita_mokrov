import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useAudio } from '@/context/AudioContext';

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function GlobalPlayer() {
  const { activeTrack, setActiveTrack, isPlaying, setIsPlaying, setAnalyserNode } = useAudio();
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Initialize AudioContext and AnalyserNode once
  useEffect(() => {
    if (!audioRef.current || audioCtxRef.current) return;

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.5;

    const source = ctx.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(ctx.destination);

    audioCtxRef.current = ctx;
    sourceRef.current = source;
    setAnalyserNode(analyser);

    return () => {
      // ctx.close(); // Don't close here, we want it to persist
    };
  }, [setAnalyserNode]);

  useEffect(() => {
    if (activeTrack) {
      setCurrentTime(0);
      setDuration(0);
    }
  }, [activeTrack]);

  useEffect(() => {
    if (!audioRef.current || !activeTrack) return;
    
    // If we're changing track, we need to handle AudioContext resume
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    audioRef.current.src = activeTrack.audioUrl;
    audioRef.current.load();
    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.warn('Playback failed:', err);
        setIsPlaying(false);
      });
  }, [activeTrack?.trackKey, setIsPlaying, activeTrack?.audioUrl]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (duration === 0 && audioRef.current.duration > 0 && isFinite(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  }, [duration]);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current && isFinite(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
    }
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, [setIsPlaying]);

  const togglePlay = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying, setIsPlaying]);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  }, [duration]);

  const handleClose = () => {
    setIsPlaying(false);
    setActiveTrack(null);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return createPortal(
    <div
      className="fixed bottom-0 left-0 right-0 z-[9998] pointer-events-none"
      style={{
        opacity: activeTrack ? 1 : 0,
        pointerEvents: activeTrack ? 'auto' : 'none',
        transition: 'opacity 0.35s ease',
      }}
    >
      <div
        className="w-full"
        style={{
          background: '#0A0A0A',
          borderTop: '1px solid #1E1E1E',
          transform: activeTrack ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onDurationChange={handleLoadedMetadata}
          onEnded={handleEnded}
          preload="auto"
          crossOrigin="anonymous"
        />

        <div
          className="flex items-center gap-5"
          style={{
            paddingLeft: 'clamp(20px, 4vw, 64px)',
            paddingRight: 'clamp(20px, 4vw, 64px)',
            paddingTop: '14px',
            paddingBottom: '14px',
          }}
        >
          {/* Cover thumbnail */}
          {activeTrack && (
            <div className="shrink-0 w-10 h-10 overflow-hidden">
              <img
                src={activeTrack.coverImage}
                alt=""
                className="w-full h-full object-cover object-top"
                style={{ filter: 'grayscale(100%)' }}
              />
            </div>
          )}

          {/* Track info */}
          <div className="flex flex-col gap-0.5 shrink-0" style={{ minWidth: '160px', maxWidth: '220px' }}>
            <span
              className="text-[#F5F5F5] truncate"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', fontWeight: 500 }}
            >
              {activeTrack?.title}
            </span>
            <span
              className="text-[#4A4A4A] truncate"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.06em' }}
            >
              {activeTrack?.albumName}
            </span>
          </div>

          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            className="shrink-0 flex items-center justify-center cursor-pointer"
            style={{ width: '32px', height: '32px', background: 'none', border: '1px solid #2A2A2A', padding: 0 }}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                <rect x="0" y="0" width="3" height="12" fill="#F5F5F5" />
                <rect x="7" y="0" width="3" height="12" fill="#F5F5F5" />
              </svg>
            ) : (
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                <polygon points="1,0 10,6 1,12" fill="#F5F5F5" />
              </svg>
            )}
          </button>

          {/* Progress bar */}
          <div
            ref={progressRef}
            className="flex-1 relative cursor-pointer group/bar"
            style={{ height: '24px', display: 'flex', alignItems: 'center' }}
            onClick={handleProgressClick}
          >
            <div className="w-full relative" style={{ height: '1px', background: '#2A2A2A' }}>
              <div className="absolute left-0 top-0 h-full" style={{ width: `${progress}%`, background: '#F5F5F5' }} />
              <div
                className="absolute top-1/2 opacity-0 md:group-hover/bar:opacity-100 transition-opacity duration-200"
                style={{
                  left: `${progress}%`,
                  transform: 'translateX(-50%) translateY(-50%)',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#F5F5F5',
                }}
              />
            </div>
          </div>

          {/* Time */}
          <span
            className="shrink-0 tabular-nums"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              color: '#5A5A5A',
              letterSpacing: '0.04em',
              minWidth: '72px',
              textAlign: 'right',
            }}
          >
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          {/* Close */}
          <button
            onClick={handleClose}
            className="shrink-0 flex items-center justify-center cursor-pointer ml-2"
            style={{ width: '28px', height: '28px', background: 'none', border: 'none', padding: 0, color: '#4A4A4A' }}
            aria-label="Close player"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
