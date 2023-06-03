import { CURRENCY_NAME } from '@/constants/app';

export const WALLET_AGE_VALUES = [
  { label: '1 day', value: '1' },
  { label: '1 week', value: '7' },
  { label: '1 month', value: '30' },
];

export const TRANSACTION_COUNT_VALUES = [
  { label: '1 transaction', value: '1' },
  { label: '5 transactions', value: '5' },
  { label: '10 transactions', value: '10' },
];

export const WALLET_BALANCE_VALUES = [
  { label: `0.1 ${CURRENCY_NAME}`, value: '0.1' },
  { label: `1 ${CURRENCY_NAME}`, value: '1' },
  { label: `10 ${CURRENCY_NAME}`, value: '10' },
];
