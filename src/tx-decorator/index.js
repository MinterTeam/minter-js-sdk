import {TX_TYPE, normalizeTxType} from 'minterjs-util';
import decorateSendTxParams from './send.js';
import decorateSellTxParams from './convert-sell.js';
import decorateBuyTxParams from './convert-buy.js';
import decorateSellAllTxParams from './convert-sell-all.js';
import decorateDeclareCandidacyTxParams from './candidacy-declare.js';
import decorateDelegateTxParams from './stake-delegate.js';
import decorateUnbondTxParams from './stake-unbond.js';
import decorateRedeemCheckTxParams from './redeem-check.js';

const noop = (x) => x;

const TX_PARAMS_DECORATOR = {
    [TX_TYPE.SEND]: decorateSendTxParams,
    [TX_TYPE.MULTISEND]: noop,
    [TX_TYPE.SELL]: decorateSellTxParams,
    [TX_TYPE.BUY]: decorateBuyTxParams,
    [TX_TYPE.SELL_ALL]: decorateSellAllTxParams,
    [TX_TYPE.CREATE_COIN]: noop,
    [TX_TYPE.DECLARE_CANDIDACY]: decorateDeclareCandidacyTxParams,
    [TX_TYPE.EDIT_CANDIDATE]: noop,
    [TX_TYPE.EDIT_CANDIDATE_PUBLIC_KEY]: noop,
    [TX_TYPE.SET_CANDIDATE_ON]: noop,
    [TX_TYPE.SET_CANDIDATE_OFF]: noop,
    [TX_TYPE.DELEGATE]: decorateDelegateTxParams,
    [TX_TYPE.UNBOND]: decorateUnbondTxParams,
    [TX_TYPE.REDEEM_CHECK]: decorateRedeemCheckTxParams,
    [TX_TYPE.CREATE_MULTISIG]: noop,
    [TX_TYPE.SET_HALT_BLOCK]: noop,
    [TX_TYPE.RECREATE_COIN]: noop,
    [TX_TYPE.EDIT_COIN_OWNER]: noop,
    [TX_TYPE.EDIT_MULTISIG]: noop,
    [TX_TYPE.PRICE_VOTE]: noop,
    [TX_TYPE.EDIT_CANDIDATE_PUBLIC_KEY]: noop,
    [TX_TYPE.ADD_LIQUIDITY]: noop,
    [TX_TYPE.REMOVE_LIQUIDITY]: noop,
    [TX_TYPE.BUY_SWAP_POOL]: decorateBuyTxParams,
    [TX_TYPE.SELL_SWAP_POOL]: decorateSellTxParams,
    [TX_TYPE.SELL_ALL_SWAP_POOL]: decorateSellAllTxParams,
    [TX_TYPE.EDIT_CANDIDATE_COMMISSION]: noop,
    [TX_TYPE.MOVE_STAKE]: noop,
    [TX_TYPE.MINT_TOKEN]: noop,
    [TX_TYPE.BURN_TOKEN]: noop,
    [TX_TYPE.CREATE_TOKEN]: noop,
    [TX_TYPE.RECREATE_TOKEN]: noop,
};

/**
 * @param {TxParams} txParams
 * @return {TxParams}
 */
export default function decorateTxParams(txParams) {
    const txType = normalizeTxType(txParams.type || txParams.txType);

    return TX_PARAMS_DECORATOR[txType](txParams);
}
