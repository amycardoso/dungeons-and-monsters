import { ECanvas } from "../contexts/canvas/helpers";

const FL = ECanvas.FLOOR;
const WL = ECanvas.WALL;
const DR = ECanvas.DOOR;
const TR = ECanvas.TRAP;
const MD = ECanvas.MINI_DEMON;
const DE = ECanvas.DEMON;
const CH = ECanvas.CHEST;
const HE = ECanvas.HERO;

export interface LevelConfig {
  name: string;
  map: number[][];
  totalChests: number;
  enemySpeed: number; // ms between moves
}

// Level 1: "The Entrance" — 12x12 playable area, padded to 20x20 with walls
const level1Map: number[][] = [
  [WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, DR, WL, WL, WL, WL, WL, WL, WL, WL, WL],
  [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL, WL, WL, WL, WL, WL, WL, WL, WL],
  [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL, WL, WL, WL, WL, WL, WL, WL, WL],
  [WL, FL, FL, WL, FL, FL, FL, FL, CH, FL, FL, WL, WL, WL, WL, WL, WL, WL, WL, WL],
  [WL, FL, FL, WL, FL, FL, FL, FL, FL, FL, FL, WL, WL, WL, WL, WL, WL, WL, WL, WL],
  [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL, WL, WL, WL, WL, WL, WL, WL, WL],
  [WL, FL, FL, FL, FL, FL, DE, FL, FL, FL, FL, WL, WL, WL, WL, WL, WL, WL, WL, WL],
  [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL, WL, WL, WL, WL, WL, WL, WL, WL],
  [WL, FL, FL, FL, FL, FL, FL, FL, WL, FL, FL, WL, WL, WL, WL, WL, WL, WL, WL, WL],
  [WL, FL, TR, FL, FL, FL, FL, FL, WL, FL, FL, WL, WL, WL, WL, WL, WL, WL, WL, WL],
  [WL, HE, FL, FL, FL, FL, FL, CH, FL, FL, FL, WL, WL, WL, WL, WL, WL, WL, WL, WL],
  [WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL],
  [WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL],
  [WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL],
  [WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL],
  [WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL],
  [WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL],
  [WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL],
  [WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL],
  [WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL],
];

// Level 2: "The Dungeon" — 16x16 playable area, padded to 20x20 with walls
const level2Map: number[][] = [
  [WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, DR, WL, WL, WL, WL, WL, WL],
  [WL, FL, FL, FL, FL, WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL, WL, WL, WL, WL],
  [WL, FL, FL, FL, FL, WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL, WL, WL, WL, WL],
  [WL, FL, CH, FL, FL, WL, FL, FL, WL, WL, FL, FL, FL, CH, FL, WL, WL, WL, WL, WL],
  [WL, FL, FL, FL, FL, FL, FL, FL, FL, WL, FL, FL, FL, FL, FL, WL, WL, WL, WL, WL],
  [WL, FL, FL, TR, FL, FL, FL, FL, FL, WL, FL, FL, FL, FL, FL, WL, WL, WL, WL, WL],
  [WL, FL, FL, FL, FL, FL, DE, FL, FL, FL, FL, FL, TR, FL, FL, WL, WL, WL, WL, WL],
  [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL, WL, WL, WL, WL],
  [WL, WL, WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL, WL, WL, WL, WL],
  [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL, WL, WL, FL, WL, WL, WL, WL, WL],
  [WL, FL, FL, FL, FL, MD, FL, FL, FL, FL, FL, WL, FL, FL, FL, WL, WL, WL, WL, WL],
  [WL, FL, CH, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, CH, FL, WL, WL, WL, WL, WL],
  [WL, FL, FL, FL, FL, FL, FL, FL, DE, FL, FL, FL, FL, FL, FL, WL, WL, WL, WL, WL],
  [WL, FL, FL, FL, FL, FL, TR, FL, FL, FL, FL, FL, FL, FL, FL, WL, WL, WL, WL, WL],
  [WL, HE, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL, WL, WL, WL, WL],
  [WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL],
  [WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL],
  [WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL],
  [WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL],
  [WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL],
];

// Level 3: "The Abyss" — 20x20, based on original map with 2 extra chests and 1 extra demon
const level3Map: number[][] = [
  [WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, DR, DR, WL, WL, WL, WL, WL],
  [WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, DR, DR, WL, WL, WL, WL, WL],
  [WL, FL, FL, WL, FL, FL, FL, FL, WL, FL, FL, FL, FL, FL, FL, FL, WL, FL, FL, WL],
  [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, CH, WL],
  [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL],
  [WL, FL, TR, FL, FL, FL, FL, CH, FL, FL, FL, FL, FL, FL, FL, MD, FL, FL, FL, WL],
  [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL],
  [WL, FL, FL, FL, FL, FL, FL, FL, TR, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL],
  [WL, FL, FL, FL, FL, FL, MD, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL],
  [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, DE, FL, FL, FL, FL, FL, FL, WL],
  [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL],
  [WL, FL, FL, FL, FL, FL, FL, FL, FL, DE, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL],
  [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL],
  [WL, FL, FL, FL, MD, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL],
  [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, CH, FL, FL, FL, WL],
  [WL, FL, CH, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL],
  [WL, FL, FL, FL, TR, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL],
  [WL, HE, WL, FL, FL, FL, FL, FL, FL, FL, CH, FL, FL, FL, FL, FL, TR, FL, FL, WL],
  [WL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, FL, WL],
  [WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL, WL],
];

export const levels: LevelConfig[] = [
  { name: "The Entrance", totalChests: 2, enemySpeed: 2500, map: level1Map },
  { name: "The Dungeon", totalChests: 4, enemySpeed: 2000, map: level2Map },
  { name: "The Abyss", totalChests: 5, enemySpeed: 1500, map: level3Map },
];
