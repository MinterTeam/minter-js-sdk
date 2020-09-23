/**
 * @param {TxParams} params
 * @return {TxParams}
 */
export default function decorateDeclareCandidacyTxParams(params) {
    if (typeof params.gasCoin === 'undefined') {
        params.gasCoin = params.data.coin;
    }

    return params;
}
