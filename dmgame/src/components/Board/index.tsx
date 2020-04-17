import React from 'react';
import Hero from '../Hero';
import { GAME_SIZE } from '../../settings/constants';
import MiniDemon from '../MiniDemon';
import Demon from '../Demon';

const Board = () => {
    return (
        <div>
            <MiniDemon />
            <Demon />
            <Hero />
            <img src="./assets/tileset.gif" alt="board" width={GAME_SIZE} height={GAME_SIZE}/>
        </div>
    );
}

export default Board;