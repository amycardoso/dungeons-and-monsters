import { useEventListener } from 'usehooks-ts';
import React, { useRef } from 'react';
import { EDirection, EGamePhase, EPowerUp, EWalker } from '../../settings/constants';
import { CanvasContext } from '../../contexts/canvas';
import { ChestsContext } from '../../contexts/chests';
import { GameContext } from '../../contexts/game';
import { useSound } from '../useSound';

function useHeroMoviment(initialPosition: { x: number; y: number }) {
  const canvasContext = React.useContext(CanvasContext);
  const chestsContext = React.useContext(ChestsContext);
  const gameContext = React.useContext(GameContext);
  const { play } = useSound();

  const [positionState, updatePositionState] = React.useState(initialPosition);
  const [direction, updateDirectionState] = React.useState(EDirection.RIGHT);

  const positionRef = useRef(positionState);
  positionRef.current = positionState;

  const canvasRef = useRef(canvasContext);
  canvasRef.current = canvasContext;

  const chestsRef = useRef(chestsContext);
  chestsRef.current = chestsContext;

  const gameRef = useRef(gameContext);
  gameRef.current = gameContext;

  const documentRef = useRef<Document>(document);

  useEventListener('keydown', (event: KeyboardEvent) => {
    if (gameRef.current.phase !== EGamePhase.PLAYING) {
      return;
    }

    const dir = event.key as EDirection;

    if (dir.indexOf('Arrow') === -1) {
      return;
    }

    event.preventDefault();

    const moviment = canvasRef.current.updateCanvas(dir, positionRef.current, EWalker.HERO);

    if (moviment.nextMove.valid) {
      updatePositionState(moviment.nextPosition);
      positionRef.current = moviment.nextPosition;
      updateDirectionState(dir);
      play('footstep');
    }

    if (moviment.nextMove.damage && !gameRef.current.isInvincible) {
      gameRef.current.takeDamage();
      play('damage');
      // Respawn hero at initial position if still alive (health > 1 because takeDamage already decremented)
      if (gameRef.current.health > 1) {
        canvasRef.current.teleportHero(moviment.nextPosition, initialPosition);
        updatePositionState(initialPosition);
        positionRef.current = initialPosition;
        updateDirectionState(EDirection.RIGHT);
      }
    }

    if (moviment.nextMove.powerup) {
      const POWER_UP_TYPES = [EPowerUp.HEART, EPowerUp.SHIELD, EPowerUp.SPEED];
      const type = POWER_UP_TYPES[(moviment.nextPosition.x * 7 + moviment.nextPosition.y * 13) % 3];
      gameRef.current.collectPowerUp(type);
      play('powerup');
    }

    if (moviment.nextMove.chest) {
      chestsRef.current.updateOpenedChests(moviment.nextPosition);
      gameRef.current.addScore(100);
      play('chest');
    }

    if (chestsRef.current.totalChests === chestsRef.current.openedChests.total && moviment.nextMove.door) {
      gameRef.current.completeLevelPhase();
      play('victory');
    }
  }, documentRef);

  return {
    position: positionState,
    direction: direction,
  }
}

export default useHeroMoviment;
