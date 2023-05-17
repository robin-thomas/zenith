'use client';

import Title from '@/layouts/title/Title';
import NewCampaign from '@/layouts/campaigns/NewCampaign';

const Campaigns: React.FC = () => (
  <>
    <Title title="Create New Campaign" />
    <NewCampaign open={true} onClose={() => {}}/>
  </>
)

export default Campaigns;
