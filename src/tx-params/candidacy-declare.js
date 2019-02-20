import MinterDeclareCandidacyTxData from 'minterjs-tx/src/tx-data/declare-candidacy';
import {TX_TYPE_DECLARE_CANDIDACY} from 'minterjs-tx/src/tx-types';
import {convertToPip} from 'minterjs-util/src/converter';
import {formatCoin} from 'minterjs-tx/src/helpers';
import {toBuffer} from 'minterjs-util/src/prefix';
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
    const txData = new MinterDeclareCandidacyTxData({
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
