![Logo](minter-logo.svg)

[![NPM Package](https://img.shields.io/npm/v/minter-js-sdk.svg?style=flat-square)](https://www.npmjs.org/package/minter-js-sdk)
[![Build Status](https://img.shields.io/github/workflow/status/MinterTeam/minter-js-sdk/Test?label=test&style=flat-square)](https://github.com/MinterTeam/minter-js-sdk/actions/workflows/test-with-coverage.yml)
[![Coverage Status](https://img.shields.io/coveralls/github/MinterTeam/minter-js-sdk/master.svg?style=flat-square)](https://coveralls.io/github/MinterTeam/minter-js-sdk?branch=master)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square&label=license)](https://github.com/MinterTeam/minter-js-sdk/blob/master/LICENSE)

This package aims to provide an easy-to-use JS helping developers communicate with the Minter blockchain through its API.

This package should aid any developer building JS applications on top of the Minter blockchain.

Please note that this SDK is under active development and subject to change.

**NOTE:** since 0.34.0, SDK supports only v2 versions of node and gate APIs

It is complemented by the following packages:
- [minterjs-wallet](https://github.com/MinterTeam/minterjs-wallet) for BIP39 mnemonic phrases, private keys, and addresses
- [minterjs-util](https://github.com/MinterTeam/minterjs-util) for utility functions

Contents:
- [Installation](#installation)
- [Usage](#usage)
  - [SDK API instance](#sdk-instance)
    - [postTx](#posttx)
    - [postSignedTx](#postsignedtx)
    - [getNonce](#getnonce)
    - [ensureNonce](#ensurenonce)
    - [getMinGasPrice](#getmingasprice)
    - [getCoinInfo](#getcoininfo)
    - [getCoinId](#getcoinid)
    - [getCoinSymbol](#getcoinsymbol)
    - [replaceCoinSymbol](#replacecoinsymbol)
    - [replaceCoinId](#replacecoinid)
    - [replaceCoinSymbolByPath](#replacecoinsymbolbypath)
    - [replaceCoinIdByPath](#replacecoinidbypath)
    - [estimateCoinBuy](#estimatecoinbuy)
    - [estimateCoinSell](#estimatecoinsell)
    - [estimateCoinSellAll](#estimatecoinsellall)
    - [estimateTxCommission](#estimatetxcommission)
  - [Tx params constructors](#tx-params)
    - [Send](#send)
    - [Multisend](#multisend)
    - [Buy](#buy)
    - [Sell](#sell)
    - [Sell all](#sell-all)
    - [Buy from pool](#buy-from-swap-pool)
    - [Sell to pool](#sell-to-swap-pool)
    - [Sell all to pool](#sell-all-to-swap-pool)
    - [Add limit order](#add-limit-order)
    - [Remove limit order](#remove-limit-order)
    - [Create pool](#create-pool)
    - [Add liquidity to pool](#add-liquidity-to-pool)
    - [Remove liquidity from pool](#remove-liquidity-from-pool)
    - [Create coin](#create-coin)
    - [Recreate coin](#recreate-coin)
    - [Create token](#create-token)
    - [Recreate token](#recreate-token)
    - [Edit ticker owner](#edit-ticker-owner)
    - [Mint token](#mint-token)
    - [Burn token](#burn-token)
    - [Declare candidacy](#declare-candidacy)
    - [Edit candidate](#edit-candidate)
    - [Edit candidate public key](#edit-candidate-public-key)
    - [Edit candidate commission](#edit-candidate-commission)
    - [Delegate](#delegate)
    - [Unbond](#unbond)
    - [Move stake](#move-stake)
    - [Lock stake](#lock-stake)
    - [Set candidate on](#set-candidate-on)
    - [Set candidate off](#set-candidate-off)
    - [Set halt block](#set-halt-block)
    - [Vote for commission price](#vote-for-commission-price)
    - [Vote for network update](#vote-for-network-update)
    - [Redeem check](#redeem-check)
    - [Lock](#lock)
    - [Create multisig](#create-multisig)
    - [Edit multisig](#edit-multisig)
  - [Transaction](#transaction)
    - [Prepare transaction](#prepare-transaction)
    - [Prepare single-signed transaction](#prepare-single-signed-transaction)
    - [Make signature](#make-signature)
    - [Multi-signatures](#multi-signatures)
    - [Decode transaction](#decode-transaction)
  - [Minter check](#minter-check)
    - [issueCheck](#issuecheck)
    - [decodeCheck](#decodecheck)
  - [Minter link](#minter-link)
    - [prepareLink](#preparelink)
    - [decodeLink](#decodelink)
  - [Minter wallet](#minter-wallet)
- [License](#license)


# Installation

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
        coin: 0, // coin id
    },
    gasCoin: 0, // coin id
    gasPrice: 1,
    payload: 'custom message',
};

minter.postTx(txParams, {seedPhrase: 'exercise fantasy smooth enough ...'})
    .then((txHash) => {
        // WARNING
        // If you use minter-node api, successful response would mean that tx just got in mempool but is not on the blockchain yet
        // You have to wait for it to be included in the upcoming block
        // You can use gate api instead, which returns successful response only after tx has appeared on the blockchain
        // WARNING #2 
        // If tx has been included in the block, it may still have failed status
        // Verify that tx.code is `0` to ensure its success
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
    // no `gasPrice` specified, "1" will be used by default and in case of error, request will be retried with auto-corrected value
    chainId: 1,
    type: TX_TYPE.SEND,
    data: {
        to: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        value: 10,
        coin: 'BIP', // coin symbol
    },
    gasCoin: 'MYCOIN', // coin symbol
};

// coin symbols in txParams will be replaced automatically with coin ids
minter.postTx(newTxParams, {
    // seedPhrase can be used to sign transaction instead of privateKey
    seedPhrase: 'air model item valley auction bullet crisp always erosion paper orient fog',
})
    .then((txHash) => {
      // WARNINGs for minter-node api users:
      // #1
      // Successful response would mean that tx just got in mempool but is not on the blockchain yet
      // You have to wait for it to be included in the upcoming block
      // #2 
      // If tx has been included in the block, it may still have failed status
      // Verify that tx.code is `0` to ensure its success
      // Gate api users not affected:
      // Gate will return successful response only after tx has appeared on the blockchain
      // Gate also returns tx data in the response, so SDK will check tx.code automatically and reject promise for non-zero codes
        alert(`Tx created: ${txHash}`);
    }).catch((error) => {
        const errorMessage = error.response.data.error.message
        alert(errorMessage);
    });
```


## SDK instance

Create `minter` SDK instance from `Minter` constructor. It contains methods to communicate with API.
`Minter` will accept [axios config](https://github.com/axios/axios#config-defaults) as params and return [axios instance](https://github.com/axios/axios#creating-an-instance).

One extra field of options object is `apiType`, which takes either [`'gate'`](https://minterteam.github.io/minter-gate-docs/) or [`'node'`](https://www.minter.network/docs#node-api). It is used to determine which type of API to use.

```js
// specify gate url
const minterGate = new Minter({chainId: 2, apiType: 'gate', baseURL: 'https://gate-api.minter.network/api/v2/'});
// specify node url
const minterNode = new Minter({chainId: 2, apiType: 'node', baseURL: 'https://node-api.testnet.minter.network/v2/'});
```

`Minter` constructor has the following options:
- `apiType`: [`'gate'`](https://minterteam.github.io/minter-gate-docs/) or [`'node'`](https://www.minter.network/docs#node-api)
- `baseURL`: API URL
- `chainId`: default chain ID, used if no chainId is specified in tx params. 1 = mainnet, 2 = testnet

`minter` SDK instance has the following methods:
- [postTx](#posttx)
- [postSignedTx](#postsignedtx)
- [getNonce](#getnonce)
- [ensureNonce](#ensurenonce)
- [getMinGasPrice](#getmingasprice)
- [getCoinInfo](#getcoininfo)
- [getCoinId](#getcoinid)
- [getCoinSymbol](#getcoinsymbol)
- [replaceCoinSymbol](#replacecoinsymbol)
- [replaceCoinId](#replacecoinid)
- [replaceCoinSymbolByPath](#replacecoinsymbolbypath)
- [replaceCoinIdByPath](#replacecoinidbypath)
- [estimateCoinBuy](#estimatecoinbuy)
- [estimateCoinSell](#estimatecoinsell)
- [estimateCoinSellAll](#estimatecoinsellall)
- [estimateTxCommission](#estimatetxcommission)


### .postTx()

Post new transaction to blockchain.  
Accepts the [tx params](#tx-params) object and makes an asynchronous request to the blockchain API.  
- `txParams.nonce` - optional, if no nonce is given, it will be requested by `getNonce` automatically
- `txParams.gasPrice` - fee multiplier, 1 by default. Should be equal to or greater than mempool's current min gas price
- `gasRetryLimit` - count of repeating request, 2 by default. If the first request fails because of low gas, it will be repeated with an updated `gasPrice`
- `mempoolRetryLimit` - count of repeating request, 0 by default. If the first request fails because of the "Tx from address already exists in mempool" error, it will be repeated in 5 seconds (average block time), trying to put it into the new block

Returns promise that resolves with:
 - sent transaction data included in a **block** (from gate), 
 - or transaction hash included in **mempool** (from node). 

*Please note: always verify that transactions you send have no errors (tx in a block should have `code: 0`). Otherwise, they will not be executed.*


```js
/**
 * @typedef {Object} TxParams
 * @property {number} [nonce] - can be omitted, will be received by `getNonce`
 * @property {number} [chainId=1] - 1 = mainnet, 2 = testnet
 * @property {number} [gasPrice=1] - can be updated automatically on retry if gasRetryLimit > 0
 * @property {string} [gasCoin='BIP']
 * @property {string|TX_TYPE|Buffer} type
 * @property {Object|Buffer|TxData} data
 * @property {string} [payload]
 * @property {number} [signatureType=1]
 * @property {number} [signatureData] - can be signed automatically if `privateKey` or `seedPhrase` passed
 */

/**
* @param {TxParams} txParams
* @param {PostTxOptions} txOptions
* @param {number} [txOptions.gasRetryLimit=2] - number of retries if request failed because of low gas
* @param {number} [txOptions.nonceRetryLimit=0] - number of retries if request failed because of invalid nonce
* @param {number} [txOptions.mempoolRetryLimit=0] - number of retries if request failed with error "Tx from address already exists in mempool"
* @param {string|Buffer} [txOptions.seedPhrase] - alternative to txOptions.privateKey
* @param {string|Buffer} [txOptions.privateKey] - to sign tx or get nonce or to make proof for redeemCheck tx
* @param {string} [txOptions.address] - to get nonce (useful for multi-signatures) or to make proof for redeemCheck tx
* @param {ByteArray} [txOptions.password] - to make proof for RedeemCheckTxData
* @param {AxiosRequestConfig} [axiosOptions] - for main request (send tx hash)
* @param {AxiosRequestConfig} [extraAxiosOptions] - for secondary requests (nonce and coin IDs)
* @return {Promise<NodeTransaction|{hash: string}>}
*/
minter.postTx(txParams, {seedPhrase: '...', gasRetryLimit: 2, mempoolRetryLimit: 0})
    .then((tx) => {
        console.log(tx.hash);
        // 'Mt...'
        // Check here that tx in block has no errors (code === 0)
    });
```

### .postSignedTx()

Post new transaction to blockchain.  
Accepts signed tx string or Buffer and makes an asynchronous request to the blockchain API.  
Returns promise that resolves with:
 - sent transaction data included in a **block** (from gate), 
 - or transaction hash included in **mempool** (from node). 

```js
/**
* @param {string|Buffer} signedTx
* @param {AxiosRequestConfig} [axiosOptions]
* @return {Promise<NodeTransaction|{hash: string}>}
*/
minter.postSignedTx('0xf8920102018a4d4e540000000000000001aae98a4d4e5400000000...')
    .then((tx) => {
        console.log(tx.hash);
        // 'Mt...'
    });
```

### .getNonce()

Get nonce for the new transaction from a given address.  
Accepts address string and makes an asynchronous request to the blockchain API.  
Returns promise that resolves with nonce for the new tx (current address tx count + 1).

```js
minter.getNonce('Mx...')
    .then((nonce) => {
        console.log(nonce);
        // 123
    });
```


### .ensureNonce()
Ensure nonce for the tx params. You should provide an address for which you want to get nonce. Accepts `seedPhrase` or `privateKey` as well—the address will be derived from either of them.

```js
/**
 * @param {MinterApiInstance} apiInstance
 * @param {TxParams} txParams
 * @param {Object} txOptions
 * @param {string} [txOptions.seedPhrase]
 * @param {ByteArray} [txOptions.privateKey]
 * @param {string} [txOptions.address]
 * @param {AxiosRequestConfig} [axiosOptions]
 * @return {Promise<number>}
 */
minter.ensureNonce(txParams, {seedPhrase: '...'})
    .then((nonce) => {
        console.log(nonce);
        // 123
    });
```


### .getMinGasPrice()
Get current minimum gas price.

```js
minter.getMinGasPrice()
    .then((gasPrice) => {
        console.log(gasPrice);
        // 1
    });
```


### .getCoinInfo()
Get coin info by coin ID or symbol.

```js
/**
 * @param {string|number} coin - coind ID or symbol 
 * @param {AxiosRequestConfig} [axiosOptions]
 * @return {Promise<CoinInfo>}
 */
minter.getCoinInfo(coin)
    .then((coinInfo) => {
        console.log(coinInfo.id, coinInfo.symbol);
    });
```


### .getCoinId()
Get coin ID by coin symbol or array of symbols. Uses `getCoinInfo()` under the hood.

```js
/**
 * @param {string|Array<string>} symbol - coin symbol or array of symbols
 * @param {number} [chainId]
 * @param {AxiosRequestConfig} [axiosOptions]
 * @return {Promise<number|Array<number>>}
 */
minter.getCoinId('MNT')
    .then((id) => {
        console.log(id);
        // 0
    });

minter.getCoinId(['MNT', 'MYCOIN'])
    .then((ids) => {
          console.log(ids);
          // [0, 123]
    });
```


### .getCoinSymbol()
Get coin symbol by coin ID or array of IDs. Uses `getCoinInfo()` under the hood.

```js
/**
 * @param {number|string|Array<number|string>} id - coin ID or array of IDs
 * @param {number} [chainId]
 * @param {AxiosRequestConfig} [axiosOptions]
 * @return {Promise<string|Array<string>>}
 */
minter.getCoinSymbol(0)
    .then((symbol) => {
        console.log(symbol);
        // 0
    });

minter.getCoinSymbol(['0', '123'])
    .then((symbols) => {
          console.log(symbols);
          // ['MNT', 'MYCOIN']
    });
```


### .replaceCoinSymbol()
Replace coin symbols with coin IDs in txParams object. Mutates original object.

```js
/**
 * @param {TxParams} txParams
 * @param {AxiosRequestConfig} [axiosOptions]
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


### .replaceCoinId()
Replace coin IDs with coin symbols in txParams object. Mutates original object.

```js
/**
 * @param {TxParams} txParams
 * @param {AxiosRequestConfig} [axiosOptions]
 * @return {Promise<TxParams>}
 */
const txParams = {
    type: 1,
    data: {
        to: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        value: 10,
        coin: 0,
    },
    gasCoin: 123,
};
minter.replaceCoinId(txParams)
    .then((newTxParams) => {
        console.log(newTxParams);
        // {
        //     type: 1,
        //     data: {
        //         to: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        //         value: 10,
        //         coin: 'BIP',
        //     },
        //     gasCoin: 'MYCOIN',
        // }
    });
```


### .replaceCoinSymbolByPath()
Replace coin symbols with coin IDs in arbitrary object by path list.

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
 * @param {AxiosRequestConfig} [axiosOptions]
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


### .replaceCoinIdByPath()
Replace coin IDs with coin symbols in arbitrary object by path list.

```js
const params = {
    foo: {
        bar: {
            coin: 0,
        },
    },
    gasCoin: 1234,
};
/**
 * @param {Object} params
 * @param {Array<string>} pathList
 * @param {number} [chainId]
 * @param {AxiosRequestConfig} [axiosOptions]
 * @return {Promise<TxParams>}
 */
minter.replaceCoinIdByPath(params, ['gasCoin', 'foo.bar.coin'])
    .then((newParams) => {
        console.log(newParams);
        // {
        //     foo: {
        //         bar: {
        //             coin: 'BIP',
        //         },
        //     },
        //     gasCoin: 'MYCOIN',
        // }
    });
```


### .estimateCoinBuy()
Estimate how many coins you will pay to buy some other coins.

```js
/**
 * @param {Object} params
 * @param {string|number} params.coinToBuy - ID or symbol of the coin to buy
 * @param {string|number} params.valueToBuy
 * @param {string|number} params.coinToSell - ID or symbol of the coin to sell
 * @param {ESTIMATE_SWAP_TYPE} [params.swapFrom] - estimate from pool, bancor, or optimal
 * @param {Array<number>} [params.route] - IDs of intermediate coins for pool swaps
 * @param {string|number} [params.gasCoin]
 * @param {string|number} [params.coinCommission] - gasCoin alias
 * @param {AxiosRequestConfig} [axiosOptions]
 * @return {Promise<EstimateBuyResult>}
 */

/**
 * @typedef {Object} EstimateBuyResult
 * @property {number|string} will_pay - amount of coinToSell
 * @property {number|string} commission - amount of coinToSell to pay fee
 * @property {"pool"|"bancor"} swap_from
 */

minter.estimateCoinBuy({
    coinToBuy: 'MYCOIN',
    valueToBuy: 10,
    coinToSell: 'BIP',
})
    .then((result) => {
        console.log(result.will_pay, result.commission, result.swap_from);
        // 123, 0.1, 'pool'
    });
```


### .estimateCoinSell()
Estimate how many coins you will get for selling some other coins.

```js
/**
 * @param {Object} params
 * @param {string|number} params.coinToSell - ID or symbol of the coin to sell
 * @param {string|number} params.valueToSell
 * @param {string|number} params.coinToBuy - ID or symbol of the coin to buy
 * @param {ESTIMATE_SWAP_TYPE} [params.swapFrom] - estimate pool swap
 * @param {Array<string|number>} [params.route] - IDs of intermediate coins for pool swaps
 * @param {string|number} [params.gasCoin]
 * @param {string|number} [params.coinCommission] - gasCoin alias
 * @param {AxiosRequestConfig} [axiosOptions]
 * @return {Promise<EstimateSellResult>}
 */

/**
 * @typedef {Object} EstimateSellResult
 * @property {number|string} will_get - amount of coinToBuy
 * @property {number|string} commission - amount of coinToSell to pay fee
 * @property {"pool"|"bancor"} swap_from
 */

minter.estimateCoinSell({
    coinToSell: 'BIP',
    valueToSell: 10,
    coinToBuy: 'MYCOIN',
})
    .then((result) => {
        console.log(result.will_get, result.commission, result.swap_from);
        // 123, 0.1, 'pool'
    });
```

### .estimateCoinSellAll()
Estimate how many coins you will get for selling some other coins by SellAll transaction.

```js
/**
 * @param {Object} params
 * @param {string|number} params.coinToSell - ID or symbol of the coin to sell
 * @param {string|number} params.valueToSell
 * @param {string|number} params.coinToBuy - ID or symbol of the coin to buy
 * @param {ESTIMATE_SWAP_TYPE} [params.swapFrom] - estimate pool swap
 * @param {Array<string|number>} [params.route] - IDs of intermediate coins for pool swaps
 * @param {string|number} [params.gasPrice]
 * @param {AxiosRequestConfig} [axiosOptions]
 * @return {Promise<EstimateSellAllResult>}
 */

/**
 * @typedef {Object} EstimateSellAllResult
 * @property {number|string} will_get - amount of coinToBuy
 * @property {"pool"|"bancor"} swap_from
 */

minter.estimateCoinSellAll({
    coinToSell: 'BIP',
    valueToSell: 10,
    coinToBuy: 'MYCOIN',
})
    .then((result) => {
        console.log(result.will_get, result.swap_from);
        // 123, 'pool'
    });
```


### .estimateTxCommission()
Estimate transaction fee.

First argument `txParams` can be a `TxParams` object or raw signed tx hex string.  
Second options argument accepts `needGasCoinFee`, `needBaseCoinFee`, and `needPriceCoinFee` fields to customize estimate behaviour.
Resolves with object containing fee.

`needGasCoinFee`
- `FEE_PRECISION_SETTING.PRECISE` (default) - make direct call to `estimate_tx_commission/{tx}` api method and return `commission` field
- `FEE_PRECISION_SETTING.IMPRECISE` - if gasCoin same as baseCoin and baseCoinFee is defined (otherwise upgrades to `PRECISE`), then it makes several requests for blockchain data and approximately calculates the fee relying on that data, but don't take limit orders into account.  
Pros: if used with request caching then when users input payload, the fee could be calculated dynamically without extra requests for each payload character.  
Cons: less accurate because don't consider limit orders, makes more requests for a single estimate.
- `FEE_PRECISION_SETTING.OMIT` - omits `commission` field


`needBaseCoinFee`
- `FEE_PRECISION_SETTING.IMPRECISE` - works only if priceCoinFee is defined, calculates basing on pool data, inaccurate because don't consider limit orders
- ` FEE_PRECISION_SETTING.OMIT` (default) - omits `baseCoinComission` field

`needPriceCoinFee`
- `FEE_PRECISION_SETTING.PRECISE` - make an API call to the `price_commissions` method and returns `priceCoinCommission` and `commissionPriceData` fields
- `FEE_PRECISION_SETTING.OMIT` (default) - omits `priceCoinCommission`

See also [Minter commissions docs](https://www.minter.network/docs#commissions)

```js
/**
 * @param {TxParams|string} txParams
 * @param {object} [options]
 * @param {FEE_PRECISION_SETTING} [options.needGasCoinFee]
 * @param {FEE_PRECISION_SETTING} [options.needBaseCoinFee]
 * @param {FEE_PRECISION_SETTING} [options.needPriceCoinFee]
 * @param {AxiosRequestConfig} [axiosOptions] - for main request (estimation)
 * @param {AxiosRequestConfig} [extraAxiosOptions] - for secondary requests (commission price data, coin IDs, and pool info)
 * @return {Promise<{commission: (number|string), baseCoinCommission: (number|string), priceCoinCommission: (number|string), commissionPriceData: CommissionPriceData}>|Promise<{commission: (number|string)}>}
 */

// from raw tx string: one direct api call
minter.estimateTxCommission('0xf8920101028a4d4e540000000000000001aae98a4d4e...')
    .then((feeData) => {
        console.log(feeData);
        // { commission: 0.1 }
    });

// from tx params: one direct api call
minter.estimateTxCommission({
    type: TX_TYPE.SEND,
    data: {to: 'Mx...', value: 10, coin: 'BIP'},
    gasCoin: 'BIP',
}, {
    needGasCoinFee: FEE_PRECISION_SETTING.PRECISE,
    needBaseCoinFee: FEE_PRECISION_SETTING.OMIT,
    needPriceCoinFee: FEE_PRECISION_SETTING.OMIT,
})
    .then((feeData) => {
        console.log(feeData);
        // { commission: 0.1 }
    });

// from tx params: calculated on fee price info and pool data
// with caching enabled can save api calls when 
minter.estimateTxCommission(
    {
        type: TX_TYPE.SEND,
        data: {to: 'Mx...', value: 10, coin: 'BIP'},
        gasCoin: 'BIP',
    }, {
        needGasCoinFee: FEE_PRECISION_SETTING.IMPRECISE,
        needBaseCoinFee: FEE_PRECISION_SETTING.IMPRECISE,
        needPriceCoinFee: FEE_PRECISION_SETTING.PRECISE,
    }
)
    .then((feeData) => {
        console.log(feeData);
        // { commission: 0.1, baseCoinCommission: 0.1, priceCoinCommission: 0.1, commissionPriceData: {coin: {id: 0, symbol: 'BIP'}, /*...*/} }
    });
```



## Tx params

Tx params object that is passed to `postTx` or `prepareSignedTx` methods to post transaction to blockchain.

- nonce - unique number for each address, used to prevent transaction replication, starts from 1
- chainId - id of the network (1 = mainnet, 2 = testnet)
- gasPrice - fee multiplier, should be equal to or greater than current mempool min gas price
- gasCoin - coin to pay fee
- type - type of transaction (see below)
- data - data of transaction (depends on transaction type)
- payload (arbitrary bytes) - arbitrary user-defined bytes
- serviceData - reserved field
- signatureType - 1 = single-signed, 2 = multi-signed
- signatureData - digital signature of transaction

```js
/**
 * @typedef {Object} TxParams
 * @property {number} [nonce]
 * @property {number} [chainId=1]
 * @property {number} [gasPrice=1]
 * @property {number|string} [gasCoin='0']
 * @property {string|Buffer|TX_TYPE} type
 * @property {Buffer|TxData|Object} data
 * @property {string} [payload]
 * @property {number} [signatureType]
 * @property {ByteArray|{multisig: ByteArray, signatures: Array<ByteArray>}} [signatureData]
 */
```

## Transaction types

### Send
[Tx docs](https://www.minter.network/docs#send-transaction)
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.SEND,
    data: {
        to: 'Mx376615B9A3187747dC7c32e51723515Ee62e37Dc',
        value: 10,
        coin: 0, // coin id
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```

### Multisend
[Tx docs](https://www.minter.network/docs#multisend-transaction)
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.MULTISEND,
    data: {
        list: [
            {
                value: 10,
                coin: 0, // coin id
                to: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
            },
            {
                value: 2,
                coin: 0, // coin id
                to: 'Mxfe60014a6e9ac91618f5d1cab3fd58cded61ee99',
            }
        ],
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```


### Buy
[Tx docs](https://www.minter.network/docs#buy-coin-transaction)
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.BUY,
    data: {
        coinToSell: 0, // coin id
        coinToBuy: 123, // coin id
        valueToBuy: 10,
        maximumValueToSell: 1234 // optional, 10^15 by default
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```


### Sell
[Tx docs](https://www.minter.network/docs#sell-coin-transaction)
```js
const txParams = {
    type: TX_TYPE.SELL,
    data: {
        coinToSell: 0,
        coinToBuy: 123,
        valueToSell: 10,
        minimumValueToBuy: 0, // optional, 0 by default
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```


### Sell all
[Tx docs](https://www.minter.network/docs#sell-all-coin-transaction)
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    // `gasCoin` will be set as `coinToSell` automatically
    type: TX_TYPE.SELL_ALL,
    data: {
        coinToSell: 0, // coin id
        coinToBuy: 123, // coin id
        minimumValueToBuy: 0, // optional, 0 by default
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```

### Buy from swap pool
[Tx docs](https://www.minter.network/docs#buy-from-swap-pool-transaction)
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.BUY_SWAP_POOL,
    data: {
        coins: [0, 123, 15], // route of coin IDs from spent to received
        valueToBuy: 10,
        maximumValueToSell: 1234 // optional, 10^15 by default
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```

### Sell to swap pool
[Tx docs](https://www.minter.network/docs#sell-from-swap-pool-transaction)
```js
const txParams = {
    type: TX_TYPE.SELL_SWAP_POOL,
    data: {
        coins: [0, 123, 15], // route of coin IDs from spent to received
        valueToSell: 10,
        minimumValueToBuy: 0, // optional, 0 by default
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```


### Sell all to swap pool
[Tx docs](https://www.minter.network/docs#sell-all-from-swap-pool-transaction)
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    // `gasCoin` will be set as coin to spend (`coins[0]`) automatically
    type: TX_TYPE.SELL_ALL_SWAP_POOL,
    data: {
        coins: [0, 123, 15], // route of coin IDs from spent to received
        minimumValueToBuy: 0, // optional, 0 by default
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```

### Add limit order
[Tx docs](https://www.minter.network/docs#add-limit-order-transaction)
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    // `gasCoin` will be set as `coinToSell` automatically
    type: TX_TYPE.ADD_LIMIT_ORDER,
    data: {
        coinToSell: 0, // coin id
        coinToBuy: 5, // coin id
        valueToSell: 10,
        valueToBuy: 10,
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```

### Remove limit order
[Tx docs](https://www.minter.network/docs#remove-limit-order-transaction)
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.REMOVE_LIMIT_ORDER,
    data: {
        id: 123, // order id
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```


### Create pool
[Tx docs](https://www.minter.network/docs#create-swap-pool-transaction)
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.CREATE_SWAP_POOL,
    data: {
      coin0: 12,
      coin1: 34,
      volume0: 123,
      volume1: 456,
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```

### Add liquidity to pool
[Tx docs](https://www.minter.network/docs#add-liquidity-to-swap-pool-transaction)
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.ADD_LIQUIDITY,
    data: {
      coin0: 12,
      coin1: 34,
      volume0: 123,
      maximumVolume1: 456,
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```

### Remove liquidity from pool
[Tx docs](https://www.minter.network/docs#remove-liquidity-from-swap-pool-transaction)
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.REMOVE_LIQUIDITY,
    data: {
      coin0: 12,
      coin1: 34,
      liquidity: 123, // amount of LP tokens
      minimumVolume0: 0,
      minimumVolume1: 0,
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```


### Create coin
[Tx docs](https://www.minter.network/docs#create-coin-transaction)
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
        maxSupply: 10000, // optional, 10^15 by default
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```

### Recreate coin
[Tx docs](https://www.minter.network/docs#recreate-coin-transaction)
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
        maxSupply: 10000, // optional, 10^15 by default
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```


### Create token
[Tx docs](https://www.minter.network/docs#create-token-transaction)
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.CREATE_TOKEN,
    data: {
        name: 'My Coin',
        symbol: 'MYCOIN',
        initialAmount: 5,
        maxSupply: 10000, // optional, 10^15 by default
        mintable: true,
        burnable: true,
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```

### Recreate token
[Tx docs](https://www.minter.network/docs#recreate-token-transaction)
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.RECREATE_TOKEN,
    data: {
        name: 'My Coin',
        symbol: 'MYCOIN',
        initialAmount: 5,
        maxSupply: 10000, // optional, 10^15 by default
        mintable: true,
        burnable: true,
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```


### Edit ticker owner
[Tx docs](https://www.minter.network/docs#edit-ticker-owner-transaction)
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.EDIT_TICKER_OWNER,
    data: {
        symbol: 'MYCOIN',
        newOwner: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```


### Mint token
[Tx docs](https://www.minter.network/docs#mint-token-transaction)
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.MINT_TOKEN,
    data: {
        coin: 1, // coin id
        value: 123,
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```

### Burn token
[Tx docs](https://www.minter.network/docs#burn-token-transaction)
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.BURN_TOKEN,
    data: {
        coin: 1, // coin id
        value: 123,
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```


### Declare candidacy
[Tx docs](https://www.minter.network/docs#declare-candidacy-transaction)
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.DECLARE_CANDIDACY,
    data: {
        address: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        commission: 10, // percentage
        coin: 0, // coin id
        stake: 100, // amount
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```

### Edit candidate
[Tx docs](https://www.minter.network/docs#edit-candidate-transaction)
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

minter.postTx(txParams, {seedPhrase: '...'});
```

### Edit candidate public Key
[Tx docs](https://www.minter.network/docs#edit-candidate-public-key-transaction)
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.EDIT_CANDIDATE_PUBLIC_KEY,
    data: {
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        newPublicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```

### Edit candidate commission
[Tx docs](https://www.minter.network/docs#edit-candidate-commission-transaction)
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.EDIT_CANDIDATE_COMMISSION,
    data: {
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        commission: 10, // percentage
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```


### Delegate
[Tx docs](https://www.minter.network/docs#delegate-transaction)
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.DELEGATE,
    data: {
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        coin: 0, // coin id
        stake: 100,
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```


### Unbond
[Tx docs](https://www.minter.network/docs#unbond-transaction)
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.UNBOND,
    data: {
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        coin: 0, // coin id
        stake: 100,
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```


### Move stake
[Tx docs](https://www.minter.network/docs#move-stake-transaction)
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.MOVE_STAKE,
    data: {
        from: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        to: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a4',
        coin: 0, // coin id
        stake: 100,
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```

### Lock stake
[Tx docs](https://www.minter.network/docs#lock-stake-transaction)
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.LOCK_STAKE,
    /* data is empty, so not required */
    data: {},
};

minter.postTx(txParams, {seedPhrase: '...'});
```


### Set candidate on
[Tx docs](https://www.minter.network/docs#set-candidate-online-transaction)
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.SET_CANDIDATE_ON,
    data: {
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```


### Set candidate off
[Tx docs](https://www.minter.network/docs#set-candidate-offline-transaction)
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.SET_CANDIDATE_OFF,
    data: {
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```


### Set halt block
[Tx docs](https://www.minter.network/docs#set-halt-block-transaction)
Vote for halt block.
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.SET_HALT_BLOCK,
    data: {
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        height: 1234,
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```

### Vote for commission price
[Tx docs](https://www.minter.network/docs#vote-for-commission-price-transaction)
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.VOTE_COMMISSION,
    data: {
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        height: 1234,
        coin: 0, // coin id
        payloadByte: '12',
        send: '12',
        buyBancor: '12',
        sellBancor: '12',
        sellAllBancor: '12',
        buyPoolBase: '12',
        sellPoolBase: '12',
        sellAllPoolBase: '12',
        buyPoolDelta: '12',
        sellPoolDelta: '12',
        sellAllPoolDelta: '12',
        createTicker3: '12',
        createTicker4: '12',
        createTicker5: '12',
        createTicker6: '12',
        createTicker7to10: '12',
        createCoin: '12',
        createToken: '12',
        recreateCoin: '12',
        recreateToken: '12',
        declareCandidacy: '12',
        delegate: '12',
        unbond: '12',
        redeemCheck: '12',
        setCandidateOn: '12',
        setCandidateOff: '12',
        createMultisig: '12',
        multisendBase: '12',
        multisendDelta: '12',
        editCandidate: '12',
        setHaltBlock: '12',
        editTickerOwner: '12',
        editMultisig: '12',
        editCandidatePublicKey: '12',
        addLiquidity: '12',
        removeLiquidity: '12',
        editCandidateCommission: '12',
        burnToken: '12',
        mintToken: '12',
        voteCommission: '12',
        voteUpdate: '12',
        createSwapPool: '12',
        failedTx: '12',
        addLimitOrder: '12',
        removeLimitOrder: '12',
        moveStake: '12',
        lockStake: '12',
        lock: '12',
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```

### Vote for network update
[Tx docs](https://www.minter.network/docs#vote-for-network-update-transaction)
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.VOTE_UPDATE,
    data: {
        version: 'v2.1',
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        height: 1234,
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```

### Price vote
Disabled
[Tx docs](https://www.minter.network/docs#price-vote-transaction)
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.PRICE_VOTE,
    data: {
        price: 1234,
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```


### Redeem check
[Checks docs](https://www.minter.network/docs#minter-check)  
[Tx docs](https://www.minter.network/docs#redeem-check-transaction)  
See also [how to issue check](#issuecheck)
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.REDEEM_CHECK,
    data: {
        check: 'Mcf8ab3101830f423f8a4d4e5400000000000000888ac7230489e800008a4d4e5400000000000000b841f69950a210196529f47df938f7af84958cdb336daf304616c37ef8bebca324910910f046e2ff999a7f2ab564bd690c1102ab65a20e0f27b57a93854339b60837011ba00a07cbf311148a6b62c1d1b34a5e0c2b6931a0547ede8b9dfb37aedff4480622a023ac93f7173ca41499624f06dfdd58c4e65d1279ea526777c194ddb623d57027',
    },
};

// password and seedPhrase will be used to generate check's proof
minter.postTx(txParams, {seedPhrase: '...', password: 'pass'});
// combination of password and address can also be used for proof generation
minter.postTx(txParams, {seedPhrase: '...', address: '...', password: 'pass'});
```

### Lock
[Tx docs](https://www.minter.network/docs#lock-transaction)
Lock coins for certain period
```js
import {TX_TYPE} from "minter-js-sdk";
const txParams = {
    type: TX_TYPE.LOCK,
    data: {
        dueBlock: 123,
        value: 10,
        coin: 0, // coin id
    },
};

minter.postTx(txParams, {seedPhrase: '...'});
```

### Create multisig
[Multisig docs](https://www.minter.network/docs#multisignatures)  
[Tx docs](https://www.minter.network/docs#create-multisig-address)

Addresses count must not be greater than 32.  
Weights count must be equal to addresses count.  
Weight value must fall within the range 0–1023.
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

minter.postTx(txParams, {seedPhrase: '...'});
```


### Edit multisig
[Tx docs](https://www.minter.network/docs#edit-multisig-transaction)
Must be sent from a multisig address.

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

minter.postTx(txParams, {seedPhrase: '...'});
```


## Transaction
### Prepare transaction
Prepare `Tx` object from txParams, used under the hood of PostTx. Accepts arguments:
 - `txParams` object
 - `options.seedPhrase` - optional, can be passed to txData constructor for redeem check transaction and used to sign transaction with single signature
 - `options.privateKey` - optional, can be used instead of `seedPhrase` directly
```js
import {prepareTx} from 'minter-js-sdk';
const tx = prepareTx(txParams, {seedPhrase: '...'});
console.log('signed tx', tx.serialize().toString('hex'));

// get actual nonce first
minter.getNonce('Mx...')
    .then((nonce) => {
        const tx = prepareTx({...txParams, nonce}, {seedPhrase: '...'});
        console.log('signed tx', tx.serialize().toString('hex'));
    });
```

### Prepare single-signed transaction
`prepareSignedTx` is an alias for `prepareTx` but with `signatureType: 1`. Hence, no support for multi-signatures.
```js
import {prepareSignedTx, prepareTx} from 'minter-js-sdk';

let tx = prepareSignedTx(txParams, {seedPhrase: '...'});
// is the same as
tx = prepareTx({...txParams, signatureType: 1}, {seedPhrase: '...'})
```

### Make signature
Make signature buffer for `Tx` with `privateKey`. Useful to create signatures for transactions with multiple signatures.
```js
import {makeSignature} from 'minter-js-sdk';

makeSignature(tx, privateKey);
```

### Multi-signatures
Usually, you should collect signatures from other multisig participants who can make them with `makeSignature`.  
Then you should construct `signatureData` for `TxParams` object and pass such `TxParams` to `postTx` or `prepareTx`.
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
        coin: 0, // coin id    
    },
    gasCoin: 0, // coin id
    gasPrice: 1,
    payload: 'custom message',
    signatureType: 2, // multiple-signature type
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

### Decode transaction
Decode RLP-serialized tx into params object.

Params:
- `tx` - string, RLP-decoded tx
- `options` - object with extra options
- `options.decodeCheck` - boolean, adds `checkData` field next to `check` field for redeemCheck tx data
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

[Minter Check](https://www.minter.network/docs#minter-check) is like an ordinary bank check. Each user of the network can issue a check with any amount of coins and pass it to another person. Receiver will be able to claim the check from an arbitrary account.

### `issueCheck()`

Checks are issued off-line and do not exist on blockchain until “redemption.”

Params:
- `seedPhrase`- seed phrase of the issuer to sign check. Type: string
- `privateKey` - private key of the issuer to sign check. Type: string, Buffer
- `password` - password to protect check. Type: string
- `nonce` - unique string to allow issuance of identical checks. Type: string
- `chainId` - network type to prevent using the same check on different networks. Type: number. Default: `1`
- `coin` - coin to transfer. Type: string
- `value` - amount to transfer. Type: number
- `gasCoin` - coin to pay fee that will be charged from issuer once the RedeemCheck tx has been sent by the recipient. Type: string. Default: network's base coin (`'BIP'` (mainnet) or `'MNT'` (testnet))
- `dueBlock` - block height at which the check expires. Type: number. Default: `999999999`

```js
// Since check issuance happens off-line, you can use it standalone without instantiating SDK
import {issueCheck} from "minter-js-sdk";
const check = issueCheck({
    seedPhrase: 'air model item valley ...',
    password: 'pass',
    nonce: '1',
    chainId: 1,
    coin: 0, // coin id
    value: 10,
    gasCoin: 0, // coin id
    dueBlock: 999999,
});
console.log(check);
// => 'Mcf8ab3101830f423f8a4d4e5400000000000000888ac7230489e800008a4d4e5400000000000000b841f69950a210196529f47df938f7af84958cdb336daf304616c37ef8bebca324910910f046e2ff999a7f2ab564bd690c1102ab65a20e0f27b57a93854339b60837011ba00a07cbf311148a6b62c1d1b34a5e0c2b6931a0547ede8b9dfb37aedff4480622a023ac93f7173ca41499624f06dfdd58c4e65d1279ea526777c194ddb623d57027'
```

### `decodeCheck()`

Decode raw check.

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
```


## Minter Link
[Minter Link Protocol](https://github.com/MinterTeam/minter-link-protocol) describes how to represent transaction data into a simple link, which can be easily consumed by user as a URL or QR code. The link is processed by [bip.to](https://bip.to) web app or any associated mobile app. The app retrieves data from the link, generates a valid transaction using logged user's private key, and sends it.

So everything a user needs to send a transaction is click/tap on the link or scan a QR code.

### `prepareLink()`
Create link from transaction params.

Options:
- `txParams` - object with [params](https://github.com/MinterTeam/minter-link-protocol#params) of transaction
- `txParams.type`
- `txParams.data`
- `txParams.payload` - optional
- `txParams.nonce` - optional
- `txParams.gasPrice` - optional
- `txParams.gasCoin` - optional
- `linkHost` - optional, custom hostname of the link, leave undefined to use the default 'https://bip.to' 

```js
import {prepareLink, TX_TYPE} from 'minter-js-sdk';

const txParams = {
    type: TX_TYPE.SEND,
    data: {
        to: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        value: 10,
        coin: 0, // coin id
    },
    gasCoin: 0, // coin id
    payload: 'custom message',
};
prepareLink(txParams);
// => 'https://bip.to/tx/-EgBqumKTU5UAAAAAAAAAJR2M5gMAAE53TvSSj9U4GR0-pQeFoiKxyMEiegAAI5jdXN0b20gbWVzc2FnZYCAikFTRAAAAAAAAAA'
```

### `decodeLink()`
Decode link into transaction params.

Params:
- `url` - string with link
- `options` - object with extra options
- `options.decodeCheck` - boolean, adds `checkData` field next to `check` field for redeemCheck tx data
- `options.privateKey` - links with `password` and no `proof` require privateKey to generate valid `proof`
- `options.seedPhrase` - alternative to `options.privateKey`


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
Get private key from seed phrase and address from private key.

Use [minterjs-wallet](https://github.com/MinterTeam/minterjs-wallet) package.


# License

MIT License
