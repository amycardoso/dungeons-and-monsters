# Dungeons & Monsters: Modernize Stack + Game Improvements

**Date:** 2026-04-03
**Branch:** `feature/modernize-stack`
**Approach:** Modernize in-place (keep existing architecture, upgrade stack, layer improvements)

---

## 1. Stack Modernization

| Package | Current | Target |
|---|---|---|
| react | 16.13.1 | 18.x |
| react-dom | 16.13.1 | 18.x |
| react-scripts | 3.4.1 | 5.x |
| typescript | 3.7.5 | 5.x |
| @types/react | 16.9.34 | 18.x |
| @types/react-dom | 16.9.6 | 18.x |
| @use-it/event-listener | 0.1.3 | replace with `usehooks-ts` |
| @use-it/interval | 0.1.3 | replace with `usehooks-ts` |

Key code changes:
- `index.tsx`: Switch from `ReactDOM.render()` to `createRoot()` API
- Replace `@use-it/event-listener` with `useEventListener` from `usehooks-ts`
- Replace `@use-it/interval` with `useInterval` from `usehooks-ts`
- Update tsconfig.json for TypeScript 5.x

## 2. UI/UX Improvements

### Replace alert() with in-game overlays
- Game Over screen: "You died!" with restart button and death animation (screen shake/red flash)
- Victory screen: "You won!" with next level button and celebration effect
- Start screen: Title, "Press Enter to Start", level selection

### HUD (Heads-Up Display)
- Top bar with: current level name, health hearts, chest counter (e.g. "2/5"), score
- Level indicator

### Visual feedback
- Smooth CSS transitions for hero/enemy movement (instead of instant tile jumps)
- Damage flash when hit
- Chest open animation
- Door pulse when all chests collected (signaling "go here")

### Responsive design
- Scale the game board based on viewport size
- Keep pixel-art aesthetic at any scale using `image-rendering: pixelated`

## 3. Gameplay Improvements

### Health system (replaces instant death)
- Hero starts with 3 hearts
- Touching an enemy = lose 1 heart + brief invincibility (1.5s) + knockback
- Touching a trap = lose 1 heart (traps are single-use, disappear after triggered)
- 0 hearts = game over

### 3 Levels with progression
- **Level 1 (Tutorial):** Small map, 1 demon, 2 chests, few traps
- **Level 2 (Medium):** Larger map, 2 demons + 1 mini-demon, 4 chests, more traps
- **Level 3 (Hard):** Full-size map, 3 demons + 2 mini-demons, 5 chests, many traps, tighter corridors

### Power-ups (spawn in random floor tiles)
- Heart: restores 1 health
- Shield: 5 seconds of invincibility (hero flashes/glows)
- Speed boost: faster movement for 5 seconds

### Score system
- +100 per chest collected
- +50 per power-up picked up
- +500 for completing a level
- Time bonus: faster completion = more points
- Final score displayed on victory screen

### Enemy behavior improvement
- Demons: if hero is within 4 tiles, move toward hero instead of randomly
- Makes the game more challenging and engaging

## 4. Polish

### Sound effects (HTML5 Audio, no extra libraries)
- Footstep sound on hero move
- Chest open chime
- Damage/hit sound
- Enemy growl (when they start chasing)
- Power-up pickup
- Victory fanfare / game over sting
- Background ambient music (subtle dungeon atmosphere)
- Mute button in HUD

### Mobile touch controls
- On-screen D-pad overlay for touch devices
- Detect touch vs mouse/keyboard and show/hide accordingly

### Visual theme
- Dark dungeon aesthetic: dark background, torch-lit feel
- CSS box-shadow glow effects for torches, power-ups, and exit door
- Pixel-art style sprites preserved with `image-rendering: pixelated`

### Transitions between levels
- Brief "Level Complete!" screen with score breakdown
- Fade transition into next level

### Language
- All text in English

## 5. Testing & Quality

- Unit tests for: health system math, score calculation, level progression logic, canvas/collision helpers
- Build verification: `npm run build` succeeds on Node 24.x
- Vercel deployment works after merge
- Browser testing: Chrome, Firefox, Safari desktop + mobile Safari/Chrome (touch controls)
