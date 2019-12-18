import {TX_TYPE} from 'minterjs-tx';
// import {TX_TYPE} from 'minterjs-tx/src/tx-types';
import MultisendTxData from '../tx-data/multisend';

/**
 * @constructor
 * @param {Array} list
 * @param {string} [feeCoinSymbol]
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function MultisendTxParams({list, feeCoinSymbol, ...otherParams}) {
    const txData = new MultisendTxData({
        list,
    });

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE.MULTISEND,
        txData: txData.serialize(),
    };
}
