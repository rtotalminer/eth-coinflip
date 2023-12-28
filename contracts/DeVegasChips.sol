// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import './Coinflip.sol';

contract Bank is Ownable {

    DeVegasChips public CHIPS_TOKEN;
    address public CHIPS_TOKEN_ADDRESS;

    mapping(address => bool) AUTHORISED_CROUPIERS;

    uint256 ETH_CHIPS_EXCHANGE_RATE = 1_000_000;
    uint256 ETH_CHIPS_MINT_TAX_PERCENTAGE = 10;
    uint256 ETH_CHIPS_REDEEM_TAX_PERCENTAGE = 10;
    uint256 MAX_WITHDRAWAL_PERCENTAGE = 30;

    constructor()
    Ownable(msg.sender) {
        CHIPS_TOKEN = new DeVegasChips(address(this));
        CHIPS_TOKEN_ADDRESS = address(CHIPS_TOKEN);
    }

    function mintChips() public payable {
        uint256 fee = (msg.value * ETH_CHIPS_MINT_TAX_PERCENTAGE) / 100;
        uint256 weiAmount = (msg.value - fee);
        CHIPS_TOKEN.mint(msg.sender, weiAmount * ETH_CHIPS_EXCHANGE_RATE);
    }

    function redeemChips(uint256 amount) public {
        uint256 weiAmount = amount / ETH_CHIPS_EXCHANGE_RATE;
        uint256 fee = (weiAmount * ETH_CHIPS_REDEEM_TAX_PERCENTAGE) / 100;
        uint256 redeemWeiAmount = (weiAmount - fee);
        require(redeemWeiAmount <= maxWithdrawal());

        CHIPS_TOKEN.burn(msg.sender, amount);
        payable(msg.sender).transfer(redeemWeiAmount);
    }

    function addAuthorisedCroupier(address _address) public onlyOwner {
        AUTHORISED_CROUPIERS[_address] = true;
    }

    function croupierBurn(uint256 amount, address account) public returns (bool) {
        require(AUTHORISED_CROUPIERS[msg.sender], "Unauthorised Croupier!");
        CHIPS_TOKEN.burn(account, amount);
        return true;
    }

    function croupierMint(uint256 amount, address account) public returns (bool){
        require(AUTHORISED_CROUPIERS[msg.sender], "Unauthorised Croupier!");
        CHIPS_TOKEN.mint(account, amount);
        return true;
    }

    function maxWithdrawal() internal view returns (uint256) {
        return ((address(this).balance) * MAX_WITHDRAWAL_PERCENTAGE) / 100;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}

// burn on exernal transfer to stop chip  abritrage

//override trasner to only allow the bank

// a bank contrrolled ErC20 essentially
contract DeVegasChips is ERC20, ERC20Burnable, Ownable {

    constructor(address initialOwner)
        ERC20("DeVegas Chips", "CHIPS")
        Ownable(initialOwner)
    {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(address account, uint256 amount) public onlyOwner {
        _burn(account, amount);
    }


}