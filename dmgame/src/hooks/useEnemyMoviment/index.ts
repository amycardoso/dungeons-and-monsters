import { useInterval } from 'usehooks-ts';
import React, { useRef } from 'react';
import { EDirection, EGamePhase, EWalker, ENEMY_CHASE_RANGE } from '../../settings/constants';
import { CanvasContext } from '../../contexts/canvas';
import { GameContext } from '../../contexts/game';
import { ECanvas } from '../../contexts/canvas/helpers';
import { useSound } from '../useSound';

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

function useEnemyMoviment(initialPosition: { x: number; y: number }) {
  const canvasContext = React.useContext(CanvasContext);
  const gameContext = React.useContext(GameContext);
  const { play } = useSound();
  const [positionState, updatePositionState] = React.useState(initialPosition);
  const [direction, updateDirectionState] = React.useState(EDirection.RIGHT);
  const wasChasingRef = useRef(false);

  const positionRef = useRef(positionState);
  positionRef.current = positionState;

  const canvasRef = useRef(canvasContext);
  canvasRef.current = canvasContext;

  const gameRef = useRef(gameContext);
  gameRef.current = gameContext;

  useInterval(function move() {
    if (gameRef.current.phase !== EGamePhase.PLAYING) {
      return;
    }

    let chosenDirection: EDirection;

    const heroPos = findHeroPosition(canvasRef.current.canvas);
    const isChasing = !!(heroPos && manhattanDistance(positionRef.current, heroPos) <= ENEMY_CHASE_RANGE);
    if (isChasing) {
      chosenDirection = getChaseDirection(positionRef.current, heroPos!);
      if (!wasChasingRef.current) {
        play('growl');
      }
    } else {
      const random = Math.floor(Math.random() * 4);
      const directionArray = Object.values(EDirection);
      chosenDirection = directionArray[random];
    }

    wasChasingRef.current = isChasing;

    const moviment = canvasRef.current.updateCanvas(chosenDirection, positionRef.current, EWalker.ENEMY);

    if (moviment.nextMove.valid) {
      updateDirectionState(chosenDirection);
      updatePositionState(moviment.nextPosition);
      positionRef.current = moviment.nextPosition;
    }

    if (moviment.nextMove.damage) {
      gameRef.current.takeDamage();
    }
  }, gameRef.current.levelConfig.enemySpeed);

  return {
    position: positionState,
    direction: direction,
  }
}

export default useEnemyMoviment;
