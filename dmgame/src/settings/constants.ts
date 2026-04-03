export const TILE_SIZE = 48;

export const DEMON_TILE_SIZE = TILE_SIZE * 2;

export const HEAD_OFFSET = 12;

export const GAME_SIZE = 20 * TILE_SIZE; // 960px

export enum EDirection {
  LEFT = "ArrowLeft",
  RIGHT = "ArrowRight",
  UP = "ArrowUp",
  DOWN = "ArrowDown",
}

export enum EWalker {
  HERO = "hero",
  ENEMY = "enemy"
}

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
export const INVINCIBILITY_DURATION = 1500;
export const SHIELD_DURATION = 5000;
export const SPEED_BOOST_DURATION = 5000;
export const ENEMY_CHASE_RANGE = 4;