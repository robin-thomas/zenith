/* eslint-disable react/no-children-prop */
'use client';

import Link from 'next/link';

import Stack from '@mui/material/Stack';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Logo } from '@/layouts/typography';
import styles from './page.module.css';
import { APP_DESCRIPTION_SHORT, APP_NAME, CURRENCY_NAME } from '@/constants/app';
import { PASSPORT_THRESHOLD } from '@/constants/passport';

SyntaxHighlighter.registerLanguage('javascript', js);

const About: React.FC = () => (
  <div className={styles.mainContainer}>
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Logo />
    </Stack>
    <div className={styles.contentContainer}>
      <h1>{APP_NAME}: {APP_DESCRIPTION_SHORT}</h1>
      <p>
        {APP_NAME} is a decentralized advertising platform that connects advertisers and publishers through
        smart contracts, eliminating the need for middlemen.
      </p>
      <p>
        Advertisers enjoy secure, verifiable transactions, while publishers are rewarded fairly for their
        user engagement. Join the DeFi advertising revolution and unlock your advertising potential with&nbsp;
        {APP_NAME} today.
      </p>
      <h3>Advertisers</h3>
      <p>
        To create a campaign, the advertiser need to provide the budget (which will be transferred to the
        smart contract) and a base cost per click. This base cost per click will be used for the ad
        bidding auction as well as deciding the cost of an ad click (explained in more detail in further
        sections).
      </p>
      <p>
        Campaign metadata like <code>name</code>, <code>description</code>, <code>url</code> and
        &nbsp;<code>created_time</code> are stored in Space and Time (SxT) tables. A SxT identifier to this
        metadata is returned which is stored in the smart contract.
      </p>
      <p>The advertiser can enable or disable a campaign at any time.</p>
      <h3>Publishers</h3>
      <p>
        Publishers are website owners, who can copy a snippet of JavaScript code from the {APP_NAME}
        <code>Settings</code> page, and then add it to their websites. This code will fetch the winning ad
        (after the decentralized auction) from the smart contract and show it to the users.
      </p>
      <p>Publishers will be paid only for valid ad clicks:</p>
      <ul>
        <li>User need to have MetaMask wallet installed</li>
        <li>Need to have a Gitcoin Passport score of {PASSPORT_THRESHOLD}</li>
        <li>A user can click on an ad only once</li>
      </ul>
      <h3>Ad Targeting</h3>
      <p>
        Advertisers have the option for targeting the ads, allowing them to reach specific DeFi user segments based
        on factors such as wallet activity, transaction history, wallet balance and so on.
      </p>
      <p>The targeting details are stored in SxT tables.</p>
      <p>Currently we support the below targeting options are:</p>
      <ul>
        <li>Wallet age more than 1 day, 1 week, 1 month</li>
        <li>Wallet activity more than 1 transaction, 5 transactions, 10 transactions</li>
        <li>Wallet balance more than 0.1 {CURRENCY_NAME}, 1 {CURRENCY_NAME}, 10 {CURRENCY_NAME}</li>
        <li>Currently own or previously owned an NFT</li>
      </ul>
      <h3>Decentralised Auction</h3>
      <p>
        The auction process is run everytime there is an availability to show an ad. The auction winner is
        the advertiser who has the highest bid, which is calculated by below formula:
      </p>
      <SyntaxHighlighter
        children="bid = 0.7 * base_cost_per_click + 0.2 * gitcoin_passport_score + 0.1 * campaign_balance"
        style={a11yDark}
        language="javascript"
        PreTag="div"
      />
      <p>
        This bid is used only to determine the auction winner. The cost per click is calculated using a
        different formula.
      </p>
      <h3>Ad Clicks</h3>
      <p>
        Only users with a&nbsp;
        <Link target="_blank" href="https://passport.gitcoin.co/#/dashboard">Gitcoin Passport</Link>
        &nbsp;having a minimum score of 15 (same score used for&nbsp;
        <Link target="_blank" href="https://explorer.gitcoin.co/#/">Gitcoin Grants</Link>
        ) can click on ads. This is to prevent users from creating multiple accounts and clicking on ads
        to earn more rewards.
      </p>
      <p>
        Users can increase their Gitcoin Passport score by adding stamps to their passport. Once they have
        added enough stamps, they can submit their passport to recalculate their score. Read more about
        Gitcoin Passport stamps&nbsp;
        <Link target="_blank" href="https://support.gitcoin.co/gitcoin-knowledge-base/gitcoin-passport/common-questions/how-is-gitcoin-passports-score-calculated">here</Link>
        .
      </p>
      <p>
        A user can click on an ad only once per campaign, and shall see only active campaigns.
      </p>
      <p>
        When a user clicks on an ad, the ad click data like <code>campaign_id</code>,&nbsp;
        <code>user_address</code>, <code>click_time</code> and <code>country</code> are stored in SxT.
        The country detection happen through Vercel.
      </p>
      <p>
        When the user requests pending rewards from ad clicks, this triggers a request to the SxT
        through&nbsp;
        <Link target="_blank" href="https://docs.spaceandtime.io/docs/chainlink-direct-requests">Chainlink Direct
          Requests</Link>
        , and retrieve all pending ad clicks of this user. The smart contract (inside Oracle fulfillment)
        will then verify the signature of the ad clicks, and only valid ad clicks will be rewarded.
      </p>
      <h3>Calculation of rewards</h3>
      <p>The cost of an ad click is calculated using the following formula:</p>
      <SyntaxHighlighter
        children="cost_per_click = campaign_base_cost_per_click * country_CPI * big_mac_index"
        style={a11yDark}
        language="javascript"
        PreTag="div"
      />
      <p>
        Example: if the yoy CPI of UK is 8.7%, base cost per click for the campaign is
        0.002 {CURRENCY_NAME}, and Big Mac Index for UK is 0.904, then the cost of the ad
        click will be 0.001965296 {CURRENCY_NAME}.
      </p>
      <SyntaxHighlighter
        children={`cost per click = 1.087 * 0.002 * 0.904 = 0.001965296 ${CURRENCY_NAME}`}
        style={a11yDark}
        language="javascript"
        PreTag="div"
      />
      <p>
        The current year-over-year CPI of all countries supported are fetched from Truflation once a day.
        If the CPI of a country is not available, then the cost of an ad click will be the base cost per
        click.
      </p>
      <br />
      <figure>
        <q cite="https://www.economist.com/big-mac-index">
          <i>The big mac index was invented by The Economist in 1986 as a lighthearted guide to
            whether currencies are at their “correct” level. It is based on the theory of
            purchasing-power parity (PPP), the notion that in the long run exchange rates should
            move towards the rate that would equalise the prices of an identical basket of goods
            and services (in this case, a burger) in any two countries.</i>
        </q>
        <figcaption>
          &mdash; <cite>The Economist</cite>
        </figcaption>
      </figure>
      <p>
        Once the rewards are calculated, they are transferred from the smart contract to the user&apos;s
        wallet.
      </p>
    </div>
  </div>
);

export default About;
