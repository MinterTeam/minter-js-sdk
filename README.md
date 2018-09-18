![Logo](minter-logo.svg)

[![NPM Package](https://img.shields.io/npm/v/minter-js-sdk.svg?style=flat-square)](https://www.npmjs.org/package/minter-js-sdk)
[![Build Status](https://img.shields.io/travis/MinterTeam/minter-js-sdk.svg?style=flat-square)](https://travis-ci.org/MinterTeam/minter-js-sdk)
[![Coverage Status](https://img.shields.io/coveralls/github/MinterTeam/minter-js-sdk/master.svg?style=flat-square)](https://coveralls.io/github/MinterTeam/minter-js-sdk?branch=master)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/MinterTeam/minter-js-sdk/blob/master/LICENSE)

This package aims to provide with an easy-to-use JS helping developers to communicate with the Minter blockchain through its API.

This package should be an aid to any developer working on JS applications with the Minter blockchain.

The author of this package cannot be held responsible for any loss of money or any malintentioned usage forms of this package. Please use this package with caution.

It is complemented by the following packages:
- [minterjs-wallet](https://github.com/MinterTeam/minterjs-wallet) to create wallet
- [minterjs-tx](https://github.com/MinterTeam/minterjs-tx) create, manipulate and sign transactions
- [minterjs-util](https://github.com/MinterTeam/minterjs-util) utility functions


## Install

`npm install minter-js-sdk`


## Usage

Post transaction full example

```js
import {PostTx} from "minter-js-sdk";
import {SendTxParams} from "minter-js-sdk";

const postTx = new PostTx({baseURL: 'http://minter-node-1.testnet.minter.network:8841'});
const txParams = new SendTxParams({
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    address: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
    amount: 10,
    coinSymbol: 'MNT',
    feeCoinSymbol: 'ASD',
    message: 'custom message',
});

postTx(txParams)
    .then((response) => {
        const txHash = response.data.result.hash;
        alert(`Tx created: ${txHash}`);
    }).catch((error) => {
        const errorMessage = error.response.data.log;
        alert(errorMessage);
    });
```


### Initialization

Create `postTx` instance from `PostTx` constructor
`PostTx` accept [axios config](https://github.com/axios/axios#config-defaults) as params and return [axios instance](https://github.com/axios/axios#creating-an-instance)

`postTx` instance accept tx params object and make asynchronous request to the blockchain API

```js
import {PostTx} from "minter-js-sdk";

const postTx = new PostTx({baseURL: 'http://minter-node-1.testnet.minter.network:8841'});

postTx(txParams)
    .then((response) => {
        // ...
    })
    .catch((error) => {
        // ...
    })
```


### Tx params constructors

Get params object from constructor and pass it to `postTx` method to post transaction to the blockchain

#### Send
```js
import {SendTxParams} from "minter-js-sdk";
const txParams = new SendTxParams({
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    address: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
    amount: 10,
    coinSymbol: 'MNT',
    feeCoinSymbol: 'ASD',
    message: 'custom message',
});

postTx(txParams);
```


#### Sell
```js
import {SellTxParams} from "minter-js-sdk";
const txParams = new SellTxParams({
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    coinFrom: 'MNT',
    coinTo: 'BELTCOIN',
    sellAmount: 10,
    feeCoinSymbol: 'ASD',
    message: 'custom message',
});

postTx(txParams);
```


#### Sell All
```js
import {SellAllTxParams} from "minter-js-sdk";
const txParams = new SellAllTxParams({
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    coinFrom: 'MNT',
    coinTo: 'BELTCOIN',
    feeCoinSymbol: 'ASD',
    message: 'custom message',
});

postTx(txParams);
```


#### Buy
```js
import {BuyTxParams} from "minter-js-sdk";
const txParams = new BuyTxParams({
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    coinFrom: 'MNT',
    coinTo: 'BELTCOIN',
    buyAmount: 10,
    feeCoinSymbol: 'ASD',
    message: 'custom message',
});

postTx(txParams);
```


#### Create Coin
```js
import {CreateCoinTxParams} from "minter-js-sdk";
const txParams = new CreateCoinTxParams({
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    coinName: 'My Coin',
    coinSymbol: 'MYCOIN',
    initialAmount: 5,
    crr: 10,
    initialReserve: 20,
    feeCoinSymbol: 'ASD',
    message: 'custom message',
});

postTx(txParams);
```


#### Declare Candidacy
```js
import {DeclareCandidacyTxParams} from "minter-js-sdk";
const txParams = new DeclareCandidacyTxParams({
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    address: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
    publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
    commission: 10,
    coinSymbol: 'MNT',
    stake: 100,
    feeCoinSymbol: 'ASD',
    message: 'custom message',
});

postTx(txParams);
```


#### Delegate
```js
import {DelegateTxParams} from "minter-js-sdk";
const txParams = new DelegateTxParams({
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
    coinSymbol: 'MNT',
    stake: 100,
    feeCoinSymbol: 'ASD',
    message: 'custom message',
});

postTx(txParams);
```


#### Unbond
```js
import {UnbondTxParams} from "minter-js-sdk";
const txParams = new UnbondTxParams({
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
    coinSymbol: 'MNT',
    stake: 100,
    feeCoinSymbol: 'ASD',
    message: 'custom message',
});

postTx(txParams);
```


#### Set Candidate On
```js
import {SetCandidateOnTxParams} from "minter-js-sdk";
const txParams = new SetCandidateOnTxParams({
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
    feeCoinSymbol: 'ASD',
    message: 'custom message',
});

postTx(txParams);
```


#### Set Candidate Off
```js
import {SetCandidateOffTxParams} from "minter-js-sdk";
const txParams = new SetCandidateOffTxParams({
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
    feeCoinSymbol: 'ASD',
    message: 'custom message',
});

postTx(txParams);
```


#### Redeem Check
```js
import {RedeemCheckTxParams} from "minter-js-sdk";
const txParams = new RedeemCheckTxParams({
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    check: 'Mcf8a002843b9ac9ff8a4d4e5400000000000000888ac7230489e80000b841ed4e21035ad4d56901422c19e7fc867a63dcab709d6d0dcc0b6333cb7365d187519e1291bbc002189e7030dedfbbc4feb733da73f9409de4f01365dd3f5f4927011ca0507210c64b3aeb7c81a2db06204b935814c28482175dee756b1f05414d18e594a06173c7c8ee51ad76e9704a39ffc5c0ab11514d8b68efcbc8df1db194d9e296ee',
    password: '123',
    feeCoinSymbol: 'MNT',
});

postTx(txParams);
```


#### Issue Check

[Minter Checks](https://minter-go-node.readthedocs.io/en/dev/checks.html) are issued offline and do not exist in blockchain before “cashing”.

```js
import {issueCheck} from "minter-js-sdk";
const check = issueCheck({
    privateKey: '2919c43d5c712cae66f869a524d9523999998d51157dc40ac4d8d80a7602ce02',
    passPhrase: 'pass',
    nonce: 1,
    coinSymbol: 'MNT',
    value: 10,
    dueBlock: 999999,
});
console.log(check);
// => 'Mcf8a002843b9ac9ff8a4d4e5400000000000000888ac7230489e80000b841ed4e21035ad4d56901422c19e7fc867a63dcab709d6d0dcc0b6333cb7365d187519e1291bbc002189e7030dedfbbc4feb733da73f9409de4f01365dd3f5f4927011ca0507210c64b3aeb7c81a2db06204b935814c28482175dee756b1f05414d18e594a06173c7c8ee51ad76e9704a39ffc5c0ab11514d8b68efcbc8df1db194d9e296ee'

```


## License

MIT License
