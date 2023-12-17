// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./VRFv2Consumer.sol";

contract Coinflip is VRFv2Consumer {

    enum CoinDecision {
        HEADS,
        TAILS,
        UNDECIDED
    }

    struct Bet {
        uint256 requestId;
        address player;
        uint256 stake;
        CoinDecision prediction;
        CoinDecision outcome;
        uint256 payout;
    }

    mapping(address => bool) public hasPlayerBet;
    mapping(uint256 => Bet) public bets;

    constructor (
        uint64 subscriptionId,
        address coordinator
    )
    VRFv2Consumer(subscriptionId, coordinator, address(this)) {  }

    function calculatePayout(uint256 value) pure internal returns (uint256)
    {
        return value;
    }

    function flip(CoinDecision _bet) public payable
    {
        require(_bet == CoinDecision.HEADS || _bet == CoinDecision.TAILS, "The bet must be valid.");
        require(hasPlayerBet[msg.sender] == false, "There is a flip already in progress.");

        hasPlayerBet[msg.sender] = true;
        
        uint256 requestId = this.requestRandomWords();

        Bet memory bet = Bet(
            requestId,
            msg.sender,
            msg.value,
            _bet,
            CoinDecision.UNDECIDED,
            calculatePayout(msg.value)
        );

        bets[requestId] = bet;
    }

    function fulfillRandomWords(uint256 _requestId, uint256[] memory _randomWords) internal override
    {
        CoinDecision decision;
        uint256 outcome = _randomWords[0] % 2;
        
        if (outcome == 0) { decision = CoinDecision.HEADS; }
        if (outcome == 1) { decision = CoinDecision.TAILS; }
        
        bets[_requestId].outcome = decision;
        hasPlayerBet[bets[_requestId].player] = false;
        
        super.fulfillRandomWords(_requestId, _randomWords);
    }
}
