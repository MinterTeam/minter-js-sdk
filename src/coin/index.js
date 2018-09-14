import ethUtil from 'ethereumjs-util';
import MinterSendTxData from 'minterjs-tx/src/tx-data/send';
import MinterCreateCoinTxData from 'minterjs-tx/src/tx-data/create-coin';
import MinterSellTxData from 'minterjs-tx/src/tx-data/sell';
import MinterSellAllTxData from 'minterjs-tx/src/tx-data/sell-all';
import MinterBuyTxData from 'minterjs-tx/src/tx-data/buy';
import {TX_TYPE_SEND, TX_TYPE_CREATE_COIN, TX_TYPE_SELL_COIN, TX_TYPE_SELL_ALL_COIN, TX_TYPE_BUY_COIN} from 'minterjs-tx/src/tx-types';
import converter from 'minterjs-tx/src/converter';
import {formatCoin} from 'minterjs-tx/src/helpers';
import {toBuffer} from 'minterjs-util';

/**
 * @constructor
 * @param {string} privateKey
 * @param {string} address
 * @param {number} amount
 * @param {string} coinSymbol
 * @param {string} [feeCoinSymbol]
 * @param {string} [message]
 * @return {TxParams}
 */
export function SendTxParams({privateKey, address, amount = 0, coinSymbol, feeCoinSymbol, message}) {
    const txData = new MinterSendTxData({
        to: toBuffer(address),
        coin: formatCoin(coinSymbol),
        value: `0x${converter.convert(amount, 'pip').toString(16)}`,
    });

    if (!feeCoinSymbol) {
        feeCoinSymbol = coinSymbol;
    }

    return {
        privateKey,
        message,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_SEND,
        txData: txData.serialize(),
    };
}

/**
 * @constructor
 * @param {string} privateKey
 * @param {string} coinName
 * @param {string} coinSymbol
 * @param {number} initialAmount
 * @param {number} initialReserve
 * @param {number} crr
 * @param {string} [feeCoinSymbol]
 * @param {string} [message]
 * @return {TxParams}
 */
export function CreateCoinTxParams({privateKey, coinName, coinSymbol, initialAmount, initialReserve, crr, feeCoinSymbol, message}) {
    const txData = new MinterCreateCoinTxData({
        name: coinName,
        symbol: formatCoin(coinSymbol),
        initialAmount: `0x${ethUtil.padToEven(converter.convert(initialAmount, 'pip').toString(16))}`,
        initialReserve: `0x${ethUtil.padToEven(converter.convert(initialReserve, 'pip').toString(16))}`,
        constantReserveRatio: `0x${ethUtil.padToEven(Number(crr).toString(16))}`,
    });

    return {
        privateKey,
        message,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_CREATE_COIN,
        txData: txData.serialize(),
    };
}

/**
 * @constructor
 * @param {string} privateKey
 * @param {string} coinFrom
 * @param {string} coinTo
 * @param {number} sellAmount
 * @param {string} [feeCoinSymbol]
 * @param {string} [message]
 * @return {TxParams}
 */
export function SellTxParams({privateKey, coinFrom, coinTo, sellAmount, feeCoinSymbol, message}) {
    const txData = new MinterSellTxData({
        coinToSell: formatCoin(coinFrom),
        coinToBuy: formatCoin(coinTo),
        valueToSell: `0x${converter.convert(sellAmount, 'pip').toString(16)}`,
    });

    if (!feeCoinSymbol) {
        feeCoinSymbol = coinFrom;
    }

    return {
        privateKey,
        message,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_SELL_COIN,
        txData: txData.serialize(),
    };
}

/**
 * @constructor
 * @param {string} privateKey
 * @param {string} coinFrom
 * @param {string} coinTo
 * @param {string} [feeCoinSymbol]
 * @param {string} [message]
 * @return {TxParams}
 */
export function SellAllTxParams({privateKey, coinFrom, coinTo, feeCoinSymbol, message}) {
    const txData = new MinterSellAllTxData({
        coinToSell: formatCoin(coinFrom),
        coinToBuy: formatCoin(coinTo),
    });

    if (!feeCoinSymbol) {
        feeCoinSymbol = coinFrom;
    }

    return {
        privateKey,
        message,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_SELL_ALL_COIN,
        txData: txData.serialize(),
    };
}

/**
 * @constructor
 * @param {string} privateKey
 * @param {string} coinFrom
 * @param {string} coinTo
 * @param {number} buyAmount
 * @param {string} [feeCoinSymbol]
 * @param {string} [message]
 * @return {TxParams}
 */
export function BuyTxParams({privateKey, coinFrom, coinTo, buyAmount, feeCoinSymbol, message}) {
    const txData = new MinterBuyTxData({
        coinToSell: formatCoin(coinFrom),
        coinToBuy: formatCoin(coinTo),
        valueToBuy: `0x${converter.convert(buyAmount, 'pip').toString(16)}`,
    });

    if (!feeCoinSymbol) {
        feeCoinSymbol = coinFrom;
    }

    return {
        privateKey,
        message,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_BUY_COIN,
        txData: txData.serialize(),
    };
}
