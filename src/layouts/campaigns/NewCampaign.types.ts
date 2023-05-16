export interface NewCampaignProps {
  open: boolean;
  onClose: () => void;
}

export interface NewCampaignState {
  name: string;
  description: string;
  budget: number;
  costPerClick: number;
  endDate: string;
  url: string;
}
