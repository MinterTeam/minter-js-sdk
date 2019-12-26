## texas.5
- **BREAKING** Change: rename `issueCheck` argument `passPhrase` to `password` 

## texas.3
- **BREAKING** Change: rename create coin params: coinName -> name, coinSymbol -> symbol, crr -> constantReserveRatio
- enable multisig tests

## texas.2
- Add: changes from [0.23.0](https://github.com/MinterTeam/minter-js-sdk/releases/tag/v0.23.0)
- Add: create-multisig weights and addresses validation

## texas.1
- remove `gasCoin` param from `RedeemCheckTxParams` and always get gasCoin from check's data

## texas.0
- add `gasCoin` field to check, may be omitted, base coin will be used
- `redeemCheck` params will check if passed `feeCoinSymbol` is equal to `gasCoin` from check, may be omitted, `gasCoin` from check will be used
- add `maxSupply` field to `CreateCoinTxParams`

## 0.25.0 - 2019-12-25
- **BREAKING** Change: `decodeLink` now decode `txData` too
- Add: `getTxData` method which return TxData constructor by txType
- Fix: `decodeLink` now decodes `nonce` no number instead of string

## 0.24.1 - 2019-12-24
- Fix: unbond tx-data

## 0.24.0 - 2019-12-23
- Add: tx data constructors with ability to encode and decode
- skip multisig tests

## 0.23.0 - 2019-11-12
- Add: `prepareLink` and `decodeLink` methods to work with [Minter Link Protocol](https://github.com/MinterTeam/minter-link-protocol)
- Add: `RedeemCheckTxParams` now accepts direct `proof` param, as alternative to generation it from password
- Add: `prepareSignedTx` now accepts `payload` param as alias for `message`
- **BREAKING** Remove: stop reexporting `minterjs-wallet` methods, use it directly 

## 0.22.0 - 2019-11-12
- **BREAKING** tx params which must be Minter prefixed, 0x prefixed or Buffer now will throw on arbitrary string passed
- update deps
- drop safe-buffer dependency
- drop des.js dependency, it have been updated and no more need to be deduped
- update 'fail' tests to be more accurate
- update tests to run faster

## 0.21.0 - 2019-11-11
- add `GetMinGasPrice` api method

## 0.20.3 - 2019-11-05
- update default `gasCoin` for testnet transaction

## 0.20.2 - 2019-10-01
- update deps

## 0.20.1 - 2019-09-06
- regenerate check with dueBlock increased by 1 if lock not equal 65 bytes length, it is workaround for https://github.com/MinterTeam/minter-go-node/issues/264

## 0.20.0 - 2019-08-21
- **BREAKING** need to specify full path in baseURL, e.g. add `/api/v1/` for gate's baseURL 

## 0.19.1 - 2019-08-15
- update deps

## 0.19.0 - 2019-08-01
- **BREAKING** rename issue-check.js and prepare-tx.js files to check.js and tx.js
- add `decodeCheck` method

## 0.18.1 - 2019-07-31
- ensure fixed dependencies

## 0.18.0 - 2019-07-31
- **BREAKING** rename UMD module from `minterJsTx` to `minterSDK`
- fix browser usage of UMD module
- tweak bundle tests

## 0.17.1 - 2019-07-08
- use gasPrice: 1 in the redeem check tx
- update deps

## 0.17.0 - 2019-06-12
- treat check nonce and coin name as utf8 strings

## 0.16.2 - 2019-06-06
- update deps

## 0.16.1 - 2019-05-14
- update deps

## 0.16.0 - 2019-04-23
- add method to post signed tx by passing string as argument

## 0.15.2 - 2019-04-17
- add option to specify default `chainId` in the `Minter` and `MinterApi` constructors

## 0.15.1 - 2019-04-17
- **BREAKING** rename `chainID` into `chainId`

# 0.15.0 - 2019-04-16
- **BREAKING** add `chainID` tx param to support minter-go-node [0.19.0](https://github.com/MinterTeam/minter-go-node/releases/tag/v0.19.0)
- **BREAKING** add `chainID` param to `issueCheck`
- **BREAKING** removed default nonce value from `prepareSignedTx`

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
