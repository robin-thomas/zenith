'use client';

import { Button } from '@mui/material';

import { Title } from '@/layouts/typography';
import { requestRewards } from '@/utils/metamask';

const Rewards: React.FC = () => {
  const onClick = async () => {
    await requestRewards();
  };

  return (
    <>
      <Title title="Rewards" />
      <Button variant="contained" onClick={onClick}>Request Rewards</Button>
    </>
  );
};

export default Rewards;
