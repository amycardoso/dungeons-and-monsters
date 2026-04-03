import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import {
  EGamePhase,
  EPowerUp,
  INITIAL_HEALTH,
  INVINCIBILITY_DURATION,
  MAX_HEALTH,
  SHIELD_DURATION,
  SPEED_BOOST_DURATION,
} from "../../settings/constants";
import { levels } from "../../settings/levels";

interface GameState {
  phase: EGamePhase;
  currentLevel: number;
  health: number;
  score: number;
  isInvincible: boolean;
  hasShield: boolean;
  hasSpeedBoost: boolean;
  levelStartTime: number;
  muted: boolean;
}

interface GameContextValue extends GameState {
  startGame: () => void;
  nextLevel: () => void;
  restartGame: () => void;
  takeDamage: () => void;
  addScore: (points: number) => void;
  collectPowerUp: (type: EPowerUp) => void;
  completeLevelPhase: () => void;
  toggleMute: () => void;
}

const defaultState: GameState = {
  phase: EGamePhase.START,
  currentLevel: 0,
  health: INITIAL_HEALTH,
  score: 0,
  isInvincible: false,
  hasShield: false,
  hasSpeedBoost: false,
  levelStartTime: 0,
  muted: false,
};

export const GameContext = createContext<GameContextValue>({
  ...defaultState,
  startGame: () => {},
  nextLevel: () => {},
  restartGame: () => {},
  takeDamage: () => {},
  addScore: () => {},
  collectPowerUp: () => {},
  completeLevelPhase: () => {},
  toggleMute: () => {},
});

export function useGame(): GameContextValue {
  return useContext(GameContext);
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<EGamePhase>(defaultState.phase);
  const [currentLevel, setCurrentLevel] = useState(defaultState.currentLevel);
  const [health, setHealth] = useState(defaultState.health);
  const [score, setScore] = useState(defaultState.score);
  const [isInvincible, setIsInvincible] = useState(defaultState.isInvincible);
  const [hasShield, setHasShield] = useState(defaultState.hasShield);
  const [hasSpeedBoost, setHasSpeedBoost] = useState(defaultState.hasSpeedBoost);
  const [levelStartTime, setLevelStartTime] = useState(defaultState.levelStartTime);
  const [muted, setMuted] = useState(defaultState.muted);

  const invincibilityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shieldTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAllTimers = useCallback(() => {
    if (invincibilityTimerRef.current) {
      clearTimeout(invincibilityTimerRef.current);
      invincibilityTimerRef.current = null;
    }
    if (shieldTimerRef.current) {
      clearTimeout(shieldTimerRef.current);
      shieldTimerRef.current = null;
    }
    if (speedTimerRef.current) {
      clearTimeout(speedTimerRef.current);
      speedTimerRef.current = null;
    }
  }, []);

  const startGame = useCallback(() => {
    clearAllTimers();
    setPhase(EGamePhase.PLAYING);
    setCurrentLevel(0);
    setHealth(INITIAL_HEALTH);
    setScore(0);
    setIsInvincible(false);
    setHasShield(false);
    setHasSpeedBoost(false);
    setLevelStartTime(Date.now());
  }, [clearAllTimers]);

  const nextLevel = useCallback(() => {
    clearAllTimers();
    setCurrentLevel((prev) => {
      const next = prev + 1;
      if (next >= levels.length) {
        setPhase(EGamePhase.VICTORY);
        return prev;
      }
      setPhase(EGamePhase.PLAYING);
      setIsInvincible(false);
      setHasShield(false);
      setHasSpeedBoost(false);
      setLevelStartTime(Date.now());
      return next;
    });
  }, [clearAllTimers]);

  const restartGame = useCallback(() => {
    clearAllTimers();
    setPhase(EGamePhase.PLAYING);
    setCurrentLevel(0);
    setHealth(INITIAL_HEALTH);
    setScore(0);
    setIsInvincible(false);
    setHasShield(false);
    setHasSpeedBoost(false);
    setLevelStartTime(Date.now());
  }, [clearAllTimers]);

  const takeDamage = useCallback(() => {
    if (isInvincible || hasShield) return;

    setHealth((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        setPhase(EGamePhase.GAME_OVER);
        return 0;
      }
      return next;
    });

    setIsInvincible(true);
    if (invincibilityTimerRef.current) {
      clearTimeout(invincibilityTimerRef.current);
    }
    invincibilityTimerRef.current = setTimeout(() => {
      setIsInvincible(false);
      invincibilityTimerRef.current = null;
    }, INVINCIBILITY_DURATION);
  }, [isInvincible, hasShield]);

  const addScore = useCallback((points: number) => {
    setScore((prev) => prev + points);
  }, []);

  const collectPowerUp = useCallback((type: EPowerUp) => {
    switch (type) {
      case EPowerUp.HEART:
        setHealth((prev) => Math.min(prev + 1, MAX_HEALTH));
        break;

      case EPowerUp.SHIELD:
        setHasShield(true);
        if (shieldTimerRef.current) {
          clearTimeout(shieldTimerRef.current);
        }
        shieldTimerRef.current = setTimeout(() => {
          setHasShield(false);
          shieldTimerRef.current = null;
        }, SHIELD_DURATION);
        break;

      case EPowerUp.SPEED:
        setHasSpeedBoost(true);
        if (speedTimerRef.current) {
          clearTimeout(speedTimerRef.current);
        }
        speedTimerRef.current = setTimeout(() => {
          setHasSpeedBoost(false);
          speedTimerRef.current = null;
        }, SPEED_BOOST_DURATION);
        break;
    }
  }, []);

  const completeLevelPhase = useCallback(() => {
    const elapsed = Date.now() - levelStartTime;
    const secondsElapsed = Math.floor(elapsed / 1000);
    // Time bonus: max 500 points, decreases by 5 per second
    const timeBonus = Math.max(0, 500 - secondsElapsed * 5);
    setScore((prev) => prev + 500 + timeBonus);
    setPhase(EGamePhase.LEVEL_COMPLETE);
  }, [levelStartTime]);

  const toggleMute = useCallback(() => {
    setMuted((prev) => !prev);
  }, []);

  const value: GameContextValue = {
    phase,
    currentLevel,
    health,
    score,
    isInvincible,
    hasShield,
    hasSpeedBoost,
    levelStartTime,
    muted,
    startGame,
    nextLevel,
    restartGame,
    takeDamage,
    addScore,
    collectPowerUp,
    completeLevelPhase,
    toggleMute,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export default GameProvider;
