import {MinterTxDataDeclareCandidacy, TX_TYPE_DECLARE_CANDIDACY, formatCoin} from 'minterjs-tx';
import {convertToPip, toBuffer} from 'minterjs-util';
import {toHexString} from '../utils';

/**
 * @constructor
 * @param {string} address
 * @param {string} publicKey
 * @param {number|string} commission
 * @param {string} coinSymbol
 * @param {number|string} stake
 * @param {string} feeCoinSymbol
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function DeclareCandidacyTxParams({address, publicKey, commission, coinSymbol, stake, feeCoinSymbol, ...otherParams}) {
    const txData = new MinterTxDataDeclareCandidacy({
        address: toBuffer(address),
        pubKey: toBuffer(publicKey),
        commission: `0x${toHexString(commission)}`,
        coin: formatCoin(coinSymbol),
        stake: `0x${convertToPip(stake, 'hex')}`,
    });

    if (!feeCoinSymbol) {
        feeCoinSymbol = coinSymbol;
    }

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_DECLARE_CANDIDACY,
        txData: txData.serialize(),
    };
}
