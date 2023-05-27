// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "./Utils.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract Truflation is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    mapping(string => uint) public cpi;
    mapping(bytes32 => string) public requests;

    uint public fee = 1 ether;
    address public oracleId = 0x6D141Cf6C43f7eABF94E288f5aa3f23357278499;
    bytes32 public jobId = bytes32(bytes("d220e5e687884462909a03021385b7ae"));

    constructor(address token_) ConfirmedOwner(msg.sender) {
        setChainlinkToken(token_);
    }

    function requestCPI(
        string memory country_
    ) public returns (bytes32 requestId) {
        string memory data_ = string(
            abi.encodePacked('{"location":"', country_, '"}')
        );

        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.receiveCPI.selector
        );
        req.add("service", "truflation/current");
        req.add("data", data_);
        req.add("keypath", "yearOverYearInflation");
        req.add("abi", "json");

        requestId = sendChainlinkRequestTo(oracleId, req, fee);

        requests[requestId] = country_;
    }

    function receiveCPI(
        bytes32 _requestId,
        bytes memory _data
    ) public recordChainlinkFulfillment(_requestId) {
        string memory _country = requests[_requestId];
        cpi[_country] = (1e18 + Utils.stringToUint(string(_data))) / 1e14;
    }

    function multiplyByCPI(uint amount_, string memory country_) public view returns (uint) {
        return amount_ * getCPI(country_) / 1e4;
    }

    function getCPI(string memory country_) private view returns (uint) {
        if (cpi[country_] == 0) {
            return 1e4;
        } else {
            return cpi[country_];
        }
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }
}
