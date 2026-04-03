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

type MutedCheck = () => boolean;

// Factory that creates sound definitions bound to a muted check
function createSounds(isMuted: MutedCheck) {
  const guardedDelay = (fn: () => void, ms: number) => {
    setTimeout(() => { if (!isMuted()) fn(); }, ms);
  };

  return {
    footstep: () => playTone(200, 0.05, 'square', 0.05),
    chest: () => {
      playTone(523, 0.1, 'square', 0.1);
      guardedDelay(() => playTone(659, 0.1, 'square', 0.1), 100);
      guardedDelay(() => playTone(784, 0.15, 'square', 0.1), 200);
    },
    damage: () => {
      playTone(150, 0.1, 'sawtooth', 0.15);
      guardedDelay(() => playTone(100, 0.2, 'sawtooth', 0.1), 100);
    },
    powerup: () => {
      playTone(400, 0.1, 'sine', 0.1);
      guardedDelay(() => playTone(600, 0.1, 'sine', 0.1), 80);
      guardedDelay(() => playTone(800, 0.15, 'sine', 0.1), 160);
    },
    gameover: () => {
      playTone(400, 0.2, 'sawtooth', 0.1);
      guardedDelay(() => playTone(300, 0.2, 'sawtooth', 0.1), 200);
      guardedDelay(() => playTone(200, 0.3, 'sawtooth', 0.1), 400);
      guardedDelay(() => playTone(100, 0.5, 'sawtooth', 0.1), 600);
    },
    victory: () => {
      playTone(523, 0.15, 'square', 0.1);
      guardedDelay(() => playTone(659, 0.15, 'square', 0.1), 150);
      guardedDelay(() => playTone(784, 0.15, 'square', 0.1), 300);
      guardedDelay(() => playTone(1047, 0.3, 'square', 0.12), 450);
    },
    growl: () => playTone(80, 0.3, 'sawtooth', 0.08),
  };
}

export type SoundName = 'footstep' | 'chest' | 'damage' | 'powerup' | 'gameover' | 'victory' | 'growl';

export function useSound() {
  const { muted } = useContext(GameContext);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  const soundsRef = useRef(createSounds(() => mutedRef.current));

  const play = useCallback((name: SoundName) => {
    if (mutedRef.current) return;
    try {
      soundsRef.current[name]();
    } catch (e) {
      // AudioContext may not be available
    }
  }, []);

  return { play };
}
