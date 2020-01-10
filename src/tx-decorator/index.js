import {TX_TYPE, normalizeTxType} from 'minterjs-tx';
import decorateSendTxParams from './send';
import decorateSellTxParams from './convert-sell';
import decorateBuyTxParams from './convert-buy';
import decorateSellAllTxParams from './convert-sell-all';
import decorateDeclareCandidacyTxParams from './candidacy-declare';
import decorateDelegateTxParams from './stake-delegate';
import decorateUnbondTxParams from './stake-unbond';
import decorateRedeemCheckTxParams from './redeem-check';

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
    [TX_TYPE.SET_CANDIDATE_ON]: noop,
    [TX_TYPE.SET_CANDIDATE_OFF]: noop,
    [TX_TYPE.DELEGATE]: decorateDelegateTxParams,
    [TX_TYPE.UNBOND]: decorateUnbondTxParams,
    [TX_TYPE.REDEEM_CHECK]: decorateRedeemCheckTxParams,
    [TX_TYPE.CREATE_MULTISIG]: noop,
};

/**
 * @param {TxParams} txParams
 * @return {TxParams}
 */
export default function decorateTxParams(txParams) {
    const txType = normalizeTxType(txParams.type || txParams.txType);

    return TX_PARAMS_DECORATOR[txType](txParams);
}
