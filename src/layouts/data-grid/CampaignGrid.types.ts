import type { Dayjs } from 'dayjs';

export interface CampaignGridData {
  status: string;
  name: string;
  description: string;
  budget: number;
  url: string;
  remaining: number;
  clicks: number;
  startDate: Dayjs;
  endDate: Dayjs;
}

export interface CampaignGridProps {
  rows: CampaignGridData[];
};
