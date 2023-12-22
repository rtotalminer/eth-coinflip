// SPDX-License-Identifier: MIT
// An example of a consumer contract that also owns and manages the subscription
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import "./VRFCoordinatorV2InterfaceMock.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract VRFv2SubscriptionManagerMock is Ownable
{
    VRFCoordinatorV2InterfaceMock COORDINATOR;

    // The gas lane to use, which specifies the maximum gas price to bump to.
    // For a list of available gas lanes on each network,
    bytes32 keyHash;

    // Storage parameters
    uint64 public s_subscriptionId;
    address public s_owner;
    address[] public consumers;
    uint256 MIN_AMOUNT = 100000000000000000; // 0.1 ETH

    constructor(
        address _vrfCoordinator,
        bytes32 _keyHash
    )
    Ownable(msg.sender)
    {
        COORDINATOR = VRFCoordinatorV2InterfaceMock(_vrfCoordinator);
        s_subscriptionId = COORDINATOR.createSubscription();
        keyHash = _keyHash;
    }

    // Assumes this contract owns eth.
    // 1000000000000000000 = 1 ETH
    function topUpSubscription(uint96 amount) external onlyOwner
    {
        require(amount >= MIN_AMOUNT, "amount must be greater than or equal to the minimum amount");
        COORDINATOR.fundSubscription(s_subscriptionId, amount);
    }

    function addConsumer(address consumerAddress) external onlyOwner
    {
        // Add a consumer contract to the subscription.
        COORDINATOR.addConsumer(s_subscriptionId, consumerAddress);
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

    function getConsumers() external view returns (address[] memory)
    {
        (,,, address[] memory _consumers) = COORDINATOR.getSubscription(s_subscriptionId);
        return _consumers;
    }

    function getBalance() external view returns (uint256)
    {
        (uint96 balance,,,) = COORDINATOR.getSubscription(s_subscriptionId);
        return balance;
    }

    // Transfer this contract's funds to an address.
    // 1000000000000000000 = 1 LINK
    function withdraw(uint256 amount, address to) external onlyOwner
    {
        payable(to).transfer(amount);
    }
}
