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
  const pendingSeekRef = useRef(0);
  const scrubbingRef = useRef(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);

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
      pendingSeekRef.current = 0;
    }
  }, [activeTrack]);

  useEffect(() => {
    if (!audioRef.current || !activeTrack) return;
    
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
    if (isPlaying && !isScrubbing) {
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, isScrubbing]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current && !isScrubbing) {
      setCurrentTime(audioRef.current.currentTime);
      if (duration === 0 && audioRef.current.duration > 0 && isFinite(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  }, [duration, isScrubbing]);

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

  const seek = useCallback((clientX: number) => {
    if (!progressRef.current || !audioRef.current || duration === 0) return;
    const rect = progressRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newTime = ratio * duration;
    pendingSeekRef.current = newTime;
    setCurrentTime(newTime);
    if (!scrubbingRef.current) {
      audioRef.current.currentTime = newTime;
    }
  }, [duration]);

  const commitScrub = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = pendingSeekRef.current;
    }
    scrubbingRef.current = false;
    setIsScrubbing(false);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (duration === 0) return;
    scrubbingRef.current = true;
    setIsScrubbing(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    seek(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!scrubbingRef.current) return;
    seek(e.clientX);
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!scrubbingRef.current) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* not captured */
    }
    commitScrub();
  };

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
        className="w-full flex flex-col"
        style={{
          background: '#0D0D0D',
          borderTop: '1px solid #1A1A1A',
          transform: activeTrack ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: '0 -8px 30px rgba(0,0,0,0.5)',
        }}
      >
        <audio
          ref={audioRef}
          className="hidden"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onDurationChange={handleLoadedMetadata}
          onEnded={handleEnded}
          preload="auto"
          crossOrigin="anonymous"
        />

        {/* Progress: h-1 visual; on mobile modest invisible hit strip (ref) so it does not steal taps from controls */}
        <div className="relative w-full h-1 group/bar max-md:px-10">
          <div className="absolute inset-0 bg-[rgba(255,255,255,0.05)] rounded-full" />
          
          {/* End caps to define the track boundaries */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-1.5 bg-[rgba(255,255,255,0.15)] rounded-full" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-1.5 bg-[rgba(255,255,255,0.15)] rounded-full" />

          <div className="pointer-events-none absolute inset-0">
            <div
              className={`absolute left-0 top-0 h-full bg-[#F5F5F5] rounded-full ${isScrubbing ? '' : 'transition-[width] duration-100 ease-linear'}`}
              style={{ width: `${progress}%`, boxShadow: '0 0 10px rgba(245,245,245,0.3)' }}
            />
            <div
              className={`pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-full bg-[#F5F5F5] shadow-lg transition-[width,height,margin,transform] duration-150 ease-out ${
                isScrubbing
                  ? 'h-6 w-6 -ml-3 md:h-4 md:w-4 md:-ml-2'
                  : 'h-5 w-5 -ml-2.5 md:h-3.5 md:w-3.5 md:-ml-[7px]'
              } max-md:opacity-100 md:opacity-0 md:group-hover/bar:opacity-100 ${isScrubbing ? '!opacity-100' : ''}`}
              style={{ left: `${progress}%` }}
            />
          </div>
          <div
            ref={progressRef}
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 cursor-pointer select-none max-md:h-4 md:h-6"
            style={{ touchAction: 'none' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUpOrCancel}
            onPointerCancel={handlePointerUpOrCancel}
          />
        </div>

        <div
          className="flex items-center"
          style={{
            paddingLeft: 'clamp(16px, 3vw, 40px)',
            paddingRight: 'clamp(16px, 3vw, 40px)',
            height: 'clamp(64px, 8vh, 80px)',
          }}
        >
          {/* Left: Track info */}
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
            {/* Cover thumbnail */}
            {activeTrack && (
              <div className="shrink-0 w-11 h-11 md:w-13 md:h-13 overflow-hidden rounded-sm shadow-lg">
                <img
                  src={activeTrack.coverImage}
                  alt=""
                  className="w-full h-full object-cover object-top"
                  style={{ filter: 'grayscale(30%) brightness(0.9)' }}
                />
              </div>
            )}

            <div className="flex flex-col gap-0.5 min-w-0">
              <span
                className="text-[#F5F5F5] truncate font-medium"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(13px, 1.2vw, 15px)' }}
              >
                {activeTrack?.title}
              </span>
              <span
                className="text-[#666666] truncate"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(10px, 0.9vw, 11px)', letterSpacing: '0.04em' }}
              >
                {activeTrack?.albumName}
              </span>
            </div>
          </div>

          {/* Center/Right Controls Group */}
          <div className="flex items-center gap-4 md:gap-8">
            {/* Time - hidden on very small mobile */}
            <span
              className="shrink-0 tabular-nums hidden xs:inline"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                color: '#444444',
                letterSpacing: '0.04em',
                minWidth: '85px',
                textAlign: 'center'
              }}
            >
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Play / Pause button */}
            <button
              onClick={togglePlay}
              className="shrink-0 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95"
              style={{ 
                width: '42px', 
                height: '42px', 
                background: 'none', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '50%',
                padding: 0 
              }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg width="12" height="14" viewBox="0 0 10 12" fill="none">
                  <rect x="0" y="0" width="3" height="12" fill="#F5F5F5" />
                  <rect x="7" y="0" width="3" height="12" fill="#F5F5F5" />
                </svg>
              ) : (
                <svg width="12" height="14" viewBox="0 0 10 12" fill="none" style={{ marginLeft: '1px' }}>
                  <polygon points="1,0 10,6 1,12" fill="#F5F5F5" />
                </svg>
              )}
            </button>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="shrink-0 flex items-center justify-center cursor-pointer p-1.5 transition-opacity opacity-40 hover:opacity-100"
              style={{ background: 'none', border: 'none', color: '#F5F5F5' }}
              aria-label="Close player"
            >
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
