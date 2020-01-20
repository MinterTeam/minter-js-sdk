/**
 * @param {TxParams} params
 * @return {TxParams}
 */
export default function decorateSendTxParams(params) {
    if (!params.gasCoin) {
        params.gasCoin = params.data.coin;
    }

    return params;
}
