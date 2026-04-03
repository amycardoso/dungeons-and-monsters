import { useEventListener } from 'usehooks-ts';
import React, { useRef } from 'react';
import { EDirection, EWalker } from '../../settings/constants';
import { CanvasContext } from '../../contexts/canvas';
import { ChestsContext } from '../../contexts/chests';

function useHeroMoviment(initialPosition) {
  const canvasContext = React.useContext(CanvasContext);
  const chestsContext = React.useContext(ChestsContext);

  const [positionState, updatePositionState] = React.useState(initialPosition);
  const [direction, updateDirectionState] = React.useState(EDirection.RIGHT);

  const documentRef = useRef<Document>(document);

  useEventListener('keydown', (event: KeyboardEvent) => {
    const direction = event.key as EDirection;

    if (direction.indexOf('Arrow') === -1) {
      return;
    }

    const moviment = canvasContext.updateCanvas(direction, positionState, EWalker.HERO);

    if (moviment.nextMove.valid) {
      updatePositionState(moviment.nextPosition);
      updateDirectionState(direction);
    }

    if (moviment.nextMove.dead) {
      alert('Você morreu');
      window.location.reload();
    }

    if (moviment.nextMove.chest) {
      chestsContext.updateOpenedChests(moviment.nextPosition);
    }

    if (chestsContext.totalChests === chestsContext.openedChests.total && moviment.nextMove.door) {
      alert('Você venceu');
      window.location.reload();
    }
  }, documentRef);

  return {
    position: positionState,
    direction: direction,
  }
}

export default useHeroMoviment;
