import React from 'react';
import { GameContext } from '../contexts/game';
import CanvasProvider from '../contexts/canvas';
import Board from './Board';
import ChestsProvider from '../contexts/chests';

function Game() {
  const { levelConfig } = React.useContext(GameContext);

  return (
    <CanvasProvider initialCanvas={levelConfig.map}>
      <ChestsProvider totalChests={levelConfig.totalChests}>
        {/* <Debugger /> */}
        <Board />
      </ChestsProvider>
    </CanvasProvider>
  );
}

export default Game;
