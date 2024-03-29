## 0.46.2 - 2023.08.13
- fix axios@1 paramsSerializer

## 0.46.1 - 2023.06.02
- `getPoolInfo` now accepts coin symbols as params

## 0.46.0 - 2023.05.30
- **BREAKING** `getPoolInfo` not returns values converted from pip

## 0.45.6 - 2022.11.17
- minor fix error handling
- update deps

## 0.45.5 - 2022.07.29
- fix `validateTicker` to accept tickers with digits in any place

## 0.45.4 - 2022.07.12
- improve jsdoc

## 0.45.3 - 2022.06.06
- improve jsdoc

## 0.45.3 - 2022.06.03
- update deps

## 0.45.1 - 2022.06.02
- fix `estimateTxCommission` in imprecise mode with empty tx data

## 0.45.0 - 2022.05.31
- add axiosOptions param to api constructors

## 0.44.0 - 2022.05.27
- **DEPRECATE** `loose` option in `estimateTxCommission` use `needGasCoinFee`, `needBaseCoinFee`, and `needPriceCoinFee` settings instead

## 0.43.3 - 2022.04.26
- fix `isCoinSymbol` to accept tickers with digits in any place and fix unsafe-regex in it

## 0.43.2 - 2022.04.22
- update deps

## 0.43.1 - 2022.04.18
- more strict `isCoinSymbol` (will cause invalid getCoinInfo to fail earlier)

## 0.43.0 - 2022.04.15
- `postTx`: add `extraAxiosOptions` param to be passed to secondary requests (for nonce and coin ids)
- **BREAKING** `estimateTxCommission`: `axiosOptions` param separated to two different params - (1) `axiosOptions` will be passed to main estimation request and (2) `extraAxiosOptions` to secondary requests (commission price data, coin ids, and pool info)
- `estimateTxCommission`: don't make https request in `loose: true` mode when `gasCoin` same as `priceCoin` (priceCoinValue used directly)

## 0.42.1 - 2022.04.13
- fix direct `estimateTxCommission` to not mutate response

## 0.42.0 - 2022.04.12
- add `Lock` and `LockStake` tx data
- restore support of `MoveStake` tx data
- add `disableValidation` option to tx data constructors
- add `disableDecorationParams` and `disableValidation` options to `prepareTx`
- fix `estimateTxCommission` to work with empty data params and coin symbol params in `loose: false` mode
- **BREAKING** add fields to VoteCommission tx data
- **DEPRECATE** `direct` option in `estimateTxCommission`, use `loose` option with reversed value instead

## 0.41.0 - 2021.12.27
- add `ReplaceCoinId`, `ReplaceCoinIdByPath`, `GetCoinSymbol` API methods
- **BREAKING** remove deprecated `getCoinInfoById` API method, use `getCoinInfo` instead

## 0.40.2 - 2021.12.16
- fix `estimateCoinSellAll`: restore valueToSell param

## 0.40.1 - 2021.12.16
- fix `CreatePoolTxData` to be independent of coins order

## 0.40.0 - 2021.12.14
- add `AddLimitOrder` gasCoin decorator
- **BREAKING** released [df1acf0](https://github.com/MinterTeam/minter-js-sdk/commit/df1acf077a0bec51675dacb93668a7f8aa0cb1c4): make `estimateCoinSellAll` actually use sell-all api route
- **BREAKING** rename some internal files

## 0.39.0 - 2021.12.01
- add `AddLimitOrder` and `RemoveLimitOrder` tx data
- update `nonce` field length for checks
- **BREAKING** add fields to VoteCommission tx data

## 0.38.3 - 2021.05.31
- add `CreateSwapPool`, `AddLiquidity` tx decorators

## 0.38.2 - 2021.04.13
- fix VoteCommission tx data

## 0.38.1 - 2021.04.12
- fix usage of seedPhrase instead of privateKey

## 0.38.0 - 2021.04.09
- add minter v2 pool, token, vote, and other tx data
- `postTx` now support coin symbols in `txParams` without using `replaceCoinSymbol`
- add `estimateCoinSellAll` API method
- add `swapFrom`, `route` and `gasCoin` parameters to estimation API methods
- add `getCoinId` API method
- add `seedPharse` param as alternative to `privateKey`
- fix: force `gasCoin` to be same as coin to spend for sell all txs
- **BREAKING** reworked `estimateTxCommission`
- **BREAKING** rename TX_TYPE `EDIT_COIN_OWNER` to `EDIT_TICKER_OWNER` and `EditCoinOwnerTxData` to `EditTickerOwnerTxData`
- **BREAKING** add error code check when `postTx` made through gate api
- **BREAKING** rename some file paths
- **BREAKING** remove deprecated `toHexString`, use `integerToHexString` instead
- **BREAKING** disabled deprecated usage of `privateKey` hex string without hex prefix
- **DEPRECATED** `coinIdToSell` and `coinIdToBuy` params in estimate sell/buy API methods, use `coinToSell` and `coinToBuy` instead
- **DEPRECATED** `getCoinInfoById` API method, use `getCoinInfo` instead

## 0.37.0 - 2020-12-30
- **BREAKING** don't autofill `gasCoin` with coin to spent, use base coin (BIP) by default everywhere

## 0.36.0 - 2020-12-22
- Update deps to support Minter node v1.2.1 (fee calculation changed)

## 0.35.6
- Improve Uint validation message
- Fix: allow `nonce` and `gasPrice` to be omitted in the Minter Link

## 0.35.5
- Improve Check error message

## 0.35.4
- Fix: cjs bundle babel runtime helpers

## 0.35.3
- Fix: cjs bundle to not require ES2015 modules

## 0.35.2
- Add: `axiosOptions` parameter to all API methods which will be passed to axios request

## 0.35.1
- Add: 'getCoinInfoById' api method

## 0.35.0
- Add: `ReplaceCoinSymbolByPath` now accept `chainId` param and can get base coin id without network request
- Update: `ReplaceCoinSymbol` uses `txParams.chainId` to get base coin id without network request
- **BREAKING** `ReplaceCoinSymbol` now exported as named not default export
- **BREAKING** file src/api/replace-coin-symbol.js renamed

## 0.34.2
- fix tx decorators to properly handle `gasCoin: 0`

## 0.34.1
- `EditMultisigTxData` now sorts address and weight lists, so different ordered lists will provide same transaction hash

## 0.34.0
Support of minter-go-node v1.2 aka Chili
- **BREAKING** change coin tickers to coin id in tx params. Affected: postTx, prepareTx, Buy, DeclareCandidacy, Delegate, Sell, SellAll, Send, Multisend, Unbond. You can use `replaceCoinSymbol` method to work with tickers and replace it with ids automatically.
- **BREAKING** add `controlAddress` field to EditCandidateData
- **BREAKING** `integerToHexString` now returns `0x` prefixed string
- add `nonceRetryLimit` option to `postTx`
- add `getCoinInfo` and `replaceCoinSymbol` api methods
- add `EditMultisigTxData`, `RecreateCoinTxData`, `EditCoinOwnerTxData`, `EditCandidatePublicKeyTxData`, `SetHaltBlockTxData`, and `PriceVoteTxData` tx data constructors
- add: `estimateCoinSell`, `estimateCoinBuy` now support both ticker and id params, e.g. `coinToBuy` and `coinIdToBuy`.

Drop deprecations
- **BREAKING** remove all deprecated TxParams constructors
- **BREAKING** remove deprecated `NETWORK_MAX_AMOUNT`, `MAX_MAX_SUPPLY`, `MIN_MAX_SUPPLY`, use minterjs-util's `COIN_MAX_AMOUNT`, `COIN_MAX_MAX_SUPPLY`, `COIN_MIN_MAX_SUPPLY` instead
- **BREAKING** `issueCheck`'s `coinSymbol` alias param is removed, use `coin` param
- **BREAKING** `estimateCoinSell`, `estimateCoinBuy`: drop support of snake_case params
- **BREAKING** `estimateTxCommission` now accept tx string directly instead of object `{tx: string}`
- **BREAKING** `decodeLink` drop support of old-style links

## 0.33.0 - 2020-08-12
- **BREAKING** string private keys now should be `0x`-prefixed
- add `mempoolRetryLimit` option to `postTx`
- update deps

## 0.32.1 - 2020-05-31
- update deps

## 0.32.0 - 2020-05-31
- **BREAKING** add: validation of TxData params
- **BREAKING** change: `postTx` and `postSignedTx` now returns object `{hash: string}` for node or NodeTransaction object for gate

## 0.31.0 - 2020-03-24
- Change: move `{password, privateKey}` from RedeemCheckTxData's first argument `data` to the second argument `options`. **Deprecate** old approach.
- Add: `address` option for RedeemCheckTxData to make proof for address. Use it as field in the second argument `options`.
- Add: `address` option to `decodeLink`
- Add: `{address, password}` to the options for `prepareTx`, `prepareSignedTx`, and `postTx` to pass it to the RedeemCheckTxData
- **Deprecate**: `privateKey` string without prefix for RedeemCheckTxData. Now it should be `0x` prefixed.

## 0.30.3 - 2020-03-13
- Fix: restore support of decoding old style links for `decodeLink`

## 0.30.2 - 2020-03-12
- Fix: link decoding

## 0.30.1 - 2020-03-10
- Add: asserts to `prepareTx`

## 0.30.0 - 2020-03-06
Support of minter-go-node v1.1 aka Texas
- Deprecate TxParams constructors
- Add: support for multisignatures
- Add: expose `ensureNonce` on `Minter` instance
- Change: `prepareSignedTx` now accepts `privateKey` as field in the second argument, `privateKey` in first argument is deprecated
- Change: `postTx` now accepts `privateKey` as field in the second argument. Old behaviour is **deprecated**
- Add: `prepareTx`, it can be used for multiSignature txs
- Add: `makeSignature`
- **BREAKING** Change: `prepareLink` and `decodeLink` now supports [new link format](https://github.com/MinterTeam/minter-link-protocol/pull/6) with base64url encoding
- **BREAKING** Change: rename `issueCheck` argument `passPhrase` to `password`
- **BREAKING** Change: rename create coin params: coinName -> name, coinSymbol -> symbol, crr -> constantReserveRatio
- enable multisig tests
- Add: create-multisig weights and addresses validation
- remove `gasCoin` param from `RedeemCheckTxParams` and always get gasCoin from check's data
- add `gasCoin` field to check, may be omitted, base coin will be used
- `redeemCheck` params will check if passed `feeCoinSymbol` is equal to `gasCoin` from check, may be omitted, `gasCoin` from check will be used
- add `maxSupply` field to `CreateCoinTxParams`

## 0.29.0 - 2020-02-14
- **BREAKING** Change: `decodeLink` 2nd param private key now is object with `privateKey` field
```js
// old
decodeLink('https://bip.to/tx...', 'f812...');

// new
decodeLink('https://bip.to/tx...', {privateKey: 'f812...'});
```
- Add: `decodeTx` method to decode RLP serialized tx
- Add: `decodeTx` and `decodeLink` methods now has `decodeCheck` param, it adds `checkData` field next to `check` field for redeemCheck tx data

## 0.28.0 - 2020-02-03
- **BREAKING** Fix: `decodeCheck`, `decodeLink` and `bufferToInteger` now returns string values for numbers. It will fix precision loss for big numbers.

## 0.27.4 - 2020-01-31
- Fix: decodeLink for candidate-set-on/off transactions

## 0.27.3 - 2020-01-30
- Fix: candidate-set-on/off tx data constructors

## 0.27.2 - 2020-01-30
- Add: expose `.postSignedTx` method on `Minter` instance
- Add: expose data constructors in index.js
- minor refactor

## 0.27.1 - 2020-01-20
- Update: allow use `RedeemCheckTxData` without `proof` and `privateKey` it will lead to empty proof

## 0.26.1 - 2020-01-20
- Add: option for `prepareLink` to allow setting custom hostname

## 0.26.0 - 2020-01-15
- **BREAKING** Change: `decodeLink` now returns `data` instead of `txData` and `type` instead of `txType` fields
- **BREAKING** Remove: `privateKey` fields from `decodeLink` result
- **BREAKINK** Remove: `issueCheck` and `decodeCheck` from `Minter` instance
- Add: `postTx`, `prepareSignedTx`, and `prepareLink` now accepts `data` and `type` fields, `txData` and `txType` are deprecated
- Add: `postTx` and `prepareSignedTx` now also accept data object for `data` field, not only Buffer
- Add: `postTx` and `prepareSignedTx` now decorate txParams as TxParamsConstructors previously do
- Add: reexport `TX_TYPE` from `minterjs-tx`

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
