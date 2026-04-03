import React from 'react';
import { GameContext } from '../../contexts/game';
import { INITIAL_HEALTH, GAME_SIZE } from '../../settings/constants';
import './index.css';

const HUD = () => {
  const gameContext = React.useContext(GameContext);

  const hearts = [];
  for (let i = 0; i < INITIAL_HEALTH; i++) {
    hearts.push(
      <span key={i} className={`hud-heart ${i < gameContext.health ? 'hud-heart--full' : 'hud-heart--empty'}`}>
        {i < gameContext.health ? '♥' : '♡'}
      </span>
    );
  }

  return (
    <div className="hud" style={{ width: GAME_SIZE }}>
      <div className="hud-section">
        <span className="hud-label">{gameContext.levelConfig.name}</span>
      </div>
      <div className="hud-section">
        {hearts}
      </div>
      <div className="hud-section">
        <span className="hud-label">Score: {gameContext.score}</span>
      </div>
      <button className="hud-mute" onClick={gameContext.toggleMute}>
        {gameContext.muted ? '🔇' : '🔊'}
      </button>
    </div>
  );
};

export default HUD;
