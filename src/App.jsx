import React, { useState, useEffect, useReducer } from 'react';
import { gameReducer } from './reducers/gameReducer';
import { CONSTANTS } from './utils/constants';
import AddPlayerForm from './components/AddPlayerForm';
import FieldTransactionForm from './components/FieldTransactionForm';
import PlayerCard from './components/PlayerCard';
import RestoreGameDialog from './components/RestoreGameDialog';
import TransactionItem from './components/TransactionItem';
import TransferForm from './components/TransferForm';
import './App.css'

const MonopolyApp = () => {
  const [gameState, dispatch] = useReducer(gameReducer, { players: [], transactions: [] });
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [savedGameState, setSavedGameState] = useState(null);

  // Инициализация и проверка сохраненной игры
  useEffect(() => {
    const savedState = localStorage.getItem(CONSTANTS.STORAGE_KEYS.GAME_STATE);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        if (parsedState.players?.length > 0 || parsedState.transactions?.length > 0) {
          setSavedGameState(parsedState);
          setShowRestoreDialog(true);
        }
      } catch (error) {
        console.error('Ошибка при загрузке сохраненной игры:', error);
      }
    }
  }, []);

  // Автосохранение при изменении состояния
  useEffect(() => {
    if (gameState.players.length > 0 || gameState.transactions.length > 0) {
      localStorage.setItem(CONSTANTS.STORAGE_KEYS.GAME_STATE, JSON.stringify(gameState));
    }
  }, [gameState]);

  // Обработчики действий
  const handleAddPlayer = (name) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new Error('Имя игрока не может быть пустым');
    }

    if (gameState.players.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
      throw new Error('Игрок с таким именем уже существует');
    }

    dispatch({ type: 'ADD_PLAYER', payload: { name: trimmedName } });
  };

  const handleFieldTransaction = (playerId, amount, isGain) => {
    dispatch({ type: 'FIELD_TRANSACTION', payload: { playerId, amount, isGain } });
  };

  const handleTransfer = (fromPlayerId, toPlayerId, amount) => {
    dispatch({ type: 'TRANSFER_MONEY', payload: { fromPlayerId, toPlayerId, amount } });
  };

  const handleRestoreGame = () => {
    if (savedGameState) {
      dispatch({ type: 'RESTORE_GAME', payload: savedGameState });
    }
    setShowRestoreDialog(false);
  };

  const handleNewGame = () => {
    localStorage.removeItem(CONSTANTS.STORAGE_KEYS.GAME_STATE);
    dispatch({ type: 'RESET_GAME' });
    setShowRestoreDialog(false);
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <h1 className="app-header">
          🎲 Монополия - Финансовые транзакции
        </h1>

        <div className="form-grid">
          <AddPlayerForm onAddPlayer={handleAddPlayer} />

          <div className="card">
            <h2 className="card-title">
              <span className="icon">👥</span> Игроки
            </h2>
            <div className="players-list">
              {gameState.players.length > 0 ? (
                gameState.players.map(player => (
                  <PlayerCard key={player.id} player={player} />
                ))
              ) : (
                <div className="empty-state">
                  Нет игроков
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-grid" style={{ marginTop: '1.5rem' }}>
          <FieldTransactionForm
            players={gameState.players}
            onFieldTransaction={handleFieldTransaction}
          />
          <TransferForm
            players={gameState.players}
            onTransfer={handleTransfer}
          />
        </div>

        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h2 className="card-title">
            <span className="icon">📊</span> История транзакций
          </h2>
          <div className="transactions-list">
            {gameState.transactions.length > 0 ? (
              gameState.transactions.map(transaction => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))
            ) : (
              <div className="empty-state">
                История транзакций пуста
              </div>
            )}
          </div>
        </div>
      </div>

      {showRestoreDialog && (
        <RestoreGameDialog
          onRestore={handleRestoreGame}
          onNewGame={handleNewGame}
        />
      )}
    </div>
  );
};

export default MonopolyApp;