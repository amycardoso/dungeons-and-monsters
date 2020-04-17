import React from 'react';
import { TILE_SIZE, HEAD_OFFSET } from "../../settings/constants";

import './index.css';

const MiniDemon = () => {
    return (
        <div 
            style={{
                position: 'absolute',
                bottom: TILE_SIZE * 10,
                left: TILE_SIZE * 5,
                width: TILE_SIZE,
                height: TILE_SIZE + HEAD_OFFSET,
                backgroundImage:"url(./assets/MINI-DEMON.png)",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: `0 -${TILE_SIZE - HEAD_OFFSET}px`,
                animation: 'mini-demon-animation 1s steps(4) infinite'
            }}
        />
    );
}

export default MiniDemon;