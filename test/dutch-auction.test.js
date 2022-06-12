const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Dutch Auction', async function () {
  var auctionStartDate;
  var auctionStartDate;
  var price;
  var dutchAuction;
  beforeEach(async function () {
    // Initial setup with deployment of the contract
     auctionStartDate = Math.floor(new Date().getTime() / 1000);
     auctionEndDate = auctionStartDate + 60 * 60 * 24 * 10;
     price = ethers.utils.parseEther('1');
     factory = await ethers.getContractFactory('DutchAuction');
     dutchAuction = await factory.deploy(
       price,
       auctionStartDate,
       auctionEndDate
     );
     await dutchAuction.deployed();
  });
  it('Should have linear drop in price', async function () {
    // We have starting price of 1 ether and auction expires in 10 days
    // so in 9 days price should be 0.1 ether
    const nineDaysFromStart = auctionStartDate + 60 * 60 * 24 * 9;
    const expectedPrice = '0.1';
    const result = ethers.utils.formatEther(
      await dutchAuction.getCost(nineDaysFromStart)
    );
    expect(result).to.equal(expectedPrice);
  });

  it('Should equal to zero when auction finished', async function () {
    // bu the end of auction price should be 0
    const expectedPrice = '0.0';
    const result = ethers.utils.formatEther(
      await dutchAuction.getCost(auctionEndDate)
    );
    expect(result).to.equal(expectedPrice);
  });

  it('Should be able to buy and receive funds', async function () {
    const [seller, buyer] = await ethers.getSigners();
    const initialBalanceSeller = parseFloat(ethers.utils.formatEther(await ethers.provider.getBalance(seller.address)));
    const initialBalanceBuyer = parseFloat(ethers.utils.formatEther(await ethers.provider.getBalance(seller.address)));
    let txn = await dutchAuction.connect(buyer).buy({ value: price });
    txn.wait();
    // After buyer bought the good, seller should have more ether that before
    const finalBalanceSeller = parseFloat(ethers.utils.formatEther(await ethers.provider.getBalance(seller.address)));
    expect(finalBalanceSeller).to.be.greaterThan(initialBalanceSeller);
    // Buyer should have part of the cost refunded corrected by the current cost of the good
    const finalBalanceBuyer = parseFloat(ethers.utils.formatEther(await ethers.provider.getBalance(buyer.address)));
    expect(initialBalanceBuyer-parseFloat(price)).to.be.lessThan(finalBalanceBuyer);
    
  });
});
