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
