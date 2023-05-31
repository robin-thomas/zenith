/* eslint-disable no-unused-vars */
import React from 'react';
import { hydrateRoot } from 'react-dom/client';

import { BrowserProvider } from 'ethers';
import Skeleton from '@mui/material/Skeleton';

import { getAnAd } from './src//utils/metamask';
import { PreviewCard } from './src/layouts/card';
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

const loadAd = async () => {
  const defaultAd = { name: PLACEHOLDER_NAME, description: PLACEHOLDER_DESCRIPTION, url: PLACEHOLDER_URL };

  const provider = new BrowserProvider(window.ethereum);
  if (!provider) {
    return config?.hideOnNoMetaMask ? undefined : defaultAd;
  }

  const accounts = await provider.send('eth_accounts', []);
  if (!Array.isArray(accounts) || accounts.length === 0) {
    return config?.hideOnNoMetaMask ? undefined : defaultAd;
  }

  const score = await getGitcoinPassportScore(accounts[0]);
  if (!score || score < PASSPORT_THRESHOLD) {
    return config?.hideOnNoMetaMask ? undefined : defaultAd;
  }

  const ad = await getAnAd(accounts[0]);
  if (!ad) {
    return config?.hideOnNoAd ? undefined : defaultAd;
  }
};

const App: React.FC = () => {
  const [ad, setAd] = React.useState<any>();

  React.useEffect(() => {
    loadAd().then((_ad) => setAd(_ad ?? null));
  }, []);

  if (ad === undefined) {
    return <Skeleton variant="rounded" height={125} />;
  }

  if (!ad) {
    return null;
  }

  return (
    <PreviewCard
      name={ad?.name}
      description={ad?.description}
      url={ad?.url}
    />
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
