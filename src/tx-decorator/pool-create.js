/**
 * @param {TxParams} params
 * @return {TxParams}
 */
export default function decorateCreateSwapPoolTxParams(params) {
    if (typeof params.gasCoin === 'undefined') {
        params.gasCoin = params.data.coin0;
    }

    return params;
}
