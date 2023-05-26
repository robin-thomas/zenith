// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Utils.sol";
import "./interfaces/UserRequest.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract Zenith is UserRequest {
    using SafeMath for uint256;
    using ECDSA for bytes32;

    /** @dev https://github.com/SxT-Community/chainlink-hackathon/blob/main/README.md */
    string public jobId = "bc97c680d2924f31a0581d947314cc64";

    struct Campaign {
        uint id;
        address advertiser;
        uint budget;
        uint remaining;
        uint minCostPerClick;
        uint endDatetime;
        string cid;
        bool active;
    }

    struct AdClick {
        uint clickedTime;
        uint costPerClick;
        address user;
        string country;
    }

    struct CampaignWithAdClicks {
        Campaign campaign;
        AdClick[] adClicks;
    }

    struct RewardWithAdClicks {
        uint reward;
        uint adClicks;
    }

    mapping(uint => Campaign) campaigns;
    mapping(uint => AdClick[]) adClicksOfCampaign;
    mapping(address => uint[]) campaignsOfAdvertiser;
    mapping(address => mapping(uint => uint)) rewardsOfUser;

    mapping(address => uint) lastProcessed;
    mapping(bytes32 => address) public requests;

    uint public numCampaigns = 0;
    uint public numAdClicks = 0;
    uint public totalRewards = 0;

    event CampaignCreated(uint _campaigns, address _advertiser, uint _budget);
    event CampaignEnabled(uint _campaignId);
    event CampaignDisabled(uint _campaignId);

    constructor(
        ISxTRelayProxy sxtRelayAddress,
        LinkTokenInterface chainlinkTokenAddress
    ) UserRequest(sxtRelayAddress, chainlinkTokenAddress, msg.sender) {}

    function createCampaign(
        uint _budget,
        uint _minCostPerClick,
        uint _endDatetime,
        string memory _cid
    ) public payable returns (uint) {
        require(_budget > 0, "Budget must be greater than 0");
        require(msg.value == _budget, "Insufficient funds sent");
        require(_minCostPerClick > 0, "Bid must be greater than 0");
        require(
            _endDatetime >= block.timestamp + 1 days,
            "End datetime must be in the future"
        );
        require(bytes(_cid).length > 0, "Cid cannot be empty");

        Campaign memory campaign = Campaign({
            id: numCampaigns,
            advertiser: msg.sender,
            budget: _budget,
            remaining: _budget,
            minCostPerClick: _minCostPerClick,
            cid: _cid,
            active: true,
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
        emit CampaignEnabled(campaignId);
    }

    function disableCampaign(uint campaignId) public isAdvertiser(campaignId) {
        campaigns[campaignId].active = false;
        emit CampaignDisabled(campaignId);
    }

    function getCampaignsOfAdvertiser()
        public
        view
        returns (CampaignWithAdClicks[] memory)
    {
        uint _numCampaigns = campaignsOfAdvertiser[msg.sender].length;
        CampaignWithAdClicks[] memory _campaigns = new CampaignWithAdClicks[](
            _numCampaigns
        );

        for (uint _index = 0; _index < _numCampaigns; _index++) {
            uint _campaignId = campaignsOfAdvertiser[msg.sender][_index];
            _campaigns[_index].campaign = campaigns[_campaignId];
            _campaigns[_index].adClicks = adClicksOfCampaign[_campaignId];
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

    function isAvailableCampaign(uint _campaignId) private view returns (bool) {
        Campaign memory campaign = campaigns[_campaignId];

        return
            campaign.active &&
            campaign.endDatetime > block.timestamp &&
            rewardsOfUser[msg.sender][_campaignId] == 0;
    }

    function triggerRetrieveRewards(
        string memory _resourceId
    ) external nonReentrant returns (bytes32 requestId) {
        require(
            getChainlinkToken().approve(
                address(getSxTRelayContract().impl()),
                getSxTRelayContract().feeInLinkToken()
            ),
            "UserRequest: Insufficient LINK allowance"
        );

        string memory _query = string(
            abi.encodePacked(
                "SELECT campaign_id, clicker, country, signature, viewed_time FROM ",
                _resourceId,
                " WHERE viewed_time > '",
                Strings.toString(lastProcessed[msg.sender]),
                "' AND clicker = '",
                Strings.toHexString(uint160(msg.sender), 20),
                "'"
            )
        );

        requestId = getSxTRelayContract().requestQueryString2D(
            _query,
            _resourceId,
            address(this),
            this.recordAdClicks.selector,
            jobId
        );

        requests[requestId] = msg.sender;
        lastProcessed[msg.sender] = block.timestamp;
    }

    function recordAdClicks(
        bytes32 _requestId,
        string[][] calldata _data
    ) external payable onlySxTRelay {
        uint _rewards = 0;
        address _user = requests[_requestId];

        for (uint _index = 0; _index < _data.length; _index++) {
            uint _campaignId = Utils.stringToUint(_data[_index][0]);
            if (
                rewardsOfUser[_user][_campaignId] > 0 ||
                campaigns[_campaignId].remaining == 0
            ) {
                continue;
            }

            uint _displayTime = Utils.stringToUint(_data[_index][4]);
            bytes memory _signature = Utils.hexStringToBytes(_data[_index][3]);
            address _clicker = getClickerFromSignature(
                _campaignId,
                _displayTime,
                _signature
            );

            if (_user == _clicker) {
                uint _costPerClick = campaigns[_campaignId].minCostPerClick;
                _costPerClick = Math.min(
                    _costPerClick,
                    campaigns[_campaignId].remaining
                );

                AdClick memory _adClick = AdClick({
                    country: _data[_index][2],
                    user: _user,
                    clickedTime: _displayTime,
                    costPerClick: _costPerClick
                });

                adClicksOfCampaign[_campaignId].push(_adClick);
                rewardsOfUser[_user][_campaignId] = _costPerClick;

                campaigns[_campaignId].remaining -= _costPerClick;

                ++numAdClicks;
                _rewards += _costPerClick;
                totalRewards += _costPerClick;
            }
        }

        if (_rewards > 0) {
            payable(_user).transfer(_rewards);
        }
    }

    function getLastProcessed() public view returns (uint) {
        return lastProcessed[msg.sender];
    }

    function getRewardsOfUser()
        public
        view
        returns (RewardWithAdClicks memory)
    {
        uint _rewards = 0;
        uint _adClicks = 0;
        for (uint _campaignId = 0; _campaignId < numCampaigns; _campaignId++) {
            _rewards += rewardsOfUser[msg.sender][_campaignId];
            ++_adClicks;
        }

        return RewardWithAdClicks({reward: _rewards, adClicks: _adClicks});
    }

    function getClickerFromSignature(
        uint campaignId,
        uint displayTime,
        bytes memory signature
    ) private pure returns (address) {
        bytes32 hash = keccak256(abi.encodePacked(campaignId, displayTime));
        bytes32 message = ECDSA.toEthSignedMessageHash(hash);

        return ECDSA.recover(message, signature);
    }

    modifier isAdvertiser(uint campaignId) {
        require(msg.sender == campaigns[campaignId].advertiser);
        _;
    }
}
