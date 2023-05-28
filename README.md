# Zenith

## Inspiration
Advertising and Blockchain are two areas I'm pretty much interested in. Advertising, because that's what my daily work entails. Blockchain, because I love smart contracts and their decentralized aspect. Trying to bring both these worlds a bit closer is what inspired me to build Zenith.

## What it does

Zenith is a decentralized advertising platform that allows advertisers to create campaigns and reward users for clicking on their ads, eliminating the need for middlemen.

When a campaign is created, campaign metadata like `name`, `description`, `url` and `created_time` are stored in SxT. An identifier is returned which is stored in the smart contract. The advertiser can enable or disable a campaign at any time.

### Ad Clicks

Only users with a [Gitcoin Passport](https://passport.gitcoin.co/#/dashboard) having a minimum score of 15 (same score used for [Gitcoin Grants](https://explorer.gitcoin.co/#/)) can click on ads. This is to prevent users from creating multiple accounts and clicking on ads to earn more rewards.

Users can increase their Gitcoin Passport score by adding stamps to their passport. Once they have added enough stamps, they can submit their passport to recalculate their score. Read more about Gitcoin Passport stamps [here](https://support.gitcoin.co/gitcoin-knowledge-base/gitcoin-passport/common-questions/how-is-gitcoin-passports-score-calculated).

A user can click on an ad only once per campaign, and shall see only active campaigns.

When a user clicks on an ad, the ad click data like `campaign_id`, `user_address`, `click_time` and `country` are stored in SxT. The country detection happen through Vercel.

When the user requests pending rewards from ad clicks, this triggers a request to the SxT through Chainlink Oracle, and retrieve all pending ad clicks of this user. The smart contract (inside Oracle fulfillment) will then verify the signature of the ad clicks, and only valid ad clicks will be rewarded.

### Calculation of rewards

The cost of an ad click is calculated using the following formula:

```
cost per click = (current year-over-year CPI of the country) * (base cost per click set in campaign)
```

Example: if the yoy CPI of USA is 2.88%, and the base cost per click is 0.002 MATIC, then the cost of an ad click in US will be 0.0020576 MATIC.

The current year-over-year CPI of all countries supported are fetched from Truflation once a day. If the CPI of a country is not available, then the cost of an ad click will be the base cost per click.

Once the rewards are calculated, they are transferred from the smart contract to the user's wallet.

## How I built it

### Frontend
The web app is built using React and NextJS and is hosted on Vercel.

- `Material UI` = the react component library used to build the app
- `Ethers.js` = for interacting with the Polygon Mumbai smart contracts

### Backend
Backend is comprised of a few APIs hosted on Vercel.

- `/api/campaigns`
  - `GET` = search for campaign metadata in SxT
  - `POST` = create a new campaign metadata in SxT, which returns a cid that is stored in `Zenith.sol`
- `/api/click`
  - `POST` = store ad click data in SxT
  - `GET` = search for pending ad clicks of a user (used by the Chainlink Oracle request)
- `/api/passport/score/:address`
  - `GET` = get the Gitcoin passport score of a user
- `/api/passport`
  - `POST` = submit passport of a user to recalculate the score
- `/api/stats`
  - `GET` = get stats of like total campaigns, ad clicks and current deposit value

### Blockchain

There are two smart contracts deployed on the Polygon Mumbai testnet:

- `Zenith.sol` = the main smart contract that stores campaigns, ad clicks and rewards
- `Truflation.sol` = stores the current year-over-year CPI of all countries supported by Truflation

## Challenges I ran into

- Working with SxT in NodeJS wasn't easy due to the lack of an SDK, and hence I built one myself, released as npm package [@robinthomas/sxt-sdk](https://www.npmjs.com/package/@robinthomas/sxt-sdk). Refer to [source code](https://github.com/robin-thomas/zenith/tree/main/sxt-sdk). But I did find few issues with SxT reported under:
  - https://github.com/SxT-Community/chainlink-hackathon/issues/1
  - https://github.com/SxT-Community/chainlink-hackathon/issues/2

- SxT and Truflation wasn't working properly in a single smart contract because of diamond inheritance problem. As such, I created two smart contracts with separate deployments to solve this.

- Debugging smart contract errors was no easy task. It took a few iterations and deployments of the solidity code to get it all working fine.

- SxT fulfillment function in Mumbai has a gas limit of 500k gwei, which depending on the size of the 2D array might not be enough.

- Truflation Oracle fulfillment wasn't happening in Mumbai testnet. On debugging, I found that its due to the lack of MATIC in a Truflation contract [0x776f1c12afa523941fd697639eb27d7726f9e482](https://mumbai.polygonscan.com/address/0x776f1c12afa523941fd697639eb27d7726f9e482). Thanks to [Chainlink Faucet](https://faucets.chain.link/mumbai), funded the contract with some MATIC and it started working fine.

## Accomplishments that I'm proud of

- SxT SDK. Created a NodeJS SDK for SxT to make it easy to interact with SxT in NodeJS (supports DDL, DML, DQL).

- The cost per ad click, which is calculated using the base cost per click from the campaign, the current year-over-year CPI of the country and the PPP of the user's country.

- UI/UX. Clean and modern responsive design created from scratch.

## What I learnt

- Though I had been a Solidity learner for quite some time, this hackathon has helped me learn more, with respect to solidity code, debugging, testnets, oracles, and so on.

## What's next for Zenith

- Add support for more countries and currencies.
- Add support for more ad types like video, audio, etc.
- Add support for more ad metrics like impressions, conversions, etc.
