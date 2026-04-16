import { createContext, useContext } from 'react';

export interface ActiveTrack {
  title: string;
  albumName: string;
  coverImage: string;
  audioUrl: string;
  trackKey: string;
}

export interface AudioContextType {
  activeTrack: ActiveTrack | null;
  setActiveTrack: (track: ActiveTrack | null) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  analyserNode: AnalyserNode | null;
  setAnalyserNode: (node: AnalyserNode | null) => void;
}

export const AudioCtx = createContext<AudioContextType>({
  activeTrack: null,
  setActiveTrack: () => {},
  isPlaying: false,
  setIsPlaying: () => {},
  analyserNode: null,
  setAnalyserNode: () => {},
});

export const useAudio = () => useContext(AudioCtx);
