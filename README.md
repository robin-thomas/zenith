# Zenith

Zenith is a decentralized advertising platform that connects advertisers and publishers through smart contracts, eliminating the need for middlemen.

Advertisers enjoy secure, verifiable transactions, while publishers are rewarded fairly for their user engagement. Join the DeFi advertising revolution and unlock your advertising potential with Zenith today.

### Advertisers

To create a campaign, the advertiser need to provide the budget (which will be transferred to the smart contract) and a base cost per click. This base cost per click will be used for the ad bidding auction as well as deciding the cost of an ad click (explained in more detail in further sections).

Campaign metadata like `name`, `description`, `url` and `created_time` are stored in Space and Time (SxT) tables. A SxT identifier to this metadata is returned which is stored in the smart contract.

The advertiser can enable or disable a campaign at any time.

### Publishers

Publishers are website owners, who can copy a snippet of JavaScript code from the Zenith "Settings" page, and then add it to their websites. This code will fetch the winning ad (after the decentralized auction) from the smart contract and show it to the users.

Publishers will be paid only for valid ad clicks by their users:
  - User need to have MetaMask wallet installed
  - Need to have a Gitcoin Passport score of 15
  - A user can click on an ad only once

### Ad Targeting

Advertisers have the option for targeting the ads, allowing them to reach specific DeFi user segments based on factors such as wallet activity, transaction history, wallet balance and so on.

The targeting details are stored in SxT tables.

Currently we support the below targeting options:
- Wallet age more than 1 day, 1 week, 1 month
- Wallet activity more than 1 transaction, 5 transactions, 10 transactions
- Wallet balance more than 0.1 MATIC, 1 MATIC, 10 MATIC
- Currently own or previously owned an NFT

These are implemented using SxT SQL:

```sql
SELECT
  TXNS.TXN_COUNT,
  WALLET.BALANCE,
  AGE.WALLET_FIRST_TXN_DATE,
  NFT.TO_ AS OWNED_NFT
FROM
(
  SELECT COUNT(TIME_STAMP) AS TXN_COUNT
  FROM
  (
    SELECT TIME_STAMP
    FROM MUMBAI2.TRANSACTIONS
    WHERE FROM_ADDRESS = :address
    LIMIT 10
  )
) AS TXNS
LEFT JOIN (
  SELECT
    CAST(TIME_STAMP AS DATE) AS WALLET_FIRST_TXN_DATE,
    FROM_ADDRESS
  FROM MUMBAI2.TRANSACTIONS
  WHERE FROM_ADDRESS = :address
  ORDER BY TIME_STAMP ASC
  LIMIT 1
) AS AGE ON AGE.FROM_ADDRESS = :address
LEFT JOIN (
  SELECT TO_
  FROM MUMBAI2.ERC721_TRANSFER
  WHERE TO_ = :address
  LIMIT 1
) AS NFT ON NFT.TO_ = :address
LEFT JOIN (
  SELECT
    WALLET_ADDRESS,
    BALANCE
  FROM MUMBAI2.NATIVE_WALLET
  WHERE
    WALLET_ADDRESS = :address
  ORDER BY TIME_STAMP DESC
  LIMIT 1
) AS WALLET ON WALLET.WALLET_ADDRESS = :address
```

where `:address` is the user's wallet address.

NOTE: The above targeting options are just for demo purposes.

### Decentralised Auction

The auction process is run everytime there is an availability to show an ad. The auction winner is the advertiser who has the highest bid, which is calculated by below formula:

```
bid = 0.7 * base cost per click + 0.2 * Gitcoin Passport score + 0.1 * remaining balance of campaign.
```

This bid is used only to determine the auction winner. The cost per click is calculated using a different formula ([explained here](#calculation-of-rewards)).

### Ad Clicks

Only users with a [Gitcoin Passport](https://passport.gitcoin.co/#/dashboard) having a minimum score of 15 (same score used for [Gitcoin Grants](https://explorer.gitcoin.co/#/)) can click on ads. This is to prevent users from creating multiple accounts and clicking on ads to earn more rewards.

Users can increase their Gitcoin Passport score by adding stamps to their passport. Once they have added enough stamps, they can submit their passport to recalculate their score. Read more about Gitcoin Passport stamps [here](https://support.gitcoin.co/gitcoin-knowledge-base/gitcoin-passport/common-questions/how-is-gitcoin-passports-score-calculated).

A user can click on an ad only once per campaign, and shall see only active campaigns.

When a user clicks on an ad, the ad click data like `campaign_id`, `user_address`, `click_time` and `country` are stored in SxT. The country detection happen through Vercel.

When a publisher requests pending rewards from ad clicks, this triggers a request to the SxT through [Chainlink Direct Requests](https://docs.spaceandtime.io/docs/chainlink-direct-requests), and retrieve all pending ad clicks for this publisher. The smart contract (inside Oracle fulfillment) will then verify the signature of the ad clicks, and calculate the cost of each ad click.

Once the rewards are calculated, they are transferred from the smart contract to the publisher's wallet.

### Calculation of rewards

The cost of an ad click is calculated using the following formula:

```
cost_per_click = campaign_base_cost_per_click * country_CPI * big_mac_index
```

Example: if the yoy CPI of UK is 8.7%, base cost per click for the campaign is 0.002 MATIC, and Big Mac Index for UK is 0.904, then the cost of the ad click will be 0.001965296 MATIC.

```
cost_per_click = 0.002 MATIC * 1.087 * 0.904 = 0.001965296 MATIC
```

The current year-over-year CPI of all countries supported are fetched from Truflation once a day (using GitHub Actions). If the CPI of a country is not available, then its taken as 1.000.

> The big mac index was invented by The Economist in 1986 as a lighthearted guide to whether currencies
> are at their “correct” level. It is based on the theory of purchasing-power parity (PPP), the notion
> that in the long run exchange rates should move towards the rate that would equalise the prices of an
> identical basket of goods and services (in this case, a burger) in any two countries.
>
> Read more: https://www.economist.com/big-mac-index

The Big Mac index is fetched from https://github.com/TheEconomist/big-mac-data.

If the Big Mac index of the country is not available, 0.500 is used as the index.

## How to run it locally

You need to have the NodeJS v18 installed in your system. You can use NVM to install it:

```sh
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

$ nvm install 18
$ node -v
v18.16.0

$ nvm use 18
$ npm ci
```

Then use below command to run it locally:

```sh
$ npm run dev
```

## How I built it

### Frontend
The web app is built using React and NextJS and is hosted on Vercel.

- `Material UI` = the react component library used to build the app
- `Ethers.js` = for interacting with the Polygon Mumbai smart contracts

### Backend
Backend is comprised of a few APIs hosted on Vercel.

- `/api/campaign`
  - `GET` = search for campaign metadata in SxT
  - `POST` = create a new campaign metadata in SxT, which returns a cid that is stored in `Zenith.sol`
- `/api/click`
  - `POST` = store ad click data in SxT
  - `GET` = search for pending ad clicks of a user (used by the Chainlink Oracle request)
- `/api/cpi`
  - `POST` = called by GitHub Actions to trigger the smart contract which uses Chainlink and Truflation to update the cpi of all countries supported
- `/api/passport/score/:address`
  - `GET` = get the Gitcoin passport score of a user
- `/api/passport`
  - `POST` = submit passport of a user to recalculate the score
- `/api/stats`
  - `GET` = get stats of like total campaigns, ad clicks and current deposit value
- `/api/targeting/:address`
  - `GET` = get targeting details of a user using SxT

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

- The cost per ad click, which is calculated using the base cost per click from the campaign, the current year-over-year CPI of the country and the Big Mac index of the user's country.

- UI/UX. Clean and modern responsive design created from scratch.

## What I learnt

- Though I had been a Solidity learner for quite some time, this hackathon has helped me learn more, with respect to solidity code, debugging, testnets, oracles, and so on.

## What's next for Zenith

- Add support for more countries and currencies.
- Add support for more ad types like video, audio, etc.
- Add support for more ad metrics like impressions, conversions, etc.
