// @TODO replace with .fields
// eslint-disable-next-line import/prefer-default-export
import {TX_TYPE} from 'minterjs-util';
import {ENV_DATA, minterGate} from '~/test/api/variables.js';

export function clearData(dirtyData) {
    // eslint-disable-next-line no-unused-vars
    const {raw, serialize, txData, fields, ...data} = dirtyData;
    Object.keys(data).forEach((key) => {
        data[key] = data[key].toString();
    });

    return data;
}

/**
 * @param {string} [coinSymbol]
 * @param {string} [privateKey]
 * @return {Promise}
 */
export function ensureCustomCoin({coinSymbol, privateKey} = {}) {
    // ensure custom coin exists
    const txParams = {
        chainId: 2,
        type: TX_TYPE.CREATE_COIN,
        data: {
            name: coinSymbol || ENV_DATA.customCoin,
            symbol: coinSymbol || ENV_DATA.customCoin,
            initialAmount: 5000,
            initialReserve: 10000,
            constantReserveRatio: 50,
        },
    };
    return minterGate.postTx(txParams, {privateKey: privateKey || ENV_DATA.privateKey})
        .catch((e) => {
            console.log(e.response?.data ? {data: e.response.data, e} : e);
        });
}
