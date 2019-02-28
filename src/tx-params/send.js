import {MinterTxDataSend, TX_TYPE_SEND, formatCoin} from 'minterjs-tx';
import {convertToPip, toBuffer} from 'minterjs-util';

/**
 * @constructor
 * @param {string} address
 * @param {number|string} amount
 * @param {string} coinSymbol
 * @param {string} [feeCoinSymbol]
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function SendTxParams({address, amount = 0, coinSymbol, feeCoinSymbol, ...otherParams}) {
    const txData = new MinterTxDataSend({
        to: toBuffer(address),
        coin: formatCoin(coinSymbol),
        value: `0x${convertToPip(amount, 'hex')}`,
    });

    if (!feeCoinSymbol) {
        feeCoinSymbol = coinSymbol;
    }

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_SEND,
        txData: txData.serialize(),
    };
}
