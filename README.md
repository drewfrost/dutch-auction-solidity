# Simple dutch auction in solidity

This project implements simple dutch auction with linear price descent. 

# Basic commands

## Initial Setup
```bash
npm install
```
## Run tests
```bash
npx hardhat test
```

# Formula for cost of a good for current time

$$
cost = {(auctionEndTime - currentTime) * startingPrice\over(auctionEndTime - auctionStartTime)}
$$