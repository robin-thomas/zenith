/* eslint-disable no-unused-vars */
import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import dynamic from 'next/dynamic';

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

const getGitcoinPassportScore = async (address: string, init?: RequestInit) => {
  const resp = await fetch(`/api/passport/score/${address}`, init);
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

const loadAd = async (init?: RequestInit) => {
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

  const score = await getGitcoinPassportScore(accounts[0], init);
  if (!score || score < PASSPORT_THRESHOLD) {
    if (!config?.hideOnNoMetaMask) {
      result.ad = defaultAd;
    }
    return result;
  }

  const ad = await getAnAd(accounts[0], init);
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
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);

    const controller = new AbortController();

    loadAd({ signal: controller.signal })
      .then(({ ad: _ad, address }) => {
        setAd(_ad ?? null);
        setAddress(address ?? null);
      })
      .catch(() => controller.abort());

    return () => controller.abort();
  }, []);

  if (!isMounted) {
    return null;
  }

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
      {ad.id && <AdvertisementDialog open={openAd} handleClose={handleCloseAd} onYes={handleViewAd} />}
      <PreviewCard
        name={ad.name}
        description={ad.description}
        url={ad.url}
        onClick={ad.id ? handleOpenAd : handleViewAd}
      />
    </>
  );
};

const AppNoSSR = dynamic(() => Promise.resolve(App), { ssr: false }) as any;

let zenithAdNode: Root | null = null;

const loadZenith = async () => {
  if (zenithAdNode) {
    zenithAdNode.unmount();
    zenithAdNode = null;
  }

  const div = document.createElement('div');
  div.id = 'zenith-ad';
  document.getElementById('zenith-js')?.parentNode?.appendChild(div);

  zenithAdNode = hydrateRoot(
    document.getElementById('zenith-ad') as HTMLElement,
    <AppNoSSR />
  );
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
