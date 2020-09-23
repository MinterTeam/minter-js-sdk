/**
 * @param {TxParams} params
 * @return {TxParams}
 */
export default function decorateSendTxParams(params) {
    if (typeof params.gasCoin === 'undefined') {
        params.gasCoin = params.data.coin;
    }

    return params;
}
