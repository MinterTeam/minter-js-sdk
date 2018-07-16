import ethUtil from 'ethereumjs-util';
import MinterDeclareCandidacyTxData from 'minterjs-tx/src/tx-data/declare-candidacy';
import MinterDelegateTxData from 'minterjs-tx/src/tx-data/delegate';
import MinterUnboundTxData from 'minterjs-tx/src/tx-data/unbound';
import MinterSetCandidateOnTxData from 'minterjs-tx/src/tx-data/set-candidate-on';
import MinterSetCandidateOffTxData from 'minterjs-tx/src/tx-data/set-candidate-off';
import {TX_TYPE_DECLARE_CANDIDACY, TX_TYPE_DELEGATE, TX_TYPE_UNBOUND, TX_TYPE_SET_CANDIDATE_ON, TX_TYPE_SET_CANDIDATE_OFF} from 'minterjs-tx/src/tx-types';
import converter from 'minterjs-tx/src/converter';
import {formatCoin} from 'minterjs-tx/src/helpers';
import {toBuffer} from 'minterjs-util';
import {sendTx} from '../utils/index';

export function declareCandidacy({nodeUrl, privateKey, address, publicKey, commission, coinSymbol, stake, message}) {
    const txData = new MinterDeclareCandidacyTxData({
        address: toBuffer(address),
        pubkey: toBuffer(publicKey),
        commission: `0x${ethUtil.padToEven(Number(commission).toString(16))}`,
        coin: formatCoin(coinSymbol),
        stake: `0x${converter.convert(stake, 'pip').toString(16)}`,
    });

    return sendTx({
        nodeUrl,
        privateKey,
        message,
        txType: TX_TYPE_DECLARE_CANDIDACY,
        txData: txData.serialize(),
    });
}

export function delegate({nodeUrl, privateKey, publicKey, coinSymbol, stake, message}) {
    const txData = new MinterDelegateTxData({
        pubkey: toBuffer(publicKey),
        coin: formatCoin(coinSymbol),
        stake: `0x${converter.convert(stake, 'pip').toString(16)}`,
    });

    return sendTx({
        nodeUrl,
        privateKey,
        message,
        txType: TX_TYPE_DELEGATE,
        txData: txData.serialize(),
    });
}

export function unbound({nodeUrl, privateKey, publicKey, coinSymbol, stake, message}) {
    const txData = new MinterUnboundTxData({
        pubkey: toBuffer(publicKey),
        coin: formatCoin(coinSymbol),
        stake: `0x${converter.convert(stake, 'pip').toString(16)}`,
    });

    return sendTx({
        nodeUrl,
        privateKey,
        message,
        txType: TX_TYPE_UNBOUND,
        txData: txData.serialize(),
    });
}

export function setCandidateOn({nodeUrl, privateKey, publicKey, message}) {
    const txData = new MinterSetCandidateOnTxData({
        pubkey: toBuffer(publicKey),
    });

    return sendTx({
        nodeUrl,
        privateKey,
        message,
        txType: TX_TYPE_SET_CANDIDATE_ON,
        txData: txData.serialize(),
    });
}

export function setCandidateOff({nodeUrl, privateKey, publicKey, message}) {
    const txData = new MinterSetCandidateOffTxData({
        pubkey: toBuffer(publicKey),
    });

    return sendTx({
        nodeUrl,
        privateKey,
        message,
        txType: TX_TYPE_SET_CANDIDATE_OFF,
        txData: txData.serialize(),
    });
}
