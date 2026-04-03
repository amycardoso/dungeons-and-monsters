import React from 'react';
import { useEventListener } from 'usehooks-ts';
import { GameContext } from '../../contexts/game';
import './screens.css';

const VictoryScreen = () => {
  const { score, restartGame } = React.useContext(GameContext);
  const documentRef = React.useRef<Document>(document);

  useEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      restartGame();
    }
  }, documentRef);

  return (
    <div className="screen-overlay screen-overlay--victory">
      <div className="screen-title">You Won!</div>
      <div className="screen-subtitle">All dungeons conquered!</div>
      <div className="screen-score">Final Score: {score}</div>
      <div className="screen-prompt">Press Enter to Play Again</div>
    </div>
  );
};

export default VictoryScreen;
