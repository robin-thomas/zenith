export interface ToggleCampaignProps {
  status: 'enable' | 'disable';
  icon: React.ReactNode;
  campaignId: string;
};
