import {TX_TYPE, normalizeTxType} from 'minterjs-util';
import {TxData as TxBufferData} from 'minterjs-tx';
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
import SetHaltBlockTxData from './vote-halt-block.js';
import RecreateCoinTxData from './recreate-coin.js';
import EditTickerOwnerTxData from './edit-ticker-owner.js';
import EditMultisigTxData from './edit-multisig.js';
import PriceVoteTxData from './vote-price.js';
import EditCandidatePublicKeyTxData from './candidate-edit-public-key.js';
import AddLiquidityTxData from './pool-add-liquidity.js';
import RemoveLiquidityTxData from './pool-remove-liquidity.js';
import BuyPoolTxData from './pool-buy.js';
import SellPoolTxData from './pool-sell.js';
import SellAllPoolTxData from './pool-sell-all.js';
import EditCandidateCommissionTxData from './candidate-edit-commission.js';
import MoveStakeTxData from './stake-move.js';
import MintTokenTxData from './token-mint.js';
import BurnTokenTxData from './token-burn.js';
import CreateTokenTxData from './token-create.js';
import RecreateTokenTxData from './token-recreate.js';
import VoteCommissionTxData from './vote-commission.js';
import VoteUpdateTxData from './vote-update.js';
import CreatePoolTxData from './pool-create.js';
import AddLimitOrderTxData from './limit-order-add.js';
import RemoveLimitOrderTxData from './limit-order-remove.js';
import LockStakeTxData from './stake-lock.js';
import LockTxData from './lock.js';
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
    [TX_TYPE.EDIT_TICKER_OWNER]: EditTickerOwnerTxData,
    [TX_TYPE.EDIT_MULTISIG]: EditMultisigTxData,
    [TX_TYPE.PRICE_VOTE]: PriceVoteTxData,
    [TX_TYPE.EDIT_CANDIDATE_PUBLIC_KEY]: EditCandidatePublicKeyTxData,
    [TX_TYPE.ADD_LIQUIDITY]: AddLiquidityTxData,
    [TX_TYPE.REMOVE_LIQUIDITY]: RemoveLiquidityTxData,
    [TX_TYPE.BUY_SWAP_POOL]: BuyPoolTxData,
    [TX_TYPE.SELL_SWAP_POOL]: SellPoolTxData,
    [TX_TYPE.SELL_ALL_SWAP_POOL]: SellAllPoolTxData,
    [TX_TYPE.EDIT_CANDIDATE_COMMISSION]: EditCandidateCommissionTxData,
    [TX_TYPE.MOVE_STAKE]: MoveStakeTxData,
    [TX_TYPE.MINT_TOKEN]: MintTokenTxData,
    [TX_TYPE.BURN_TOKEN]: BurnTokenTxData,
    [TX_TYPE.CREATE_TOKEN]: CreateTokenTxData,
    [TX_TYPE.RECREATE_TOKEN]: RecreateTokenTxData,
    [TX_TYPE.VOTE_COMMISSION]: VoteCommissionTxData,
    [TX_TYPE.VOTE_UPDATE]: VoteUpdateTxData,
    [TX_TYPE.CREATE_SWAP_POOL]: CreatePoolTxData,
    [TX_TYPE.ADD_LIMIT_ORDER]: AddLimitOrderTxData,
    [TX_TYPE.REMOVE_LIMIT_ORDER]: RemoveLimitOrderTxData,
    [TX_TYPE.LOCK_STAKE]: LockStakeTxData,
    [TX_TYPE.LOCK]: LockTxData,
};

/**
 * @param {TX_TYPE|number|string|Buffer|Uint8Array} txType
 * @return {SendTxData|MultisendTxData|SellTxData|SellAllTxData|BuyTxData|CreateCoinTxData|DeclareCandidacyTxData|EditCandidateTxData|SetCandidateOnTxData|SetCandidateOffTxData|DelegateTxData|UnbondTxData|RedeemCheckTxData|CreateMultisigTxData|SetHaltBlockTxData|RecreateCoinTxData|EditTickerOwnerTxData|EditMultisigTxData|PriceVoteTxData|EditCandidatePublicKeyTxData|AddLiquidityTxData|RemoveLiquidityTxData|BuyPoolTxData|SellPoolTxData|SellAllPoolTxData|EditCandidateCommissionTxData|MoveStakeTxData|MintTokenTxData|BurnTokenTxData|CreateTokenTxData|RecreateTokenTxData|VoteCommissionTxData|VoteUpdateTxData|CreatePoolTxData|AddLimitOrderTxData|RemoveLimitOrderTxData|LockStakeTxData|LockTxData}
 */
export default function getTxData(txType) {
    txType = normalizeTxType(txType);

    return TX_DATA_CONSTRUCTOR[txType];
}

/**
 * @param {Buffer|TxData|object} txData
 * @param {TX_TYPE} txType
 * @param {TxOptions} [options] - options for RedeemCheckTxData
 * @return {Buffer}
 */
export function ensureBufferData(txData, txType, options) {
    // serialize, if it TxData
    if (txData && typeof txData.serialize === 'function') {
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

/**
 * Fill tx data params with default values
 * @param {TX_TYPE} txType
 * @param {object} txData
 * @return {object}
 */
export function fillDefaultData(txType, txData) {
    const defaultBufferData = new TxBufferData({}, txType, {forceDefaultValues: true});
    const defaultData = getTxData(txType).fromBufferFields(defaultBufferData, {disableValidation: true});
    let mergedData = {};
    defaultBufferData._fields.forEach((key) => {
        if (typeof txData?.[key] !== 'undefined') {
            mergedData[key] = txData[key];
        } else {
            mergedData[key] = defaultData[key];
        }
    });

    return mergedData;
}
