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

const ensureCoinPromiseList = {};

/**
 * @param {string} [coinSymbol]
 * @param {string} [privateKey]
 * @return {Promise}
 */
export function ensureCustomCoin({coinSymbol, privateKey} = {}) {
    coinSymbol = coinSymbol || ENV_DATA.customCoin;
    privateKey = privateKey || ENV_DATA.privateKey;

    // ensure custom coin exists
    const txParams = {
        chainId: 2,
        type: TX_TYPE.CREATE_COIN,
        data: {
            name: coinSymbol,
            symbol: coinSymbol,
            initialAmount: 5000,
            initialReserve: 20000,
            constantReserveRatio: 50,
        },
    };

    if (ensureCoinPromiseList[coinSymbol]) {
        return ensureCoinPromiseList[coinSymbol];
    }

    ensureCoinPromiseList[coinSymbol] = minterGate.postTx(txParams, {privateKey})
        .catch((error) => {
            logError(error);
            return minterGate.replaceCoinSymbol({
                chainId: 2,
                type: TX_TYPE.SELL,
                data: {
                    coinToBuy: coinSymbol,
                    coinToSell: 'MNT',
                    valueToSell: 15000,
                },
            });
        })
        .then((sellTxParams) => {
            return minterGate.postTx(sellTxParams, {privateKey});
        })
        .catch((error) => {
            logError(error);
        });

    return ensureCoinPromiseList[coinSymbol];
}

export function logError(error) {
    const cleanError = new Error(error.message);
    let axiosRequest;
    if (error.config) {
        axiosRequest = {
            fullUrl: error.config.baseURL + error.config.url,
            method: error.config.method,
            data: error.config.data,
        };
    }
    console.log(cleanError);
    console.log(error?.response?.data ? {data: error.response.data, errorData: error.response.data.error?.data, axiosRequest} : error);
}
