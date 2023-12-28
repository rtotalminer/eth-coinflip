// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./VRFv2Consumer.sol";
import './DeVegasChips.sol';

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

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

    //needs antiwhale code and betrer payour calc
    Bank bank; 

    mapping(address => bool) public hasPlayerBet;
    mapping(address => uint256) public playerIds;
    mapping(uint256 => Bet) public bets;

    constructor (
        uint64 subscriptionId,
        address coordinator,
        bytes32 keyHash,
        address bankAddr
    )
    VRFv2Consumer(subscriptionId, coordinator, keyHash, address(this)) {
        bank = Bank(bankAddr);
    }

    function calculatePayout(uint256 value) pure internal returns (uint256)
    {
        return value * 2;
    }

    function flip(CoinDecision _bet, uint256 chips) public returns (uint256 requestId)
    {
        require(_bet == CoinDecision.HEADS || _bet == CoinDecision.TAILS, "The bet must be valid.");
        require(hasPlayerBet[msg.sender] == false, "There is a flip already in progress.");
        require(chips > 0, "You cant be 0 chips...");
        //require(chipsToken.balanceOf(msg.sender), "You do not have enough chips to fulfill this request.");

        // transfer chips make sure it matches amount
        // try require an erc20 transffer to see the number of chips poop up in metemmask?
        require(bank.croupierBurn(chips, msg.sender));

        // bank.transferChips(msg.sender, address(this), chips);

        uint256 _requestId = this.requestRandomWords();

        hasPlayerBet[msg.sender] = true;
        playerIds[msg.sender] = _requestId;

        Bet memory bet = Bet(
            _requestId,
            msg.sender,
            chips,
            _bet,
            CoinDecision.UNDECIDED,
            calculatePayout(chips)
        );

        bets[_requestId] = bet;
        return _requestId;
    }

    // This should only be allowed be called ONCE/FULFILLMENT IMPORTANT!
    function fulfillRandomWords(uint256 _requestId, uint256[] memory _randomWords) internal override
    {
        super.fulfillRandomWords(_requestId, _randomWords);

        CoinDecision decision;
        uint256 outcome = _randomWords[0] % 2;
        
        if (outcome == 0) { decision = CoinDecision.HEADS; }
        if (outcome == 1) { decision = CoinDecision.TAILS; }

        if (bets[_requestId].prediction == decision)
            bank.croupierMint(bets[_requestId].payout, bets[_requestId].player);

        bets[_requestId].outcome = decision;
        hasPlayerBet[bets[_requestId].player] = false;
        playerIds[bets[_requestId].player] = 0;
    }

    function withdraw() public
    {}
}
