// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract VRFv2Consumer is VRFConsumerBaseV2, Ownable
{
    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);

    struct RequestStatus {
        bool fulfilled;
        bool exists;
        uint256[] randomWords;
    }
    mapping(uint256 => RequestStatus) public s_requests;
    VRFCoordinatorV2Interface COORDINATOR;

    // past requests Id.
    uint256[] public requestIds;
    uint256 public lastRequestId;

    // https://docs.chain.link/docs/vrf/v2/subscription/supported-networks/#configurations
    uint64 public s_subscriptionId;
    address public coordinator;
    bytes32 keyHash;
    uint32 callbackGasLimit = 2500000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 2;

    constructor(
        uint64 subscriptionId,
        address _coordinator,
        bytes32 _keyHash,
        address owner
    )
        VRFConsumerBaseV2(_coordinator)
        Ownable(owner)
    {
        COORDINATOR = VRFCoordinatorV2Interface(
            _coordinator
        );
        coordinator = _coordinator;
        s_subscriptionId = subscriptionId;
        keyHash = _keyHash;
    }

    function requestRandomWords()
    external onlyOwner
    returns (uint256 requestId)
    {
        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        s_requests[requestId] = RequestStatus({
            randomWords: new uint256[](0),
            exists: true,
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, numWords);
        return requestId;
    }

    // What to do when the random numbers have been generated
    function fulfillRandomWords(uint256 _requestId, uint256[] memory _randomWords)
    internal override virtual
    {
        require(s_requests[_requestId].exists, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        emit RequestFulfilled(_requestId, _randomWords);
    }

    function getRequestStatus(uint256 _requestId)
    external view
    returns (bool fulfilled, uint256[] memory randomWords)
    {
        require(s_requests[_requestId].exists, "request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.fulfilled, request.randomWords);
    }
}
