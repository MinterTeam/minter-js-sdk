/**
 * @param {TxParams} params
 * @return {TxParams}
 */
export default function decorateSellAllSwapPoolTxParams(params) {
    // force gasCoin to be same as coin to sell
    params.gasCoin = params.data.coins[0];

    return params;
}
