import { useState } from 'react';
import Navigation from './components/Navigation';
import HeroSplitSection from './components/HeroSplitSection';
import BiographySection from './components/BiographySection';
import WorksSection from './components/WorksSection';
import ContactSection from './components/ContactSection';
import { AudioCtx, ActiveTrack } from '@/context/AudioContext';
import { GlobalPlayer } from '@/components/feature/GlobalPlayer';

export default function Home() {
  const [activeTrack, setActiveTrack] = useState<ActiveTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  return (
    <AudioCtx.Provider value={{ activeTrack, setActiveTrack, isPlaying, setIsPlaying, analyserNode, setAnalyserNode }}>
      <div className="relative min-h-screen overflow-x-hidden" style={{ backgroundColor: '#121212', color: '#F5F5F5' }}>
        <Navigation />
        <HeroSplitSection />
        <BiographySection />
        <WorksSection />
        <ContactSection />
        <GlobalPlayer />
      </div>
    </AudioCtx.Provider>
  );
}
