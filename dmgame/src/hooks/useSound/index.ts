import { useCallback, useContext, useRef } from 'react';
import { GameContext } from '../../contexts/game';

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

// Simple synthetic sound generator
function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'square',
  volume: number = 0.1
) {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.value = volume;
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

// Predefined sound effects
const sounds = {
  footstep: () => playTone(200, 0.05, 'square', 0.05),
  chest: () => {
    playTone(523, 0.1, 'square', 0.1);
    setTimeout(() => playTone(659, 0.1, 'square', 0.1), 100);
    setTimeout(() => playTone(784, 0.15, 'square', 0.1), 200);
  },
  damage: () => {
    playTone(150, 0.1, 'sawtooth', 0.15);
    setTimeout(() => playTone(100, 0.2, 'sawtooth', 0.1), 100);
  },
  powerup: () => {
    playTone(400, 0.1, 'sine', 0.1);
    setTimeout(() => playTone(600, 0.1, 'sine', 0.1), 80);
    setTimeout(() => playTone(800, 0.15, 'sine', 0.1), 160);
  },
  gameover: () => {
    playTone(400, 0.2, 'sawtooth', 0.1);
    setTimeout(() => playTone(300, 0.2, 'sawtooth', 0.1), 200);
    setTimeout(() => playTone(200, 0.3, 'sawtooth', 0.1), 400);
    setTimeout(() => playTone(100, 0.5, 'sawtooth', 0.1), 600);
  },
  victory: () => {
    playTone(523, 0.15, 'square', 0.1);
    setTimeout(() => playTone(659, 0.15, 'square', 0.1), 150);
    setTimeout(() => playTone(784, 0.15, 'square', 0.1), 300);
    setTimeout(() => playTone(1047, 0.3, 'square', 0.12), 450);
  },
  growl: () => playTone(80, 0.3, 'sawtooth', 0.08),
};

export type SoundName = keyof typeof sounds;

export function useSound() {
  const { muted } = useContext(GameContext);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  const play = useCallback((name: SoundName) => {
    if (mutedRef.current) return;
    try {
      sounds[name]();
    } catch (e) {
      // AudioContext may not be available
    }
  }, []);

  return { play };
}
