// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "./Utils.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

/**
 * @dev This contract is used to store the current year-over-year CPI of all countries supported by Truflation.
 */
contract Truflation is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    /**
     * @dev Mapping of country code to the timestamp of the last update.
     */
    mapping(string => uint) public lastUpdated;

    /**
     * @dev Mapping of country code to year-over-year CPI
     */
    mapping(string => uint) public cpi;

    /**
     * @dev Mapping of Chainlink request ID to country code
     */
    mapping(bytes32 => string) public requests;

    /**
     * @dev Refer to https://marketplace.truflation.com for more details.
     */
    uint public constant fee = 1 ether;
    address public constant oracleId = 0x6D141Cf6C43f7eABF94E288f5aa3f23357278499;
    bytes32 public constant jobId = bytes32(bytes("d220e5e687884462909a03021385b7ae"));

    error LinkTransferFailed();

    /**
     * @dev Initializes the contract with the address of the LINK token.
     *
     * @param _token The address of the LINK token.
     */
    constructor(address _token) ConfirmedOwner(msg.sender) {
        setChainlinkToken(_token);
    }

    /**
     * @dev Requests the CPI of a country from Truflation using Chainlink.
     *
     * Requirements:
     * - need to enough LINK token in this smart contract
     *
     * @param _country The two letter country code.
     * @return _requestId The Chainlink request ID.
     */
    function requestCPI(
        string calldata _country
    ) public returns (bytes32 _requestId) {
        string memory _data = string(
            abi.encodePacked('{"location":"', _country, '"}')
        );

        Chainlink.Request memory _req = buildChainlinkRequest(
            jobId,
            address(this),
            this.receiveCPI.selector
        );
        _req.add("service", "truflation/current");
        _req.add("data", _data);
        _req.add("keypath", "yearOverYearInflation");
        _req.add("abi", "json");

        _requestId = sendChainlinkRequestTo(oracleId, _req, fee);

        requests[_requestId] = _country;
        lastUpdated[_country] = block.timestamp;
    }

    /**
     * @dev Receives the CPI of a country from Truflation using Chainlink.
     *
     * Requirements:
     * - need to have enough MATIC token in https://mumbai.polygonscan.com/address/0x776f1c12afa523941fd697639eb27d7726f9e482
     *
     * @param _requestId The Chainlink request ID.
     * @param _data The CPI of the country in bytes.
     */
    function receiveCPI(
        bytes32 _requestId,
        bytes calldata _data
    ) public recordChainlinkFulfillment(_requestId) {
        string memory _country = requests[_requestId];
        cpi[_country] = (1e18 + Utils.stringToUint(string(_data))) / 1e14;
    }

    /**
     * @dev Returns the amount multipled by the CPI rate.
     *
     * For example: if the CPI of a country is 2.88%, then the amount will be multiplied by 1.0288.
     * If the CPI of the country is not available, then the amount will be multiplied by 1.0.
     *
     * @param _amount The amount to be multiplied.
     * @param _country The two letter country code.
     * @return The amount multipled by the CPI rate.
     */
    function multiplyByCPI(
        uint _amount,
        string calldata _country
    ) public view returns (uint) {
        return (_amount * getCPI(_country)) / 1e4;
    }

    /**
     * @dev Returns the CPI of a country. If the CPI is not available, returns 1e4.
     * @param _country The two letter country code.
     * @return The CPI of the country multipled by 1e4.
     */
    function getCPI(string calldata _country) private view returns (uint) {
        if (cpi[_country] == 0) {
            return 1e4;
        } else {
            return cpi[_country];
        }
    }

    /**
     * @dev Allows the owner to withdraw the LINK token from this contract.
     *
     * Requirements:
     *
     * - The caller must be the owner.
     */
    function withdrawLink() public onlyOwner {
        LinkTokenInterface _link = LinkTokenInterface(chainlinkTokenAddress());
        if (!_link.transfer(msg.sender, _link.balanceOf(address(this)))) {
            revert LinkTransferFailed();
        }
    }
}
