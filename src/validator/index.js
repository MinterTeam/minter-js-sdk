import ethUtil from 'ethereumjs-util';
import MinterDeclareCandidacyTxData from 'minterjs-tx/src/tx-data/declare-candidacy';
import MinterDelegateTxData from 'minterjs-tx/src/tx-data/delegate';
import MinterUnbondTxData from 'minterjs-tx/src/tx-data/unbond';
import MinterSetCandidateOnTxData from 'minterjs-tx/src/tx-data/set-candidate-on';
import MinterSetCandidateOffTxData from 'minterjs-tx/src/tx-data/set-candidate-off';
import {TX_TYPE_DECLARE_CANDIDACY, TX_TYPE_DELEGATE, TX_TYPE_UNBOND, TX_TYPE_SET_CANDIDATE_ON, TX_TYPE_SET_CANDIDATE_OFF} from 'minterjs-tx/src/tx-types';
import converter from 'minterjs-tx/src/converter';
import {formatCoin} from 'minterjs-tx/src/helpers';
import {toBuffer} from 'minterjs-util';

/**
 * @constructor
 * @param {string} privateKey
 * @param {string} address
 * @param {string} publicKey
 * @param {number} commission
 * @param {string} coinSymbol
 * @param {number} stake
 * @param {string} feeCoinSymbol
 * @param {string} [message]
 * @return {TxParams}
 */
export function DeclareCandidacyTxParams({privateKey, address, publicKey, commission, coinSymbol, stake, feeCoinSymbol, message}) {
    const txData = new MinterDeclareCandidacyTxData({
        address: toBuffer(address),
        pubkey: toBuffer(publicKey),
        commission: `0x${ethUtil.padToEven(Number(commission).toString(16))}`,
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
        txType: TX_TYPE_DECLARE_CANDIDACY,
        txData: txData.serialize(),
    };
}

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
export function DelegateTxParams({privateKey, publicKey, coinSymbol, stake, feeCoinSymbol, message}) {
    const txData = new MinterDelegateTxData({
        pubkey: toBuffer(publicKey),
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
export function UnbondTxParams({privateKey, publicKey, coinSymbol, stake, feeCoinSymbol, message}) {
    const txData = new MinterUnbondTxData({
        pubkey: toBuffer(publicKey),
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

/**
 * @constructor
 * @param {string} privateKey
 * @param {string} publicKey
 * @param {string} feeCoinSymbol
 * @param {string} [message]
 * @return {TxParams}
 */
export function SetCandidateOnTxParams({privateKey, publicKey, feeCoinSymbol, message}) {
    const txData = new MinterSetCandidateOnTxData({
        pubkey: toBuffer(publicKey),
    });

    return {
        privateKey,
        message,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_SET_CANDIDATE_ON,
        txData: txData.serialize(),
    };
}

/**
 * @constructor
 * @param {string} privateKey
 * @param {string} publicKey
 * @param {string} feeCoinSymbol
 * @param {string} [message]
 * @return {TxParams}
 */
export function SetCandidateOffTxParams({privateKey, publicKey, feeCoinSymbol, message}) {
    const txData = new MinterSetCandidateOffTxData({
        pubkey: toBuffer(publicKey),
    });

    return {
        privateKey,
        message,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_SET_CANDIDATE_OFF,
        txData: txData.serialize(),
    };
}
