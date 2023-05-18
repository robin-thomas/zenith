'use client';

import { useEffect, useState } from 'react';

import Title from '@/layouts/title/Title';
import { getCampaigns } from '@/utils/metamask';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';

import Map from '@/layouts/map/Map';
import StatCard from '@/layouts/card/Stat';

const Campaigns: React.FC = () => {
  const [campaignCount, setCampaignCount] = useState<number>();
  const [remaingingFunds, setRemaingingFunds] = useState<number>();

  useEffect(() => {
    const fn = async () => {
      const campaigns = await getCampaigns();
      if (campaigns?.length > 0) {
        setCampaignCount(campaigns.length);
        setRemaingingFunds(campaigns.reduce((acc: number, c: any) => acc + Number.parseFloat(c.remaining), 0));
      }
    };

    fn();
  }, []);

  return (
    <>
      <Title title="Campaigns" />
      <Grid container spacing={0}>
        <Grid md={2}>
          <Stack direction="column" spacing={2}>
            <StatCard
              icon={<AccountBalanceRoundedIcon />}
              title="Balance"
              value={remaingingFunds !== undefined ? `Ξ ${remaingingFunds}` : undefined}
              description="Remainging funds in Ethers"
            />
            <StatCard icon={<AdsClickIcon />} title="Clicks" />
            <StatCard icon={<AddShoppingCartRoundedIcon />} title="Campaigns" value={campaignCount} />
          </Stack>
        </Grid>
        <Grid md={9}>
          <Map
            data={[
              { country: 'us', value: 1 }
            ]}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Campaigns;
