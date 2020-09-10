/**
 * @param {TxParams} params
 * @return {TxParams}
 */
export default function decorateEditCandidateTxParams(params) {
    if (!params.data.newPublicKey) {
        params.data.newPublicKey = params.data.publicKey;
    }

    return params;
}
