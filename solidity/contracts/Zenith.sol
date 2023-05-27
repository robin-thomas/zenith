// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Truflation.sol";
import "./Utils.sol";
import "./interfaces/UserRequest.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

/**
 * @dev Main app contract.
 */
contract Zenith is UserRequest {
    using SafeMath for uint256;
    using ECDSA for bytes32;

    /** @dev https://github.com/SxT-Community/chainlink-hackathon/blob/main/README.md */
    string public jobId = "bc97c680d2924f31a0581d947314cc64";

    Truflation truflationContract;

    /**
     * @dev Store the details of a campaign.
     */
    struct Campaign {
        uint id;
        address advertiser;
        uint budget;
        uint remaining;
        uint baseCostPerClick;
        uint endDatetime;
        string cid;
        bool active;
    }

    /**
     * @dev Store the details of an ad click.
     */
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

    /**
     * @dev lookup a campaign by its id.
     */
    mapping(uint => Campaign) campaigns;

    /**
     * @dev lookup of all ad clicks made for a campaign.
     */
    mapping(uint => AdClick[]) adClicksOfCampaign;

    /**
     * @dev lookup of all campaigns created by an advertiser.
     */
    mapping(address => uint[]) campaignsOfAdvertiser;

    /**
     * @dev lookup of all ad clicks paid out to a user.
     */
    mapping(address => mapping(uint => uint)) rewardsOfUser;

    /**
     * @dev store the last time a user's ad clicks were retrived from SxT.
     */
    mapping(address => uint) lastProcessed;

    /**
     * @dev mapping of Chainlink request ID to the address of a user who requested reward.
     */
    mapping(bytes32 => address) public requests;

    uint public numCampaigns = 0;
    uint public numAdClicks = 0;
    uint public totalRewards = 0;

    event CampaignCreated(uint _campaigns, address _advertiser, uint _budget);
    event CampaignEnabled(uint _campaignId);
    event CampaignDisabled(uint _campaignId);

    constructor(
        ISxTRelayProxy sxtRelayAddress,
        LinkTokenInterface chainlinkTokenAddress,
        address truflationContractAddress
    ) UserRequest(sxtRelayAddress, chainlinkTokenAddress, msg.sender) {
        truflationContract = Truflation(truflationContractAddress);
    }

    /**
     * @dev Create a new campaign.
     *
     * @param _budget The total budget of the campaign.
     * @param _baseCostPerClick The base cost per click of the campaign.
     * @param _endDatetime The end datetime of the campaign.
     * @param _cid The cid of the campaign to lookup the campaign details from SxT.
     * @return The id of the campaign.
     */
    function createCampaign(
        uint _budget,
        uint _baseCostPerClick,
        uint _endDatetime,
        string memory _cid
    ) public payable returns (uint) {
        require(_budget > 0, "Budget must be greater than 0");
        require(msg.value == _budget, "Insufficient funds sent");
        require(_baseCostPerClick > 0, "Bid must be greater than 0");
        require(
            _endDatetime >= block.timestamp + 1 days,
            "End datetime must be in the future"
        );
        require(bytes(_cid).length > 0, "Cid cannot be empty");

        Campaign memory _campaign = Campaign({
            id: numCampaigns,
            advertiser: msg.sender,
            budget: _budget,
            remaining: _budget,
            baseCostPerClick: _baseCostPerClick,
            cid: _cid,
            active: true,
            endDatetime: _endDatetime
        });

        campaigns[_campaign.id] = _campaign;
        campaignsOfAdvertiser[_campaign.advertiser].push(_campaign.id);

        numCampaigns++;

        emit CampaignCreated(_campaign.id, msg.sender, _budget);

        return _campaign.id;
    }

    /**
     * @dev Enable a campaign.
     *
     * @param _campaignId The id of the campaign.
     */
    function enableCampaign(uint _campaignId) public isAdvertiser(_campaignId) {
        campaigns[_campaignId].active = true;
        emit CampaignEnabled(_campaignId);
    }

    /**
     * @dev Disable a campaign.
     *
     * @param _campaignId The id of the campaign.
     */
    function disableCampaign(
        uint _campaignId
    ) public isAdvertiser(_campaignId) {
        campaigns[_campaignId].active = false;
        emit CampaignDisabled(_campaignId);
    }

    /**
     * @dev Get all campaigns of an advertiser.
     *
     * @return An array of campaigns.
     */
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

    /**
     * @dev Get all campaigns available for a user to click.
     *
     * @return An array of campaigns.
     */
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

    /**
     * @dev Check if a campaign is available for a user to click.
     *
     * @param _campaignId The id of the campaign.
     * @return True if the campaign is available for a user to click.
     */
    function isAvailableCampaign(uint _campaignId) private view returns (bool) {
        Campaign memory _campaign = campaigns[_campaignId];

        return
            _campaign.active &&
            _campaign.endDatetime > block.timestamp &&
            rewardsOfUser[msg.sender][_campaignId] == 0;
    }

    /**
     * @dev Get all pending ad clicks of a user from SxT
     *
     * @param _resourceId The resource id of the ad clicks table in SxT.
     * @return _requestId The Chainlink request id.
     */
    function triggerRetrieveRewards(
        string memory _resourceId
    ) external nonReentrant returns (bytes32 _requestId) {
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

        _requestId = getSxTRelayContract().requestQueryString2D(
            _query,
            _resourceId,
            address(this),
            this.recordAdClicks.selector,
            jobId
        );

        requests[_requestId] = msg.sender;
        lastProcessed[msg.sender] = block.timestamp;
    }

    /**
     * @dev Record pending ad clicks of a user from SxT.
     *
     * @param _requestId The Chainlink request id.
     * @param _data The ad clicks data in 2D array form.
     *
     * Requirements:
     * - can be called only by the SxT relay contract.
     */
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
                uint _costPerClick = truflationContract.multiplyByCPI(
                    campaigns[_campaignId].baseCostPerClick,
                    _data[_index][2]
                );
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

    /**
     * @dev Get the last processed reward request of a user.
     */
    function getLastProcessed() public view returns (uint) {
        return lastProcessed[msg.sender];
    }

    /**
     * @dev Calculate the total rewards paid to a user.
     *
     * @return The rewards of a user.
     */
    function getRewardsOfUser()
        public
        view
        returns (RewardWithAdClicks memory)
    {
        uint _rewards = 0;
        uint _adClicks = 0;
        for (uint _campaignId = 0; _campaignId < numCampaigns; _campaignId++) {
            uint _reward = rewardsOfUser[msg.sender][_campaignId];
            if (_reward > 0) {
                _rewards += _reward;
                ++_adClicks;
            }
        }

        return RewardWithAdClicks({reward: _rewards, adClicks: _adClicks});
    }

    /**
     * @dev Request update of CPI using Truflation.
     *
     * @param _country The country to update CPI.
     * @return _requestId The Chainlink request id.
     */
    function requestCPI(
        string memory _country
    ) public returns (bytes32 _requestId) {
        return truflationContract.requestCPI(_country);
    }

    /**
     * @dev Retrieve the signer from an ethereum signature
     *
     * @param _campaignId The id of the campaign.
     * @param _displayTime The time the ad was displayed.
     * @param _signature The signature of the clicker.
     * @return The address of the clicker from the signature.
     */
    function getClickerFromSignature(
        uint _campaignId,
        uint _displayTime,
        bytes memory _signature
    ) private pure returns (address) {
        bytes32 _hash = keccak256(abi.encodePacked(_campaignId, _displayTime));
        bytes32 _message = ECDSA.toEthSignedMessageHash(_hash);

        return ECDSA.recover(_message, _signature);
    }

    /**
     * @dev Withdraw LINK from this contract.
     *
     * Requirements:
     * - can be called only by the owner.
     */
    function withdrawLink() public onlyOwner {
        LinkTokenInterface _link = getChainlinkToken();
        require(
            _link.transfer(msg.sender, _link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }

    modifier isAdvertiser(uint campaignId) {
        require(msg.sender == campaigns[campaignId].advertiser);
        _;
    }
}
