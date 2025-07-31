// src/components/FieldTransactionForm.jsx
import React, { useState } from 'react';
import { MoneyUtils } from '../utils/MoneyUtils';

const FieldTransactionForm = ({ players, onFieldTransaction }) => {
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [amount, setAmount] = useState('');

  const activePlayers = players.filter(p => !p.isEliminated);

  const handleTransaction = (isGain) => {
    const playerId = parseInt(selectedPlayer);
    const amountNum = parseInt(amount) || 0;

    if (!playerId) {
      alert('Выберите игрока!');
      return;
    }

    if (amountNum <= 0) {
      alert('Введите корректную сумму!');
      return;
    }

    try {
      onFieldTransaction(playerId, amountNum, isGain);
      setAmount('');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">
        <span className="icon">🎯</span> Взаимодействие с полем
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label className="form-label">Игрок:</label>
          <select
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className="select-field"
          >
            <option value="">Выберите игрока</option>
            {activePlayers.map(player => (
              <option key={player.id} value={player.id}>
                {player.name} ({MoneyUtils.format(player.balance)})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Сумма:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Введите сумму"
            min="0"
            className="input-field"
          />
        </div>

        <div className="btn-group">
          <button
            onClick={() => handleTransaction(true)}
            className="btn btn-success"
          >
            💰 Получить
          </button>
          <button
            onClick={() => handleTransaction(false)}
            className="btn btn-danger"
          >
            💸 Потерять
          </button>
        </div>
      </div>
    </div>
  );
};

export default FieldTransactionForm;