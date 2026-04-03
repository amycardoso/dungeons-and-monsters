import { EDirection, EWalker } from "../../settings/constants";

export function handleNextPosition(direction: EDirection, position: { x: number; y: number }) {
  switch(direction) {
    case EDirection.LEFT:
      return { x: position.x - 1, y: position.y };

    case EDirection.RIGHT:
      return { x: position.x + 1, y: position.y };

    case EDirection.DOWN:
      return { x: position.x, y: position.y + 1 };

    case EDirection.UP:
      return { x: position.x, y: position.y - 1 };
  }
}

export enum ECanvas {
  FLOOR = 0,
  WALL = 1,
  DOOR = 2,
  TRAP = 3,
  MINI_DEMON = 4,
  DEMON = 5,
  CHEST = 6,
  HERO = 7,
  POWER_UP = 8
};

export function checkValidMoviment(canvas: number[][], nextPosition: { x: number; y: number }, walker: EWalker) {
  const canvasValue = canvas[nextPosition.y][nextPosition.x];

  const result = walker === EWalker.HERO ? getHeroValidMoves(canvasValue) : getEnemyValidMoves(canvasValue);
  return result;
}

function getHeroValidMoves(canvasValue: number) {
  return {
    valid: canvasValue === ECanvas.FLOOR || canvasValue === ECanvas.CHEST || canvasValue === ECanvas.TRAP || canvasValue === ECanvas.MINI_DEMON || canvasValue === ECanvas.DEMON || canvasValue === ECanvas.DOOR || canvasValue === ECanvas.POWER_UP,
    damage: canvasValue === ECanvas.TRAP || canvasValue === ECanvas.MINI_DEMON || canvasValue === ECanvas.DEMON,
    chest: canvasValue === ECanvas.CHEST,
    door: canvasValue === ECanvas.DOOR,
    powerup: canvasValue === ECanvas.POWER_UP,
  }
}

function getEnemyValidMoves(canvasValue: number) {
  return {
    valid: canvasValue === ECanvas.FLOOR || canvasValue === ECanvas.HERO,
    damage: canvasValue === ECanvas.HERO,
    chest: false,
    door: false,
  }
}