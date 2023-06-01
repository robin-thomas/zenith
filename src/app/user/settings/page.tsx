'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';
import Divider from '@mui/material/Divider';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Title } from '@/layouts/typography';
import { useAppContext } from '@/hooks/useAppContext';
import { APP_HOST } from '@/constants/app';
import { PASSPORT_THRESHOLD } from '@/constants/passport';

const WatchAnAd: React.FC = () => {
  const { wallet } = useAppContext();

  const [loadedJs, setLoadedJs] = useState<any>(false);
  const [hideOnNoAd, setHideOnNoAd] = useState(false);
  const [hideOnNoMetaMask, setHideOnNoMetaMask] = useState(false);

  useEffect(() => {
    const loadJs = async () => {
      const _script = document.createElement('script');
      _script.src = '/cmp/ad-0.1.0.js';
      _script.id = 'zenith-js';
      _script.type = 'module';

      _script.addEventListener('load', () => {
        setLoadedJs(true);
      });

      document.getElementById('zenith-ad-preview')?.appendChild(_script);
    };

    if (wallet) {
      loadJs();
    }
  }, [wallet]);

  useEffect(() => {
    if (loadedJs) {
      (window as any)?.initZenith({
        publisherId: wallet.accounts[0],
        hideOnNoMetaMask,
        hideOnNoAd,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedJs, hideOnNoMetaMask, hideOnNoAd]);

  return (
    <>
      <Title title="Settings" />
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={hideOnNoMetaMask} onChange={(e) => setHideOnNoMetaMask(e.target.checked)} />}
          label={(
            <>
              Hide if user doesn&apos;t have MetaMask wallet&nbsp;
              <Tooltip arrow title="You shall get paid only if the user has MetaMask wallet">
                <HelpIcon sx={{ fontSize: 16 }} />
              </Tooltip>
            </>
          )}
        />
        <FormControlLabel
          control={<Switch checked={hideOnNoAd} onChange={(e) => setHideOnNoAd(e.target.checked)} />}
          label={(
            <>
              Hide if no ads are available or user <Link href="https://passport.gitcoin.co/#/dashboard" target="_blank">
                Gitcoin Passport
              </Link> score is less than <b>{PASSPORT_THRESHOLD}</b>
            </>
          )}
        />
      </FormGroup>
      <Divider sx={{ mt: 2, mb: 3 }} />
      <p>Paste below HTML code where you want the ad to appear.</p><br />
      <SyntaxHighlighter
        language="javascript"
        style={a11yDark}
        customStyle={{
          padding: 0,
          margin: 0,
          fontSize: '0.8rem',
        }}
      >
        {`
  <script type="module" src="${APP_HOST}/cmp/ad-0.1.0.js" id="zenith-js"></script>
  <script type="text/javascript">
    window.initZenith({
      publisherId: "${wallet?.accounts?.[0]}",
      hideOnNoMetaMask: ${hideOnNoMetaMask},
      hideOnNoAd: ${hideOnNoAd},
    });
  </script>

`}
      </SyntaxHighlighter>
      <Divider sx={{ mt: 3, mb: 3 }} />
      <p style={{ marginBottom: '0.75rem' }}>Preview</p>
      <div id="zenith-ad-preview"></div>
    </>
  );
};

export default WatchAnAd;
