/**
 * @param {TxParams} params
 * @return {TxParams}
 */
export default function decorateSellTxParams(params) {
    if (!params.gasCoin) {
        params.gasCoin = params.data.coinToSell;
    }

    return params;
}
