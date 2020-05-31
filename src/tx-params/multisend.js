import {TX_TYPE} from 'minterjs-util';
// import {TX_TYPE} from 'minterjs-tx/src/tx-types.js';
import MultisendTxData from '../tx-data/multisend.js';

/**
 * @deprecated
 * @constructor
 * @param {Array} list
 * @param {string} [feeCoinSymbol]
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function MultisendTxParams({list, feeCoinSymbol, ...otherParams}) {
    // eslint-disable-next-line no-console
    console.warn('MultisendTxParams is deprecated');

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
