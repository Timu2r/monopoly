
import React, { useState } from 'react';

const AddPlayerForm = ({ onAddPlayer }) => {
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (playerName.trim()) {
      try {
        onAddPlayer(playerName.trim());
        setPlayerName('');
        setError('');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">
        <span className="icon">➕</span> Добавить игрока
      </h2>
      <div>
        <label className="form-label">
          Имя игрока:
        </label>
        <input
          type="text"
          value={playerName}
          onChange={(e) => {
            setPlayerName(e.target.value);
            if (error) setError('');
          }}
          onKeyPress={handleKeyPress}
          placeholder="Введите имя игрока"
          className="input-field"
          style={{ borderColor: error ? 'var(--danger-color)' : '' }}
        />
        {error && <p style={{ color: 'var(--danger-color)', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</p>}
      </div>
      <button
        onClick={handleSubmit}
        className="btn btn-primary"
        style={{ marginTop: '1rem' }}
      >
        Добавить игрока
      </button>
    </div>
  );
};

export default AddPlayerForm;