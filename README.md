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
- [Install](#install)
- [Usage](#usage)
  - [SDK instance](#sdk-instance)
    - [postTx](#posttx)
    - [postSignedTx](#postsignedtx)
    - [getNonce](#getnonce)
    - [getMinGasPrice](#getmingasprice)
    - [getCoinInfo](#getcoininfo)
    - [estimateCoinSell](#estimatecoinsell)
    - [estimateCoinBuy](#estimatecoinbuy)
    - [estimateTxCommission](#estimatetxcommission)
    - [replaceCoinSymbol](#replacecoinsymbol)
    - [replaceCoinSymbolByPath](#replacecoinsymbolbypath)
  - [Tx params constructors](#tx-params)
    - [Send](#send)
    - [Multisend](#multisend)
    - [Sell](#sell)
    - [Sell All](#sell-all)
    - [Buy](#buy)
    - [Create Coin](#create-coin)
    - [Recreate Coin](#recreate-coin)
    - [Edit Coin Owner](#edit-coin-owner)
    - [Declare Candidacy](#declare-candidacy)
    - [Edit Candidate](#edit-candidate)
    - [Edit Candidate Public key](#edit-candidate-public-key)
    - [Delegate](#delegate)
    - [Unbond](#unbond)
    - [Set Candidate On](#set-candidate-on)
    - [Set Candidate Off](#set-candidate-off)
    - [Set Halt Block](#set-halt-block)
    - [Price Vote](#price-vote)
    - [Redeem Check](#redeem-check)
    - [Create Multisig](#create-multisig)
    - [Edit Multisig](#edit-multisig)
  - [Transaction](#transaction)
    - [Prepare Transaction](#prepare-transaction)
    - [Prepare Single Signed Transaction](#prepare-single-signed-transaction)
    - [Make Signature](#make-signature)
    - [Multi Signatures](#multi-signatures)
    - [Decode Transaction](#decode-transaction)
  - [Minter Check](#minter-check)
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

const minter = new Minter({apiType: 'node', baseURL: 'https://node-api.testnet.minter.network/v2/'});
const txParams = {
    nonce: 1,
    chainId: 1,
    type: TX_TYPE.SEND,
    data: {
        to: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        value: 10,
        coin: 0, // BIP id
    },
    gasCoin: 0, // BIP id
    gasPrice: 1,
    payload: 'custom message',
};

minter.postTx(txParams, {privateKey: '0x5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da'})
    .then((txHash) => {
        // WARNING
        // If you use minter-node api, successful response mean that Tx just get in mempool and it is not in blockchain yet. 
        // You have to wait it in the upcoming block. 
        // Also you can use gate api instead, it will return succes response only after Tx will be appeared in the blockchain 
        // WARNING #2 
        // If Tx was included in the block, it still may has failed status.
        // Check tx.code to be `0`, to ensure it is successful
        alert(`Tx created: ${txHash}`);
    }).catch((error) => {
        const errorMessage = error.response.data.error.message
        alert(errorMessage);
    });
```

Post transaction using SDK features

```js
import {Minter, TX_TYPE} from "minter-js-sdk";

const minter = new Minter({apiType: 'node', baseURL: 'https://node-api.testnet.minter.network/v2/'});
const txParams = {
    // no `nonce` specified, it will be fetched automatically
    // no `gasPrice` specified, "1" will be used by default and in case of error request will be retried with autocorrected value
    chainId: 1,
    type: TX_TYPE.SEND,
    data: {
        to: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        value: 10,
        coin: 'BIP', // coin symbol
    },
    gasCoin: 'MYCOIN', // coin symbol
};

// replace coin symbols in txParams with coin ids
minter.replaceCoinSymbol(txParams)
    .then((newTxParams) => {
        return minter.postTx(txParams, {
            privateKey: '0x5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da'
        })
    })
    .then((txHash) => {
        // WARNING
        // If you use minter-node api, successful response mean that Tx just get in mempool and it is not in blockchain yet. 
        // You have to wait it in the upcoming block. 
        // Also you can use gate api instead, it will return succes response only after Tx will be appeared in the blockchain 
        // WARNING #2 
        // If Tx was included in the block, it still may has failed status.
        // Check tx.code to be `0`, to ensure it is successful
        alert(`Tx created: ${txHash}`);
    }).catch((error) => {
        const errorMessage = error.response.data.error.message
        alert(errorMessage);
    });
```


## SDK instance

Create `minter` SDK instance from `Minter` constructor. It contains methods to communicate with API.
`Minter` accept [axios config](https://github.com/axios/axios#config-defaults) as params and return [axios instance](https://github.com/axios/axios#creating-an-instance)

One extra field of options object is `apiType`, which is one of [`'gate'`](https://minterteam.github.io/minter-gate-docs/) or [`'node'`](https://www.minter.network/docs#node-api). It is used to determine what type of API to use.

```js
// specify gate url
const minterGate = new Minter({chainId: 2, apiType: 'gate', baseURL: 'https://gate-api.minter.network/api/v2/'});
// specify node url
const minterNode = new Minter({chainId: 2, apiType: 'node', baseURL: 'https://node-api.testnet.minter.network/v2/'});
```

`Minter` constructor has the following options:
- `apiType`: [`'gate'`](https://minterteam.github.io/minter-gate-docs/) or [`'node'`](https://www.minter.network/docs#node-api)
- `baseURL`: API URL
- `chainId`: default chain ID, used if no chainId specified in the tx params, 1 - mainnet, 2 - testnet

`minter` SDK instance has the following methods:
- [postTx](#posttx)
- [postSignedTx](#postsignedtx)
- [getNonce](#getnonce)
- [ensureNonce](#ensurenonce)
- [getMinGasPrice](#getmingasprice)
- [getCoinInfo](#getcoininfo)
- [estimateCoinSell](#estimatecoinsell)
- [estimateCoinBuy](#estimatecoinbuy)
- [estimateTxCommission](#estimatetxcommission)
- [replaceCoinSymbol](#replacecoinsymbol)
- [replaceCoinSymbolByPath](#replacecoinsymbolbypath)


### .postTx()

Post new transaction to the blockchain
Accept [tx params](#Tx params constructors) object and make asynchronous request to the blockchain API.
`txParams.nonce` - optional, if no nonce given, it will be requested by `getNonce` automatically.
`txParams.gasPrice` - 1 by default, fee multiplier, should be equal or greater than current mempool's min gas price.
`gasRetryLimit` - count of repeating request, 2 by default. If first request fails because of low gas, it will be repeated with updated `gasPrice`
`mempoolRetryLimit` - count of repeating request, 0 by default. If first request fails because of error "Tx from address already exists in mempool", it will be repeated after 5 seconds (average time of the block) to try put it in the new block
Returns promise that resolves with:
 - sent transaction data included in a **block** (from gate), 
 - or transaction hash included in **mempool** (from node). 

*Please note: always check that sent transaction has no errors (tx in a block should have `code: 0`). Otherwise errored tx will not be applied*


```js
/**
 * @typedef {Object} TxParams
 * @property {number} [nonce] - can be omitted, will be received by `getNonce`
 * @property {number} [chainId=1] - 1 = mainnet, 2 = testnet
 * @property {number} [gasPrice=1] - can be updated automatically on retry, if gasRetryLimit > 1
 * @property {string} [gasCoin='BIP']
 * @property {string|TX_TYPE|Buffer} type
 * @property {Object|Buffer|TxData} data
 * @property {string} [payload]
 * @property {number} [signatureType=1]
 * @property {number} [signatureData] - can be signed automatically if `privateKey` passed
 */

/**
* @param {TxParams} txParams
* @param {PostTxOptions} txOptions
* @param {number} [txOptions.gasRetryLimit=2] - number of retries, if request was failed because of low gas
* @param {number} [txOptions.nonceRetryLimit=0] - number of retries, if request was failed because of invalid nonce
* @param {number} [txOptions.mempoolRetryLimit=0] - number of retries, if request was failed with error "Tx from address already exists in mempool"
* @param {string|Buffer} [txOptions.privateKey] - to sign tx or get nonce or to make proof for redeemCheck tx
* @param {string} [txOptions.address] - to get nonce (useful for multisignatures) or to make proof for redeemCheck tx
* @param {ByteArray} [txOptions.password] - to make proof for RedeemCheckTxData
* @return {Promise<NodeTransaction|{hash: string}>}
*/
minter.postTx(txParams, {privateKey: '...', gasRetryLimit: 2, mempoolRetryLimit: 0})
    .then((tx) => {
        console.log(tx.hash);
        // 'Mt...'
        // Check here that tx in block has no errors (code === 0)
    });
```

### .postSignedTx()

Post new transaction to the blockchain
Accept signed tx string or Buffer and make asynchronous request to the blockchain API.
Returns promise that resolves with:
 - sent transaction data included in a **block** (from gate), 
 - or transaction hash included in **mempool** (from node). 

```js
/**
* @param {string|Buffer} signedTx
* @return {Promise<NodeTransaction|{hash: string}>}
*/
minter.postSignedTx('0xf8920102018a4d4e540000000000000001aae98a4d4e5400000000...')
    .then((tx) => {
        console.log(tx.hash);
        // 'Mt...'
    });
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
    });
```


### .ensureNonce()
Ensure nonce for the tx params.

```js
/**
 * @param {MinterApiInstance} apiInstance
 * @param {TxParams} txParams
 * @param {ByteArray} [privateKey]
 * @param {string} [address]
 * @return {Promise<number>}
 */
minter.ensureNonce(txParams, {privateKey: '...'})
    .then((nonce) => {
        console.log(nonce);
        // 123
    });
```


### .getMinGasPrice()
Get current minimal gas price.

```js
minter.getMinGasPrice()
    .then((gasPrice) => {
        console.log(gasPrice);
        // 1
    });
```


### .getCoinInfo()
Get coin info by coinSymbol.

```js
/**
 * @param {string} coinSymbol
 * @return {Promise<CoinInfo>}
 */
minter.getCoinInfo(coinSymbol)
    .then((coinInfo) => {
        console.log(coinInfo.id);
    });
```


### .estimateCoinSell()
Estimate how much coins you will get for selling some other coins.

```js
// by coin symbol
minter.estimateCoinSell({
    coinToSell: 'BIP',
    valueToSell: 10,
    coinToBuy: 'MYCOIN',
})
    .then((result) => {
        console.log(result.will_get, result.commission);
        // 123, 0.1
    });

// or by coin id
minter.estimateCoinSell({
    coinIdToSell: 0, // BIP id
    valueToSell: 10,
    coinIdToBuy: 123, // custom coin id
})
```

### .estimateCoinBuy()
Estimate how much coins you will pay for buying some other coins.

```js
// by coin symbol
minter.estimateCoinBuy({
    coinToBuy: 'MYCOIN',
    valueToBuy: 10,
    coinToSell: 'BIP',
})
    .then((result) => {
        console.log(result.will_pay, result.commission);
        // 123, 0.1
    });
// or by coin id

minter.estimateCoinBuy({
    coinIdToSell: 0, // BIP id
    valueToSell: 10,
    coinIdToBuy: 123, // custom coin id
})
```

### .estimateTxCommission()
Estimate transaction fee. Useful for transactions with `gasCoin` different from base coin BIP (or MNT).
Accept string with raw signed tx.
Resolves with commission value.

```js
minter.estimateTxCommission('0xf8920101028a4d4e540000000000000001aae98a4d4e...')
    .then((commission) => {
        console.log(commission);
        // 0.1
    });
```


### .replaceCoinSymbol()
Replace coin symbols with coin ids in txParams object

```js
/**
 * @param {TxParams} txParams
 * @return {Promise<TxParams>}
 */
const txParams = {
    type: 1,
    data: {
        to: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        value: 10,
        coin: 'BIP',
    },
    gasCoin: 'MYCOIN',
};
minter.replaceCoinSymbol(txParams)
    .then((newTxParams) => {
        console.log(newTxParams);
        // {
        //     type: 1,
        //     data: {
        //         to: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        //         value: 10,
        //         coin: 0,
        //     },
        //     gasCoin: 1234,
        // }
    });
```


### .replaceCoinSymbolByPath()
Replace coin symbols with coin ids in arbitrary object by path list

```js
const params = {
    foo: {
        bar: {
            coin: 'BIP',
        },
    },
    gasCoin: 'MYCOIN',
};
/**
 * @param {Object} params
 * @param {Array<string>} pathList
 * @param {number} [chainId]
 * @return {Promise<TxParams>}
 */
minter.replaceCoinSymbolByPath(params, ['gasCoin', 'foo.bar.coin'])
    .then((newParams) => {
        console.log(newParams);
        // {
        //     foo: {
        //         bar: {
        //             coin: 0,
        //         },
        //     },
        //     gasCoin: 1234,
        // }
    });
```


## Tx params

Tx params object to pass it to `postTx` or `prepareSignedTx` methods to post transaction to the blockchain

### Send
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.SEND,
    data: {
        to: 'Mx376615B9A3187747dC7c32e51723515Ee62e37Dc',
        value: 10,
        coin: 0, // BIP id
    },
};

minter.postTx(txParams, {privateKey: '...'});
```

### Multisend
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.MULTISEND,
    data: {
        list: [
            {
                value: 10,
                coin: 0, // BIP id
                to: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
            },
            {
                value: 2,
                coin: 0, // BIP id
                to: 'Mxfe60014a6e9ac91618f5d1cab3fd58cded61ee99',
            }
        ],
    },
};

minter.postTx(txParams, {privateKey: '...'});
```


### Sell
```js
const txParams = {
    type: TX_TYPE.SELL,
    data: {
        coinToSell: 0, // BIP id
        coinToBuy: 123, // custom coin id
        valueToSell: 10,
    },
};

minter.postTx(txParams, {privateKey: '...'});
```


### Sell All
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.SELL_ALL,
    data: {
        coinToSell: 0, // BIP id
        coinToBuy: 123, // custom coin id
    },
};

minter.postTx(txParams, {privateKey: '...'});
```


### Buy
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = new {
    type: TX_TYPE.BUY,
    data: {
        coinToSell: 0, // BIP id
        coinToBuy: 123, // custom coin id
        valueToBuy: 10,
    },
};

minter.postTx(txParams, {privateKey: '...'});
```


### Create Coin
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.CREATE_COIN,
    data: {
        name: 'My Coin',
        symbol: 'MYCOIN',
        initialAmount: 5,
        constantReserveRatio: 10,
        initialReserve: 20,
        maxSupply: 10000, // optional, by default 10**15
    },
};

minter.postTx(txParams, {privateKey: '...'});
```

### Recreate Coin
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.RECREATE_COIN,
    data: {
        name: 'My Coin',
        symbol: 'MYCOIN',
        initialAmount: 5,
        constantReserveRatio: 10,
        initialReserve: 20,
        maxSupply: 10000, // optional, by default 10**15
    },
};

minter.postTx(txParams, {privateKey: '...'});
```

### Edit Coin Owner
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.EDIT_COIN_OWNER,
    data: {
        symbol: 'MYCOIN',
        newOwner: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
    },
};

minter.postTx(txParams, {privateKey: '...'});
```


### Declare Candidacy
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.DECLARE_CANDIDACY,
    data: {
        address: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        commission: 10,
        coin: 0, // BIP id
        stake: 100,
    },
};

minter.postTx(txParams, {privateKey: '...'});
```

### Edit Candidate
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.EDIT_CANDIDATE,
    data: {
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        rewardAddress: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        ownerAddress: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        controlAddress: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
    },
};

minter.postTx(txParams, {privateKey: '...'});
```

### Edit Candidate Public Key
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.EDIT_CANDIDATE_PUBLIC_KEY,
    data: {
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        newPublicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
    },
};

minter.postTx(txParams, {privateKey: '...'});
```


### Delegate
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.DELEGATE,
    data: {
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        coin: 0, // BIP id
        stake: 100,
    },
};

minter.postTx(txParams, {privateKey: '...'});
```


### Unbond
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.UNBOND,
    data: {
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        coin: 0, // BIP id
        stake: 100,
    },
};

minter.postTx(txParams, {privateKey: '...'});
```


### Set Candidate On
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.SET_CANDIDATE_ON,
    data: {
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
    },
};

minter.postTx(txParams, {privateKey: '...'});
```


### Set Candidate Off
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.SET_CANDIDATE_OFF,
    data: {
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
    },
};

minter.postTx(txParams, {privateKey: '...'});
```


### Set Halt Block
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.SET_HALT_BLOCK,
    data: {
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        height: 1234,
    },
};

minter.postTx(txParams, {privateKey: '...'});
```

### Price Vote
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.PRICE_VOTE,
    data: {
        price: 1234,
    },
};

minter.postTx(txParams, {privateKey: '...'});
```


### Redeem Check
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.REDEEM_CHECK,
    data: {
        check: 'Mcf8ab3101830f423f8a4d4e5400000000000000888ac7230489e800008a4d4e5400000000000000b841f69950a210196529f47df938f7af84958cdb336daf304616c37ef8bebca324910910f046e2ff999a7f2ab564bd690c1102ab65a20e0f27b57a93854339b60837011ba00a07cbf311148a6b62c1d1b34a5e0c2b6931a0547ede8b9dfb37aedff4480622a023ac93f7173ca41499624f06dfdd58c4e65d1279ea526777c194ddb623d57027',
    },
};

// password and privateKey will be used to generate check's proof
minter.postTx(txParams, {privateKey: '...', password: 'pass'});
// also combination of password and address can be used to generate proof
minter.postTx(txParams, {privateKey: '...', address: '...', password: 'pass'});
```

### Create Multisig
[Multisig docs](https://docs.minter.network/#section/Multisignatures)

Addresses count must not be greater than 32.  
Weights count must be equal to addresses count.  
Weights must be between 0-1023.
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.CREATE_MULTISIG,
    data: {
        addresses: ['Mx7633980c000139dd3bd24a3f54e06474fa941e00', 'Mxfe60014a6e9ac91618f5d1cab3fd58cded61ee99'],
        weights: [40, 80],
        threshold: 100,
    },
};

minter.postTx(txParams, {privateKey: '...'});
```


### Edit Multisig
Send it from the multisig address

```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.EDIT_MULTISIG,
    data: {
        addresses: ['Mx7633980c000139dd3bd24a3f54e06474fa941e00', 'Mxfe60014a6e9ac91618f5d1cab3fd58cded61ee99'],
        weights: [40, 80],
        threshold: 100,
    },
};

minter.postTx(txParams, {privateKey: '...'});
```


## Transaction
### Prepare Transaction
Prepare `Tx` object from txParams, used under the hood of PostTx, accepts arguments:
 - `txParams` object, 
 - `options.privateKey` - optional, can be passed to txData constructor for redeem check transaction and can be used to sign transaction with single signature.
```js
import {prepareTx} from 'minter-js-sdk';
const tx = prepareTx(txParams, {privateKey});
console.log('signed tx', tx.serialize().toString('hex'));

// get actual nonce first
minter.getNonce('Mx...')
    .then((nonce) => {
        const tx = prepareTx({...txParams, nonce}, {privateKey});
        console.log('signed tx', tx.serialize().toString('hex'));
    });
```

### Prepare Single Signed Transaction
`prepareSignedTx` is an alias for `prepareTx` but with `signatureType: 1`. So it doesn't support multisignatures.
```js
import {prepareSignedTx, prepareTx} from 'minter-js-sdk';

let tx = prepareSignedTx(txParams, {privateKey});
// is the same as
tx = prepareTx({...txParams, signatureType: 1}, {privateKey})
```

### Make Signature
Make signature buffer for `Tx` with `privateKey`. Useful to create signatures for transactions with multiple signatures.
```js
import {makeSignature} from 'minter-js-sdk';

makeSignature(tx, privateKey);
```

### Multi Signatures
Usually you should collect signatures from other multisig participants, which can make it with `makeSignature`.
Then you should construct `signatureData` for `TxParams` object and pass such `TxParams` to `postTx` or `prepareTx`
```js
import {Minter, TX_TYPE, prepareTx, makeSignature} from "minter-js-sdk";

const minter = new Minter({/* ... */});
const txParams = {
    nonce: 1,
    chainId: 1,
    type: TX_TYPE.SEND,
    data: {
        to: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        value: 10,
        coin: 0, // BIP id    
    },
    gasCoin: 0, // BIP id
    gasPrice: 1,
    payload: 'custom message',
    signatureType: 2, // multiple signature type
};
const tx = prepareTx(txParams);

const signature1 = makeSignature(tx, privateKey1);
const signature2 = makeSignature(tx, privateKey2);

minter.postTx({
    ...txParams,
    signatureData: {
        multisig: multisigAddress,
        signatures: [signature1, signature2],
    },
})
```

### Decode Transaction
Decode RLP serialized tx into params object

Params:
`tx` - string, RLP decoded tx
`options` - object with extra options
`options.decodeCheck` - boolean, adds `checkData` field next to `check` field for redeemCheck tx data
```js
import {decodeTx} from 'minter-js-sdk';
decodeTx('0xf87e818102018a42414e414e415445535402a3e28a42414e414e41544553548a067d59060c9f4d7282328a4d4e540000000000000080808001b845f8431ca01d568386460de1dd40a7c73084a84be68bbf4696aea0208530d3bae2ccf47e4ba059cb6cbfb12e56d7f5f4f8c367a76a867aff09afca15e8d61a7ef4cf7e0d26be');
//  {
//      nonce: '129',
//      chainId: '2',
//      gasPrice: '1',
//      gasCoin: '0',
//      type: '0x02',
//      data: { 
//          coinToSell: '123',
//          valueToSell: '30646.456735029139767858',
//          coinToBuy: '0',
//          minimumValueToBuy: '0',
//      },
//      payload: '',
//      signatureType: '1',
//      signatureData: '0xf8431ca01d568386460de1dd40a7c73084a84be68bbf4696aea0208530d3bae2ccf47e4ba059cb6cbfb12e56d7f5f4f8c367a76a867aff09afca15e8d61a7ef4cf7e0d26be',
//  }
```


## Minter Check

[Minter Check](https://minter-go-node.readthedocs.io/en/dev/checks.html) is like an ordinary bank check. Each user of network can issue check with any amount of coins and pass it to another person. Receiver will be able to cash a check from arbitrary account. 

### `issueCheck()`

Checks are issued offline and do not exist in blockchain before “cashing”.

Params:
- `privateKey` - private key of the issuer to sign check. Type: string
- `password` - password to protect check. Type: string
- `nonce` - unique string to allow issue identical checks. Type: string
- `chainId` - network type to prevent using same check between networks. Type: number. Default: `1`
- `coin` - coin to transfer. Type: string
- `value` - amount to transfer. Type: number
- `gasCoin` - coin to pay fee, fee will be charged from issuer when RedeemCheck tx will be sent by check's recipient. Type: string. Default: network's base coin (`'BIP'` or `'MNT'`)
- `dueBlock` - number of block, at this block check will be expired. Type: number. Default: `999999999`

```js
// Since issuing checks is offline, you can use it standalone without instantiating SDK
import {issueCheck} from "minter-js-sdk";
const check = issueCheck({
    privateKey: '0x2919c43d5c712cae66f869a524d9523999998d51157dc40ac4d8d80a7602ce02',
    password: 'pass',
    nonce: '1',
    chainId: 1,
    coin: 0, // BIP id
    value: 10,
    gasCoin: 0, // BIP id
    dueBlock: 999999,
});
console.log(check);
// => 'Mcf8ab3101830f423f8a4d4e5400000000000000888ac7230489e800008a4d4e5400000000000000b841f69950a210196529f47df938f7af84958cdb336daf304616c37ef8bebca324910910f046e2ff999a7f2ab564bd690c1102ab65a20e0f27b57a93854339b60837011ba00a07cbf311148a6b62c1d1b34a5e0c2b6931a0547ede8b9dfb37aedff4480622a023ac93f7173ca41499624f06dfdd58c4e65d1279ea526777c194ddb623d57027'

// This method also available on the SDK instance
const check = minter.issueCheck({...});
```

### `decodeCheck()`

Decode raw check

```js
import {decodeCheck} from "minter-js-sdk";
const check = decodeCheck('Mcf8ab3101830f423f8a4d4e5400000000000000888ac7230489e800008a4d4e5400000000000000b841f69950a210196529f47df938f7af84958cdb336daf304616c37ef8bebca324910910f046e2ff999a7f2ab564bd690c1102ab65a20e0f27b57a93854339b60837011ba00a07cbf311148a6b62c1d1b34a5e0c2b6931a0547ede8b9dfb37aedff4480622a023ac93f7173ca41499624f06dfdd58c4e65d1279ea526777c194ddb623d57027');
console.log(check);
// =>
// {
//   nonce: '1',
//   chainId: 1,
//   coin: '0',
//   value: '10',
//   gasCoin: '0',
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
        coin: 0, // BIP id
    },
    gasCoin: 0, // BIP id
    payload: 'custom message',
};
prepareLink(txParams);
// => 'https://bip.to/tx/-EgBqumKTU5UAAAAAAAAAJR2M5gMAAE53TvSSj9U4GR0-pQeFoiKxyMEiegAAI5jdXN0b20gbWVzc2FnZYCAikFTRAAAAAAAAAA'
```

### `decodeLink()`
Decode link into transaction params

Params:
`url` - string with link
`options` - object with extra options
`options.decodeCheck` - boolean, adds `checkData` field next to `check` field for redeemCheck tx data
`options.privateKey` - links with `password` and without `proof` require privateKey to generate valid `proof`


```js
import {decodeLink} from 'minter-js-sdk';

decodeLink('https://bip.to/tx/-EgBqumKTU5UAAAAAAAAAJR2M5gMAAE53TvSSj9U4GR0-pQeFoiKxyMEiegAAI5jdXN0b20gbWVzc2FnZYCAikFTRAAAAAAAAAA');
// =>
// {
// gasCoin: 0,
// type: '0x01',
// data: {
//    to: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
//    coin: '0',
//    value: '10',
// },
// payload: 'custom message',
// }

const LINK_CHECK = 'https://bip.to/tx?d=f8f009b8e9f8e7b8a2f8a03101830f423f8a4d4e5400000000000000888ac7230489e80000b84149eba2361855724bbd3d20eb97a54ea15ad7dc28c1111b8dcf3bb15db26f874f095803cad9f8fc88b2b4eec9ba706325a7929be31b6ccfef01260791a844cb55011ba06c63ad17bfe07b82be8a0144fd4daf8b4144281fdf88f313205ceacf37fd877fa03c243ad79cab6205f4b753bd402c4cfa5d570888659090b2f923071ac52bdf75b8410497ea588f0fc2bd448de76d03a74cf371269e10ac1a02765fb5fa37c29f67e0348fb3faacd3370b8809401e7d562d8943f3642ce96667188d3c344e8e5bff6d0180808080'; 
decodeLink(LINK_CHECK, {decodeCheck: true})
// { 
//     type: '0x09',
//     data: { 
//         proof: '0x0497ea588f0fc2bd448de76d03a74cf371269e10ac1a02765fb5fa37c29f67e0348fb3faacd3370b8809401e7d562d8943f3642ce96667188d3c344e8e5bff6d01',
//         check: 'Mcf8a03101830f423f8a4d4e5400000000000000888ac7230489e80000b84149eba2361855724bbd3d20eb97a54ea15ad7dc28c1111b8dcf3bb15db26f874f095803cad9f8fc88b2b4eec9ba706325a7929be31b6ccfef01260791a844cb55011ba06c63ad17bfe07b82be8a0144fd4daf8b4144281fdf88f313205ceacf37fd877fa03c243ad79cab6205f4b753bd402c4cfa5d570888659090b2f923071ac52bdf75',
//         checkData: {
//            nonce: '1',
//            chainId: '1',
//            coin: '0',
//            value: '10',
//            dueBlock: '999999',
//         },
//     },
//     payload: '',
// }

```






## Minter Wallet
Use [minterjs-wallet](https://github.com/MinterTeam/minterjs-wallet)


# License

MIT License
