'use client';

import { Button } from '@mui/material';

import { Title } from '@/layouts/typography';
import { requestRewards, getRewards } from '@/utils/metamask';
import { useEffect } from 'react';

const Rewards: React.FC = () => {
  useEffect(() => {
    // eslint-disable-next-line no-console
    getRewards().then(console.log);
  }, []);

  const onClick = async () => {
    await requestRewards();
  };

  return (
    <>
      <Title title="Rewards" />
      <Button variant="contained" onClick={onClick}>Request Reward</Button>
    </>
  );
};

export default Rewards;
