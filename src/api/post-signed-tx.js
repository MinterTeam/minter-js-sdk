
/**
 * @param {MinterApiInstance} apiInstance
 * @param {import('axios').AxiosRequestConfig} [factoryAxiosOptions]
 * @return {PostSignedTxInstance}
 */
export default function PostSignedTx(apiInstance, factoryAxiosOptions) {
    /**
     * @typedef {Function} PostSignedTxInstance
     * @param {string|Buffer} signedTx
     * @param {import('axios').AxiosRequestConfig} [axiosOptions]
     * @return {Promise<PostTxResponse>}
     */
    return function postSignedTx(signedTx, axiosOptions) {
        if (Buffer.isBuffer(signedTx)) {
            signedTx = `0x${signedTx.toString('hex')}`;
        }

        return apiInstance.post('send_transaction', {
            tx: signedTx,
        }, {
            ...factoryAxiosOptions,
            ...axiosOptions,
        })
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
 * @typedef {NodeTransaction|{hash: string}} PostTxResponse
 */

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
 * @property {object} tags
 */
