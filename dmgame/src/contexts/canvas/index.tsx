import React from "react";
import { handleNextPosition, checkValidMoviment, ECanvas } from "./helpers";

interface IProps {
  children: React.ReactNode;
  initialCanvas: number[][];
}

export const CanvasContext = React.createContext({
  canvas: [] as number[][],
  updateCanvas: (direction: any, currentPosition: any, walker: any) => null as any,
  teleportHero: (from: { x: number; y: number }, to: { x: number; y: number }) => {},
});

function CanvasProvider(props: IProps) {
  const canvasRef = React.useRef(props.initialCanvas);

  const [canvasState, updateCanvasState] = React.useState({
    canvas: props.initialCanvas,
    updateCanvas: (direction: any, currentPosition: any, walker: any) => {
      const nextPosition = handleNextPosition(direction, currentPosition);
      const nextMove = checkValidMoviment(canvasRef.current, nextPosition, walker);

      if (nextMove.valid) {
        updateCanvasState((prevState) => {
          const newCanvas = Object.assign([], prevState.canvas);
          const currentValue = newCanvas[currentPosition.y][currentPosition.x];

          newCanvas[currentPosition.y][currentPosition.x] = ECanvas.FLOOR;
          newCanvas[nextPosition.y][nextPosition.x] = currentValue;

          canvasRef.current = newCanvas;

          return {
            canvas: newCanvas,
            updateCanvas: prevState.updateCanvas,
            teleportHero: prevState.teleportHero,
          }
        });
      }

      return {
        nextPosition,
        nextMove
      }
    },
    teleportHero: (from: { x: number; y: number }, to: { x: number; y: number }) => {
      updateCanvasState((prevState) => {
        const newCanvas = Object.assign([], prevState.canvas);

        newCanvas[from.y][from.x] = ECanvas.FLOOR;
        newCanvas[to.y][to.x] = ECanvas.HERO;

        canvasRef.current = newCanvas;

        return {
          canvas: newCanvas,
          updateCanvas: prevState.updateCanvas,
          teleportHero: prevState.teleportHero,
        }
      });
    },
  });

  return (
    <CanvasContext.Provider value={canvasState}>
      {props.children}
    </CanvasContext.Provider>
  )
}

export default CanvasProvider;
