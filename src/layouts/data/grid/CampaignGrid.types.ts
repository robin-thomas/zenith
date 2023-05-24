import type { Dayjs } from 'dayjs';

export interface CampaignGridData {
  status: string;
  name: string;
  budget: number;
  url: string;
  remaining: number;
  clicks: number;
  created: Dayjs;
  end: Dayjs;
}

export interface CampaignGridProps {
  rows: CampaignGridData[];
};
