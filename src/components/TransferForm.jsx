
import React, { useState } from 'react';
import { MoneyUtils } from '../utils/MoneyUtils';

const TransferForm = ({ players, onTransfer }) => {
  const [fromPlayer, setFromPlayer] = useState('');
  const [toPlayer, setToPlayer] = useState('');
  const [amount, setAmount] = useState('');

  const activePlayers = players.filter(p => !p.isEliminated);

  const handleTransfer = () => {
    const fromPlayerId = parseInt(fromPlayer);
    const toPlayerId = parseInt(toPlayer);
    const amountNum = parseInt(amount) || 0;

    if (!fromPlayerId || !toPlayerId) {
      alert('Выберите игроков!');
      return;
    }

    if (amountNum <= 0) {
      alert('Введите корректную сумму!');
      return;
    }

    try {
      onTransfer(fromPlayerId, toPlayerId, amountNum);
      setAmount('');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">
        <span className="icon">💱</span> Переводы между игроками
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label className="form-label">От игрока:</label>
          <select
            value={fromPlayer}
            onChange={(e) => setFromPlayer(e.target.value)}
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
          <label className="form-label">К игроку:</label>
          <select
            value={toPlayer}
            onChange={(e) => setToPlayer(e.target.value)}
            className="select-field"
          >
            <option value="">Выберите игрока</option>
            {activePlayers.filter(p => p.id !== parseInt(fromPlayer)).map(player => (
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

        <button
          onClick={handleTransfer}
          className="btn btn-primary"
        >
          💸 Перевести деньги
        </button>
      </div>
    </div>
  );
};

export default TransferForm;