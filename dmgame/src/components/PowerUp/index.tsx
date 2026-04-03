import { TILE_SIZE } from '../../settings/constants';
import './index.css';

interface IProps {
  initialPosition: { x: number; y: number };
}

const POWER_UP_TYPES = ['heart', 'shield', 'speed'];
const POWER_UP_COLORS: Record<string, string> = {
  heart: '#ff4444',
  shield: '#4488ff',
  speed: '#ffcc00',
};
const POWER_UP_SYMBOLS: Record<string, string> = {
  heart: '\u2665',
  shield: '\uD83D\uDEE1',
  speed: '\u26A1',
};

const PowerUp = (props: IProps) => {
  const { x, y } = props.initialPosition;
  const type = POWER_UP_TYPES[(x * 7 + y * 13) % 3];

  return (
    <div
      className="power-up"
      data-type={type}
      style={{
        position: 'absolute',
        top: TILE_SIZE * y,
        left: TILE_SIZE * x,
        width: TILE_SIZE,
        height: TILE_SIZE,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: TILE_SIZE * 0.6,
        color: POWER_UP_COLORS[type],
        zIndex: 1,
      }}
    >
      {POWER_UP_SYMBOLS[type]}
    </div>
  );
};

export default PowerUp;
