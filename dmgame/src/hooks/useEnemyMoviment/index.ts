import { useInterval } from 'usehooks-ts';
import React from 'react';
import { EDirection, EGamePhase, EWalker, ENEMY_CHASE_RANGE } from '../../settings/constants';
import { CanvasContext } from '../../contexts/canvas';
import { GameContext } from '../../contexts/game';
import { ECanvas } from '../../contexts/canvas/helpers';

function findHeroPosition(canvas: number[][]): { x: number; y: number } | null {
  for (let y = 0; y < canvas.length; y++) {
    for (let x = 0; x < canvas[y].length; x++) {
      if (canvas[y][x] === ECanvas.HERO) {
        return { x, y };
      }
    }
  }
  return null;
}

function manhattanDistance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function getChaseDirection(enemyPos: { x: number; y: number }, heroPos: { x: number; y: number }): EDirection {
  const dx = heroPos.x - enemyPos.x;
  const dy = heroPos.y - enemyPos.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? EDirection.RIGHT : EDirection.LEFT;
  } else {
    return dy > 0 ? EDirection.DOWN : EDirection.UP;
  }
}

function useEnemyMoviment(initialPosition) {
  const canvasContext = React.useContext(CanvasContext);
  const gameContext = React.useContext(GameContext);
  const [positionState, updatePositionState] = React.useState(initialPosition);
  const [direction, updateDirectionState] = React.useState(EDirection.RIGHT);

  useInterval(function move() {
    if (gameContext.phase !== EGamePhase.PLAYING) {
      return;
    }

    let chosenDirection: EDirection;

    // Try chase logic: find hero and check if within range
    const heroPos = findHeroPosition(canvasContext.canvas);
    if (heroPos && manhattanDistance(positionState, heroPos) <= ENEMY_CHASE_RANGE) {
      chosenDirection = getChaseDirection(positionState, heroPos);
    } else {
      // Random movement (existing logic)
      var random = Math.floor(Math.random() * 4);
      var directionArray = Object.values(EDirection);
      chosenDirection = directionArray[random];
    }

    const moviment = canvasContext.updateCanvas(chosenDirection, positionState, EWalker.ENEMY);

    if (moviment.nextMove.valid) {
      updateDirectionState(chosenDirection);
      updatePositionState(moviment.nextPosition);
    }

    if (moviment.nextMove.damage) {
      gameContext.takeDamage();
    }
  }, gameContext.levelConfig.enemySpeed);

  return {
    position: positionState,
    direction: direction,
  }
}

export default useEnemyMoviment;
