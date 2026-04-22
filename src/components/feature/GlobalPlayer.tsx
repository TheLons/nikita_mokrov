import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
  const [waveformBars, setWaveformBars] = useState<number[]>([]);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isMobileView, setIsMobileView] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const waveformCache = useRef<Record<string, number[]>>({});
  const animationRef = useRef<number>(0);
  
  // Update mobile view state on resize
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isIOS =
    typeof navigator !== 'undefined' &&
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

  // Initialize AudioContext and AnalyserNode once
  useEffect(() => {
    if (!audioRef.current || audioCtxRef.current) return;

    // iOS Safari is more stable for background playback without WebAudio graph.
    if (isIOS) {
      setAnalyserNode(null);
      return;
    }

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

    return () => {};
  }, [isIOS, setAnalyserNode]);

  useEffect(() => {
    if (activeTrack) {
      setCurrentTime(0);
      setDuration(0);
      pendingSeekRef.current = 0;
    }
  }, [activeTrack]);

  useEffect(() => {
    if (!audioRef.current || !activeTrack) return;
    
    if (!isIOS && audioCtxRef.current?.state === 'suspended') {
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
  }, [activeTrack?.trackKey, setIsPlaying, activeTrack?.audioUrl, isIOS]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying && !isScrubbing) {
      if (!isIOS && audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, isScrubbing, isIOS]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current && !isScrubbing) {
      const current = audioRef.current.currentTime;
      setCurrentTime(current);
      if (duration === 0 && audioRef.current.duration > 0 && isFinite(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }

      // Update Media Session position state
      if ('mediaSession' in navigator && isFinite(audioRef.current.duration)) {
        try {
          navigator.mediaSession.setPositionState({
            duration: audioRef.current.duration,
            playbackRate: audioRef.current.playbackRate,
            position: current,
          });
        } catch (e) {}
      }
    }
  }, [duration, isScrubbing]);

  // Smooth animation loop for progress
  useEffect(() => {
    const updateProgress = () => {
      if (audioRef.current && duration > 0) {
        const time = scrubbingRef.current ? pendingSeekRef.current : audioRef.current.currentTime;
        setDisplayProgress((time / duration) * 100);
      }
      animationRef.current = requestAnimationFrame(updateProgress);
    };

    animationRef.current = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationRef.current);
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
    if (!isIOS && audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    setIsPlaying(!isPlaying);
  }, [isIOS, isPlaying, setIsPlaying]);

  const seek = useCallback((clientX: number) => {
    if (!progressRef.current || !audioRef.current || duration === 0) return;
    
    if (!isIOS && audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    const rect = progressRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newTime = ratio * duration;
    pendingSeekRef.current = newTime;
    setCurrentTime(newTime);
    if (!scrubbingRef.current) {
      audioRef.current.currentTime = newTime;
    }
  }, [duration, isIOS]);

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

    if (!isIOS && audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }

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

  const currentWaveform = useMemo(() => {
    if (waveformBars.length === 0) return [];
    const targetCount = isMobileView ? 60 : 150;
    const step = Math.floor(waveformBars.length / targetCount);
    const sampled = [];
    for (let i = 0; i < targetCount; i++) {
      sampled.push(waveformBars[i * step] || 10);
    }
    return sampled;
  }, [waveformBars, isMobileView]);

  // Real audio analysis to generate waveform
  useEffect(() => {
    if (!activeTrack?.audioUrl) return;
    
    const trackKey = activeTrack.trackKey || activeTrack.audioUrl;
    
    if (waveformCache.current[trackKey]) {
      setWaveformBars(waveformCache.current[trackKey]);
      return;
    }

    // Default placeholder bars while loading
    setWaveformBars(new Array(180).fill(15));

    const analyzeAudio = async () => {
      try {
        const response = await fetch(activeTrack.audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        
        const tempCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioBuffer = await tempCtx.decodeAudioData(arrayBuffer);
        await tempCtx.close();
        
        const channelData = audioBuffer.getChannelData(0);
        const barsCount = 300; // Generate high-res base
        const samplesPerBar = Math.floor(channelData.length / barsCount);
        const rawBars: number[] = [];
        let maxPeak = 0;

        for (let i = 0; i < barsCount; i++) {
          let peak = 0;
          const start = i * samplesPerBar;
          for (let j = 0; j < samplesPerBar; j += 15) {
            const val = Math.abs(channelData[start + j]);
            if (val > peak) peak = val;
          }
          rawBars.push(peak);
          if (peak > maxPeak) maxPeak = peak;
        }

        const normalizedBars = rawBars.map(peak => {
          const ratio = maxPeak > 0 ? peak / maxPeak : 0;
          const adjusted = Math.pow(ratio, 0.7); 
          return Math.max(8, Math.round(adjusted * 100));
        });

        waveformCache.current[trackKey] = normalizedBars;
        setWaveformBars(normalizedBars);
      } catch (err) {
        console.error('Failed to analyze audio for waveform:', err);
        const fallback = new Array(300).fill(0).map(() => 20 + Math.random() * 40);
        setWaveformBars(fallback);
      }
    };

    analyzeAudio();
  }, [activeTrack]);

  // Media Session API for background playback and native controls
  useEffect(() => {
    if (!activeTrack || !('mediaSession' in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: activeTrack.title,
      artist: activeTrack.albumName,
      album: activeTrack.albumName,
      artwork: [
        { src: activeTrack.coverImage, sizes: '96x96', type: 'image/png' },
        { src: activeTrack.coverImage, sizes: '128x128', type: 'image/png' },
        { src: activeTrack.coverImage, sizes: '192x192', type: 'image/png' },
        { src: activeTrack.coverImage, sizes: '256x256', type: 'image/png' },
        { src: activeTrack.coverImage, sizes: '384x384', type: 'image/png' },
        { src: activeTrack.coverImage, sizes: '512x512', type: 'image/png' },
      ],
    });

    const handlers = [
      ['play', () => setIsPlaying(true)],
      ['pause', () => setIsPlaying(false)],
      ['previoustrack', null],
      ['nexttrack', null],
      ['seekto', (details: any) => {
        if (audioRef.current && details.seekTime !== undefined) {
          audioRef.current.currentTime = details.seekTime;
          setCurrentTime(details.seekTime);
        }
      }],
    ];

    for (const [action, handler] of handlers) {
      try {
        navigator.mediaSession.setActionHandler(action as any, handler as any);
      } catch (error) {
        console.warn(`Media Session action "${action}" is not supported.`);
      }
    }

    return () => {
      for (const [action] of handlers) {
        try {
          navigator.mediaSession.setActionHandler(action as any, null);
        } catch (error) {}
      }
    };
  }, [activeTrack, setIsPlaying]);

  // Update playback state in Media Session
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
  }, [isPlaying]);

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
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onDurationChange={handleLoadedMetadata}
          onEnded={handleEnded}
          preload="auto"
          crossOrigin="anonymous"
          playsInline
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: '0',
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: '0',
            pointerEvents: 'none',
            opacity: '0',
          }}
        />

        <div ref={progressRef} className="relative w-full group/bar px-10 md:px-14 pt-4 pb-2">
          <div className="relative w-full h-10 md:h-14">
            {/* Time indicators */}
            <div 
              className="absolute -left-8 md:-left-11 top-1/2 -translate-y-1/2 tabular-nums text-[#444444] text-[10px]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {formatTime(currentTime)}
            </div>
            <div 
              className="absolute -right-8 md:-right-11 top-1/2 -translate-y-1/2 tabular-nums text-[#444444] text-[10px]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {formatTime(duration)}
            </div>

            <div className="pointer-events-none absolute inset-0">
              {/* Base Waveform (Background / Inactive) */}
              <div className="absolute inset-0 flex items-center gap-[1px] md:gap-[2px] px-[1px]">
                {currentWaveform.map((height, index) => (
                  <span
                    key={`wave-base-${index}`}
                    className="flex-1 rounded-full bg-[rgba(255,255,255,0.12)]"
                    style={{ height: `${height}%`, minHeight: '2px' }}
                  />
                ))}
              </div>

              {/* Active Waveform (Progress) - Identical structure, revealed by clip-path */}
              <div
                className="absolute inset-0 flex items-center gap-[1px] md:gap-[2px] px-[1px]"
                style={{ 
                  clipPath: `inset(0 ${100 - displayProgress}% 0 0)`,
                  WebkitClipPath: `inset(0 ${100 - displayProgress}% 0 0)`
                }}
              >
                {currentWaveform.map((height, index) => (
                  <span
                    key={`wave-active-${index}`}
                    className="flex-1 rounded-full bg-[#F5F5F5]"
                    style={{
                      height: `${height}%`,
                      minHeight: '2px',
                    }}
                  />
                ))}
              </div>

              {/* Progress Line and Handle */}
              <div
                className="absolute top-0 bottom-0 w-px bg-[#F5F5F5] opacity-50 z-10"
                style={{ left: `${displayProgress}%` }}
              />
            </div>
            <div
              className="absolute inset-0 cursor-pointer select-none"
              style={{ touchAction: 'none' }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUpOrCancel}
              onPointerCancel={handlePointerUpOrCancel}
            />
          </div>
        </div>

        <div
          className="flex items-center"
          style={{
            paddingLeft: 'clamp(16px, 3vw, 40px)',
            paddingRight: 'clamp(16px, 3vw, 40px)',
            height: 'clamp(70px, 10vh, 90px)',
          }}
        >
          {/* Left: Track info */}
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
            {/* Cover thumbnail */}
            {activeTrack && (
              <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 overflow-hidden rounded-sm shadow-lg">
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
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(14px, 1.3vw, 16px)' }}
              >
                {activeTrack?.title}
              </span>
              <span
                className="text-[#666666] truncate"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(11px, 1vw, 12px)', letterSpacing: '0.04em' }}
              >
                {activeTrack?.albumName}
              </span>
            </div>
          </div>

          {/* Center/Right Controls Group */}
          <div className="flex items-center gap-4 md:gap-8">
            {/* Play / Pause button */}
            <button
              onClick={togglePlay}
              className="shrink-0 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95"
              style={{ 
                width: '46px', 
                height: '46px', 
                background: 'none', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '50%',
                padding: 0 
              }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg width="14" height="16" viewBox="0 0 10 12" fill="none">
                  <rect x="0" y="0" width="3" height="12" fill="#F5F5F5" />
                  <rect x="7" y="0" width="3" height="12" fill="#F5F5F5" />
                </svg>
              ) : (
                <svg width="14" height="16" viewBox="0 0 10 12" fill="none" style={{ marginLeft: '1px' }}>
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
