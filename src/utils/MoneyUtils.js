// src/utils/MoneyUtils.js

export const MoneyUtils = {
  format: (amount) => {
    return new Intl.NumberFormat('ru-RU').format(amount);
  },
};