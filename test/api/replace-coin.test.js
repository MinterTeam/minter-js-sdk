import {TX_TYPE} from 'minterjs-util';
import {ENV_DATA, minterGate, minterNode} from './variables';
import {ensureCustomCoin, logError} from '~/test/utils.js';

const API_TYPE_LIST = [
    {
        ...minterNode,
        // privateKey: ENV_DATA.privateKey2,
        address: ENV_DATA.address2,
        customCoin: ENV_DATA.customCoin,
        // newCoin: getRandomCoin(),
        // newCandidatePublicKey: newCandidatePublicKeyNode,
        toString() {
            return 'node';
        },
    },
    {
        ...minterGate,
        // postTx: makePostTx(minterGate),
        // privateKey: ENV_DATA.privateKey,
        address: ENV_DATA.address,
        customCoin: ENV_DATA.customCoin,
        // newCoin: getRandomCoin(),
        // newCandidatePublicKey: newCandidatePublicKeyGate,
        toString() {
            return 'gate';
        },
    },
];

beforeAll(async () => {
    await ensureCustomCoin();
}, 30000);

describe('ReplaceCoinSymbol', () => {
    const txParamsData = (apiType, data) => ({
        chainId: 2,
        type: TX_TYPE.SEND,
        data: Object.assign({
            to: apiType.address,
            value: 10,
            coin: 'MNT',
        }, data),
        gasCoin: 'MNT',
        payload: 'custom message',
    });

    test.each(API_TYPE_LIST)('should work %s', (apiType) => {
        expect.assertions(1);
        const txParams = txParamsData(apiType);
        return apiType.replaceCoinSymbol(txParams)
            .then((newTxParams) => {
                expect(newTxParams).toEqual({
                    chainId: 2,
                    type: TX_TYPE.SEND,
                    data: {
                        to: apiType.address,
                        value: 10,
                        coin: 0,
                    },
                    gasCoin: 0,
                    payload: 'custom message',
                });
            })
            .catch((error) => {
                logError(error);
                throw error;
            });
    }, 30000);
});

describe('ReplaceCoinSymbolByPath', () => {
    const txParamsData = (apiType) => ({
        gasCoin: apiType.customCoin,
    });

    test.each(API_TYPE_LIST)('should work %s', (apiType) => {
        expect.assertions(1);
        const txParams = txParamsData(apiType);
        return apiType.replaceCoinSymbolByPath(txParams, ['gasCoin'])
            .then((newTxParams) => {
                expect(newTxParams.gasCoin).toBeGreaterThan(0);
            })
            .catch((error) => {
                logError(error);
                throw error;
            });
    }, 30000);
});

describe('GetCoinId', () => {
    test.each(API_TYPE_LIST)('should work single %s', (apiType) => {
        expect.assertions(1);
        return apiType.getCoinId(apiType.customCoin)
            .then((coinId) => {
                expect(coinId).toBeGreaterThan(0);
            })
            .catch((error) => {
                logError(error);
                throw error;
            });
    }, 30000);

    test.each(API_TYPE_LIST)('should work array %s', (apiType) => {
        expect.assertions(2);
        return apiType.getCoinId([apiType.customCoin, 'MNT'], 2)
            .then(([customCoinId, baseCoinId]) => {
                expect(customCoinId).toBeGreaterThan(0);
                expect(baseCoinId).toBe(0);
            })
            .catch((error) => {
                logError(error);
                throw error;
            });
    }, 30000);
});
