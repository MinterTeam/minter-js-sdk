import {TX_TYPE, normalizeTxType} from 'minterjs-tx';
import SendTxData from './send';
import MultisendTxData from './multisend';
import SellTxData from './convert-sell';
import BuyTxData from './convert-buy';
import SellAllTxData from './convert-sell-all';
import CreateCoinTxData from './create-coin';
import DeclareCandidacyTxData from './candidacy-declare';
import EditCandidateTxData from './candidate-edit';
import SetCandidateOnTxData from './candidate-set-on';
import SetCandidateOffTxData from './candidate-set-off';
import DelegateTxData from './stake-delegate';
import UnbondTxData from './stake-unbond';
import RedeemCheckTxData from './redeem-check';
import CreateMultisigTxData from './create-multisig';

const TX_DATA_CONSTRUCTOR = {
    [TX_TYPE.SEND]: SendTxData,
    [TX_TYPE.MULTISEND]: MultisendTxData,
    [TX_TYPE.SELL]: SellTxData,
    [TX_TYPE.BUY]: BuyTxData,
    [TX_TYPE.SELL_ALL]: SellAllTxData,
    [TX_TYPE.CREATE_COIN]: CreateCoinTxData,
    [TX_TYPE.DECLARE_CANDIDACY]: DeclareCandidacyTxData,
    [TX_TYPE.EDIT_CANDIDATE]: EditCandidateTxData,
    [TX_TYPE.SET_CANDIDATE_ON]: SetCandidateOnTxData,
    [TX_TYPE.SET_CANDIDATE_OFF]: SetCandidateOffTxData,
    [TX_TYPE.DELEGATE]: DelegateTxData,
    [TX_TYPE.UNBOND]: UnbondTxData,
    [TX_TYPE.REDEEM_CHECK]: RedeemCheckTxData,
    [TX_TYPE.CREATE_MULTISIG]: CreateMultisigTxData,
};

/**
 * @param {TX_TYPE|number|string|Buffer|Uint8Array} txType
 * @return {SendTxData|MultisendTxData|SellTxData|SellAllTxData|BuyTxData|CreateCoinTxData|DeclareCandidacyTxData|EditCandidateTxData|SetCandidateOnTxData|SetCandidateOffTxData|DelegateTxData|UnbondTxData|RedeemCheckTxData|CreateMultisigTxData}
 */
export default function getTxData(txType) {
    txType = normalizeTxType(txType);

    return TX_DATA_CONSTRUCTOR[txType];
}

/**
 * @param {Buffer|TxData|Object} txData
 * @param {TX_TYPE} txType
 * @return {Buffer}
 */
export function ensureBufferData(txData, txType) {
    // serialize, if it TxData
    if (typeof txData.serialize === 'function') {
        txData = txData.serialize();
    }
    // make buffer from object
    if (typeof txData.length === 'undefined') {
        const TxData = getTxData(txType);
        txData = new TxData(txData);
        txData = txData.serialize();
    }

    return txData;
}
