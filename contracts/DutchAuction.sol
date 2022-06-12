//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/utils/math/Math.sol';

import 'hardhat/console.sol';

contract DutchAuction {
    event Buy(address winner, uint256 amount);

    address payable public seller;
    uint256 public startingPrice;
    uint256 public auctionStart;
    uint256 public auctionEnd;
    address public winner;

    constructor(
        uint256 _startingPrice,
        uint256 _auctionStart,
        uint256 _auctionEnd
    ) {
        seller = payable(msg.sender);
        startingPrice = _startingPrice;
        auctionStart = _auctionStart;
        auctionEnd = _auctionEnd;
    }

    function buy() external payable {
        require(winner == address(0), 'Auction finished');
        uint256 cost = getCurrentCost();
        require(msg.value >= cost, 'Not enough ether to buy');
        winner = msg.sender;
        emit Buy(winner, msg.value);
        seller.transfer(cost);
        uint refund = msg.value - cost;
        if (refund > 0) {
            payable(msg.sender).transfer(refund);
        }
    }

    function getCurrentCost() public view returns (uint256) {
        return getCost(block.timestamp);
    }

    function getCost(uint256 date) public view returns (uint256) {
        require((date >= auctionStart), 'Auction has not started yet');
        require((date <= auctionEnd), 'Auction has already ended');
        return
            ((auctionEnd - date) * startingPrice) / (auctionEnd - auctionStart);
    }
}
