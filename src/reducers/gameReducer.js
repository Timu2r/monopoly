// src/reducers/gameReducer.js
import { CONSTANTS } from '../utils/constants';
import { TRANSACTION_TYPES } from '../utils/transactionTypes';
import { MoneyUtils } from '../utils/MoneyUtils';

export const gameReducer = (state, action) => {
  // Очищаем предыдущую ошибку при каждом новом действии,
  // если только ошибка не связана с этим действием
  const newStateWithoutError = { ...state, error: null };

  switch (action.type) {
    case 'ADD_PLAYER': {
      const { name } = action.payload;
      const trimmedName = name.trim();

      if (!trimmedName) {
        return {
          ...newStateWithoutError,
          error: 'Имя игрока не может быть пустым.'
        };
      }

      if (state.players.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
        return {
          ...newStateWithoutError,
          error: `Игрок с именем "${trimmedName}" уже существует.`
        };
      }

      const newPlayer = {
        id: Date.now(),
        name: trimmedName,
        balance: CONSTANTS.STARTING_BALANCE,
        isEliminated: false,
        createdAt: new Date().toISOString()
      };

      const transaction = {
        id: Date.now() + 1,
        type: TRANSACTION_TYPES.PLAYER_ADDED,
        timestamp: new Date().toISOString(),
        description: `Игрок "${trimmedName}" добавлен в игру`,
        playerName: trimmedName,
        amount: CONSTANTS.STARTING_BALANCE
      };

      return {
        ...newStateWithoutError,
        players: [...state.players, newPlayer],
        transactions: [transaction, ...state.transactions]
      };
    }

    case 'FIELD_TRANSACTION': {
      const { playerId, amount, isGain } = action.payload;
      const player = state.players.find(p => p.id === playerId);

      if (!player) {
        return {
          ...newStateWithoutError,
          error: 'Игрок не найден.'
        };
      }

      if (player.isEliminated) {
        return {
          ...newStateWithoutError,
          error: `Игрок "${player.name}" исключен из игры и не может совершать транзакции.`
        };
      }

      const transactionAmount = isGain ? amount : -amount;
      const newBalance = player.balance + transactionAmount;

      const updatedPlayer = { ...player, balance: newBalance };
      const updatedPlayers = state.players.map(p =>
        p.id === playerId ? updatedPlayer : p
      );

      const transaction = {
        id: Date.now(),
        type: isGain ? TRANSACTION_TYPES.FIELD_GAIN : TRANSACTION_TYPES.FIELD_LOSS,
        timestamp: new Date().toISOString(),
        description: `"${player.name}" ${isGain ? 'получил' : 'потерял'} ${MoneyUtils.format(amount)}`,
        playerName: player.name,
        amount: transactionAmount,
        newBalance
      };

      let newTransactions = [transaction, ...state.transactions];

      // Проверка на исключение
      if (newBalance < CONSTANTS.MIN_BALANCE && !player.isEliminated) {
        updatedPlayer.isEliminated = true; // Обновляем статус игрока для исключения
        const eliminationTransaction = {
          id: Date.now() + 1,
          type: TRANSACTION_TYPES.PLAYER_ELIMINATED,
          timestamp: new Date().toISOString(),
          description: `Игрок "${player.name}" исключен из игры (баланс ниже ${MoneyUtils.format(CONSTANTS.MIN_BALANCE)})`,
          playerName: player.name
        };
        newTransactions = [eliminationTransaction, ...newTransactions];
      }

      return {
        ...newStateWithoutError,
        players: updatedPlayers,
        transactions: newTransactions
      };
    }

    case 'TRANSFER_MONEY': {
      const { fromPlayerId, toPlayerId, amount } = action.payload;

      const fromPlayer = state.players.find(p => p.id === fromPlayerId);
      const toPlayer = state.players.find(p => p.id === toPlayerId);

      if (!fromPlayer || !toPlayer) {
        return {
          ...newStateWithoutError,
          error: 'Один из игроков для перевода не найден.'
        };
      }

      if (fromPlayerId === toPlayerId) {
        return {
          ...newStateWithoutError,
          error: 'Нельзя перевести деньги самому себе.'
        };
      }

      if (fromPlayer.isEliminated) {
        return {
          ...newStateWithoutError,
          error: `Игрок "${fromPlayer.name}" исключен из игры и не может переводить деньги.`
        };
      }

      if (toPlayer.isEliminated) {
        return {
          ...newStateWithoutError,
          error: `Игрок "${toPlayer.name}" исключен из игры и не может принимать деньги.`
        };
      }

      if (fromPlayer.balance < amount) {
        return {
          ...newStateWithoutError,
          error: `У игрока "${fromPlayer.name}" недостаточно средств для перевода ${MoneyUtils.format(amount)}.`
        };
      }

      const newFromBalance = fromPlayer.balance - amount;
      const newToBalance = toPlayer.balance + amount;

      const updatedPlayers = state.players.map(player => {
        if (player.id === fromPlayerId) {
          return { ...player, balance: newFromBalance };
        }
        if (player.id === toPlayerId) {
          return { ...player, balance: newToBalance };
        }
        return player;
      });

      const transaction = {
        id: Date.now(),
        type: TRANSACTION_TYPES.PLAYER_TRANSFER,
        timestamp: new Date().toISOString(),
        description: `"${fromPlayer.name}" передал "${toPlayer.name}" ${MoneyUtils.format(amount)}`,
        fromPlayerName: fromPlayer.name,
        toPlayerName: toPlayer.name,
        amount
      };

      let newTransactions = [transaction, ...state.transactions];

      // Проверка на исключение отправителя
      // Если у отправителя баланс становится меньше минимального после перевода
      if (newFromBalance < CONSTANTS.MIN_BALANCE && !fromPlayer.isEliminated) {
        const eliminationTransaction = {
          id: Date.now() + 1,
          type: TRANSACTION_TYPES.PLAYER_ELIMINATED,
          timestamp: new Date().toISOString(),
          description: `Игрок "${fromPlayer.name}" исключен из игры (баланс ниже ${MoneyUtils.format(CONSTANTS.MIN_BALANCE)})`,
          playerName: fromPlayer.name
        };

        // Обновляем игрока как исключенного в updatedPlayers
        const finalPlayers = updatedPlayers.map(p =>
          p.id === fromPlayerId ? { ...p, isEliminated: true } : p
        );

        return {
          ...newStateWithoutError,
          players: finalPlayers,
          transactions: [eliminationTransaction, ...newTransactions]
        };
      }

      return {
        ...newStateWithoutError,
        players: updatedPlayers,
        transactions: newTransactions
      };
    }

    case 'RESTORE_GAME':
      return { ...action.payload, error: null }; // Сбрасываем ошибку при восстановлении игры

    case 'RESET_GAME':
      return { players: [], transactions: [], error: null }; // Сбрасываем ошибку при сбросе игры

    default:
      return state;
  }
};