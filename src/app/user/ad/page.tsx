'use client';

import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import dayjs from 'dayjs';

import Preview from '@/layouts/ad/Preview';
import Title from '@/layouts/title/Title';
import { getAvailableAds, getSignatureForAdClick } from '@/utils/metamask';
import Advertisement from '@/layouts/dialog/Advertisement';

const WatchAnAd: React.FC = () => {
  const [ad, setAd] = useState<any>();
  const [openAd, setOpenAd] = useState(false);

  const handleOpenAd = () => setOpenAd(true);
  const handleCloseAd = () => setOpenAd(false);
  const handleViewAd = async () => {
    await getSignatureForAdClick(ad.id, dayjs().unix());

    window.open(ad.url, '_blank');
    handleCloseAd();
  };

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
        <>
          <Advertisement open={openAd} handleClose={handleCloseAd} onYes={handleViewAd} />
          <Card variant="outlined" sx={{ marginTop: 3 }}>
            <CardContent>
              <Preview
                name={ad.name}
                url={ad.url}
                description={ad.description}
                onClick={handleOpenAd}
              />
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
};

export default WatchAnAd;
