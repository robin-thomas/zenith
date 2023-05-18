'use client';

import { useEffect, useState } from 'react';

import Title from '@/layouts/title/Title';
import { getCampaigns } from '@/utils/metamask';
import Grid from '@mui/material/Grid';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';

import Map from '@/layouts/map/Map';
import StatCard from '@/layouts/card/Stat';
import CampaignGrid from '@/layouts/data-grid/CampaignGrid';
import type { CampaignGridData } from '@/layouts/data-grid/CampaignGrid.types';

const Campaigns: React.FC = () => {
  const [campaignCount, setCampaignCount] = useState<number>();
  const [remaingingFunds, setRemaingingFunds] = useState<number>();
  const [campaignGridData, setCampaignGridData] = useState<CampaignGridData[]>([]);

  useEffect(() => {
    const fn = async () => {
      const campaigns = await getCampaigns();
      if (campaigns?.length > 0) {
        setCampaignCount(campaigns.length);
        setRemaingingFunds(campaigns.reduce((acc: number, c: any) => acc + Number.parseFloat(c.remaining), 0));

        setCampaignGridData(campaigns.map((c: any, index: number) => ({
          id: index + 1,
          name: c.name,
          url: c.adUrl, // TODO
          budget: c.budget,
          remaining: c.remaining,
          clicks: 0, // TODO
          created: c.startDatetime,
          end: c.endDatetime,
        })));
      }
    };

    fn();
  }, []);

  return (
    <>
      <Title title="Campaigns" />
      <Grid container>
        <Grid md={4}>
          <Grid container spacing={1} justifyContent="flex-start">
            <Grid md={5} sx={{ marginRight: 1, marginBottom: 1 }}>
              <StatCard
                icon={<AccountBalanceRoundedIcon />}
                title="Balance"
                value={remaingingFunds !== undefined ? `Ξ ${remaingingFunds}` : undefined}
                description="Remainging funds in Ethers"
              />
            </Grid>
            <Grid md={5}>
              <StatCard icon={<AdsClickIcon />} title="Clicks" />
            </Grid>
            <Grid md={5}>
              <StatCard icon={<AddShoppingCartRoundedIcon />} title="Campaigns" value={campaignCount} />
            </Grid>
          </Grid>
        </Grid>
        <Grid md={8}>
          <Map
            data={[
              { country: 'us', value: 1 }
            ]}
          />
        </Grid>
      </Grid>
      <CampaignGrid rows={campaignGridData} />
    </>
  );
};

export default Campaigns;
