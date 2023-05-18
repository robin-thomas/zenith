// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import '@openzeppelin/contracts/utils/math/SafeMath.sol';

contract Zenith is ChainlinkClient, ConfirmedOwner {
    using SafeMath for uint256;
    using Chainlink for Chainlink.Request;
    using ECDSA for bytes32;

    struct Campaign {
        uint id;
        address advertiser;
        uint budget;
        uint remaining;
        uint minCostPerClick;
        string name;
        string url;
        bool active;
        uint startDatetime;
        uint endDatetime;
    }

    struct AdClick {
        uint id;
        uint campaignId;
        uint costPerClick;
        uint displayTime;
        address user;
        bool paid;
        string country;
        bytes signature;
    }

    struct CampaignWithAdClicks {
        Campaign campaign;
        AdClick[] adClicks;
    }

    mapping(uint => Campaign) campaigns;
    mapping(uint => AdClick) adClicks;
    mapping(uint => uint[]) adClicksOfCampaign;
    mapping(address => uint[]) campaignsOfAdvertiser;
    mapping(address => mapping(uint => uint)) rewardsOfUser;

    uint public numCampaigns = 0;
    uint public numAdClicks = 0;
    uint public totalRewards = 0;

    address public oracleId;
    string public jobId;
    uint256 public fee;

    mapping(bytes32 => string) public requests;
    mapping (string => uint) costPerClicks;

    event CampaignCreated(uint _campaigns, address _advertiser, uint _budget);
    event CampaignEnabled(uint _campaignId);
    event CampaignDisabled(uint _campaignId);
    event CampaignClickDataUpdated();

    constructor(
        address _oracleId,
        string memory _jobId,
        uint _fee,
        address _token
    ) ConfirmedOwner(msg.sender) {
	    setChainlinkToken(_token);

        oracleId = _oracleId;
        jobId = _jobId;
        fee = _fee;
    }

    function createCampaign(
        uint _budget,
        uint _minCostPerClick,
        uint _endDatetime,
        string memory _name,
        string memory _url
    ) public payable returns (uint) {
        require(_budget > 0, "Budget must be greater than 0");
        require(msg.value == _budget, "Insufficient funds sent");
        require(_minCostPerClick > 0, "Bid must be greater than 0");
        require(_endDatetime >= block.timestamp + 1 days, "End datetime must be in the future");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_url).length > 0, "URL cannot be empty");

        Campaign memory campaign = Campaign({
            id: numCampaigns,
            advertiser: msg.sender,
            budget: _budget,
            remaining: _budget,
            minCostPerClick: _minCostPerClick,
            name: _name,
            url: _url,
            active: true,
            startDatetime: block.timestamp,
            endDatetime: _endDatetime
        });

        campaigns[campaign.id] = campaign;
        campaignsOfAdvertiser[campaign.advertiser].push(campaign.id);

        numCampaigns++;

        emit CampaignCreated(campaign.id, msg.sender, _budget);

        return campaign.id;
    }

    function enableCampaign(uint campaignId) public isAdvertiser(campaignId) {
        campaigns[campaignId].active = true;
    }

    function disableCampaign(uint campaignId) public isAdvertiser(campaignId) {
        campaigns[campaignId].active = false;
    }

    function getCampaignsOfAdvertiser() public view returns (CampaignWithAdClicks[] memory) {
        uint _numCampaigns = campaignsOfAdvertiser[msg.sender].length;
        CampaignWithAdClicks[] memory _campaigns = new CampaignWithAdClicks[](_numCampaigns);

        for (uint _index = 0; _index < _numCampaigns; _index++) {
            uint _campaignId = campaignsOfAdvertiser[msg.sender][_index];
            _campaigns[_index].campaign = campaigns[_campaignId];
            _campaigns[_index].adClicks = getAdClicksOfCampaign(_campaignId);
        }

        return _campaigns;
    }

    function getAvailableCampaigns() public view returns (Campaign[] memory) {
        uint _numCampaigns = 0;
        for (uint _campaignId = 0; _campaignId < numCampaigns; _campaignId++) {
            if (isAvailableCampaign(_campaignId)) {
                _numCampaigns++;
            }
        }

        Campaign[] memory _campaigns = new Campaign[](_numCampaigns);

        for (uint _campaignId = 0; _campaignId < numCampaigns; _campaignId++) {
            if (isAvailableCampaign(_campaignId)) {
                _campaigns[--_numCampaigns] = campaigns[_campaignId];
            }
        }

        return _campaigns;
    }

    function recordAdClicks(AdClick[] memory _adClicks) external {
        for (uint _index = 0; _index < _adClicks.length; _index++) {
            bytes32 messageHash = keccak256(
                abi.encodePacked(
                    address(this),
                    _adClicks[_index].user,
                    _adClicks[_index].campaignId,
                    _adClicks[_index].displayTime,
                    _adClicks[_index].country
                )
            );

            address _account = messageHash.toEthSignedMessageHash().recover(_adClicks[_index].signature);
            if (_adClicks[_index].user == _account) {
                uint _costPerClick = costPerClicks[_adClicks[_index].country];
                _costPerClick = Math.min(_costPerClick, campaigns[_adClicks[_index].campaignId].remaining);

                uint _campaignId = _adClicks[_index].campaignId;

                _adClicks[_index].id = numAdClicks;
                _adClicks[_index].costPerClick = _costPerClick;
                _adClicks[_index].paid = false;

                adClicks[_adClicks[_index].id] = _adClicks[_index];

                adClicksOfCampaign[_campaignId].push(_adClicks[_index].id);
                rewardsOfUser[_adClicks[_index].user][_campaignId] = _adClicks[_index].id;

                campaigns[_campaignId].remaining -= _costPerClick;

                ++numAdClicks;
                totalRewards += _costPerClick;
            }
        }
    }

    function requestCPI(
        string memory _country,
        string memory multiplier
    ) public returns (bytes32 requestId) {
        require(LinkTokenInterface(chainlinkTokenAddress()).transferFrom(msg.sender, address(this), fee), "LINK transfer failed");

        Chainlink.Request memory req = buildChainlinkRequest(
            bytes32(bytes(jobId)),
            address(this),
            this.fulfillCPI.selector
        );
        req.add("service", "truflation/current");
        req.add("data", string(abi.encodePacked("{\"location\":\"", _country, "\"}")));
        req.add("abi", "uint256");
        req.add("multiplier", multiplier);
        req.add("refundTo", Strings.toHexString(uint160(msg.sender), 20));

        requests[requestId] = _country;

        return sendChainlinkRequestTo(oracleId, req, fee);
    }

    function fulfillCPI(bytes32 _requestId, uint256 _data) public recordChainlinkFulfillment(_requestId) {
        string memory _country = requests[_requestId];
        costPerClicks[_country] = _data;
    }

    function isAvailableCampaign(uint _campaignId) private view returns (bool) {
        Campaign memory campaign = campaigns[_campaignId];

        uint _adClickId = rewardsOfUser[msg.sender][_campaignId];

        return campaign.active &&
            campaign.endDatetime > block.timestamp &&
            adClicks[_adClickId].displayTime == 0;
    }

    function getAdClicksOfCampaign(uint _campaignId) private view returns (AdClick[] memory) {
        AdClick[] memory _adClicks = new AdClick[](adClicksOfCampaign[_campaignId].length);

        for (uint _index = 0; _index < adClicksOfCampaign[_campaignId].length; _index++) {
            _adClicks[_index] = adClicks[adClicksOfCampaign[_campaignId][_index]];
        }

        return _adClicks;
    }

    modifier isAdvertiser(uint campaignId) {
      require(msg.sender == campaigns[campaignId].advertiser);
      _;
    }
}
