# Dungeons & Monsters: Modernize + Improve Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Modernize the Dungeons & Monsters game to run on Node 24.x with React 18, and add gameplay improvements (health system, 3 levels, power-ups, score, HUD, sound, touch controls).

**Architecture:** Keep existing Context API + functional components architecture. Add a GameContext for centralized game state (health, score, level, game phase). Level maps stored as constant arrays like the existing canvas. Sound via HTML5 Audio. Touch controls via pointer events.

**Tech Stack:** React 18, react-scripts 5, TypeScript 5, usehooks-ts, HTML5 Audio, CSS transitions/animations.

**Important:** Do NOT add Co-Authored-By lines to any git commits.

---

## Task 1: Create Feature Branch

**Files:** None (git only)

**Step 1: Create and switch to feature branch**

```bash
cd /Users/ameliaalicecardoso/Documents/GitHub/dungeons-and-monsters
git checkout -b feature/modernize-stack
```

**Step 2: Commit**

Not needed — branch creation only.

---

## Task 2: Upgrade Dependencies

**Files:**
- Modify: `dmgame/package.json`
- Regenerate: `dmgame/package-lock.json`

**Step 1: Remove old packages and install new ones**

```bash
cd /Users/ameliaalicecardoso/Documents/GitHub/dungeons-and-monsters/dmgame
rm -rf node_modules package-lock.json

# Update package.json dependencies
npm install react@18 react-dom@18 react-scripts@5 typescript@5 usehooks-ts@latest
npm install --save-dev @types/react@18 @types/react-dom@18

# Remove old packages
npm uninstall @use-it/event-listener @use-it/interval @types/history
```

**Step 2: Verify install succeeds**

```bash
npm ls react react-dom react-scripts typescript usehooks-ts
```

Expected: All packages listed at correct major versions.

**Step 3: Commit**

```bash
cd /Users/ameliaalicecardoso/Documents/GitHub/dungeons-and-monsters
git add dmgame/package.json dmgame/package-lock.json
git commit -m "Upgrade to React 18, react-scripts 5, TypeScript 5, replace @use-it hooks with usehooks-ts"
```

---

## Task 3: Fix Entry Point for React 18

**Files:**
- Modify: `dmgame/src/index.tsx`

**Step 1: Update to createRoot API**

Replace entire file content with:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<App />);
```

**Step 2: Update tsconfig.json**

Modify `dmgame/tsconfig.json`:
- Change `"jsx": "react"` to `"jsx": "react-jsx"`
- Change `"target": "es5"` to `"target": "es2015"`
- Change `"module": "esnext"` to `"module": "esnext"` (keep)
- Add `"moduleResolution": "node"` (already present, keep)

**Step 3: Replace hook imports in useHeroMoviment**

Modify `dmgame/src/hooks/useHeroMoviment/index.ts`:
- Change: `import useEventListener from '@use-it/event-listener';`
- To: `import { useEventListener } from 'usehooks-ts';`

Note: `usehooks-ts` useEventListener has a different signature. It takes `(eventName, handler, element?, options?)`. For document-level events, pass `documentRef`:

```ts
import { useEventListener } from 'usehooks-ts';
import React, { useRef } from 'react';

// Inside the hook, use:
const documentRef = useRef<Document>(document);
useEventListener('keydown', (event: KeyboardEvent) => {
  // ... existing handler logic (change React.KeyboardEvent to KeyboardEvent)
}, documentRef);
```

**Step 4: Replace hook imports in useEnemyMoviment**

Modify `dmgame/src/hooks/useEnemyMoviment/index.ts`:
- Change: `import useInterval from '@use-it/interval';`
- To: `import { useInterval } from 'usehooks-ts';`

Note: `usehooks-ts` useInterval has the same signature `(callback, delay)` — drop-in replacement.

**Step 5: Verify build**

```bash
cd /Users/ameliaalicecardoso/Documents/GitHub/dungeons-and-monsters/dmgame
npm run build
```

Expected: Build succeeds. Fix any TypeScript errors that arise.

**Step 6: Verify dev server**

```bash
npm start
```

Expected: Game loads and is playable in browser (same behavior as before).

**Step 7: Commit**

```bash
cd /Users/ameliaalicecardoso/Documents/GitHub/dungeons-and-monsters
git add dmgame/src/ dmgame/tsconfig.json
git commit -m "Migrate to React 18 createRoot API and usehooks-ts"
```

---

## Task 4: Add Game State Context

This is the foundation for all gameplay improvements. Centralizes health, score, level, and game phase.

**Files:**
- Create: `dmgame/src/contexts/game/index.tsx`
- Create: `dmgame/src/settings/levels.ts`
- Modify: `dmgame/src/settings/constants.ts`
- Modify: `dmgame/src/components/Game.tsx`

**Step 1: Add new constants**

Add to `dmgame/src/settings/constants.ts`:

```ts
export enum EGamePhase {
  START = "start",
  PLAYING = "playing",
  LEVEL_COMPLETE = "level_complete",
  GAME_OVER = "game_over",
  VICTORY = "victory",
}

export enum EPowerUp {
  HEART = "heart",
  SHIELD = "shield",
  SPEED = "speed",
}

export const INITIAL_HEALTH = 3;
export const MAX_HEALTH = 5;
export const INVINCIBILITY_DURATION = 1500; // ms
export const SHIELD_DURATION = 5000; // ms
export const SPEED_BOOST_DURATION = 5000; // ms
export const ENEMY_CHASE_RANGE = 4; // tiles
```

**Step 2: Create level maps**

Create `dmgame/src/settings/levels.ts` with 3 level maps. Use the same ECanvas enum. The existing canvas becomes the basis for Level 3 (Hard). Create simpler maps for Levels 1 and 2.

```ts
import { ECanvas } from '../contexts/canvas/helpers';

const FL = ECanvas.FLOOR;
const WL = ECanvas.WALL;
const DR = ECanvas.DOOR;
const TR = ECanvas.TRAP;
const MD = ECanvas.MINI_DEMON;
const DE = ECanvas.DEMON;
const CH = ECanvas.CHEST;
const HE = ECanvas.HERO;
const PU = 8; // power-up placeholder (add to ECanvas enum)

export interface LevelConfig {
  name: string;
  map: number[][];
  totalChests: number;
  enemySpeed: number; // ms between enemy moves
}

export const levels: LevelConfig[] = [
  {
    name: "The Entrance",
    totalChests: 2,
    enemySpeed: 2500,
    map: [
      [WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL],
      [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, DR, WL],
      [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, DR, WL],
      [WL, FL, FL, FL, FL, CH, FL, FL, FL, FL, FL, WL],
      [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL],
      [WL, FL, FL, FL, FL, FL, FL, TR, FL, FL, FL, WL],
      [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL],
      [WL, FL, FL, DE, FL, FL, FL, FL, FL, CH, FL, WL],
      [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL],
      [WL, HE, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL],
      [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL],
      [WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL],
    ],
  },
  {
    name: "The Dungeon",
    totalChests: 4,
    enemySpeed: 2000,
    map: [
      [WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL],
      [WL, FL, FL, FL, FL, FL, WL, FL, FL, FL, FL, FL, FL, FL, DR, WL],
      [WL, FL, FL, FL, FL, FL, WL, FL, FL, FL, FL, FL, FL, FL, DR, WL],
      [WL, FL, FL, CH, FL, FL, FL, FL, FL, FL, WL, FL, FL, FL, FL, WL],
      [WL, FL, FL, FL, FL, FL, FL, FL, TR, FL, WL, FL, FL, FL, FL, WL],
      [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, CH, FL, WL],
      [WL, FL, TR, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL],
      [WL, FL, FL, FL, DE, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL],
      [WL, FL, FL, FL, FL, FL, FL, FL, FL, MD, FL, FL, FL, FL, FL, WL],
      [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL],
      [WL, FL, FL, FL, FL, FL, WL, WL, WL, FL, FL, FL, FL, FL, FL, WL],
      [WL, FL, CH, FL, FL, FL, WL, FL, FL, FL, DE, FL, FL, CH, FL, WL],
      [WL, FL, FL, FL, TR, FL, WL, FL, FL, FL, FL, FL, FL, FL, FL, WL],
      [WL, HE, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, TR, FL, FL, WL],
      [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL],
      [WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL],
    ],
  },
  {
    name: "The Abyss",
    totalChests: 5,
    enemySpeed: 1500,
    map: [
      [WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, DR, DR, WL, WL, WL, WL, WL],
      [WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, DR, DR, WL, WL, WL, WL, WL],
      [WL, FL, FL, WL, FL, FL, FL, FL, WL, FL, FL, FL, FL, FL, FL, FL, WL, FL, FL, WL],
      [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, CH, WL],
      [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL],
      [WL, FL, TR, FL, FL, FL, FL, CH, FL, FL, FL, FL, FL, FL, FL, MD, FL, FL, FL, WL],
      [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL],
      [WL, FL, FL, FL, FL, FL, FL, FL, TR, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL],
      [WL, FL, FL, FL, FL, FL, MD, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL],
      [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL],
      [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL],
      [WL, FL, FL, FL, FL, FL, FL, FL, FL, DE, FL, FL, FL, FL, FL, FL, FL, TR, FL, WL],
      [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL],
      [WL, FL, FL, FL, MD, FL, FL, FL, FL, FL, FL, FL, FL, DE, FL, FL, FL, FL, FL, WL],
      [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, CH, FL, FL, FL, WL],
      [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL],
      [WL, FL, FL, FL, TR, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL],
      [WL, HE, WL, FL, FL, FL, FL, FL, FL, FL, CH, FL, FL, FL, FL, FL, TR, FL, FL, WL],
      [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, CH, FL, WL],
      [WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL],
    ],
  },
];
```

**Step 3: Create GameContext**

Create `dmgame/src/contexts/game/index.tsx`:

```tsx
import React, { createContext, useState, useCallback, useRef } from 'react';
import { EGamePhase, INITIAL_HEALTH, MAX_HEALTH } from '../../settings/constants';
import { levels, LevelConfig } from '../../settings/levels';

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

interface GameContextType extends GameState {
  levelConfig: LevelConfig;
  startGame: () => void;
  nextLevel: () => void;
  restartGame: () => void;
  takeDamage: () => void;
  addScore: (points: number) => void;
  collectPowerUp: (type: string) => void;
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

export const GameContext = createContext<GameContextType>({
  ...defaultState,
  levelConfig: levels[0],
  startGame: () => {},
  nextLevel: () => {},
  restartGame: () => {},
  takeDamage: () => {},
  addScore: () => {},
  collectPowerUp: () => {},
  completeLevelPhase: () => {},
  toggleMute: () => {},
});

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(defaultState);
  const invincibilityTimer = useRef<NodeJS.Timeout | null>(null);
  const shieldTimer = useRef<NodeJS.Timeout | null>(null);
  const speedTimer = useRef<NodeJS.Timeout | null>(null);

  const startGame = useCallback(() => {
    setState({
      ...defaultState,
      phase: EGamePhase.PLAYING,
      levelStartTime: Date.now(),
    });
  }, []);

  const nextLevel = useCallback(() => {
    setState(prev => {
      const next = prev.currentLevel + 1;
      if (next >= levels.length) {
        return { ...prev, phase: EGamePhase.VICTORY };
      }
      return {
        ...prev,
        currentLevel: next,
        phase: EGamePhase.PLAYING,
        isInvincible: false,
        hasShield: false,
        hasSpeedBoost: false,
        levelStartTime: Date.now(),
      };
    });
  }, []);

  const restartGame = useCallback(() => {
    setState({
      ...defaultState,
      phase: EGamePhase.PLAYING,
      levelStartTime: Date.now(),
    });
  }, []);

  const takeDamage = useCallback(() => {
    setState(prev => {
      if (prev.isInvincible || prev.hasShield) return prev;
      const newHealth = prev.health - 1;
      if (newHealth <= 0) {
        return { ...prev, health: 0, phase: EGamePhase.GAME_OVER };
      }
      return { ...prev, health: newHealth, isInvincible: true };
    });
    // Set invincibility timer
    if (invincibilityTimer.current) clearTimeout(invincibilityTimer.current);
    invincibilityTimer.current = setTimeout(() => {
      setState(prev => ({ ...prev, isInvincible: false }));
    }, 1500);
  }, []);

  const addScore = useCallback((points: number) => {
    setState(prev => ({ ...prev, score: prev.score + points }));
  }, []);

  const collectPowerUp = useCallback((type: string) => {
    setState(prev => {
      switch (type) {
        case 'heart':
          return { ...prev, health: Math.min(prev.health + 1, MAX_HEALTH), score: prev.score + 50 };
        case 'shield':
          return { ...prev, hasShield: true, score: prev.score + 50 };
        case 'speed':
          return { ...prev, hasSpeedBoost: true, score: prev.score + 50 };
        default:
          return prev;
      }
    });
    if (type === 'shield') {
      if (shieldTimer.current) clearTimeout(shieldTimer.current);
      shieldTimer.current = setTimeout(() => {
        setState(prev => ({ ...prev, hasShield: false }));
      }, 5000);
    }
    if (type === 'speed') {
      if (speedTimer.current) clearTimeout(speedTimer.current);
      speedTimer.current = setTimeout(() => {
        setState(prev => ({ ...prev, hasSpeedBoost: false }));
      }, 5000);
    }
  }, []);

  const completeLevelPhase = useCallback(() => {
    setState(prev => {
      const timeBonus = Math.max(0, 300 - Math.floor((Date.now() - prev.levelStartTime) / 1000)) * 2;
      return {
        ...prev,
        phase: EGamePhase.LEVEL_COMPLETE,
        score: prev.score + 500 + timeBonus,
      };
    });
  }, []);

  const toggleMute = useCallback(() => {
    setState(prev => ({ ...prev, muted: !prev.muted }));
  }, []);

  return (
    <GameContext.Provider value={{
      ...state,
      levelConfig: levels[state.currentLevel],
      startGame,
      nextLevel,
      restartGame,
      takeDamage,
      addScore,
      collectPowerUp,
      completeLevelPhase,
      toggleMute,
    }}>
      {children}
    </GameContext.Provider>
  );
}
```

**Step 4: Wire GameProvider into App**

Modify `dmgame/src/components/Game.tsx` to wrap with GameProvider:

```tsx
import React from 'react';
import CanvasProvider from '../contexts/canvas';
import Board from './Board';
import ChestsProvider from '../contexts/chests';
import { GameProvider } from '../contexts/game';

function Game() {
  return (
    <GameProvider>
      <CanvasProvider>
        <ChestsProvider>
          <Board />
        </ChestsProvider>
      </CanvasProvider>
    </GameProvider>
  );
}

export default Game;
```

**Step 5: Verify build**

```bash
cd /Users/ameliaalicecardoso/Documents/GitHub/dungeons-and-monsters/dmgame
npm run build
```

**Step 6: Commit**

```bash
git add dmgame/src/
git commit -m "Add GameContext with health, score, levels, and power-up state management"
```

---

## Task 5: Refactor Canvas Context for Multi-Level Support

The canvas context currently imports a hardcoded canvas from helpers.ts. Refactor it to accept a level map from GameContext.

**Files:**
- Modify: `dmgame/src/contexts/canvas/helpers.ts` — remove hardcoded canvas, add ECanvas.POWER_UP
- Modify: `dmgame/src/contexts/canvas/index.tsx` — accept level map as prop, integrate with GameContext for damage/powerups
- Modify: `dmgame/src/contexts/chests/index.tsx` — accept totalChests from level config
- Modify: `dmgame/src/components/Board/index.tsx` — read map from context instead of hardcoded import

**Step 1: Update ECanvas enum in helpers.ts**

Add `POWER_UP = 8` to ECanvas enum. Remove the hardcoded `canvas` export. Keep `handleNextPosition` and `checkValidMoviment` but update `checkValidMoviment` to accept canvas as parameter instead of importing it.

**Step 2: Update CanvasProvider to accept level map**

The provider should receive `initialCanvas: number[][]` as a prop and use it for state.

**Step 3: Update ChestsProvider to accept totalChests**

Receive `totalChests: number` as prop instead of hardcoding `2`.

**Step 4: Update Board to dynamically read map from context**

Move `getCanvasMap()` inside the Board component so it reads from context state rather than the hardcoded import.

**Step 5: Update Game.tsx to pass level config**

```tsx
function Game() {
  const { levelConfig, phase } = React.useContext(GameContext);

  return (
    <GameProvider>
      <CanvasProvider initialCanvas={levelConfig.map}>
        <ChestsProvider totalChests={levelConfig.totalChests}>
          <Board />
        </ChestsProvider>
      </CanvasProvider>
    </GameProvider>
  );
}
```

Note: GameProvider must be outside, so Game needs to be split — GameProvider wraps in App.tsx, and Game reads from GameContext.

**Step 6: Verify game still works with Level 3 map (same as original)**

```bash
npm start
```

**Step 7: Commit**

```bash
git add dmgame/src/
git commit -m "Refactor canvas and chests contexts for multi-level support"
```

---

## Task 6: Health System and Damage

Replace instant-death with the health system.

**Files:**
- Modify: `dmgame/src/hooks/useHeroMoviment/index.ts`
- Modify: `dmgame/src/hooks/useEnemyMoviment/index.ts`
- Modify: `dmgame/src/contexts/canvas/helpers.ts`

**Step 1: Update useHeroMoviment**

- Import GameContext
- On enemy/trap collision: call `gameContext.takeDamage()` instead of `alert('You died')`
- On trap: mark trap as used (set to FLOOR in canvas)
- Check `gameContext.isInvincible` — if true, skip damage
- On all chests collected + door: call `gameContext.completeLevelPhase()` instead of alert
- Add score on chest: `gameContext.addScore(100)`

**Step 2: Update useEnemyMoviment**

- Import GameContext
- On hero collision: call `gameContext.takeDamage()` instead of alert
- Add chase logic: if hero position is within ENEMY_CHASE_RANGE tiles (Manhattan distance), move toward hero instead of random. Requires knowing hero position — read from canvas state.

**Step 3: Verify**

```bash
npm start
```

Test: walk into enemy, lose 1 heart, brief invincibility. Walk into 3 enemies, game over.

**Step 4: Commit**

```bash
git add dmgame/src/
git commit -m "Implement health system with damage, invincibility, and enemy chase AI"
```

---

## Task 7: Power-Up System

**Files:**
- Create: `dmgame/src/components/PowerUp/index.tsx`
- Create: `dmgame/src/components/PowerUp/index.css`
- Modify: `dmgame/src/components/Board/index.tsx` — render PowerUp components
- Modify: `dmgame/src/hooks/useHeroMoviment/index.ts` — handle power-up collection
- Modify: `dmgame/src/contexts/canvas/helpers.ts` — add POWER_UP to valid hero moves

**Step 1: Create PowerUp component**

Renders a floating/pulsing sprite at its tile position. Uses CSS animation for glow effect. Three types: heart (red), shield (blue), speed (yellow).

**Step 2: Add power-up tiles to level maps**

Add a few POWER_UP (8) tiles to each level map in `levels.ts`.

**Step 3: Handle collection in useHeroMoviment**

When hero moves onto POWER_UP tile, determine type (can be random or based on position), call `gameContext.collectPowerUp(type)`.

**Step 4: Visual feedback for active power-ups**

- Shield active: hero has blue glow (CSS box-shadow)
- Speed active: hero movement uses shorter interval
- Invincible: hero flashes (CSS animation)

**Step 5: Verify**

```bash
npm start
```

**Step 6: Commit**

```bash
git add dmgame/src/
git commit -m "Add power-up system with heart, shield, and speed boost"
```

---

## Task 8: HUD Component

**Files:**
- Create: `dmgame/src/components/HUD/index.tsx`
- Create: `dmgame/src/components/HUD/index.css`
- Modify: `dmgame/src/components/App.tsx` — add HUD above game board

**Step 1: Create HUD component**

Reads from GameContext. Displays:
- Level name (left)
- Hearts as pixel-art icons (center-left)
- Chest counter "2/5" (center-right)
- Score (right)
- Mute button (far right)

Style: dark bar, pixel font (use system monospace or Google Fonts "Press Start 2P"), matches dungeon theme.

**Step 2: Wire into App.tsx**

```tsx
function App() {
  return (
    <div className="App">
      <GameProvider>
        <HUD />
        <div style={{ position: 'relative', width: GAME_SIZE, height: GAME_SIZE }}>
          <Game />
        </div>
      </GameProvider>
    </div>
  );
}
```

Note: GameProvider moves to App.tsx so HUD and Game share state.

**Step 3: Verify HUD displays correctly**

```bash
npm start
```

**Step 4: Commit**

```bash
git add dmgame/src/
git commit -m "Add HUD with health, score, chest counter, level name, and mute toggle"
```

---

## Task 9: Game Screens (Start, Game Over, Victory, Level Complete)

**Files:**
- Create: `dmgame/src/components/screens/StartScreen.tsx`
- Create: `dmgame/src/components/screens/GameOverScreen.tsx`
- Create: `dmgame/src/components/screens/VictoryScreen.tsx`
- Create: `dmgame/src/components/screens/LevelCompleteScreen.tsx`
- Create: `dmgame/src/components/screens/screens.css`
- Modify: `dmgame/src/components/App.tsx` — conditionally render screens based on game phase

**Step 1: Create StartScreen**

Full-screen overlay over the game area. Title "Dungeons & Monsters", subtitle "Press Enter to Start". Dark background with dungeon aesthetic. Listen for Enter key to call `gameContext.startGame()`.

**Step 2: Create GameOverScreen**

Overlay: "You Died!" with red tint/flash, final score, "Press Enter to Restart". Screen shake CSS animation on mount. Calls `gameContext.restartGame()`.

**Step 3: Create LevelCompleteScreen**

Overlay: "Level Complete!", score breakdown (chests, time bonus, level bonus), "Press Enter for Next Level". Calls `gameContext.nextLevel()`.

**Step 4: Create VictoryScreen**

Overlay: "You Won!", total score, celebration effect (CSS sparkle/confetti), "Press Enter to Play Again". Calls `gameContext.restartGame()`.

**Step 5: Wire screens into App**

```tsx
function App() {
  const { phase } = React.useContext(GameContext);

  return (
    <div className="App">
      <HUD />
      <div style={{ position: 'relative', width: GAME_SIZE, height: GAME_SIZE }}>
        <Game />
        {phase === EGamePhase.START && <StartScreen />}
        {phase === EGamePhase.GAME_OVER && <GameOverScreen />}
        {phase === EGamePhase.LEVEL_COMPLETE && <LevelCompleteScreen />}
        {phase === EGamePhase.VICTORY && <VictoryScreen />}
      </div>
    </div>
  );
}
```

Note: App.tsx needs to be inside GameProvider to use useContext. Move GameProvider to index.tsx or create a wrapper.

**Step 6: Verify all screens show/transition correctly**

**Step 7: Commit**

```bash
git add dmgame/src/
git commit -m "Add game screens for start, game over, level complete, and victory"
```

---

## Task 10: Smooth Movement and Visual Effects

**Files:**
- Modify: `dmgame/src/components/Hero/index.tsx`
- Modify: `dmgame/src/components/Hero/index.css`
- Modify: `dmgame/src/components/Demon/index.tsx`
- Modify: `dmgame/src/components/Demon/index.css`
- Modify: `dmgame/src/components/MiniDemon/index.tsx`
- Modify: `dmgame/src/components/MiniDemon/index.css`
- Modify: `dmgame/src/components/Board/index.tsx`

**Step 1: Add CSS transitions for movement**

Add `transition: top 0.15s ease, left 0.15s ease` to Hero, Demon, and MiniDemon inline styles (or move to CSS classes).

**Step 2: Add damage flash to Hero**

When `gameContext.isInvincible` is true, add CSS class `hero--invincible` that flashes the hero (opacity animation).

**Step 3: Add door pulse**

When all chests are collected, add CSS class `door--ready` to the door image with a pulsing glow animation.

**Step 4: Responsive scaling**

Wrap the game board in a container that uses CSS `transform: scale()` based on viewport width. Add `image-rendering: pixelated` to preserve pixel art.

```css
.game-container {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
```

**Step 5: Verify smooth movement in browser**

**Step 6: Commit**

```bash
git add dmgame/src/
git commit -m "Add smooth movement transitions, damage flash, door pulse, and responsive scaling"
```

---

## Task 11: Sound System

**Files:**
- Create: `dmgame/src/hooks/useSound/index.ts`
- Create: `dmgame/public/assets/sounds/` (directory for sound files)
- Modify: `dmgame/src/hooks/useHeroMoviment/index.ts` — trigger sounds
- Modify: `dmgame/src/hooks/useEnemyMoviment/index.ts` — trigger sounds

**Step 1: Create useSound hook**

```ts
import { useRef, useCallback, useContext } from 'react';
import { GameContext } from '../../contexts/game';

const audioCache: Record<string, HTMLAudioElement> = {};

function getAudio(src: string): HTMLAudioElement {
  if (!audioCache[src]) {
    audioCache[src] = new Audio(src);
  }
  return audioCache[src];
}

export function useSound() {
  const { muted } = useContext(GameContext);

  const play = useCallback((src: string, volume = 0.5) => {
    if (muted) return;
    const audio = getAudio(src);
    audio.volume = volume;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }, [muted]);

  const playLoop = useCallback((src: string, volume = 0.3) => {
    if (muted) return;
    const audio = getAudio(src);
    audio.volume = volume;
    audio.loop = true;
    audio.play().catch(() => {});
  }, [muted]);

  const stopLoop = useCallback((src: string) => {
    const audio = audioCache[src];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  return { play, playLoop, stopLoop };
}
```

**Step 2: Source or generate sound files**

Need free/CC0 sound effects. Use tiny synthesized sounds or source from freesound.org. Files to create/source:
- `footstep.mp3` — short click/tap
- `chest.mp3` — chime
- `damage.mp3` — hit/oof
- `powerup.mp3` — sparkle
- `gameover.mp3` — sad sting
- `victory.mp3` — fanfare
- `ambient.mp3` — looping dungeon ambiance

Note: For the initial implementation, the engineer can use placeholder audio or generate simple tones. Sound files can be swapped later.

**Step 3: Integrate sounds into hooks**

In useHeroMoviment: play footstep on valid move, chest chime on chest, damage on hit, powerup on collect.
In useEnemyMoviment: play growl when enemy starts chasing.
In game screens: play gameover/victory sounds.
In Board: play ambient loop when phase is PLAYING.

**Step 4: Mute button integration**

Already wired via GameContext `muted` state. The useSound hook reads it.

**Step 5: Commit**

```bash
git add dmgame/src/ dmgame/public/
git commit -m "Add sound system with HTML5 Audio for game effects and ambient music"
```

---

## Task 12: Mobile Touch Controls

**Files:**
- Create: `dmgame/src/components/TouchControls/index.tsx`
- Create: `dmgame/src/components/TouchControls/index.css`
- Modify: `dmgame/src/components/App.tsx` — render TouchControls below game board

**Step 1: Create TouchControls component**

D-pad layout with 4 directional buttons. Each button dispatches a `keydown` KeyboardEvent on the document (so the existing useEventListener picks it up).

```tsx
function TouchControls() {
  const dispatch = (key: string) => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key }));
  };

  return (
    <div className="touch-controls">
      <button className="touch-btn touch-up" onTouchStart={() => dispatch('ArrowUp')}>&#9650;</button>
      <div className="touch-row">
        <button className="touch-btn touch-left" onTouchStart={() => dispatch('ArrowLeft')}>&#9664;</button>
        <button className="touch-btn touch-right" onTouchStart={() => dispatch('ArrowRight')}>&#9654;</button>
      </div>
      <button className="touch-btn touch-down" onTouchStart={() => dispatch('ArrowDown')}>&#9660;</button>
    </div>
  );
}
```

**Step 2: Style the D-pad**

Dark semi-transparent buttons, large touch targets (min 48px), centered below game board. Only visible on touch devices:

```css
.touch-controls {
  display: none;
}

@media (pointer: coarse) {
  .touch-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 16px;
  }
}
```

**Step 3: Verify on mobile (or Chrome DevTools device emulation)**

**Step 4: Commit**

```bash
git add dmgame/src/
git commit -m "Add mobile touch controls with D-pad overlay"
```

---

## Task 13: Dark Dungeon Theme and CSS Polish

**Files:**
- Modify: `dmgame/src/index.css` — global dark theme
- Modify: `dmgame/src/components/App.css` — dungeon aesthetic
- Modify: `dmgame/src/components/Board/index.tsx` — add torch glow effects
- Create: `dmgame/public/assets/HEART.png` — heart sprite for HUD (or use CSS/emoji)
- Create: `dmgame/public/assets/SHIELD.png` — shield power-up sprite (or use CSS/emoji)
- Create: `dmgame/public/assets/SPEED.png` — speed power-up sprite (or use CSS/emoji)
- Create: `dmgame/public/assets/POWER-UP.png` — generic power-up sprite

**Step 1: Global dark theme**

```css
body {
  background-color: #1a1a2e;
  color: #e0e0e0;
  font-family: 'Press Start 2P', monospace;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
```

Add Google Font "Press Start 2P" via `<link>` in `dmgame/public/index.html`.

**Step 2: Glow effects**

- Door when ready: `box-shadow: 0 0 20px 5px gold`
- Power-ups: `box-shadow: 0 0 10px 3px cyan` (pulsing)
- Torch tiles (wall adjacent to floor): subtle `box-shadow: 0 0 15px 5px orange` at fixed positions

**Step 3: Level transition fade**

```css
.level-fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**Step 4: Verify visual theme looks cohesive**

**Step 5: Commit**

```bash
git add dmgame/src/ dmgame/public/
git commit -m "Add dark dungeon theme, glow effects, and CSS polish"
```

---

## Task 14: Build Verification and Cleanup

**Files:**
- Modify: various — fix any TypeScript errors or warnings

**Step 1: Run production build**

```bash
cd /Users/ameliaalicecardoso/Documents/GitHub/dungeons-and-monsters/dmgame
npm run build
```

Fix any errors.

**Step 2: Run tests (if any exist)**

```bash
npm test -- --watchAll=false
```

Fix or update any failing tests.

**Step 3: Clean up**

- Remove commented-out code in components
- Remove unused imports
- Verify all sprite references exist in `public/assets/`

**Step 4: Test full game flow**

- Start screen → press Enter → Level 1
- Collect chests, pick up power-ups, take damage from enemies
- Complete Level 1 → Level Complete screen → Level 2
- Complete Level 2 → Level 3
- Complete Level 3 → Victory screen
- Die → Game Over screen → Restart
- Test mute button
- Test responsive scaling
- Test touch controls (Chrome DevTools)

**Step 5: Commit**

```bash
git add -A
git commit -m "Fix build errors, clean up code, verify full game flow"
```

---

## Task 15: Push Branch and Create PR

**Step 1: Push feature branch**

```bash
git push -u origin feature/modernize-stack
```

**Step 2: Create pull request**

```bash
gh pr create --title "Modernize stack and improve game" --body "$(cat <<'EOF'
## Summary
- Upgrade to React 18, react-scripts 5, TypeScript 5 (Node 24 compatible)
- Add health system (3 hearts) replacing instant death
- Add 3 levels with progression (The Entrance, The Dungeon, The Abyss)
- Add power-ups (heart, shield, speed boost)
- Add score system with time bonus
- Add HUD with health, score, chest counter, level name
- Add game screens (start, game over, level complete, victory)
- Add smooth movement transitions and visual effects
- Add sound system (footsteps, chests, damage, ambient)
- Add mobile touch controls (D-pad)
- Add dark dungeon theme with glow effects
- Replace unmaintained @use-it packages with usehooks-ts

## Test plan
- [ ] `npm run build` succeeds on Node 24
- [ ] Full game flow: start → 3 levels → victory
- [ ] Health system: damage, invincibility, game over at 0 hearts
- [ ] Power-ups: heart heals, shield blocks, speed boosts
- [ ] Score accumulates correctly across levels
- [ ] Sound plays and mute toggle works
- [ ] Mobile touch controls work on touch devices
- [ ] Responsive scaling on different screen sizes
- [ ] Vercel deployment succeeds
EOF
)"
```

---

## Task Dependencies

```
Task 1 (branch) → Task 2 (deps) → Task 3 (React 18 migration)
  → Task 4 (GameContext) → Task 5 (multi-level canvas)
    → Task 6 (health/damage) → Task 7 (power-ups)
    → Task 8 (HUD)
    → Task 9 (game screens)
  → Task 10 (visual effects) — after Tasks 6-9
  → Task 11 (sound) — after Tasks 6-9
  → Task 12 (touch controls) — after Task 3
  → Task 13 (theme) — after Tasks 8-9
  → Task 14 (verification) — after all above
  → Task 15 (PR) — after Task 14
```
