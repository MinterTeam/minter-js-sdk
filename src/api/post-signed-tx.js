
/**
 * @param {MinterApiInstance} apiInstance
 * @return {Function<Promise>}
 */
export default function PostSignedTx(apiInstance) {
    /**
     * @param {string|Buffer} signedTx
     * @return {Promise<NodeTransaction|{hash: string}>}
     */
    return function postSignedTx(signedTx) {
        if (Buffer.isBuffer(signedTx)) {
            signedTx = `0x${signedTx.toString('hex')}`;
        }

        return apiInstance.post('send_transaction', {
            tx: signedTx,
        })
            .then((response) => {
                const resData = response.data;

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
