import React from 'react';
import './index.css';

const TouchControls = () => {
  const dispatch = (key: string) => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key }));
  };

  return (
    <div className="touch-controls">
      <div className="touch-row">
        <button
          className="touch-btn touch-up"
          onTouchStart={(e) => { e.preventDefault(); dispatch('ArrowUp'); }}
        >
          ▲
        </button>
      </div>
      <div className="touch-row">
        <button
          className="touch-btn touch-left"
          onTouchStart={(e) => { e.preventDefault(); dispatch('ArrowLeft'); }}
        >
          ◄
        </button>
        <div className="touch-spacer" />
        <button
          className="touch-btn touch-right"
          onTouchStart={(e) => { e.preventDefault(); dispatch('ArrowRight'); }}
        >
          ►
        </button>
      </div>
      <div className="touch-row">
        <button
          className="touch-btn touch-down"
          onTouchStart={(e) => { e.preventDefault(); dispatch('ArrowDown'); }}
        >
          ▼
        </button>
      </div>
    </div>
  );
};

export default TouchControls;
