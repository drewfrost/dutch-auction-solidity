const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Dutch Auction', async function () {
  it('Should have linear drop in price', async function () {
    const auctionStartDate = new Date().getTime();
    const auctionEndDate = auctionStartDate + 60 * 60 * 24 * 10;
    const price = ethers.utils.parseEther('1');
    const factory = await ethers.getContractFactory('DutchAuction');
    const dutchAuction = await factory.deploy(
      price,
      auctionStartDate,
      auctionEndDate
    );
    await dutchAuction.deployed();
    const nineDaysFromStart = auctionStartDate + 60 * 60 * 24 * 9;
    const expectedPrice = '0.1';
    const result = ethers.utils.formatEther(
      await dutchAuction.getCost(nineDaysFromStart)
    );
    expect(result).to.equal(expectedPrice);
  });

  it('Should equal to zero when auction finished', async function () {
    const auctionStartDate = new Date().getTime();
    const auctionEndDate = auctionStartDate + 60 * 60 * 24 * 10;
    const price = ethers.utils.parseEther('1');
    const factory = await ethers.getContractFactory('DutchAuction');
    const dutchAuction = await factory.deploy(
      price,
      auctionStartDate,
      auctionEndDate
    );
    await dutchAuction.deployed();
    const expectedPrice = '0.0';
    const result = ethers.utils.formatEther(
      await dutchAuction.getCost(auctionEndDate)
    );
    expect(result).to.equal(expectedPrice);
  });

  it('Should be able to buy', async function () {
    const [seller, buyer] = await ethers.getSigners();
    const auctionStartDate = new Date().getTime();
    const auctionEndDate = auctionStartDate + 60 * 60 * 24 * 10;
    const price = ethers.utils.parseEther('1');
    const factory = await ethers.getContractFactory('DutchAuction');
    const dutchAuction = await factory
      .deploy(price, auctionStartDate, auctionEndDate);
    await dutchAuction.deployed();
    console.log(ethers.utils.formatEther(await dutchAuction.getCurrentCost()));
    // const initialBalance = parseFloat(ethers.utils.formatEther(await ethers.provider.getBalance(seller.address)));
    // let txn = await dutchAuction.buy({ value: price });
    // txn.wait();
    // const finalBalance = parseFloat(ethers.utils.formatEther(await ethers.provider.getBalance(seller.address)));
    // expect(finalBalance - initialBalance).to.equal(1);
    
  });
});
