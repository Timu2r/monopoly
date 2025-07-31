
import React from 'react';

const RestoreGameDialog = ({ onRestore, onNewGame }) => {
  const backdropStyle = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const dialogStyle = {
    backgroundColor: 'var(--card-background)',
    padding: '2rem',
    borderRadius: 'var(--border-radius)',
    boxShadow: 'var(--shadow-lg)',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center'
  };

  return (
    <div style={backdropStyle}>
      <div style={dialogStyle}>
        <h3 className="card-title" style={{ justifyContent: 'center', fontSize: '1.5rem' }}>
          <span className="icon">🎮</span> Восстановление игры
        </h3>
        <p style={{ color: 'var(--muted-text)', margin: '1rem 0 1.5rem' }}>
          Найдена сохраненная игра. Хотите продолжить с того места, где остановились?
        </p>
        <div className="btn-group">
          <button onClick={onRestore} className="btn btn-primary">
            Продолжить
          </button>
          <button onClick={onNewGame} className="btn btn-danger">
            Новая игра
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestoreGameDialog;