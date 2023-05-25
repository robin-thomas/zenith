/* eslint-disable no-console */
import { ethers } from 'hardhat';

async function main() {
  const AppContract = await ethers.getContractFactory('Zenith');

  const appContract = await AppContract.deploy(
    '0xf6b18242dab7af6F7390505fCFd16e03F61F8bCB',
    '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'
  );

  await appContract.deployed();

  console.log(`Contract deployed to ${appContract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
