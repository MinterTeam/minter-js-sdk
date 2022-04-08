import {TX_TYPE, normalizeTxType} from 'minterjs-util';
import decorateSendTxParams from './send.js';
import decorateSellTxParams from './convert-sell.js';
import decorateBuyTxParams from './convert-buy.js';
import decorateSellAllTxParams from './convert-sell-all.js';
import decorateSellSwapPoolTxParams from './convert-sell-pool.js';
import decorateBuySwapPoolTxParams from './convert-buy-pool.js';
import decorateSellAllSwapPoolTxParams from './convert-sell-all-pool.js';
import decorateCreateSwapPoolTxParams from './pool-create.js';
import decorateAddLiquidityTxParams from './pool-add-liquidity.js';
import decorateAddLimitOrderTxParams from './limit-order-add.js';
import decorateDeclareCandidacyTxParams from './candidacy-declare.js';
import decorateDelegateTxParams from './stake-delegate.js';
// import decorateUnbondTxParams from './stake-unbond.js';
import decorateMoveStakeTxParams from './stake-move.js';
import decorateBurnTokenTxParams from './token-burn.js';
import decorateRedeemCheckTxParams from './redeem-check.js';
import decorateLockTxParams from './lock.js';

const noop = (x) => x;

/**
 * @param {TxParams} txParams
 * @param {object} [options]
 * @param {boolean} [options.setGasCoinAsCoinToSpend]
 * @return {TxParams}
 */
export default function decorateTxParams(txParams, {setGasCoinAsCoinToSpend} = {}) {
    const txType = normalizeTxType(txParams.type || txParams.txType);

    const TX_PARAMS_DECORATOR = {
        [TX_TYPE.SEND]: setGasCoinAsCoinToSpend ? decorateSendTxParams : noop,
        [TX_TYPE.MULTISEND]: noop,
        [TX_TYPE.SELL]: setGasCoinAsCoinToSpend ? decorateSellTxParams : noop,
        [TX_TYPE.BUY]: setGasCoinAsCoinToSpend ? decorateBuyTxParams : noop,
        [TX_TYPE.SELL_ALL]: decorateSellAllTxParams,
        [TX_TYPE.CREATE_COIN]: noop,
        [TX_TYPE.DECLARE_CANDIDACY]: setGasCoinAsCoinToSpend ? decorateDeclareCandidacyTxParams : noop,
        [TX_TYPE.EDIT_CANDIDATE]: noop,
        [TX_TYPE.EDIT_CANDIDATE_PUBLIC_KEY]: noop,
        [TX_TYPE.SET_CANDIDATE_ON]: noop,
        [TX_TYPE.SET_CANDIDATE_OFF]: noop,
        [TX_TYPE.DELEGATE]: setGasCoinAsCoinToSpend ? decorateDelegateTxParams : noop,
        [TX_TYPE.UNBOND]: noop, // decorateUnbondTxParams,
        [TX_TYPE.REDEEM_CHECK]: decorateRedeemCheckTxParams,
        [TX_TYPE.CREATE_MULTISIG]: noop,
        [TX_TYPE.SET_HALT_BLOCK]: noop,
        [TX_TYPE.RECREATE_COIN]: noop,
        [TX_TYPE.EDIT_TICKER_OWNER]: noop,
        [TX_TYPE.EDIT_MULTISIG]: noop,
        [TX_TYPE.PRICE_VOTE]: noop,
        [TX_TYPE.EDIT_CANDIDATE_PUBLIC_KEY]: noop,
        [TX_TYPE.ADD_LIQUIDITY]: setGasCoinAsCoinToSpend ? decorateAddLiquidityTxParams : noop,
        [TX_TYPE.REMOVE_LIQUIDITY]: noop,
        [TX_TYPE.BUY_SWAP_POOL]: setGasCoinAsCoinToSpend ? decorateBuySwapPoolTxParams : noop,
        [TX_TYPE.SELL_SWAP_POOL]: setGasCoinAsCoinToSpend ? decorateSellSwapPoolTxParams : noop,
        [TX_TYPE.SELL_ALL_SWAP_POOL]: decorateSellAllSwapPoolTxParams,
        [TX_TYPE.EDIT_CANDIDATE_COMMISSION]: noop,
        [TX_TYPE.MOVE_STAKE]: setGasCoinAsCoinToSpend ? decorateMoveStakeTxParams : noop,
        [TX_TYPE.MINT_TOKEN]: noop,
        [TX_TYPE.BURN_TOKEN]: setGasCoinAsCoinToSpend ? decorateBurnTokenTxParams : noop,
        [TX_TYPE.CREATE_TOKEN]: noop,
        [TX_TYPE.RECREATE_TOKEN]: noop,
        [TX_TYPE.VOTE_COMMISSION]: noop,
        [TX_TYPE.VOTE_UPDATE]: noop,
        [TX_TYPE.CREATE_SWAP_POOL]: setGasCoinAsCoinToSpend ? decorateCreateSwapPoolTxParams : noop,
        [TX_TYPE.ADD_LIMIT_ORDER]: setGasCoinAsCoinToSpend ? decorateAddLimitOrderTxParams : noop,
        [TX_TYPE.REMOVE_LIMIT_ORDER]: noop,
        [TX_TYPE.LOCK_STAKE]: noop,
        [TX_TYPE.LOCK]: setGasCoinAsCoinToSpend ? decorateLockTxParams : noop,
    };

    return TX_PARAMS_DECORATOR[txType](txParams);
}
