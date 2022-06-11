//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import 'hardhat/console.sol';

import '@openzeppelin/contracts/utils/math/Math.sol';

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

    function getCost(uint256 date) public view returns (uint256) {
        require((date >= auctionStart), "Auction has not started yet");
        require((date <= auctionEnd), "Auction has already ended");
        return
            ((auctionEnd - date) * startingPrice) / (auctionEnd - auctionStart);
    }
}
