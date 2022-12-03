# DeFenDAO

*Note: this code is not audited and should not be used in production environment.*

## Summary

DeFenDAO is a project that aims to increase liquidity in the NFT market. It helps increase liquidity in the NFT market by incorporating randomness and boosting holder defense.

## Demo

- https://hackathon-dcyn.vercel.app/
- TODO: 데모 영상 추가 필요
- TODO: Project slides deck (pdf)

## Problem

### NFT holders' perspective

As the NFT market experiences a downturn, it's experiencing a death spiral of lower floor prices leading to lower bids leading to lower confidence and leading back to lower floor prices.

### NFT buyers' perspective

Want to snipe a collection at a price lower than the current floor price but cannot make partial bids

## Solution

TODO: architecture, design decisions, optimism, opensea, ...

### Frontend

https://github.com/pureboy11/hackathon

### Contracts

Expected node version is >= 16.0.0

1. Install and build

```shell
yarn
yarn build
```

2. Run unit test

```shell
yarn workspace contracts test
```

## Challenges

- OpenSea API not working for Optimism network
- Seaport fulfill functions not working without pre-validation
- TODO: ...


## Future work

- Dynamic price units
- Integrate floor price oracles
- Ticket purchase and NFT claim fees
- Executor incentives
- Ticket reserve yields
