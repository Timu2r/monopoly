
import React from 'react';
import { MoneyUtils } from '../utils/MoneyUtils';

const PlayerCard = ({ player }) => {
  const balanceStyle = {
    color: player.balance >= 0 ? 'var(--success-color)' : 'var(--danger-color)',
    fontWeight: 'bold',
    fontSize: '1.1rem'
  };

  const cardStyle = {
    padding: '1rem',
    borderRadius: 'var(--border-radius)',
    border: '1px solid var(--border-color)',
    transition: 'all 0.2s ease',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: player.isEliminated ? '#fee2e2' : 'var(--card-background)',
    opacity: player.isEliminated ? 0.7 : 1,
  };

  return (
    <div style={cardStyle}>
      <div style={{ fontWeight: 600 }}>
        {player.name} {player.isEliminated && '❌'}
      </div>
      <div style={balanceStyle}>
        {MoneyUtils.format(player.balance)} монет
      </div>
    </div>
  );
};

export default PlayerCard;