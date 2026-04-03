import React from 'react';
import { GameContext } from '../contexts/game';
import CanvasProvider from '../contexts/canvas';
import Board from './Board';
import ChestsProvider from '../contexts/chests';

function Game() {
  const { levelConfig, currentLevel, phase } = React.useContext(GameContext);

  return (
    <CanvasProvider key={`canvas-${currentLevel}-${phase}`} initialCanvas={levelConfig.map}>
      <ChestsProvider key={`chests-${currentLevel}-${phase}`} totalChests={levelConfig.totalChests}>
        {/* <Debugger /> */}
        <Board />
      </ChestsProvider>
    </CanvasProvider>
  );
}

export default Game;
