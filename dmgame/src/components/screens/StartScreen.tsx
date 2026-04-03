import React from 'react';
import { useEventListener } from 'usehooks-ts';
import { GameContext } from '../../contexts/game';
import './screens.css';

const StartScreen = () => {
  const { startGame } = React.useContext(GameContext);
  const documentRef = React.useRef<Document>(document);

  useEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      startGame();
    }
  }, documentRef);

  return (
    <div className="screen-overlay">
      <div className="screen-title">Dungeons &amp; Monsters</div>
      <div className="screen-subtitle">Collect all chests and reach the exit!</div>
      <div className="screen-prompt">Press Enter to Start</div>
    </div>
  );
};

export default StartScreen;
