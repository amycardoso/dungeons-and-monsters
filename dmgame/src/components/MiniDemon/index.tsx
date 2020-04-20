import React from 'react';
import { TILE_SIZE, HEAD_OFFSET, EDirection } from '../../settings/constants';

import './index.css';
import useEnemymovement from '../../hooks/useEnemyMovement';

const MiniDemon = () => {
  const movement = useEnemymovement({ x: 10, y: 5 });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: TILE_SIZE * movement.position.y,
        left: TILE_SIZE * movement.position.x,
        width: TILE_SIZE,
        height: TILE_SIZE + HEAD_OFFSET,
        backgroundImage: "url(./assets/MINI-DEMON.png)",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `0px -${TILE_SIZE - HEAD_OFFSET}px`,
        animation: 'mini-demon-animation 1s steps(4) infinite',
        transform: `scaleX(${movement.direction === EDirection.RIGHT ? 1 : -1})`,
      }}
    />
  )
}

export default MiniDemon;