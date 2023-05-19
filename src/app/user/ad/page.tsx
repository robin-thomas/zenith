'use client';

import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';

import Preview from '@/layouts/ad/Preview';
import Title from '@/layouts/title/Title';
import { getAvailableAds } from '@/utils/metamask';

const WatchAnAd: React.FC = () => {
  const [ad, setAd] = useState<any>();

  useEffect(() => {
    const fn = async () => {
      const ads = await getAvailableAds();
      if (ads?.length > 0) {
        setAd(ads[0]);
      } else {
        setAd(null);
      }
    };

    fn();
  }, []);

  return (
    <>
      <Title title="Watch an Ad" />
      {ad === undefined && (
        <Skeleton variant="rounded" height={125} />
      )}
      {ad === null && (
        <Card variant="outlined" sx={{ marginTop: 3 }}>
          <CardContent>
            <p>There are no ads available to watch at this time.</p>
          </CardContent>
        </Card>
      )}
      {ad && (
        <Card variant="outlined" sx={{ marginTop: 3 }}>
          <CardContent>
            <Preview name={ad.name} url={ad.url} description={ad.description} />
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default WatchAnAd;
