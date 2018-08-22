import ethUtil from 'ethereumjs-util';
import MinterSendTxData from 'minterjs-tx/src/tx-data/send';
import MinterCreateCoinTxData from 'minterjs-tx/src/tx-data/create-coin';
import MinterSellCoinTxData from 'minterjs-tx/src/tx-data/sell-coin';
import MinterSellAllCoinTxData from 'minterjs-tx/src/tx-data/sell-all-coin';
import MinterBuyCoinTxData from 'minterjs-tx/src/tx-data/buy-coin';
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
export function SendCoinsTxParams({privateKey, address, amount = 0, coinSymbol, feeCoinSymbol, message}) {
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
 * @param {number} crr
 * @param {number} initialReserve
 * @param {string} [feeCoinSymbol]
 * @param {string} [message]
 * @return {TxParams}
 */
export function CreateCoinTxParams({privateKey, coinName, coinSymbol, initialAmount, crr, initialReserve, feeCoinSymbol, message}) {
    const txData = new MinterCreateCoinTxData({
        name: coinName,
        symbol: formatCoin(coinSymbol),
        initialAmount: `0x${ethUtil.padToEven(converter.convert(initialAmount, 'pip').toString(16))}`,
        crr: `0x${ethUtil.padToEven(Number(crr).toString(16))}`,
        initialReserve: `0x${ethUtil.padToEven(converter.convert(initialReserve, 'pip').toString(16))}`,
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
export function SellCoinsTxParams({privateKey, coinFrom, coinTo, sellAmount, feeCoinSymbol, message}) {
    const txData = new MinterSellCoinTxData({
        coin_to_sell: formatCoin(coinFrom),
        coin_to_buy: formatCoin(coinTo),
        value_to_sell: `0x${converter.convert(sellAmount, 'pip').toString(16)}`,
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
export function SellAllCoinsTxParams({privateKey, coinFrom, coinTo, feeCoinSymbol, message}) {
    const txData = new MinterSellAllCoinTxData({
        coin_to_sell: formatCoin(coinFrom),
        coin_to_buy: formatCoin(coinTo),
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
export function BuyCoinsTxParams({privateKey, coinFrom, coinTo, buyAmount, feeCoinSymbol, message}) {
    const txData = new MinterBuyCoinTxData({
        coin_to_sell: formatCoin(coinFrom),
        coin_to_buy: formatCoin(coinTo),
        value_to_buy: `0x${converter.convert(buyAmount, 'pip').toString(16)}`,
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
