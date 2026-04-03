import { useEventListener } from 'usehooks-ts';
import React, { useRef } from 'react';
import { EDirection, EGamePhase, EWalker } from '../../settings/constants';
import { CanvasContext } from '../../contexts/canvas';
import { ChestsContext } from '../../contexts/chests';
import { GameContext } from '../../contexts/game';

function useHeroMoviment(initialPosition) {
  const canvasContext = React.useContext(CanvasContext);
  const chestsContext = React.useContext(ChestsContext);
  const gameContext = React.useContext(GameContext);

  const [positionState, updatePositionState] = React.useState(initialPosition);
  const [direction, updateDirectionState] = React.useState(EDirection.RIGHT);

  const documentRef = useRef<Document>(document);

  useEventListener('keydown', (event: KeyboardEvent) => {
    if (gameContext.phase !== EGamePhase.PLAYING) {
      return;
    }

    const direction = event.key as EDirection;

    if (direction.indexOf('Arrow') === -1) {
      return;
    }

    const moviment = canvasContext.updateCanvas(direction, positionState, EWalker.HERO);

    if (moviment.nextMove.valid) {
      updatePositionState(moviment.nextPosition);
      updateDirectionState(direction);
    }

    if (moviment.nextMove.damage && !gameContext.isInvincible) {
      gameContext.takeDamage();
      // Traps are single-use: when the hero walks onto a trap, updateCanvas
      // replaces the trap tile with the hero. When the hero moves away, the
      // tile is set to FLOOR, effectively removing the trap from the map.
    }

    if (moviment.nextMove.chest) {
      chestsContext.updateOpenedChests(moviment.nextPosition);
      gameContext.addScore(100);
    }

    if (chestsContext.totalChests === chestsContext.openedChests.total && moviment.nextMove.door) {
      gameContext.completeLevelPhase();
    }
  }, documentRef);

  return {
    position: positionState,
    direction: direction,
  }
}

export default useHeroMoviment;
