import {TX_TYPE} from 'minterjs-util';
import {ENV_DATA, minterGate, minterNode} from './variables';

const API_TYPE_LIST = [
    {
        ...minterNode,
        // privateKey: ENV_DATA.privateKey2,
        address: ENV_DATA.address2,
        // customCoin: 'TESTCOIN03',
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
        // customCoin: ENV_DATA.customCoin,
        // newCoin: getRandomCoin(),
        // newCandidatePublicKey: newCandidatePublicKeyGate,
        toString() {
            return 'gate';
        },
    },
];

// beforeAll(async () => {
//     await ensureCustomCoin();
// }, 30000);

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
                console.log(error?.response?.data ? {data: error.response.data, errorData: error.response.data.error?.data, error} : error);
            });
    }, 30000);
});
