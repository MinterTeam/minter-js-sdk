import ethUtil from 'ethereumjs-util';
import MinterSendTxData from 'minterjs-tx/src/tx-data/send';
import MinterCreateCoinTxData from 'minterjs-tx/src/tx-data/create-coin';
import MinterSellCoinTxData from 'minterjs-tx/src/tx-data/sell-coin';
import MinterBuyCoinTxData from 'minterjs-tx/src/tx-data/buy-coin';
import {TX_TYPE_SEND, TX_TYPE_CREATE_COIN, TX_TYPE_SELL_COIN, TX_TYPE_BUY_COIN} from 'minterjs-tx/src/tx-types';
import converter from 'minterjs-tx/src/converter';
import {formatCoin} from 'minterjs-tx/src/helpers';
import {toBuffer} from 'minterjs-util';
import {sendTx} from '../utils/index';

export function sendCoins({nodeUrl, privateKey, address, amount = 0, coinSymbol, message}) {
    const txData = new MinterSendTxData({
        to: toBuffer(address),
        coin: formatCoin(coinSymbol),
        value: `0x${converter.convert(amount, 'pip').toString(16)}`,
    });

    return sendTx({
        nodeUrl,
        privateKey,
        message,
        txType: TX_TYPE_SEND,
        txData: txData.serialize(),
    });
}

export function createCoin({nodeUrl, privateKey, coinName, coinSymbol, initialAmount, crr, initialReserve, message}) {
    const txData = new MinterCreateCoinTxData({
        name: coinName,
        symbol: formatCoin(coinSymbol),
        initialAmount: `0x${ethUtil.padToEven(converter.convert(initialAmount, 'pip').toString(16))}`,
        crr: `0x${ethUtil.padToEven(Number(crr).toString(16))}`,
        initialReserve: `0x${ethUtil.padToEven(converter.convert(initialReserve, 'pip').toString(16))}`,
    });

    return sendTx({
        nodeUrl,
        privateKey,
        message,
        txType: TX_TYPE_CREATE_COIN,
        txData: txData.serialize(),
    });
}

export function sellCoin({nodeUrl, privateKey, coinFrom, coinTo, sellAmount, message}) {
    const txData = new MinterSellCoinTxData({
        coin_to_sell: formatCoin(coinFrom),
        coin_to_buy: formatCoin(coinTo),
        value_to_sell: `0x${converter.convert(sellAmount, 'pip').toString(16)}`,
    });

    return sendTx({
        nodeUrl,
        privateKey,
        message,
        txType: TX_TYPE_SELL_COIN,
        txData: txData.serialize(),
    });
}

export function buyCoin({nodeUrl, privateKey, coinFrom, coinTo, buyAmount, message}) {
    const txData = new MinterBuyCoinTxData({
        coin_to_sell: formatCoin(coinFrom),
        coin_to_buy: formatCoin(coinTo),
        value_to_buy: `0x${converter.convert(buyAmount, 'pip').toString(16)}`,
    });

    return sendTx({
        nodeUrl,
        privateKey,
        message,
        txType: TX_TYPE_BUY_COIN,
        txData: txData.serialize(),
    });
}
