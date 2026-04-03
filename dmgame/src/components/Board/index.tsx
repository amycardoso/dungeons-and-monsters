import React from 'react';
import Hero from '../Hero';
import { TILE_SIZE, GAME_SIZE } from '../../settings/constants';
import MiniDemon from '../MiniDemon';
import Demon from '../Demon';
import Chest from '../Chest';
import Trap from '../Trap';
import { ECanvas } from '../../contexts/canvas/helpers';
import { CanvasContext } from '../../contexts/canvas';
import { ChestsContext } from '../../contexts/chests';

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
        const text = currentCanvas[y][x] || canvasYX;
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

        if (text === ECanvas.HERO) {
          array.push(<Hero key={key} initialPosition={position} />)
        }
      }
    }

    return array;
  }

  function getDoorPosition() {
    const currentCanvas = canvasContext.canvas;
    for (let y = 0; y < currentCanvas.length; y++) {
      for (let x = 0; x < currentCanvas[y].length; x++) {
        if (currentCanvas[y][x] === ECanvas.DOOR) {
          return { left: x * TILE_SIZE, top: y * TILE_SIZE };
        }
      }
    }
    return { left: 578, top: 0 }; // fallback to original position
  }

  function renderOpenedDoor() {
    const doorPos = getDoorPosition();
    return (
      <img src="./assets/DOOR-OPEN.png" alt="" style={{
        position: "absolute",
        left: doorPos.left,
        top: doorPos.top,
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

      <img src="./assets/tileset.gif" alt="" width={GAME_SIZE} height={GAME_SIZE} />
    </div>
  );
}

export default Board;