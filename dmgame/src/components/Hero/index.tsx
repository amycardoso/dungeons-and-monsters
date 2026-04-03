import React from 'react';

import { TILE_SIZE, HEAD_OFFSET, EDirection } from '../../settings/constants';
import { GameContext } from '../../contexts/game';

import './index.css';
import useHeroMoviment from '../../hooks/useHeroMoviment';

// const moviment = {
//   position: { x: 5, y: 5 },
//   direction: EDirection.RIGHT,
// };

interface IProps {
  initialPosition: { x: number; y: number }
}

const Hero = (props: IProps) => {
  const { position, direction } = useHeroMoviment(props.initialPosition);
  const gameContext = React.useContext(GameContext);

  const glowEffects: string[] = [];
  if (gameContext.hasShield) {
    glowEffects.push('0 0 12px 4px rgba(68, 136, 255, 0.7)');
  }
  if (gameContext.hasSpeedBoost) {
    glowEffects.push('0 0 12px 4px rgba(255, 204, 0, 0.7)');
  }

  const classNames = ['hero'];
  if (gameContext.isInvincible) {
    classNames.push('hero--invincible');
  }

  return (
    <div
      className={classNames.join(' ')}
      style={{
        position: 'absolute',
        top: TILE_SIZE * position.y - HEAD_OFFSET,
        left: TILE_SIZE * position.x,
        width: TILE_SIZE,
        height: TILE_SIZE + HEAD_OFFSET,
        backgroundImage: "url(./assets/HERO.png)",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `0px -${TILE_SIZE - HEAD_OFFSET}px`,
        animation: 'hero-animation 1s steps(4) infinite',
        transform: `scaleX(${direction === EDirection.RIGHT ? 1 : -1})`,
        zIndex: 1,
        boxShadow: glowEffects.length > 0 ? glowEffects.join(', ') : undefined,
      }}
    />
  )
}

export default Hero;