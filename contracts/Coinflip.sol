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
    mapping(address => uint256) public debts;

    constructor (
        uint64 subscriptionId,
        address coordinator
    )
    VRFv2Consumer(subscriptionId, coordinator, address(this)) {  }

    function calculatePayout(uint256 value) pure internal returns (uint256)
    {
        return value / 2;
    }

    function flip(CoinDecision _bet) public payable returns (uint256 requestId)
    {
        require(_bet == CoinDecision.HEADS || _bet == CoinDecision.TAILS, "The bet must be valid.");
        require(hasPlayerBet[msg.sender] == false, "There is a flip already in progress.");

        hasPlayerBet[msg.sender] = true;
        
        uint256 _requestId = this.requestRandomWords();

        Bet memory bet = Bet(
            _requestId,
            msg.sender,
            msg.value,
            _bet,
            CoinDecision.UNDECIDED,
            calculatePayout(msg.value)
        );

        bets[_requestId] = bet;
        return _requestId;
    }

    // This should only be allowed be called ONCE/FULFILLMENT IMPORTANT!
    function fulfillRandomWords(uint256 _requestId, uint256[] memory _randomWords) internal override
    {
        CoinDecision decision;
        uint256 outcome = _randomWords[0] % 2;
        
        if (outcome == 0) { decision = CoinDecision.HEADS; }
        if (outcome == 1) { decision = CoinDecision.TAILS; }

        if (bets[_requestId].prediction == decision) {
            debts[bets[_requestId].player] += bets[_requestId].payout;
        }
        
        bets[_requestId].outcome = decision;
        hasPlayerBet[bets[_requestId].player] = false;
        
        super.fulfillRandomWords(_requestId, _randomWords);
    }

    function withdraw() public
    {
        require(debts[msg.sender] < address(this).balance, "The bank cannot fulfill the withdraw.");
        payable(msg.sender).transfer(debts[msg.sender]);
        
    }
}
