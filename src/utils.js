import axios from 'axios';

/**
 * @param nodeUrl
 * @param address
 * @return {Promise<number>}
 */
export function getNonce(nodeUrl, address) {
    return axios.get(`${nodeUrl}/api/transactionCount/${address}`)
        .then((response) => Number(response.data.result) + 1);
}
