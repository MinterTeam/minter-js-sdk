/**
 * @param {TxParams} params
 * @return {TxParams}
 */
export default function decorateSwapPoolTxParams(params) {
    if (typeof params.gasCoin === 'undefined') {
        params.gasCoin = params.data.coins[0];
    }

    return params;
}
