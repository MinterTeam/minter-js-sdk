import MinterUnbondTxData from 'minterjs-tx/src/tx-data/unbond';
import {toBuffer} from 'minterjs-util';
import {formatCoin} from 'minterjs-tx/src/helpers';
import {convertToPip} from 'minterjs-util/src/converter';
import {TX_TYPE_UNBOND} from 'minterjs-tx/src/tx-types';

/**
 * @constructor
 * @param {string} privateKey
 * @param {string} publicKey
 * @param {string} coinSymbol
 * @param {number|string} stake
 * @param {string} [feeCoinSymbol]
 * @param {string} [message]
 * @return {TxParams}
 */
export default function UnbondTxParams({privateKey, publicKey, coinSymbol, stake, feeCoinSymbol, message}) {
    const txData = new MinterUnbondTxData({
        pubKey: toBuffer(publicKey),
        coin: formatCoin(coinSymbol),
        stake: `0x${convertToPip(stake, 'hex')}`,
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
