import React, { useEffect } from 'react';
import { useEventListener } from 'usehooks-ts';
import { GameContext } from '../../contexts/game';
import { useSound } from '../../hooks/useSound';
import './screens.css';

const GameOverScreen = () => {
  const { score, restartGame } = React.useContext(GameContext);
  const { play } = useSound();
  const documentRef = React.useRef<Document>(document);

  useEffect(() => {
    play('gameover');
  }, [play]);

  useEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      restartGame();
    }
  }, documentRef);

  return (
    <div className="screen-overlay screen-overlay--game-over">
      <div className="screen-title">You Died!</div>
      <div className="screen-score">Score: {score}</div>
      <div className="screen-prompt">Press Enter to Restart</div>
    </div>
  );
};

export default GameOverScreen;
