
import React from 'react';
import { TRANSACTION_TYPES } from '../utils/transactionTypes';

const TransactionItem = ({ transaction }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case TRANSACTION_TYPES.PLAYER_ADDED: return '#a855f7'; 
      case TRANSACTION_TYPES.FIELD_GAIN: return 'var(--success-color)';
      case TRANSACTION_TYPES.FIELD_LOSS: return 'var(--danger-color)';
      case TRANSACTION_TYPES.PLAYER_TRANSFER: return 'var(--primary-color)';
      case TRANSACTION_TYPES.PLAYER_ELIMINATED: return 'var(--warning-color)';
      default: return 'var(--muted-text)';
    }
  };

  const itemStyle = {
    padding: '0.75rem 1rem',
    backgroundColor: '#f9fafb', 
    borderRadius: '0.5rem',
    borderLeft: `4px solid ${getTypeColor(transaction.type)}`,
    marginBottom: '0.5rem',
  };

  return (
    <div style={itemStyle}>
      <div style={{ fontSize: '0.75rem', color: 'var(--muted-text)', marginBottom: '0.25rem' }}>
        {new Date(transaction.timestamp).toLocaleString('ru-RU')}
      </div>
      <div style={{ fontSize: '0.875rem', color: 'var(--text-color)' }}>
        {transaction.description}
      </div>
    </div>
  );
};

export default TransactionItem;