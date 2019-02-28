import {MinterTxDataUnbond, TX_TYPE_UNBOND, formatCoin} from 'minterjs-tx';
import {toBuffer, convertToPip} from 'minterjs-util';

/**
 * @constructor
 * @param {string} publicKey
 * @param {string} coinSymbol
 * @param {number|string} stake
 * @param {string} [feeCoinSymbol]
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function UnbondTxParams({publicKey, coinSymbol, stake, feeCoinSymbol, ...otherParams}) {
    const txData = new MinterTxDataUnbond({
        pubKey: toBuffer(publicKey),
        coin: formatCoin(coinSymbol),
        stake: `0x${convertToPip(stake, 'hex')}`,
    });

    if (!feeCoinSymbol) {
        feeCoinSymbol = coinSymbol;
    }

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_UNBOND,
        txData: txData.serialize(),
    };
}
