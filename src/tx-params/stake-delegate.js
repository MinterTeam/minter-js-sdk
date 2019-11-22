import {TxDataDelegate, TX_TYPE, coinToBuffer} from 'minterjs-tx';
import {convertToPip, toBuffer} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter';
// import {toBuffer} from 'minterjs-util/src/prefix';

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
    const txData = new TxDataDelegate({
        pubKey: toBuffer(publicKey),
        coin: coinToBuffer(coinSymbol),
        stake: `0x${convertToPip(stake, 'hex')}`,
    });

    if (!feeCoinSymbol) {
        feeCoinSymbol = coinSymbol;
    }

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE.DELEGATE,
        txData: txData.serialize(),
    };
}
