import React from "react";
import { handleNextPosition, checkValidMoviment, ECanvas } from "./helpers";

interface IProps {
  children: React.ReactNode;
  initialCanvas: number[][];
}

export const CanvasContext = React.createContext({
  canvas: [],
  updateCanvas: (direction, currentPosition, walker) => null
});

function CanvasProvider(props: IProps) {
  // Store a mutable reference to the canvas rows so checkValidMoviment
  // always reads current data (mirrors the original pattern where the
  // module-level canvas rows were mutated in-place via shallow copies).
  const canvasRef = React.useRef(props.initialCanvas);

  const [canvasState, updateCanvasState] = React.useState({
    canvas: props.initialCanvas,
    updateCanvas: (direction, currentPosition, walker) => {
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
          }
        });
      }


      return {
        nextPosition,
        nextMove
      }
    }
  });

  return (
    <CanvasContext.Provider value={canvasState}>
      {props.children}
    </CanvasContext.Provider>
  )
}

export default CanvasProvider;