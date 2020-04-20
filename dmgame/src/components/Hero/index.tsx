import React, { useState } from "react";
import { TILE_SIZE, HEAD_OFFSET, EDirection } from "../../settings/constants";

import './index.css';
import useHeroMovement from "../../hooks/useHeroMovement";

const initialPosition = {
    x: 1,
    y: 2
};

const Hero = () => {
    const {position, direction} = useHeroMovement(initialPosition);
    
    return (
        <div
            style={{
                position: 'absolute',
                bottom: TILE_SIZE * position.y,
                left: TILE_SIZE * position.x,
                width: TILE_SIZE,
                height: TILE_SIZE + HEAD_OFFSET,
                backgroundImage: "url(./assets/HERO.png)",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: `0 -${TILE_SIZE - HEAD_OFFSET}px`,
                animation: 'hero-animation 1s steps(4) infinite',
                transform: `scaleX(${direction === EDirection.RIGHT ? 1 : -1})`,
                zIndex: 1
            }}
        />
    );
}

export default Hero;