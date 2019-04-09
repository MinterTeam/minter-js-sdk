# 0.14.1 - 2019-04-09
- Fixed: paths alias

# 0.14.0 - 2019-03-19
- **BREAKING** Changed: connection with [explorer api](https://github.com/MinterTeam/minter-php-explorer-api) removed in favor of [gate api](https://github.com/MinterTeam/explorer-gate)
- **BREAKING** Removed: `apiType` and `baseURL` options no more have default values  
- Removed: adapter to reject errors with 200 code, now all api errors should have 400+ code

# 0.13.0 - 2019-02-28
- Added: UMD and commonjs builds
- **BREAKING** Removed: `getProofWithRecovery` export from tx-params/redeem-check.js

## 0.12.0 - 2019-02-20
- **BREAKING** Added: now will throw on invalid numeric params

## 0.11.2 - 2019-02-18
- Updated: deps
- Fixed: ethereumjs-util

## 0.11.1 - 2019-02-06
- Added: `MultisendTxParams`

## 0.11.0 - 2019-01-31
- **BREAKING** Changed: move postTx's `nonce` param into `txParams` object
- Added: allow pass `gasPrice` into `txParams`
- Added: retry behavior to `postTx` if it failed with low gas error, `gasRetryLimit` option controls it
- Fixed: copy error payload `error.tx_result.log` to `error.tx_result.message`

## 0.10.0 - 2019-01-24
- Move `error.log` payload field into `error.message` to conform node API [v0.10.0](https://github.com/MinterTeam/minter-go-node/releases/tag/v0.10.0)

## 0.9.1 - 2019-01-22
- Expose `prepareSignedTx` in the index.js

## 0.9.0 - 2019-01-22
- Move `prepareSignedTx` to separate function from postTx

## 0.8.1 - 2019-01-17
- Fix variables import

## 0.8.0 - 2019-01-17
- Add `EditCandidateTxParams` for API version [0.10.0](https://github.com/MinterTeam/minter-go-node/releases/tag/v0.10.0)
- Expose `API_TYPE_EXPLORER`, `API_TYPE_NODE` variables

## 0.7.0 - 2018-12-10
- update for new incompatible node API version [0.8.5](https://github.com/MinterTeam/minter-go-node/blob/master/CHANGELOG.md#085)
- **BREAKING** remove failed response transformation (data.error => data), now `error` field will exist in failed response

## 0.6.0 - 2018-12-10
- update for new incompatible node API version: [0.8.0](https://github.com/MinterTeam/minter-go-node/blob/master/CHANGELOG.md#080) (minter-test-network-27)

## 0.5.5 - 2018-12-06
- Use `Mx` prefixed address for `getCount` methods
- Handle invalid response, when HTML got instead of JSON

## 0.5.4 - 2018-11-30
- Add `CreateMultisigTxParams`
- Update deps

## 0.5.3 - 2018-11-27
- Fix assertions in estimate methods to return rejected promise instead of throwing errors

## 0.5.2 - 2018-11-27
- Fix estimation pip conversion

## 0.5.1 - 2018-11-27
- Fix import paths

## 0.5.0 - 2018-11-26
- Add estimation methods `estimateCoinSell`, `estimateCoinBuy`, `estimateTxCommisssion`
- **BREAKING** refactor file structure
- **BREAKING** move `postTx` into one of api methods, change Promise resolve data to simple tx hash

Instead of `(new PostTx(apiParams))(txParams).then()` use: 
```js
import Minter from 'minter-js-sdk';
const minterSDK = new Minter(apiParams);
minterSDK.postTx(txParams).then();
```

## 0.4.1 - 2018-10-18
- Add option `apiType` for `PostTx` to work with explorer API

## 0.4.0 - 2018-10-15
- **BREAKING** update `postTx` to support network with MultiSig transactions 
- update dependencies

## 0.3.0 - 2018-09-14
- **BREAKING** rename `SendTx` -> `PostTx`, `SendCoinsTxParams` -> `SendTxParams`, `SellCoinsTxParams` -> `SellTxParams`, `SellAllCoinsTxParams` -> `SellAllTxParams`, `BuyCoinsTxParams` -> `BuyTxParams` 

## 0.2.2 - 2018-08-11
- **BREAKING** rename TxParams constructors

## 0.2.1 - 2018-08-11
- remove `nodeUrl` from `redeemTx` params

## 0.2.0 - 2018-08-10
- **BREAKING** refactor to explicit use `sendTx()`. Get it from `SendTx` constructor with specified API urls, instead of passing url to each tx call 

## 0.1.3 - 2018-08-09
- fix `sellAllCoins` method

## 0.1.2 - 2018-08-06
- fix default `declareCandidacy` fee

## 0.1.1 - 2018-08-06
- fix redeem `feeCoinSymbol` checkup

## 0.1.0 - 2018-07-23
- fix setCandidate's `gasCoin`

## 0.0.9 - 2018-07-23
- add `gasCoin`

## 0.0.8 - 2018-07-20
- update `getNonce` method
- add `sellAllCoins`

## 0.0.7 - 2018-07-16
- **BREAKING** rename sell/buy methods

## 0.0.6 - 2018-07-16
- add `issueCheck` method
- move files

## 0.0.5 - 2018-07-13
- **BREAKING** remove wallet alias
- add utils

## 0.0.4 - 2018-07-13
- add transaction methods

## 0.0.3 - 2018-07-13
- fix minor errors

## 0.0.2 - 2018-07-13
- initial
