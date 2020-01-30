import {getGasCoinFromCheck} from '../check.js';
import RedeemCheckTxData from '../tx-data/redeem-check.js';

/**
 * @param {TxParams} params
 * @return {TxParams}
 */
export default function decorateRedeemCheckTxParams(params) {
    const check = params.data.check || RedeemCheckTxData.fromRlp(params.data).check;
    params.gasCoin = getGasCoinFromCheck(check);

    // only gasPrice: 1 is allowed by blockchain
    params.gasPrice = 1;

    return params;
}
