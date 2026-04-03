import React from 'react';
import { GameProvider, GameContext } from '../contexts/game';
import CanvasProvider from '../contexts/canvas';
import Board from './Board';
import ChestsProvider from '../contexts/chests';

function GameInner() {
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

function Game() {
  return (
    <GameProvider>
      <GameInner />
    </GameProvider>
  );
}

export default Game;