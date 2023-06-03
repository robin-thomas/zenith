import { WALLET_AGE_VALUES, TRANSACTION_COUNT_VALUES, WALLET_BALANCE_VALUES } from '@/constants/targeting';

export const walletAgeValueLabel = (walletAge: string) => {
  return WALLET_AGE_VALUES.find((item) => item.value === walletAge)?.label;
};

export const transactionCountValueLabel = (transactionCount: string) => {
  return TRANSACTION_COUNT_VALUES.find((item) => item.value === transactionCount)?.label;
};

export const walletBalanceValueLabel = (walletBalance: string) => {
  return WALLET_BALANCE_VALUES.find((item) => item.value === walletBalance)?.label;
};
