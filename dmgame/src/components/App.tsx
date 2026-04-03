import React from 'react';
import './App.css';
import { GAME_SIZE, EGamePhase } from '../settings/constants';
import Game from './Game';
import HUD from './HUD';
import { GameProvider, GameContext } from '../contexts/game';
import StartScreen from './screens/StartScreen';
import GameOverScreen from './screens/GameOverScreen';
import LevelCompleteScreen from './screens/LevelCompleteScreen';
import VictoryScreen from './screens/VictoryScreen';
import TouchControls from './TouchControls';

function AppContent() {
  const { phase } = React.useContext(GameContext);

  return (
    <>
      <HUD />
      <div className="game-board">
        <Game />
        {phase === EGamePhase.START && <StartScreen />}
        {phase === EGamePhase.GAME_OVER && <GameOverScreen />}
        {phase === EGamePhase.LEVEL_COMPLETE && <LevelCompleteScreen />}
        {phase === EGamePhase.VICTORY && <VictoryScreen />}
      </div>
      <TouchControls />
    </>
  );
}

function App() {
  return (
    <div className="App">
      <GameProvider>
        <div className="game-container">
          <AppContent />
        </div>
      </GameProvider>
    </div>
  );
}

export default App;
