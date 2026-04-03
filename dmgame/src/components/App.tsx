import React from 'react';
import './App.css';
import { GAME_SIZE } from '../settings/constants';
import Game from './Game';
import HUD from './HUD';
import { GameProvider } from '../contexts/game';

function App() {
  return (
    <div className="App">
      <GameProvider>
        <HUD />
        <div style={{ position: 'relative', width: GAME_SIZE, height: GAME_SIZE }}>
          <Game />
        </div>
      </GameProvider>
    </div>
  );
}

export default App;
