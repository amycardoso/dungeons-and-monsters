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

  function getCanvasMap() {
    const array = [];
    const currentCanvas = canvasContext.canvas;

    for (let y = 0; y < currentCanvas.length; y++) {
      const canvasY = currentCanvas[y];

      for (let x = 0; x < canvasY.length; x++) {
        const canvasYX = canvasY[x];

        const position = { x: x, y: y };
        const text = canvasYX;
        const key = `${x}-${y}`;

        if (text === ECanvas.TRAP) {
          array.push(<Trap key={key} initialPosition={position} />)
        }

        if (text === ECanvas.MINI_DEMON) {
          array.push(<MiniDemon key={key} initialPosition={position} />)
        }

        if (text === ECanvas.DEMON) {
          array.push(<Demon key={key} initialPosition={position} />)
        }

        if (text === ECanvas.CHEST) {
          array.push(<Chest key={key} initialPosition={position} />)
        }

        if (text === ECanvas.POWER_UP) {
          array.push(<PowerUp key={key} initialPosition={position} />)
        }

        if (text === ECanvas.HERO) {
          array.push(<Hero key={key} initialPosition={position} />)
        }
      }
    }

    return array;
  }

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

  const elements = getCanvasMap();

  return (
    <div>
      {elements}

      {chestsContext.totalChests === chestsContext.openedChests.total && (
        renderOpenedDoor()
      )}

      <img src="/assets/tileset.gif" alt="" width={GAME_SIZE} height={GAME_SIZE} />
    </div>
  );
}

export default Board;