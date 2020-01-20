![Logo](minter-logo.svg)

[![NPM Package](https://img.shields.io/npm/v/minter-js-sdk.svg?style=flat-square)](https://www.npmjs.org/package/minter-js-sdk)
[![Build Status](https://img.shields.io/travis/MinterTeam/minter-js-sdk.svg?style=flat-square)](https://travis-ci.org/MinterTeam/minter-js-sdk)
[![Coverage Status](https://img.shields.io/coveralls/github/MinterTeam/minter-js-sdk/master.svg?style=flat-square)](https://coveralls.io/github/MinterTeam/minter-js-sdk?branch=master)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/MinterTeam/minter-js-sdk/blob/master/LICENSE)

This package aims to provide with an easy-to-use JS helping developers to communicate with the Minter blockchain through its API.

This package should be an aid to any developer working on JS applications with the Minter blockchain.

Please note that this SDK is under active development and is subject to change.

It is complemented by the following packages:
- [minterjs-wallet](https://github.com/MinterTeam/minterjs-wallet) take care of BIP39 mnemonic phrase, private key and address
- [minterjs-tx](https://github.com/MinterTeam/minterjs-tx) create, manipulate and sign transactions
- [minterjs-util](https://github.com/MinterTeam/minterjs-util) utility functions

Contents:
- [Install](#nstall)
- [Usage](#usage)
  - [SDK instance](#sdk-instance)
    - [postTx](#posttx)
    - [postSignedTx](#postsignedtx)
    - [getNonce](#getnonce)
    - [getMinGasPrice](#getmingasprice)
    - [estimateCoinSell](#estimatecoinsell)
    - [estimateCoinBuy](#estimatecoinbuy)
    - [estimateTxCommission](#estimatetxcommission)
  - [Tx params constructors](#tx-params-constructors)
    - [Send](#send)
    - [Multisend](#multisend)
    - [Sell](#sell)
    - [Sell All](#sell-all)
    - [Buy](#buy)
    - [Create Coin](#create-coin)
    - [Declare Candidacy](#declare-candidacy)
    - [Edit Candidate](#edit-candidate)
    - [Delegate](#delegate)
    - [Unbond](#unbond)
    - [Set Candidate On](#set-candidate-on)
    - [Set Candidate Off](#set-candidate-off)
    - [Redeem Check](#redeem-check)
    - [Create Multisig](#create-multisig)
  - [Prepare Signed Transaction](#prepare-signed-transaction)
  - [Minter Check](minter-check)
    - [issueCheck](#issuecheck)
    - [decodeCheck](#decodecheck)
  - [Minter Link](#minter-link)
    - [prepareLink](#preparelink)
    - [decodeLink](#decodelink)
  - [Minter Wallet](#minter-wallet)
- [License](#license)


# Install

```bash
npm install minter-js-sdk
```

```js
import {Minter, prepareLink} from "minter-js-sdk";

const minter = new Minter({/* ...options, see Usage */});
const link = prepareLink(/* ... */)
```

or from browser

```html
<script src="https://unpkg.com/minter-js-sdk"></script>
<script>
const minter = new minterSDK.Minter({/* ...options, see Usage */});
const link = minterSDK.prepareLink(/* ... */)
</script>
```


# Usage

Post transaction full example

```js
import {Minter, TX_TYPE} from "minter-js-sdk";

const minter = new Minter({apiType: 'node', baseURL: 'https://minter-node-1.testnet.minter.network/'});
const txParams = {
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    nonce: 1,
    chainId: 1,
    type: TX_TYPE.SEND,
    data: {
        to: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        value: 10,
        coin: 'MNT',    
    },
    gasCoin: 'ASD',
    gasPrice: 1,
    message: 'custom message',
};

minter.postTx(txParams)
    .then((txHash) => {
        alert(`Tx created: ${txHash}`);
    }).catch((error) => {
        const errorMessage = error.response.data.error.log;
        alert(errorMessage);
    });
```


## SDK instance

Create `minter` SDK instance from `Minter` constructor
`Minter` accept [axios config](https://github.com/axios/axios#config-defaults) as params and return [axios instance](https://github.com/axios/axios#creating-an-instance)

One extra field of options object is `apiType`, which is one of [`'gate'`](https://minterteam.github.io/minter-gate-docs/) or [`'node'`](https://docs.minter.network/#tag/Node-API). It is used to determine what type of API to use.

```js
// specify gate url
const minterGate = new Minter({chainId: 2, apiType: 'gate', baseURL: 'https://gate-api.testnet.minter.network/api/v1/'});
// specify node url
const minterNode = new Minter({chainId: 2, apiType: 'node', baseURL: 'https://minter-node-1.testnet.minter.network/'});
```

`Minter` constructor has the following options:
- `apiType`: [`'gate'`](https://minterteam.github.io/minter-gate-docs/) or [`'node'`](https://docs.minter.network/#tag/Node-API)
- `baseURL`: API URL
- `chainId`: default chain ID, used if no chainId specified in the tx params, 1 - mainnet, 2 - testnet

`minter` SDK instance has the following methods:
- [postTx](#posttx)
- [postSignedTx](#postsignedtx)
- [getNonce](#getnonce)
- [getMinGasPrice](#getmingasprice)
- [estimateCoinSell](#estimatecoinsell)
- [estimateCoinBuy](#estimatecoinbuy)
- [estimateTxCommission](#estimatetxcommission)
- [issueCheck](#issuecheck)
- [decodeCheck](#decodecheck)


### .postTx()

Post new transaction to the blockchain
Accept [tx params](#Tx params constructors) object and make asynchronous request to the blockchain API.
`txParams.nonce` - optional, if no nonce given, it will be requested by `getNonce` automatically.
`txParams.gasPrice` - 1 by default, fee multiplier, should be equal or greater than current mempool's min gas price.
`gasRetryLimit` - count of repeating request, 2 by default. If first request fails because of low gas, it will be repeated with updated `gasPrice`
Returns promise that resolves with sent transaction hash.

```js
/**
 * @typedef {Object} TxParams
 * @property {string|Buffer} privateKey
 * @property {number} [nonce] - can be omitted, will be received by `getNonce`
 * @property {number} [chainId=1] - 1 = mainnet, 2 = testnet
 * @property {number} [gasPrice=1] - can be updated automatically on retry, if gasRetryLimit > 1
 * @property {string} [gasCoin='BIP']
 * @property {string|TX_TYPE|Buffer} type
 * @property {Object|Buffer|TxData} data
 * @property {string} [message]
 */

/**
* @param {TxParams} txParams
* @param {number} [gasRetryLimit=2] - number of retries, if request was failed because of low gas
* @return {Promise<string>}
*/
minter.postTx(txParams, {gasRetryLimit: 2})
    .then((txHash) => {
        console.log(txHash);
        // 'Mt...'
    })
    .catch((error) => {
        // ...
    })
```

### .postSignedTx()

Post new transaction to the blockchain
Accept signed tx string or Buffer and make asynchronous request to the blockchain API.
Returns promise that resolves with sent transaction hash.

```js
/**
* @param {string|Buffer} signedTx
* @return {Promise<string>}
*/
minter.postSignedTx('f8920102018a4d4e540000000000000001aae98a4d4e5400000000...')
    .then((txHash) => {
        console.log(txHash);
        // 'Mt...'
    })
    .catch((error) => {
        // ...
    })
```

### .getNonce()

Get nonce for the new transaction from given address.
Accept address string and make asynchronous request to the blockchain API.
Returns promise that resolves with nonce for new tx (current address tx count + 1).

```js
minter.getNonce('Mx...')
    .then((nonce) => {
        console.log(nonce);
        // 123
    })
    .catch((error) => {
        // ...
    })
```

### .getMinGasPrice()

Get current minimal gas price.

```js
minter.getMinGasPrice()
    .then((gasPrice) => {
        console.log(gasPrice);
        // 1
    })
    .catch((error) => {
        // ...
    })
```

### .estimateCoinSell()

Estimate how much coins you will get for selling some other coins.

```js
minter.estimateCoinSell({
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

### .estimateCoinBuy()

Estimate how much coins you will pay for buying some other coins.

```js
minter.estimateCoinBuy({
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

### .estimateTxCommission()

Estimate transaction fee. Useful for transactions with `gasCoin` different from base coin BIP (or MNT).
Accept string with raw signed tx.
Resolves with commission value.

```js
minter.estimateTxCommission({
        transaction: 'f8920101028a4d4e540000000000000001aae98a4d4e...'
    })
    .then((commission) => {
        console.log(commission);
        // 0.1
    })
    .catch((error) => {
        // ...
    })
```


## Tx params

Tx params object to pass it to `postTx` or `prepareSignedTx` methods to post transaction to the blockchain

### Send
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    chainId: 1,
    type: TX_TYPE.SEND,
    data: {
        to: 'Mx376615B9A3187747dC7c32e51723515Ee62e37Dc',
        value: 10,
        coin: 'MNT',
    },
    gasCoin: 'ASD',
    payload: 'custom message',
};

minter.postTx(txParams);
```

### Multisend
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    chainId: 1,
    type: TX_TYPE.MULTISEND,
    data: {
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
    },
    gasCoin: 'ASD',
    payload: 'custom message',
};

minter.postTx(txParams);
```


### Sell
```js
const txParams = {
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    chainId: 1,
    type: TX_TYPE.SELL,
    data: {
        coinToSell: 'MNT',
        coinToBuy: 'BELTCOIN',
        valueToSell: 10,
    },
    gasCoin: 'ASD',
    payload: 'custom message',
};

minter.postTx(txParams);
```


### Sell All
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    chainId: 1,
    type: TX_TYPE.SELL_ALL,
    data: {
        coinToSell: 'MNT',
        coinToBuy: 'BELTCOIN',
    },
    gasCoin: 'ASD',
    payload: 'custom message',
};

minter.postTx(txParams);
```


### Buy
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = new {
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    chainId: 1,
    type: TX_TYPE.BUY,
    data: {
        coinToSell: 'MNT',
        coinToBuy: 'BELTCOIN',
        valueToBuy: 10,
    },
    gasCoin: 'ASD',
    payload: 'custom message',
};

minter.postTx(txParams);
```


### Create Coin
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    chainId: 1,
    type: TX_TYPE.CREATE_COIN,
    data: {
        name: 'My Coin',
        symbol: 'MYCOIN',
        initialAmount: 5,
        constantReserveRatio: 10,
        initialReserve: 20,
    },
    gasCoin: 'ASD',
    payload: 'custom message',
};

minter.postTx(txParams);
```


### Declare Candidacy
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    chainId: 1,
    type: TX_TYPE.DECLARE_CANDIDACY,
    data: {
        address: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        commission: 10,
        coin: 'MNT',
        stake: 100,
    },
    gasCoin: 'ASD',
    payload: 'custom message',
};

minter.postTx(txParams);
```

### Edit Candidate
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    chainId: 1,
    type: TX_TYPE.EDIT_CANDIDATE,
    data: {
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        rewardAddress: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        ownerAddress: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
    },
    gasCoin: 'ASD',
    payload: 'custom message',
};

minter.postTx(txParams);
```


### Delegate
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    chainId: 1,
    type: TX_TYPE.DELEGATE,
    data: {
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        coin: 'MNT',
        stake: 100,
    },
    gasCoin: 'ASD',
    payload: 'custom message',
};

minter.postTx(txParams);
```


### Unbond
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    chainId: 1,
    type: TX_TYPE.UNBOND,
    data: {
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        coin: 'MNT',
        stake: 100,
    },
    gasCoin: 'ASD',
    payload: 'custom message',
};

minter.postTx(txParams);
```


### Set Candidate On
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    chainId: 1,
    type: TX_TYPE.SET_CANDIDATE_ON,
    data: {
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
    },
    gasCoin: 'ASD',
    payload: 'custom message',
};

minter.postTx(txParams);
```


### Set Candidate Off
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    chainId: 1,
    type: TX_TYPE.SET_CANDIDATE_OFF,
    data: {
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
    },
    gasCoin: 'ASD',
    payload: 'custom message',
};

minter.postTx(txParams);
```


### Redeem Check
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    chainId: 1,
    type: TX_TYPE.REDEEM_CHECK,
    data: {
        check: 'Mcf8a002843b9ac9ff8a4d4e5400000000000000888ac7230489e80000b841ed4e21035ad4d56901422c19e7fc867a63dcab709d6d0dcc0b6333cb7365d187519e1291bbc002189e7030dedfbbc4feb733da73f9409de4f01365dd3f5f4927011ca0507210c64b3aeb7c81a2db06204b935814c28482175dee756b1f05414d18e594a06173c7c8ee51ad76e9704a39ffc5c0ab11514d8b68efcbc8df1db194d9e296ee',
        password: '123',
    },
    gasCoin: 'MNT',
};

minter.postTx(txParams);
```

### Create Multisig
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    chainId: 1,
    type: TX_TYPE.CREATE_MULTISIG,
    data: {
        addresses: ['Mx7633980c000139dd3bd24a3f54e06474fa941e00', 'Mxfe60014a6e9ac91618f5d1cab3fd58cded61ee99'],
        weights: [40, 80],
        threshold: 100,
    },
    gasCoin: 'MNT',
};

minter.postTx(txParams);
```


## Prepare Signed Transaction
Used under the hood of PostTx, accepts `txParams` object as argument
```js
import {prepareSignedTx} from 'minter-js-sdk';
const tx = prepareSignedTx(txParams);
console.log('signed tx', tx.serialize().toString('hex'));

// get actual nonce first
minter.getNonce('Mx...')
    .then((nonce) => {
        const tx = prepareSignedTx({...txParams, nonce});
        console.log('signed tx', tx.serialize().toString('hex'));
    });
```


## Minter Check

[Minter Check](https://minter-go-node.readthedocs.io/en/dev/checks.html) is like an ordinary bank check. Each user of network can issue check with any amount of coins and pass it to another person. Receiver will be able to cash a check from arbitrary account. 
 
Checks are issued offline and do not exist in blockchain before “cashing”.

### `issueCheck()`

```js
// Since issuing checks is offline, you can use it standalone without instantiating SDK
import {issueCheck} from "minter-js-sdk";
const check = issueCheck({
    privateKey: '2919c43d5c712cae66f869a524d9523999998d51157dc40ac4d8d80a7602ce02',
    passPhrase: 'pass',
    nonce: '1', // it is string and must be unique
    chainId: 1,
    coin: 'MNT',
    value: 10,
    dueBlock: 999999, // at this block number check will be expired
});
console.log(check);
// => 'Mcf8a002843b9ac9ff8a4d4e5400000000000000888ac7230489e80000b841ed4e21035ad4d56901422c19e7fc867a63dcab709d6d0dcc0b6333cb7365d187519e1291bbc002189e7030dedfbbc4feb733da73f9409de4f01365dd3f5f4927011ca0507210c64b3aeb7c81a2db06204b935814c28482175dee756b1f05414d18e594a06173c7c8ee51ad76e9704a39ffc5c0ab11514d8b68efcbc8df1db194d9e296ee'

// This method also available on the SDK instance
const check = minter.issueCheck({...});
```

### `decodeCheck()`

Decode raw check

```js
import {decodeCheck} from "minter-js-sdk";
const check = decodeCheck('Mcf8a002843b9ac9ff8a4d4e5400000000000000888ac7230489e80000b841ed4e21035ad4d56901422c19e7fc867a63dcab709d6d0dcc0b6333cb7365d187519e1291bbc002189e7030dedfbbc4feb733da73f9409de4f01365dd3f5f4927011ca0507210c64b3aeb7c81a2db06204b935814c28482175dee756b1f05414d18e594a06173c7c8ee51ad76e9704a39ffc5c0ab11514d8b68efcbc8df1db194d9e296ee');
console.log(check);
// =>
// {
//   nonce: '1',
//   chainId: 1,
//   coin: 'MNT',
//   value: '10',
//   dueBlock: 999999,
// } 

// This method also available on the SDK instance
const check = minter.decodeCheck('...');
```


## Minter Link
[Minter Link Protocol](https://github.com/MinterTeam/minter-link-protocol) describes how to represent transaction data into a simple link, which can be easily consumed by user as a link or as QR. Then link is being processed by [bip.to](https://bip.to) web app or any associated mobile app. App retrieves data from the link, generate valid transaction using logged user's private key and send it.

So everything a user needs to do to send a transaction is to click on the link or scan QR code.  

### `prepareLink()`
Create link from transaction params

Options:
- `txParams` - object with [params](https://github.com/MinterTeam/minter-link-protocol#params) of transaction
- `txParams.type`
- `txParams.data`
- `txParams.payload` - optional
- `txParams.nonce` - optional
- `txParams.gasPrice` - optional
- `txParams.gasCoin` - optional
- `linkHost` - optional, custom hostname of the link, leave undefined to use default 'https://bip.to' 

```js
import {prepareLink, TX_TYPE} from 'minter-js-sdk';

const txParams = {
    type: TX_TYPE.SEND,
    data: {
        to: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        value: 10,
        coin: 'MNT',
    },
    gasCoin: 'ASD',
    payload: 'custom message',
};
prepareLink(txParams);
// => 'https://bip.to/tx?d=f84801aae98a4d4e5400000000000000947633980c000139dd3bd24a3f54e06474fa941e16888ac7230489e800008e637573746f6d206d65737361676580808a41534400000000000000'
```

### `decodeLink()`
Decode link into transaction params

```js
import {decodeLink} from 'minter-js-sdk';

decodeLink('https://bip.to/tx?d=f84801aae98a4d4e5400000000000000947633980c000139dd3bd24a3f54e06474fa941e16888ac7230489e800008e637573746f6d206d65737361676580808a41534400000000000000');
// =>
// {
// gasCoin: 'ASD',
// type: '0x01',
// data: {
//    to: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
//    coin: 'MNT',
//    value: '10',
// },
// payload: 'custom message',
// }
```


## Minter Wallet
Use [minterjs-wallet](https://github.com/MinterTeam/minterjs-wallet)


# License

MIT License
