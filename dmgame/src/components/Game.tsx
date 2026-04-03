import React from 'react';
import { GameContext } from '../contexts/game';
import CanvasProvider from '../contexts/canvas';
import Board from './Board';
import ChestsProvider from '../contexts/chests';

function Game() {
  const { levelConfig, currentLevel, phase } = React.useContext(GameContext);

  const freshMap = React.useMemo(
    () => levelConfig.map.map(row => [...row]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentLevel, phase]
  );

  return (
    <CanvasProvider key={`canvas-${currentLevel}-${phase}`} initialCanvas={freshMap}>
      <ChestsProvider key={`chests-${currentLevel}-${phase}`} totalChests={levelConfig.totalChests}>
        {/* <Debugger /> */}
        <Board />
      </ChestsProvider>
    </CanvasProvider>
  );
}

export default Game;
