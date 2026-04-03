import React from 'react';

import { TILE_SIZE, HEAD_OFFSET, EDirection } from '../../settings/constants';
import { GameContext } from '../../contexts/game';

import './index.css';
import useHeroMoviment from '../../hooks/useHeroMoviment';

interface IProps {
  initialPosition: { x: number; y: number }
}

const Hero = (props: IProps) => {
  const { position, direction } = useHeroMoviment(props.initialPosition);
  const gameContext = React.useContext(GameContext);

  const heroClass = `hero-sprite ${gameContext.isInvincible ? 'hero--invincible' : ''} ${gameContext.hasShield ? 'hero--shield' : ''} ${gameContext.hasSpeedBoost ? 'hero--speed' : ''}`;

  return (
    <div
      className={heroClass}
      style={{
        position: 'absolute',
        top: TILE_SIZE * position.y - HEAD_OFFSET,
        left: TILE_SIZE * position.x,
        width: TILE_SIZE,
        height: TILE_SIZE + HEAD_OFFSET,
        backgroundImage: "url(./assets/HERO.png)",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `0px -${TILE_SIZE - HEAD_OFFSET}px`,
        transition: 'top 0.15s ease, left 0.15s ease',
        transform: `scaleX(${direction === EDirection.RIGHT ? 1 : -1})`,
        zIndex: 1,
      }}
    />
  )
}

export default Hero;