import MinterSendTxData from 'minterjs-tx/src/tx-data/send';
import {TX_TYPE_SEND} from 'minterjs-tx/src/tx-types';
import {convertToPip} from 'minterjs-util/src/converter';
import {formatCoin} from 'minterjs-tx/src/helpers';
import {toBuffer} from 'minterjs-util';

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
    const txData = new MinterSendTxData({
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
