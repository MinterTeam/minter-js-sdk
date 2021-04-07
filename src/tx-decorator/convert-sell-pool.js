/**
 * @param {TxParams} params
 * @return {TxParams}
 */
export default function decorateSellSwapPoolTxParams(params) {
    if (typeof params.gasCoin === 'undefined') {
        params.gasCoin = params.data.coins[0];
    }

    return params;
}
