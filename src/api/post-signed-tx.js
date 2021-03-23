
/**
 * @param {MinterApiInstance} apiInstance
 * @return {Function<Promise>}
 */
export default function PostSignedTx(apiInstance) {
    /**
     * @param {string|Buffer} signedTx
     * @param {AxiosRequestConfig} [axiosOptions]
     * @return {Promise<NodeTransaction|{hash: string}>}
     */
    return function postSignedTx(signedTx, axiosOptions) {
        if (Buffer.isBuffer(signedTx)) {
            signedTx = `0x${signedTx.toString('hex')}`;
        }

        return apiInstance.post('send_transaction', {
            tx: signedTx,
        }, axiosOptions)
            .then((response) => {
                const resData = response.data;

                if (resData.transaction?.code > 0) {
                    throw new Error(`Transaction included in the block with error code ${resData.transaction.code}: ${resData.transaction.log}`);
                }

                // @TODO check error code
                return resData.transaction || {hash: resData.hash};
            });
    };
}

/**
 * @typedef NodeTransaction
 * @property {string} hash
 * @property {string} raw_tx
 * @property {string} height
 * @property {string} from
 * @property {string} nonce
 * @property {string} gas
 * @property {number} gas_price
 * @property {string} gas_coin
 * @property {number} type
 * @property {TxData} data
 * @property {string} payload
 * @property {Object} tags
 */
