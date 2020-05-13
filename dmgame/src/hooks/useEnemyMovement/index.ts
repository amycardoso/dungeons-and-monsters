import useInterval from '@use-it/interval';
import React from 'react';
import { EDirection } from '../../settings/constants';
import { handleNextPosition, checkValidMovement } from '../../contexts/canvas/helpers';

function useEnemyMovement(initialPosition: any) {
  const [positionState, updatePositionState] = React.useState(initialPosition);
  const [direction, updateDirectionState] = React.useState(EDirection.RIGHT);

  useInterval(function move() {
    var random = Math.floor(Math.random() * 4);
    var directionArray = Object.values(EDirection);
    const randomDirection = directionArray[random];

    const nextPosition = handleNextPosition(randomDirection, positionState);
    const isValidMovement = checkValidMovement(nextPosition);

    if (isValidMovement) {
      updateDirectionState(randomDirection);
      updatePositionState(nextPosition);
    }
  }, 2000);

  return {
    position: positionState,
    direction: direction,
  }
}

export default useEnemyMovement;