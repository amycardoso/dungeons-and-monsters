import React from 'react';
import Hero from '../Hero';
import { TILE_SIZE, GAME_SIZE } from '../../settings/constants';
import MiniDemon from '../MiniDemon';
import Demon from '../Demon';
import Chest from '../Chest';
import Trap from '../Trap';
import PowerUp from '../PowerUp';
import { ECanvas } from '../../contexts/canvas/helpers';
import { CanvasContext } from '../../contexts/canvas';
import { ChestsContext } from '../../contexts/chests';

import './index.css';

const Board = () => {
  const canvasContext = React.useContext(CanvasContext);
  const chestsContext = React.useContext(ChestsContext);

  // Memoize initial entity list so moving entities keep stable keys
  const initialEntities = React.useMemo(() => {
    const entities: React.ReactNode[] = [];
    const canvas = canvasContext.canvas;
    let demonCount = 0;
    let miniDemonCount = 0;

    for (let y = 0; y < canvas.length; y++) {
      for (let x = 0; x < canvas[y].length; x++) {
        const val = canvas[y][x];
        const position = { x, y };
        const posKey = `${x}-${y}`;

        if (val === ECanvas.TRAP) {
          entities.push(<Trap key={`trap-${posKey}`} initialPosition={position} />);
        }
        if (val === ECanvas.MINI_DEMON) {
          entities.push(<MiniDemon key={`mini-demon-${miniDemonCount++}`} initialPosition={position} />);
        }
        if (val === ECanvas.DEMON) {
          entities.push(<Demon key={`demon-${demonCount++}`} initialPosition={position} />);
        }
        if (val === ECanvas.CHEST) {
          entities.push(<Chest key={`chest-${posKey}`} initialPosition={position} />);
        }
        if (val === ECanvas.POWER_UP) {
          entities.push(<PowerUp key={`powerup-${posKey}`} initialPosition={position} />);
        }
        if (val === ECanvas.HERO) {
          entities.push(<Hero key="hero" initialPosition={position} />);
        }
      }
    }
    return entities;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function renderOpenedDoor() {
    // Find all door tiles to compute center position
    const currentCanvas = canvasContext.canvas;
    let minX = Infinity, minY = Infinity;
    for (let y = 0; y < currentCanvas.length; y++) {
      for (let x = 0; x < currentCanvas[y].length; x++) {
        if (currentCanvas[y][x] === ECanvas.DOOR) {
          if (x < minX) minX = x;
          if (y < minY) minY = y;
        }
      }
    }
    // Center the 192x96 image over the door tiles
    // The image is 4 tiles wide, door is 2 tiles wide, so offset by 1 tile left
    const left = minX === Infinity ? 578 : (minX * TILE_SIZE) - TILE_SIZE;
    const top = minY === Infinity ? 0 : (minY * TILE_SIZE);

    return (
      <img src="/assets/DOOR-OPEN.png" alt="" style={{
        position: "absolute",
        left,
        top,
        zIndex: 2,
        animation: 'door-pulse 1s ease-in-out infinite',
      }} />
    )
  }

  return (
    <div>
      {initialEntities}

      {chestsContext.totalChests === chestsContext.openedChests.total && (
        renderOpenedDoor()
      )}

      <img src="/assets/tileset.gif" alt="" width={GAME_SIZE} height={GAME_SIZE} />
    </div>
  );
}

export default Board;