import {TX_TYPE, normalizeTxType} from 'minterjs-util';
import SendTxData from './send.js';
import MultisendTxData from './multisend.js';
import SellTxData from './convert-sell.js';
import BuyTxData from './convert-buy.js';
import SellAllTxData from './convert-sell-all.js';
import CreateCoinTxData from './create-coin.js';
import DeclareCandidacyTxData from './candidacy-declare.js';
import EditCandidateTxData from './candidate-edit.js';
import SetCandidateOnTxData from './candidate-set-on.js';
import SetCandidateOffTxData from './candidate-set-off.js';
import DelegateTxData from './stake-delegate.js';
import UnbondTxData from './stake-unbond.js';
import RedeemCheckTxData from './redeem-check.js';
import CreateMultisigTxData from './create-multisig.js';
import SetHaltBlockTxData from './set-halt-block.js';
import RecreateCoinTxData from './recreate-coin.js';
import EditCoinOwnerTxData from './edit-coin-owner.js';
import EditMultisigTxData from './edit-multisig.js';
import PriceVoteTxData from './price-vote.js';
import EditCandidatePublicKeyTxData from './candidate-edit-public-key.js';
import {decodeCheck} from '../check.js';

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
    [TX_TYPE.SET_HALT_BLOCK]: SetHaltBlockTxData,
    [TX_TYPE.RECREATE_COIN]: RecreateCoinTxData,
    [TX_TYPE.EDIT_COIN_OWNER]: EditCoinOwnerTxData,
    [TX_TYPE.EDIT_MULTISIG]: EditMultisigTxData,
    [TX_TYPE.PRICE_VOTE]: PriceVoteTxData,
    [TX_TYPE.EDIT_CANDIDATE_PUBLIC_KEY]: EditCandidatePublicKeyTxData,
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
 * @param {TxOptions} [options] - options for RedeemCheckTxData
 * @return {Buffer}
 */
export function ensureBufferData(txData, txType, options) {
    // serialize, if it TxData
    if (typeof txData.serialize === 'function') {
        txData = txData.serialize();
    }
    // make buffer from object
    if (typeof txData.length === 'undefined') {
        const TxData = getTxData(txType);
        txData = new TxData(txData, options);
        txData = txData.serialize();
    }

    return txData;
}

/**
 * Decode rlp txData into fields
 * @param {TX_TYPE} txType
 * @param {string|Buffer|Uint8Array} txData
 * @param {boolean} [decodeCheck]
 */
export function decodeTxData(txType, txData, {decodeCheck: isDecodeCheck} = {}) {
    txType = normalizeTxType(txType);
    let txDataDecoded = getTxData(txType).fromRlp(txData);
    let fields = txDataDecoded.fields;

    if (isDecodeCheck && txType === TX_TYPE.REDEEM_CHECK) {
        fields.checkData = decodeCheck(fields.check);
    }

    return fields;
}
