import ethUtil from 'ethereumjs-util';
import MinterSendTxData from 'minterjs-tx/src/tx-data/send';
import MinterCreateCoinTxData from 'minterjs-tx/src/tx-data/create-coin';
import {TX_TYPE_SEND, TX_TYPE_CREATE_COIN} from 'minterjs-tx/src/tx-types';
import converter from 'minterjs-tx/src/converter';
import {formatCoin, mToBuffer} from 'minterjs-tx/src/helpers';
import {sendTx} from "./utils";

export function sendCoins({nodeUrl, privateKey, address, amount = 0, coinSymbol, message}) {
    const txData = new MinterSendTxData({
        to: mToBuffer(address),
        coin: formatCoin(coinSymbol),
        value: `0x${converter.convert(amount, 'pip').toString(16)}`,
    });

    return sendTx({
        nodeUrl,
        privateKey,
        message,
        txType: TX_TYPE_SEND,
        txData: txData.serialize(),
    })
}

export function createCoin({nodeUrl, privateKey, coinName, coinSymbol, initialAmount, crr, initialReserve, message}) {
    const txData = new MinterCreateCoinTxData({
        name: coinName,
        symbol: formatCoin(coinSymbol),
        initialAmount: `0x${ethUtil.padToEven(converter.convert(initialAmount, 'pip').toString(16))}`,
        crr: `0x${ethUtil.padToEven(Number(crr).toString(16))}`,
        initialReserve: `0x${ethUtil.padToEven(converter.convert(initialReserve, 'pip').toString(16))}`
    });

    return sendTx({
        nodeUrl,
        privateKey,
        message,
        txType: TX_TYPE_CREATE_COIN,
        txData: txData.serialize(),
    })
}
