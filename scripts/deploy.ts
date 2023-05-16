import { ethers } from "hardhat";

async function main() {
  const Lock = await ethers.getContractFactory("Zenith");

  /**
   * @refer https://whitepaper.truflation.com/dev-guides/network-endpoints#mumbai-testnet-chain-id-80001
   */
  const lock = await Lock.deploy(
    "0x17dED59fCd940F0a40462D52AAcD11493C6D8073",
    "b04c2a85143c43089c1befe7c41dea93",
    (10**16).toString(),
    "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"
  );

  await lock.deployed();

  console.log(`Contract deployed to ${lock.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
