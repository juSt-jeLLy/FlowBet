import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

interface SoundContextType {
  playSound: (soundType: SoundType) => void;
  isMuted: boolean;
  toggleMute: () => void;
}

type SoundType = 'click' | 'hover' | 'success' | 'error' | 'notification' | 'bet' | 'claim' | 'win';

const SoundContext = createContext<SoundContextType | undefined>(undefined);

// Simple Web Audio API sound synthesis
class AudioSynth {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      this.audioContext = new AudioContext();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = 0.3; // Default volume
    }
  }

  private createOscillator(frequency: number, type: OscillatorType = 'sine'): OscillatorNode | null {
    if (!this.audioContext || !this.gainNode) return null;
    
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.connect(this.gainNode);
    return oscillator;
  }

  playClick() {
    const osc = this.createOscillator(800, 'square');
    if (!osc || !this.audioContext) return;
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.1);
  }

  playHover() {
    const osc = this.createOscillator(600, 'sine');
    if (!osc || !this.audioContext) return;
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.05);
  }

  playSuccess() {
    if (!this.audioContext) return;
    
    // Play ascending notes
    const frequencies = [523, 659, 784]; // C, E, G
    frequencies.forEach((freq, index) => {
      const osc = this.createOscillator(freq, 'sine');
      if (!osc) return;
      
      const startTime = this.audioContext!.currentTime + index * 0.1;
      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  }

  playError() {
    const osc = this.createOscillator(200, 'sawtooth');
    if (!osc || !this.audioContext) return;
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.3);
  }

  playNotification() {
    const osc = this.createOscillator(1000, 'sine');
    if (!osc || !this.audioContext) return;
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.15);
  }

  playBet() {
    if (!this.audioContext) return;
    
    // Betting sound - quick beep sequence
    const frequencies = [440, 554, 659]; // A, C#, E
    frequencies.forEach((freq, index) => {
      const osc = this.createOscillator(freq, 'triangle');
      if (!osc) return;
      
      const startTime = this.audioContext!.currentTime + index * 0.08;
      osc.start(startTime);
      osc.stop(startTime + 0.1);
    });
  }

  playClaim() {
    if (!this.audioContext) return;
    
    // Claim sound - coin drop effect
    const osc = this.createOscillator(880, 'sine');
    if (!osc || !this.gainNode) return;
    
    // Create envelope for coin drop effect
    this.gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
    this.gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
    
    osc.frequency.setValueAtTime(880, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, this.audioContext.currentTime + 0.4);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.4);
  }

  playWin() {
    if (!this.audioContext) return;
    
    // Victory fanfare
    const melody = [523, 659, 784, 1047, 784, 1047, 1319]; // C, E, G, C2, G, C2, E2
    melody.forEach((freq, index) => {
      const osc = this.createOscillator(freq, 'triangle');
      if (!osc) return;
      
      const startTime = this.audioContext!.currentTime + index * 0.15;
      osc.start(startTime);
      osc.stop(startTime + 0.25);
    });
  }

  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [audioSynth] = useState(() => new AudioSynth());
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('flowbet-muted') === 'true';
    }
    return false;
  });

  useEffect(() => {
    audioSynth.setVolume(isMuted ? 0 : 0.3);
  }, [isMuted, audioSynth]);

  const playSound = (soundType: SoundType) => {
    if (isMuted) return;
    
    switch (soundType) {
      case 'click':
        audioSynth.playClick();
        break;
      case 'hover':
        audioSynth.playHover();
        break;
      case 'success':
        audioSynth.playSuccess();
        break;
      case 'error':
        audioSynth.playError();
        break;
      case 'notification':
        audioSynth.playNotification();
        break;
      case 'bet':
        audioSynth.playBet();
        break;
      case 'claim':
        audioSynth.playClaim();
        break;
      case 'win':
        audioSynth.playWin();
        break;
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => {
      const newMuted = !prev;
      localStorage.setItem('flowbet-muted', newMuted.toString());
      return newMuted;
    });
  };

  const value: SoundContextType = {
    playSound,
    isMuted,
    toggleMute,
  };

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}

export function SoundToggle() {
  const { isMuted, toggleMute } = useSound();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleMute}
      className="relative group"
    >
      {isMuted ? (
        <VolumeX className="w-4 h-4" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-dark-card px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {isMuted ? 'Unmute Sounds' : 'Mute Sounds'}
      </span>
    </Button>
  );
}