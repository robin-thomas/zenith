/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { ethers } from 'hardhat';

const LINK_TOKEN = '0x326C977E6efc84E512bB9C30f76E30c160eD06FB';

async function deployAppContract() {
  const AppContract = await ethers.getContractFactory('Zenith');

  const appContract = await AppContract.deploy(
    '0xf6b18242dab7af6F7390505fCFd16e03F61F8bCB', // SXT Relay Proxy address
    LINK_TOKEN,
    '0x534Edd5fec97D0ae7523F3bEfCa449396ca14eCA' // Truflation contract address
  );

  await appContract.deployed();

  console.log(`Main Contract deployed to ${appContract.address}`);
}

async function deployTruflationContract() {
  const AppContract = await ethers.getContractFactory('Truflation');

  const appContract = await AppContract.deploy(LINK_TOKEN);

  await appContract.deployed();

  console.log(`Truflation Contract deployed to ${appContract.address}`);
}

async function main() {
  return await Promise.all([
    deployAppContract(),
    // deployTruflationContract(),
  ]);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
