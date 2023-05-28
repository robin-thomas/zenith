'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import { PreviewCard } from '@/layouts/card';
import { Title } from '@/layouts/typography';
import { getAvailableAds, getSignatureForAdClick } from '@/utils/metamask';
import { AdvertisementDialog } from '@/layouts/dialog';
import { useAppContext } from '@/hooks/useAppContext';
import { PASSPORT_THRESHOLD } from '@/constants/passport';

const WatchAnAd: React.FC = () => {
  const { wallet } = useAppContext();

  const [ad, setAd] = useState<any>();
  const [score, setScore] = useState<number | null>();
  const [openAd, setOpenAd] = useState(false);
  const [submittingPassport, setSubmittingPassport] = useState(false);

  const handleOpenAd = () => setOpenAd(true);
  const handleCloseAd = () => setOpenAd(false);
  const handleViewAd = async () => {
    const viewed = Date.now();
    const signature = await getSignatureForAdClick(ad.id, viewed);

    await fetch('/api/click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        campaignId: ad.id,
        advertiser: ad.advertiser,
        clicker: wallet.accounts[0],
        signature,
        viewed: viewed.toString(),
      }),
    });

    window.open(ad.url, '_blank');
    handleCloseAd();
  };

  useEffect(() => {
    const fn = async () => {
      const resp = await fetch(`/api/passport/score/${wallet.accounts[0]}`);
      const data = await resp.json();

      setScore(data?.score ?? null);
    };

    if (wallet && score === undefined) {
      fn();
    }
  }, [wallet, score]);

  useEffect(() => {
    const fn = async () => {
      const ads = await getAvailableAds(wallet.accounts[0]);
      if (ads?.length > 0) {
        setAd(ads[0]);
      } else {
        setAd(null);
      }
    };

    if (score && score >= PASSPORT_THRESHOLD) {
      fn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  const submitPassport = async () => {
    setSubmittingPassport(true);

    const passportResp = await fetch('/api/passport', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: wallet.accounts[0],
      }),
    });

    await passportResp.json();

    setTimeout(() => {
      setSubmittingPassport(false);
      setScore(undefined);
    }, 1000);
  };

  return (
    <>
      <Title title="Watch an Ad" />
      {(score === undefined && ad === undefined) || (score && score >= PASSPORT_THRESHOLD && ad === undefined) && (
        <Skeleton variant="rounded" height={125} />
      )}
      {(score === null || (score && score < PASSPORT_THRESHOLD)) && (
        <Card variant="outlined" sx={{ mt: 3 }}>
          <CardContent>
            <p>
              Gitcoin Passport is an identity protocol that proves your trustworthiness without
              needing to collect personally identifiable information.
            </p>
            <br />
            <p>
              You get score by adding stamps to your passport. Once you have added enough stamps,
              submit your passport to recalculate your score.<br />
            </p>
            <br />
            <i>NOTE: You need to have a minimum score of &apos;{PASSPORT_THRESHOLD}&apos; to watch an ad.</i>
            <br />
            <Link href="https://passport.gitcoin.co/#/dashboard" target="_blank">
              <Button variant="contained" sx={{ mt: 2 }}>Configure your passport</Button>
            </Link>
            <LoadingButton
              variant="contained"
              sx={{ mt: 2, ml: 2 }}
              onClick={submitPassport}
              loading={submittingPassport}
            >
              Submit your passport
            </LoadingButton>
          </CardContent>
        </Card>
      )}
      {ad === null && (
        <Card variant="outlined" sx={{ mt: 3 }}>
          <CardContent>
            <p>There are no ads available to watch at this time.</p>
          </CardContent>
        </Card>
      )}
      {ad && (
        <>
          <AdvertisementDialog open={openAd} handleClose={handleCloseAd} onYes={handleViewAd} />
          <Card variant="outlined" sx={{ mt: 3 }}>
            <CardContent>
              <PreviewCard
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
