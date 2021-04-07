/**
 * @param {TxParams} params
 * @return {TxParams}
 */
export default function decorateSellTxParams(params) {
    // force gasCoin to be same as coinToSell
    params.gasCoin = params.data.coinToSell;

    return params;
}
