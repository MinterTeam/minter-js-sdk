import MinterDelegateTxData from 'minterjs-tx/src/tx-data/delegate';
import {toBuffer} from 'minterjs-util';
import {formatCoin} from 'minterjs-tx/src/helpers';
import converter from 'minterjs-tx/src/converter';
import {TX_TYPE_DELEGATE} from 'minterjs-tx/src/tx-types';

/**
 * @constructor
 * @param {string} privateKey
 * @param {string} publicKey
 * @param {string} coinSymbol
 * @param {number} stake
 * @param {string} [feeCoinSymbol]
 * @param {string} [message]
 * @return {TxParams}
 */
export default function DelegateTxParams({privateKey, publicKey, coinSymbol, stake, feeCoinSymbol, message}) {
    const txData = new MinterDelegateTxData({
        pubKey: toBuffer(publicKey),
        coin: formatCoin(coinSymbol),
        stake: `0x${converter.convert(stake, 'pip').toString(16)}`,
    });

    if (!feeCoinSymbol) {
        feeCoinSymbol = coinSymbol;
    }

    return {
        privateKey,
        message,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_DELEGATE,
        txData: txData.serialize(),
    };
}
