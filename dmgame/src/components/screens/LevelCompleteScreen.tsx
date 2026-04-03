import React from 'react';
import { useEventListener } from 'usehooks-ts';
import { GameContext } from '../../contexts/game';
import './screens.css';

const LevelCompleteScreen = () => {
  const { score, nextLevel } = React.useContext(GameContext);
  const documentRef = React.useRef<Document>(document);

  useEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      nextLevel();
    }
  }, documentRef);

  return (
    <div className="screen-overlay screen-overlay--level-complete">
      <div className="screen-title">Level Complete!</div>
      <div className="screen-score">Score: {score}</div>
      <div className="screen-prompt">Press Enter for Next Level</div>
    </div>
  );
};

export default LevelCompleteScreen;
