import React from 'react';
import { GameProvider } from '../contexts/game';
import CanvasProvider from '../contexts/canvas';
import Debugger from './Debugger';
import Board from './Board';
import ChestsProvider from '../contexts/chests';

function Game() {
  return (
    <GameProvider>
      <CanvasProvider>
        <ChestsProvider>
          {/* <Debugger /> */}
          <Board />
        </ChestsProvider>
      </CanvasProvider>
    </GameProvider>
  );
}

export default Game;