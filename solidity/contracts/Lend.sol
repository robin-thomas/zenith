// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/UserRequest.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Lend is UserRequest {
    string public jobId;
    string public latestError;
    string[][] public currentResponse;

    struct AdClick {
        string campaignId;
        string country;
        string user;
        string signature;
    }

    mapping(address => AdClick) adClicks;
    mapping(bytes32 => address) requests;
    mapping(address => uint) lastProcessed;

    event SxTQueryRequest(string sqlText);
    event SxTQueryResponse(string[] response);

    constructor(
        ISxTRelayProxy sxtRelayAddress,
        LinkTokenInterface chainlinkTokenAddress
    ) UserRequest(sxtRelayAddress, chainlinkTokenAddress, msg.sender) {
        jobId = "bc97c680d2924f31a0581d947314cc64";
    }

    function calculateRewards(
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
                "SELECT * FROM ",
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
            this.saveQueryResponse.selector,
            jobId
        );

        requests[requestId] = msg.sender;
        lastProcessed[msg.sender] = block.timestamp;

        emit SxTQueryRequest(_query);
    }

    function saveQueryResponse(
        bytes32 _requestId,
        string[][] calldata _data,
        string calldata errorMessage
    ) external payable onlySxTRelay {
        latestError = errorMessage;
        delete currentResponse;

        address _user = requests[_requestId];

        for (uint _index = 0; _index < _data.length; _index++) {
            uint256 inLength = _data[_index].length;
            string[] memory row = new string[](inLength);
            for (uint256 j = 0; j < inLength; j++) {
                row[j] = _data[_index][j];
            }

            currentResponse.push(row);

            // // TODO: verify the signature.
            // AdClick memory _adClick = AdClick({
            //     campaignId: _data[_index][0],
            //     country: _data[_index][3],
            //     user: _data[_index][2],
            //     signature: _data[_index][4]
            // });

            // adClicks[msg.sender] = _adClick;

            uint _reward = 0.006 * 1e18;
            payable(_user).transfer(_reward);
        }
    }

    function getResponse() public view returns (string[] memory) {
        return currentResponse[0];
    }

    receive() external payable {}
}
