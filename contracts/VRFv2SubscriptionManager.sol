// SPDX-License-Identifier: MIT
// An example of a consumer contract that also owns and manages the subscription
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract VRFv2SubscriptionManager is Ownable
{
    VRFCoordinatorV2Interface COORDINATOR;
    LinkTokenInterface LINKTOKEN;

    // The gas lane to use, which specifies the maximum gas price to bump to.
    // For a list of available gas lanes on each network,
    bytes32 keyHash;
    address linkToken;

    // Storage parameters
    uint64 public s_subscriptionId;
    address public s_owner;
    address[] public consumers;

    constructor(
        address _vrfCoordinator,
        bytes32 _keyHash,
        address _linkToken
    )
    Ownable(msg.sender)
    {
        COORDINATOR = VRFCoordinatorV2Interface(_vrfCoordinator);
        LINKTOKEN = LinkTokenInterface(_linkToken);
        
        //Create a new subscription when you deploy the contract.
        s_subscriptionId = COORDINATOR.createSubscription();

        keyHash = _keyHash;
        linkToken = _linkToken;
    }

    // Assumes this contract owns link.
    // 1000000000000000000 = 1 LINK
    function topUpSubscription(uint256 amount) external onlyOwner
    {
        LINKTOKEN.transferAndCall(
            address(COORDINATOR),
            amount,
            abi.encode(s_subscriptionId)
        );
    }

    function getBalance() external view returns (uint256)
    {
        return LINKTOKEN.balanceOf(address(this));
    }

    function addConsumer(address consumerAddress) external onlyOwner
    {
        // Add a consumer contract to the subscription.
        COORDINATOR.addConsumer(s_subscriptionId, consumerAddress); 
        //consumers(consumerAddress);
    }

    function removeConsumer(address consumerAddress) external onlyOwner
    {
        // Remove a consumer contract from the subscription.
        COORDINATOR.removeConsumer(s_subscriptionId, consumerAddress);
    }

    function cancelSubscription(address receivingWallet) external onlyOwner
    {
        // Cancel the subscription and send the remaining LINK to a wallet address.
        COORDINATOR.cancelSubscription(s_subscriptionId, receivingWallet);
        s_subscriptionId = 0;
    }

    // Transfer this contract's funds to an address.
    // 1000000000000000000 = 1 LINK
    function withdraw(uint256 amount, address to) external onlyOwner
    {
        LINKTOKEN.transfer(to, amount);
    }
}
