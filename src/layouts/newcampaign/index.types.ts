import type { Dayjs } from 'dayjs';

export interface NewCampaignState {
  name: string;
  description: string;
  budget: number;
  costPerClick: number;
  endDate: Dayjs;
  url: string;
  maticBalance: number;
  transactionCount: number;
  walletAge: number;
  maticBalanceChecked: boolean;
  transactionCountChecked: boolean;
  walletAgeChecked: boolean;
  nftChecked: boolean;
}
