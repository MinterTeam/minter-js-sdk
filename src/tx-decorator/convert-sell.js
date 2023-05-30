/**
 * @param {TxParams} params
 * @return {TxParams}
 */
export default function decorateSellTxParams(params) {
    if (params.gasCoin === undefined) {
        params.gasCoin = params.data.coinToSell;
    }

    return params;
}
