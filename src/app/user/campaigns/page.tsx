'use client';

import { useEffect, useState } from 'react';

import { Title } from '@/layouts/typography';
import { getCampaigns } from '@/utils/metamask';
import Grid from '@mui/material/Grid';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';

import { CampaignGrid, CampaignMap } from '@/layouts/data';
import { StatsCard } from '@/layouts/card';
import type { CampaignGridData } from '@/layouts/data/grid/CampaignGrid.types';
import { CURRENCY_SYMBOL, CURRENCY_NAME } from '@/constants/app';

const Campaigns: React.FC = () => {
  const [adClickCount, setAdClickCount] = useState<number>();
  const [campaignCount, setCampaignCount] = useState<number>();
  const [remaingingFunds, setRemaingingFunds] = useState<string>();
  const [campaignGridData, setCampaignGridData] = useState<CampaignGridData[]>();

  useEffect(() => {
    const fn = async () => {
      const campaigns = await getCampaigns();
      if (campaigns?.length > 0) {
        setCampaignCount(campaigns.length);
        setAdClickCount(campaigns.reduce((acc: number, c: any) => acc + c.clicks.length, 0));
        setRemaingingFunds(
          campaigns
            .reduce((acc: number, c: any) => acc + Number.parseFloat(c.remaining), 0)
            .toFixed(4)
        );

        setCampaignGridData(campaigns.map((c: any, index: number) => ({
          id: index + 1,
          name: c.name,
          url: c.url,
          budget: c.budget,
          remaining: c.remaining,
          clicks: c.clicks.length,
          created: c.startDatetime,
          end: c.endDatetime,
          status: `${c.active}_${c.id}`,
        })));
      } else {
        setCampaignCount(0);
        setAdClickCount(0);
        setRemaingingFunds('0');
        setCampaignGridData([]);
      }
    };

    fn();
  }, []);

  return (
    <>
      <Title title="Campaigns" />
      <Grid container>
        <Grid item md={5}>
          <Grid container spacing={1} justifyContent="flex-start">
            <Grid item md={5} sx={{ marginRight: 1, marginBottom: 1 }}>
              <StatsCard
                icon={<AccountBalanceRoundedIcon />}
                title="Balance"
                value={remaingingFunds !== undefined ? `${CURRENCY_SYMBOL} ${remaingingFunds}` : undefined}
                description={`Remainging funds in ${CURRENCY_NAME}`}
              />
            </Grid>
            <Grid item md={5}>
              <StatsCard icon={<AdsClickIcon />} title="Clicks" value={adClickCount} />
            </Grid>
            <Grid item md={5}>
              <StatsCard icon={<AddShoppingCartRoundedIcon />} title="Campaigns" value={campaignCount} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={7}>
          <CampaignMap
            data={[
              { country: 'us', value: 1 }
            ]}
          />
        </Grid>
      </Grid>
      {campaignGridData && <CampaignGrid rows={campaignGridData} />}
    </>
  );
};

export default Campaigns;
