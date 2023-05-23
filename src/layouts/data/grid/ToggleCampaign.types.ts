export interface ToggleCampaignProps {
  status: 'pause' | 'start';
  icon: React.ReactNode;
  campaignId: string;
  toggleCampaignStatus: () => void;
};
