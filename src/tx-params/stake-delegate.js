import {MinterTxDataDelegate, TX_TYPE_DELEGATE, formatCoin} from 'minterjs-tx';
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
export default function DelegateTxParams({publicKey, coinSymbol, stake, feeCoinSymbol, ...otherParams}) {
    const txData = new MinterTxDataDelegate({
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
        txType: TX_TYPE_DELEGATE,
        txData: txData.serialize(),
    };
}
