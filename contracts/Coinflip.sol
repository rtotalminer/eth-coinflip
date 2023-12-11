// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./VRFv2Consumer.sol";

contract Coinflip is VRFv2Consumer
{
    event FlipStarted(uint256 requestId, address better, uint256 stake, uint256 bet);
    event FlipFinish(uint256 requestId, address better, uint256 stake, bool decision);

    struct BetStatus {
        address better;
        uint256 stake;
        uint256 bet;
        bool decision;
        uint256 payout;
    }

    mapping(uint256 => BetStatus) public bets;
    
    constructor(
        uint64 subscriptionId,
        address coordinator
    )
    VRFv2Consumer(
        subscriptionId,
        coordinator,
        address(this)
    )
    {
    }

    function flip(uint256 bet) public payable
    {
        require(bet <= 1, "The bet must either be 0 or 1");
        uint256 requestId = this.requestRandomWords();
        emit FlipStarted(requestId, msg.sender, msg.value, bet);
        uint256 payout = msg.value + msg.value/2;
        BetStatus memory betStatus = BetStatus(msg.sender, msg.value, bet, false, payout);
        bets[requestId] = betStatus;
    }

    function fulfillRandomWords(uint256 _requestId, uint256[] memory _randomWords) internal override
    {
        super.fulfillRandomWords(_requestId, _randomWords);
        
        uint256 headstails = 1;
        if (_randomWords[0] % 2 == 0) {
            headstails = 0;
        }

        if (headstails == bets[_requestId].bet) {
            bets[_requestId].decision = true;
        }

        emit FlipFinish(
            _requestId,
            bets[_requestId].better,
            bets[_requestId].stake,
            bets[_requestId].decision
        );
    }
    
}

