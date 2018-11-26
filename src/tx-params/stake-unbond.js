import MinterUnbondTxData from 'minterjs-tx/src/tx-data/unbond';
import {toBuffer} from 'minterjs-util';
import {formatCoin} from 'minterjs-tx/src/helpers';
import converter from 'minterjs-tx/src/converter';
import {TX_TYPE_UNBOND} from 'minterjs-tx/src/tx-types';

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
export default function UnbondTxParams({privateKey, publicKey, coinSymbol, stake, feeCoinSymbol, message}) {
    const txData = new MinterUnbondTxData({
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
        txType: TX_TYPE_UNBOND,
        txData: txData.serialize(),
    };
}
