/**
 * @param {TxParams} params
 * @return {TxParams}
 */
export default function decorateAddLiquidityTxParams(params) {
    if (typeof params.gasCoin === 'undefined') {
        params.gasCoin = params.data.coin0;
    }

    return params;
}
