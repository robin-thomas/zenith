'use client';

import { useEffect } from 'react';

import Title from '@/layouts/title/Title';
import { getCampaigns } from '@/utils/metamask';

const Campaigns: React.FC = () => {
  useEffect(() => {
    const fn = async () => {
      await getCampaigns();
    };

    fn();
  }, []);

  return (
    <>
      <Title title="Campaigns" />
    </>
  );
};

export default Campaigns;
