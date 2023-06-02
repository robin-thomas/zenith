/* eslint-disable react/no-children-prop */
'use client';

import Stack from '@mui/material/Stack';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Logo } from '@/layouts/typography';
import styles from './page.module.css';
import { APP_DESCRIPTION_SHORT, APP_NAME } from '@/constants/app';

const markdown = `
# ${APP_NAME}: ${APP_DESCRIPTION_SHORT}

Zenith is a decentralized advertising platform that connects advertisers and publishers through smart contracts,
eliminating the need for middlemen.

Advertisers enjoy secure, verifiable transactions, while publishers are rewarded fairly for their user engagement.
Join the DeFi advertising revolution and unlock your advertising potential with Zenith today.

### Advertisers

To create a campaign, the advertiser need to provide the budget (which will be transferred to the smart contract)
and a base cost per click. This base cost per click will be used for the ad bidding auction as well as deciding
the cost of an ad click (explained in more detail in further sections).

Campaign metadata like \`name\`, \`description\`, \`url\` and \`created_time\` are stored in Space and Time (SxT)
tables. A SxT identifier to this metadata is returned which is stored in the smart contract.

The advertiser can enable or disable a campaign at any time.

### Publishers

Publishers are website owners, who can copy a snippet of JavaScript code from the Zenith "Settings" page, and then
add it to their websites. This code will fetch the winning ad (after the decentralized auction) from the smart
contract and show it to the users.

Publishers will be paid only for valid ad clicks:
  - User need to have MetaMask wallet installed
  - Need to have a Gitcoin Passport score of 15
  - A user can click on an ad only once

### Decentralised Auction

The auction process is run everytime there is an availability to show an ad. The auction winner is the advertiser
who has the highest bid, which is calculated by below formula:

\`\`\`javascript
bid = 0.7 * base_cost_per_click + 0.2 * gitcoin_passport_score + 0.1 * campaign_balance
\`\`\`

This bid is used only to determine the auction winner. The cost per click is calculated using a different formula.

### Ad Clicks

Only users with a [Gitcoin Passport](https://passport.gitcoin.co/#/dashboard) having a minimum score of 15 (same score used for [Gitcoin Grants](https://explorer.gitcoin.co/#/)) can click on ads. This is to prevent users from creating multiple accounts and clicking on ads to earn more rewards.

Users can increase their Gitcoin Passport score by adding stamps to their passport. Once they have added enough stamps, they can submit their passport to recalculate their score. Read more about Gitcoin Passport stamps [here](https://support.gitcoin.co/gitcoin-knowledge-base/gitcoin-passport/common-questions/how-is-gitcoin-passports-score-calculated).

A user can click on an ad only once per campaign, and shall see only active campaigns.

When a user clicks on an ad, the ad click data like \`campaign_id\`, \`user_address\`, \`click_time\` and
\`country\` are stored in SxT. The country detection happen through Vercel.

When the user requests pending rewards from ad clicks, this triggers a request to the SxT through [Chainlink Direct
  Requests](https://docs.spaceandtime.io/docs/chainlink-direct-requests), and retrieve all pending ad clicks of
  this user. The smart contract (inside Oracle fulfillment) will then verify the signature of the ad clicks, and
  only valid ad clicks will be rewarded.

### Calculation of rewards

The cost of an ad click is calculated using the following formula:

\`\`\`javascript
cost_per_click = campaign_base_cost_per_click * country_CPI
\`\`\`

Example: if the yoy CPI of USA is 2.88%, and the base cost per click is 0.002 MATIC, then the cost of an ad click
in US will be 0.0020576 MATIC.

The current year-over-year CPI of all countries supported are fetched from Truflation once a day. If the CPI of a
country is not available, then the cost of an ad click will be the base cost per click.

Once the rewards are calculated, they are transferred from the smart contract to the user's wallet.
`;

const About: React.FC = () => {
  return (
    <div className={styles.mainContainer}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Logo />
      </Stack>
      <div className={styles.contentContainer}>
        <ReactMarkdown
          children={markdown}
          linkTarget="_blank"
          components={{
            code({ inline, className, children, ...props }) {
              if (inline) {
                return (
                  <code {...props} className={className}>
                    {children}
                  </code>
                );
              }
              return (
                <SyntaxHighlighter
                  {...props}
                  children={String(children).replace(/\n$/, '')}
                  style={a11yDark}
                  language="javascript"
                  PreTag="div"
                />
              );
            },
          }}
        />
      </div>
    </div>
  );
};

export default About;
