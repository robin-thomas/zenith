/* eslint-disable no-unused-vars */
import React from 'react';
import { hydrateRoot } from 'react-dom/client';

import { BrowserProvider } from 'ethers';
import Skeleton from '@mui/material/Skeleton';

import { AdvertisementDialog } from './src/layouts/dialog';
import { getAnAd, getSignatureForAdClick } from './src//utils/metamask';
import { PreviewCard } from './src/layouts/card';
import { APP_HOST } from './src/constants/app';
import { PASSPORT_THRESHOLD } from './src/constants/passport';
import { PLACEHOLDER_NAME, PLACEHOLDER_DESCRIPTION, PLACEHOLDER_URL } from './src/constants/campaign';

interface ZenithConfig {
  hideOnNoMetaMask?: boolean;
  hideOnNoAd?: boolean;
  publisherId: string;
}

declare global {
  interface Window {
    ethereum: any;
    initZenith: any;
  }
}

const config = {} as ZenithConfig;

const getGitcoinPassportScore = async (address: string) => {
  const resp = await fetch(`/api/passport/score/${address}`);
  const data = await resp.json();

  return data?.score;
};

type Ad = {
  address: string | null, ad: null | {
    name: string,
    description: string,
    url: string,
    id?: string,
    advertiser?: string
  }
};

const loadAd = async () => {
  const result: Ad = { address: null, ad: null };
  const defaultAd = { name: PLACEHOLDER_NAME, description: PLACEHOLDER_DESCRIPTION, url: PLACEHOLDER_URL };

  const provider = new BrowserProvider(window.ethereum);
  if (!provider) {
    if (!config?.hideOnNoMetaMask) {
      result.ad = defaultAd;
    }
    return result;
  }

  const accounts = await provider.send('eth_accounts', []);
  if (!Array.isArray(accounts) || accounts.length === 0) {
    if (!config?.hideOnNoMetaMask) {
      result.ad = defaultAd;
    }
    return result;
  }

  result.address = accounts[0];

  const score = await getGitcoinPassportScore(accounts[0]);
  if (!score || score < PASSPORT_THRESHOLD) {
    if (!config?.hideOnNoMetaMask) {
      result.ad = defaultAd;
    }
    return result;
  }

  const ad = await getAnAd(accounts[0]);
  if (!ad) {
    if (!config?.hideOnNoAd) {
      result.ad = defaultAd;
    }
    return result;
  }

  result.ad = ad;

  return result;
};

const App: React.FC = () => {
  const [ad, setAd] = React.useState<Ad['ad']>();
  const [openAd, setOpenAd] = React.useState(false);
  const [address, setAddress] = React.useState<string | null>();

  React.useEffect(() => {
    loadAd()
      .then(({ ad: _ad, address }) => {
        setAd(_ad ?? null);
        setAddress(address ?? null);
      });
  }, []);

  if (ad === undefined) {
    return <Skeleton variant="rounded" height={125} />;
  }

  if (!ad) {
    return null;
  }

  const handleOpenAd = () => setOpenAd(true);
  const handleCloseAd = () => setOpenAd(false);
  const handleViewAd = async () => {
    if (ad?.id) {
      const viewed = Date.now();
      const signature = await getSignatureForAdClick(ad.id, viewed);

      await fetch(`${APP_HOST}/api/click`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignId: ad.id,
          advertiser: ad.advertiser,
          publisher: config.publisherId,
          clicker: address,
          signature,
          viewed: viewed.toString(),
        }),
      });
    }

    window.open(ad.url, '_blank');
    ad?.id && handleCloseAd();
  };

  return (
    <>
      {ad?.id && <AdvertisementDialog open={openAd} handleClose={handleCloseAd} onYes={handleViewAd} />}
      <PreviewCard
        name={ad?.name}
        description={ad?.description}
        url={ad?.url}
        onClick={ad?.id ? handleOpenAd : handleViewAd}
      />
    </>
  );
};

const loadZenith = async () => {
  const div = document.createElement('div');
  div.id = 'zenith-ad';
  document.getElementById('zenith-js')?.parentNode?.appendChild(div);

  hydrateRoot(document.getElementById('zenith-ad') as HTMLElement, <App />);
};

const initZenith = (_config: ZenithConfig) => {
  if (!_config.publisherId) {
    throw new Error('You need to provider publisherId');
  }

  config.hideOnNoMetaMask = Boolean(_config.hideOnNoMetaMask);
  config.hideOnNoAd = Boolean(_config.hideOnNoAd);
  config.publisherId = _config.publisherId;

  loadZenith();
};

window.React = React;
window.initZenith = initZenith;
