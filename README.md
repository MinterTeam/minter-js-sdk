![Logo](minter-logo.svg)

[![NPM Package](https://img.shields.io/npm/v/minter-js-sdk.svg?style=flat-square)](https://www.npmjs.org/package/minter-js-sdk)
[![Build Status](https://img.shields.io/travis/MinterTeam/minter-js-sdk.svg?style=flat-square)](https://travis-ci.org/MinterTeam/minter-js-sdk)
[![Coverage Status](https://img.shields.io/coveralls/github/MinterTeam/minter-js-sdk/master.svg?style=flat-square)](https://coveralls.io/github/MinterTeam/minter-js-sdk?branch=master)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/MinterTeam/minter-js-sdk/blob/master/LICENSE)

This package aims to provide with an easy-to-use JS helping developers to communicate with the Minter blockchain through its API.

This package should be an aid to any developer working on JS applications with the Minter blockchain.

Please note that this SDK is under active development and is subject to change.

It is complemented by the following packages:
- [minterjs-wallet](https://github.com/MinterTeam/minterjs-wallet) to create wallet
- [minterjs-tx](https://github.com/MinterTeam/minterjs-tx) create, manipulate and sign transactions
- [minterjs-util](https://github.com/MinterTeam/minterjs-util) utility functions


## Install

```bash
npm install minter-js-sdk
```



## Usage

Post transaction full example

```js
import {Minter, SendTxParams} from "minter-js-sdk";

const minterSDK = new Minter();
const txParams = new SendTxParams({
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    nonce: 1,
    address: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
    amount: 10,
    coinSymbol: 'MNT',
    feeCoinSymbol: 'ASD',
    gasPrice: 1,
    message: 'custom message',
});

minterSDK.postTx(txParams)
    .then((txHash) => {
        alert(`Tx created: ${txHash}`);
    }).catch((error) => {
        const errorMessage = error.response.data.error.log;
        alert(errorMessage);
    });
```


### Initialization

Create `minterSDK` instance from `Minter` constructor
`Minter` accept [axios config](https://github.com/axios/axios#config-defaults) as params and return [axios instance](https://github.com/axios/axios#creating-an-instance)

One extra field of options object is `apiType`, which is one of [`'explorer'`](https://github.com/MinterTeam/minter-php-explorer-api) or [`'node'`](https://minter-go-node.readthedocs.io/en/dev/api.html). It is used to determine what type of API to use. 

```js
 // by default use explorer's testnet API
const minterSDK = new Minter();
// specify explorer url
const minterExplorer = new Minter({apiType: 'explorer', baseURL: 'https://testnet.explorer.minter.network'});
// specify node url
const minterNode = new Minter({apiType: 'node', baseURL: 'http://minter-node-1.testnet.minter.network:8841'});
```

`minterSDK` instance has the following methods:
 
- [postTx](#.postTx())
- [getNonce](#.getNonce())
- [estimateCoinSell](#.estimateCoinSell())
- [estimateCoinBuy](#.estimateCoinBuy())
- [estimateTxCommission](#.estimateTxCommission())
- [issueCheck](#.issueCheck())


#### .postTx()

Post new transcation to the blockchain
Accept [tx params](#Tx params constructors) object and make asynchronous request to the blockchain API.
`txParams.nonce` - optional, if no nonce given, it will be requested by `getNonce` automatically.
`txParams.gasPrice` - 1 by default, if request failed because of low gas, it will be repeated wi 
`gasRetryLimit` - count of repeating request, 2 by default. If first request fails because of low gas, it will be repeated with updated `gasPrice`
Returns promise that resolves with sent transaction hash.

```js
/**
 * @typedef {Object} TxParams
 * @property {string|Buffer} privateKey
 * @property {number} [nonce] - can be omitted, will be received by `getNonce`
 * @property {number} [gasPrice=1] - can be updated automatically on retry, if gasRetryLimit > 1
 * @property {string} [gasCoin='BIP']
 * @property {string|Buffer} txType
 * @property {Buffer} txData
 * @property {string} [message]
 */

/**
* @param {TxParams} txParams
* @param {number} [gasRetryLimit=2] - number of retries, if request was failed because of low gas
* @return {Promise<string>}
*/
minterSDK.postTx(txParams, {gasRetryLimit: 2})
    .then((txHash) => {
        console.log(txHash);
        // 'Mt...'
    })
    .catch((error) => {
        // ...
    })
```

#### .getNonce()

Get nonce for the new transaction from given address.
Accept address string and make asynchronous request to the blockchain API.
Returns promise that resolves with nonce for new tx (current address tx count + 1).

```js
minterSDK.getNonce('Mx...')
    .then((nonce) => {
        console.log(nonce);
        // 123
    })
    .catch((error) => {
        // ...
    })
```

#### .estimateCoinSell()

Estimate how much coins you will get for selling some other coins.

```js
minterSDK.estimateCoinSell({
    coinToSell: 'MNT',
    valueToSell: '10',
    coinToBuy: 'MYCOIN',
})
    .then((result) => {
        console.log(result.will_get, result.commission);
        // 123, 0.1
    })
    .catch((error) => {
        // ...
    })
```

#### .estimateCoinBuy()

Estimate how much coins you will pay for buying some other coins.

```js
minterSDK.estimateCoinBuy({
    coinToBuy: 'MYCOIN',
    valueToBuy: '10',
    coinToSell: 'MNT',
})
    .then((result) => {
        console.log(result.will_pay, result.commission);
        // 123, 0.1
    })
    .catch((error) => {
        // ...
    })
```

#### .estimateTxCommission()

Estimate transaction fee. Useful for transactions with `gasCoin` different from base coin BIP (or MNT).
Accept string with raw signed tx.
Resolves with commission value.

```js
minterSDK.estimateTxCommission()
    .then((commission) => {
        console.log(commission);
        // 0.1
    })
    .catch((error) => {
        // ...
    })
```

#### .issueCheck()

[Minter Checks](https://minter-go-node.readthedocs.io/en/dev/checks.html) are issued offline and do not exist in blockchain before “cashing”.

```js
// Since issuing checks is offline, you can use it standalone without instantiating SDK
import {issueCheck} from "minter-js-sdk";
const check = issueCheck({
    privateKey: '2919c43d5c712cae66f869a524d9523999998d51157dc40ac4d8d80a7602ce02',
    passPhrase: 'pass',
    nonce: 1, // must be unique for private key
    coinSymbol: 'MNT',
    value: 10,
    dueBlock: 999999, // at this block number check will be expired
});
console.log(check);
// => 'Mcf8a002843b9ac9ff8a4d4e5400000000000000888ac7230489e80000b841ed4e21035ad4d56901422c19e7fc867a63dcab709d6d0dcc0b6333cb7365d187519e1291bbc002189e7030dedfbbc4feb733da73f9409de4f01365dd3f5f4927011ca0507210c64b3aeb7c81a2db06204b935814c28482175dee756b1f05414d18e594a06173c7c8ee51ad76e9704a39ffc5c0ab11514d8b68efcbc8df1db194d9e296ee'

// But this method also available on the SDK instance
const check = minterSDK.issueCheck({...}); 
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

minterSDK.postTx(txParams);
```

#### Multisend
```js
import {MultisendTxParams} from "minter-js-sdk";
const txParams = new MultisendTxParams({
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    list: [
        {
            value: 10,
            coin: 'MNT',
            to: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        },
        {
            value: 2,
            coin: 'MNT',
            to: 'Mxfe60014a6e9ac91618f5d1cab3fd58cded61ee99',
        }
    ],
    feeCoinSymbol: 'ASD',
    message: 'custom message',
});

minterSDK.postTx(txParams);
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

minterSDK.postTx(txParams);
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

minterSDK.postTx(txParams);
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

minterSDK.postTx(txParams);
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

minterSDK.postTx(txParams);
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

minterSDK.postTx(txParams);
```

#### Edit Candidate
```js
import {EditCandidateTxParams} from "minter-js-sdk";
const txParams = new DeclareCandidacyTxParams({
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
    rewardAddress: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
    ownerAddress: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
    feeCoinSymbol: 'ASD',
    message: 'custom message',
});

minterSDK.postTx(txParams);
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

minterSDK.postTx(txParams);
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

minterSDK.postTx(txParams);
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

minterSDK.postTx(txParams);
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

minterSDK.postTx(txParams);
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

minterSDK.postTx(txParams);
```

#### Create Multisig
```js
import {CreateMultisigTxParams} from "minter-js-sdk";
const txParams = new CreateMultisigTxParams({
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    addresses: ['Mx7633980c000139dd3bd24a3f54e06474fa941e00', 'Mxfe60014a6e9ac91618f5d1cab3fd58cded61ee99'],
    weights: [40, 80], 
    threshold: 100,
    feeCoinSymbol: 'MNT',
});

minterSDK.postTx(txParams);
```


### Prepare Signed Transaction
Used under the hood of PostTx, accepts `txParams` object as argument
```js
import {prepareSignedTx} from 'minter-js-sdk';
const tx = prepareSignedTx(txParams);
console.log('signed tx', tx.serialize().toString('hex'));

// get actual nonce first
minterSDK.getNonce('Mx...')
    .then((nonce) => {
        const tx = prepareSignedTx({...txParams, nonce});
        console.log('signed tx', tx.serialize().toString('hex'));
    });

```


## License

MIT License
