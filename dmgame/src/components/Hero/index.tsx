import React, { useState } from "react";
import useEventListener from '@use-it/event-listener';
import { TILE_SIZE, HEAD_OFFSET } from "../../settings/constants";

import './index.css';

const initialPosition = {
    x: 1,
    y: 2
};

const Hero = () => {
    const [positionState, updatePositionState] = React.useState(initialPosition);
    const [direction, updateDirectionState] = React.useState('RIGHT');

    useEventListener("keydown", (event: React.KeyboardEvent<HTMLDivElement>) => {
        switch(event.key) {
            case 'ArrowLeft':
                updatePositionState({ x: positionState.x - 1, y: positionState.y });
                updateDirectionState('LEFT');
                break;
            case 'ArrowRight':
                updatePositionState({ x: positionState.x + 1, y: positionState.y });
                updateDirectionState('RIGHT');
                break;
            case 'ArrowDown':
                updatePositionState({ x: positionState.x, y: positionState.y - 1 });
                break;
            case 'ArrowUp':
                updatePositionState({ x: positionState.x, y: positionState.y + 1 });
                break;
        }
    });

    return (
        <div
            style={{
                position: 'absolute',
                bottom: TILE_SIZE * positionState.y,
                left: TILE_SIZE * positionState.x,
                width: TILE_SIZE,
                height: TILE_SIZE + HEAD_OFFSET,
                backgroundImage: "url(./assets/HERO.png)",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: `0 -${TILE_SIZE - HEAD_OFFSET}px`,
                animation: 'hero-animation 1s steps(4) infinite',
                transform: `scaleX(${direction === 'RIGHT' ? 1 : -1})`
            }}
        />
    );
}

export default Hero;