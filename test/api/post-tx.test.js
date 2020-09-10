import {generateWallet} from 'minterjs-wallet';
import {TX_TYPE, COIN_MAX_AMOUNT} from 'minterjs-util';
import {
    SendTxData,
    MultisendTxData,
    SellTxData,
    BuyTxData,
    DeclareCandidacyTxData,
    EditCandidateTxData,
    DelegateTxData,
    UnbondTxData,
    RedeemCheckTxData,
    SetCandidateOnTxData,
    SetCandidateOffTxData,
    CreateMultisigTxData,
    CreateCoinTxData,
    SellAllTxData,
    issueCheck,
    prepareSignedTx,
} from '~/src';
import {ENV_DATA, minterGate, minterNode} from './variables';
import {ensureCustomCoin} from '~/test/utils.js';

const newCandidatePublicKeyGate = generateWallet().getPublicKeyString();
const newCandidatePublicKeyNode = generateWallet().getPublicKeyString();

const NOT_EXISTENT_COIN = 4294967295;

const API_TYPE_LIST = [
    {
        ...minterNode,
        postTx: makePostTx(minterNode),
        privateKey: ENV_DATA.privateKey2,
        address: ENV_DATA.address2,
        customCoin: 'TESTCOIN03',
        newCandidatePublicKey: newCandidatePublicKeyNode,
        toString() {
            return 'node';
        },
    },
    {
        ...minterGate,
        postTx: makePostTx(minterGate),
        privateKey: ENV_DATA.privateKey,
        address: ENV_DATA.address,
        customCoin: ENV_DATA.customCoin,
        newCandidatePublicKey: newCandidatePublicKeyGate,
        toString() {
            return 'gate';
        },
    },
];

function makePostTx(minterApi) {
    return function postTxDecorated(txParams, options) {
        return minterApi.postTx(txParams, {mempoolRetryLimit: 2, nonceRetryLimit: 2, ...options});
    };
}

beforeAll(async () => {
    // fill test ENV_DATA with data from the server
    /*
    if (CURRENT_ENV === ENV_TEST_TESTNET) {
        const response = await axios.get(`${ENV_DATA.nodeBaseUrl}make_test_setup?env=bot`);
        const result = response.data.result;
        ENV_DATA = {
            ...ENV_DATA,
            mnemonic: result.mnemonic,
            privateKey: walletFromMnemonic(result.mnemonic).getPrivateKeyString(),
            address: result.address,
            customCoin: result.coin_symbol,
        };
    }
    */

    // ensure custom coin exists
    const coinPromises = API_TYPE_LIST.map((apiType) => {
        return ensureCustomCoin({coinSymbol: apiType.customCoin, privateKey: apiType.privateKey});
    });

    // @TODO allSettled is not a function
    // try {
    //     await Promise.allSettled(coinPromises);
    // } catch (e) {
    //     console.log(e?.response?.data || e);
    // }
    try {
        await coinPromises[0];
    } catch (e) {
        console.log(e.response?.data ? {data: e.response.data, e} : e);
    }
    try {
        await coinPromises[1];
    } catch (e) {
        console.log(e.response?.data ? {data: e.response.data, e} : e);
    }

    const coinInfoPromises = API_TYPE_LIST.map((apiType) => {
        return apiType.getCoinInfo(apiType.customCoin)
            .then((coinInfo) => {
                console.log({coinInfo});
                apiType.customCoinId = coinInfo.id;
            });
    });

    await Promise.all(coinInfoPromises);
}, 30000);

// only one tx from given address can exist in mempool
// beforeEach(async () => {
//     await new Promise((resolve) => {
//         setTimeout(resolve, 5000);
//     });
// }, 10000);


describe('PostTx: send', () => {
    const txParamsData = (apiType, data) => ({
        chainId: 2,
        type: TX_TYPE.SEND,
        data: new SendTxData(Object.assign({
            to: apiType.address,
            value: 10,
            coin: 0,
        }, data)),
        gasCoin: 0,
        payload: 'custom message',
    });

    test('should return signed tx', async () => {
        const nonce = await minterGate.getNonce(ENV_DATA.address);
        const txParams = {...txParamsData(API_TYPE_LIST[0]), nonce, gasPrice: 1};
        const tx = prepareSignedTx(txParams, {privateKey: API_TYPE_LIST[0].privateKey});
        console.log(tx.serialize().toString('hex'));
        expect(tx.serialize().toString('hex').length)
            .toBeGreaterThan(0);
    }, 30000);

    test.each(API_TYPE_LIST)('should work %s', (apiType) => {
        expect.assertions(2);
        const txParams = txParamsData(apiType);
        return apiType.postTx(txParams, {privateKey: apiType.privateKey})
            .then(({hash: txHash}) => {
                console.log(txHash);
                // txHash = txHash.replace(/^Mt/);
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                console.log(error?.response?.data ? {data: error.response.data, errorData: error.response.data.error?.data, error} : error);
            });
    }, 30000);

    describe('wait', () => {
        // beforeAll(async () => {
        //     await wait(6000);
        // }, 30000);

        test.each(API_TYPE_LIST)('should fail %s', async (apiType) => {
            expect.assertions(1);
            const txParams = txParamsData(apiType, {value: COIN_MAX_AMOUNT, coin: NOT_EXISTENT_COIN});
            return apiType.postTx(txParams, {privateKey: apiType.privateKey})
                .catch((error) => {
                    console.log(error?.response?.data ? {data: error.response.data, errorData: error.response.data.error?.data, error} : error);
                    // Coin not exists
                    expect(error.response.data.error.code).toBe('102');
                });
        }, 70000);
    });
});


describe('PostTx handle low gasPrice', () => {
    const txParamsData = (apiType) => ({
        chainId: 2,
        type: TX_TYPE.SEND,
        data: new SendTxData({
            to: apiType.address,
            value: 10,
            coin: 0,
        }),
        gasCoin: 0,
        gasPrice: 0, // <= low gas
        payload: 'custom message',
    });

    describe.each(API_TYPE_LIST)('should fail when 0 retries | %s', (apiType) => {
        test('should fail with specified min_gas_price', () => {
            expect.assertions(1);
            const txParams = txParamsData(apiType);
            return apiType.postTx(txParams, {privateKey: apiType.privateKey, gasRetryLimit: 0})
                .catch((error) => {
                    // console.log(error);
                    console.log(error.response.data);
                    expect(Number(error.response.data.error.data.min_gas_price)).toBeGreaterThan(0);
                });
        }, 70000);
    });

    // @TODO enable after MN-482 will be resolved
    test.skip.each(API_TYPE_LIST)('should work with retries | %s', (apiType) => {
        expect.assertions(2);
        const txParams = txParamsData(apiType);
        return apiType.postTx(txParams, {privateKey: apiType.privateKey})
            .then(({hash: txHash}) => {
                // console.log(txHash);
                // txHash = txHash.replace(/^Mt/);
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                console.log(error?.response?.data ? {data: error.response.data, errorData: error.response.data.error?.data, error} : error);
            });
    }, 30000);
});


describe('PostTx: multisend', () => {
    const getTxParams = (apiType) => ({
        chainId: 2,
        type: TX_TYPE.MULTISEND,
        data: new MultisendTxData({
            list: [
                {
                    value: 10,
                    coin: 0,
                    to: apiType.address,
                },
                {
                    value: 0.1,
                    coin: 0,
                    to: 'Mxddab6281766ad86497741ff91b6b48fe85012e3c',
                },
            ],
        }),
        gasCoin: 0,
        payload: 'custom message',
    });

    test.each(API_TYPE_LIST)('should work %s', (apiType) => {
        expect.assertions(2);
        const txParams = getTxParams(apiType);
        return apiType.postTx(txParams, {privateKey: apiType.privateKey})
            .then(({hash: txHash}) => {
                console.log(txHash);
                // txHash = txHash.replace(/^Mt/);
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                console.log(error?.response?.data ? {data: error.response.data, errorData: error.response.data.error?.data, error} : error);
            });
    }, 30000);

    test.each(API_TYPE_LIST)('should work with 100 items %s', (apiType) => {
        expect.assertions(2);
        const txParamsInstance = getTxParams(apiType);
        let txData = {
            list: new Array(100).fill(0).map(() => ({
                value: Math.random(),
                coin: 0,
                to: apiType.address,
            })),
        };
        const txParams = {
            ...txParamsInstance,
            data: txData,
        };
        return apiType.postTx(txParams, {privateKey: apiType.privateKey})
            .then(({hash: txHash}) => {
                console.log(txHash);
                // txHash = txHash.replace(/^Mt/);
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                console.log(error?.response?.data ? {data: error.response.data, errorData: error.response.data.error?.data, error} : error);
            });
    }, 70000);

    test.each(API_TYPE_LIST)('should fail %s', (apiType) => {
        expect.assertions(1);
        const txParamsInstance = getTxParams(apiType);
        // @TODO txParamsInstance.data is not writable (raw not updated)
        let txData = txParamsInstance.data.fields;
        txData.list[0].value = COIN_MAX_AMOUNT;
        txData.list[0].coin = NOT_EXISTENT_COIN;
        const txParams = {
            ...txParamsInstance,
            data: txData,
        };
        return apiType.postTx(txParams, {privateKey: apiType.privateKey})
            .catch((error) => {
                console.log(error?.response?.data ? {data: error.response.data, errorData: error.response.data.error?.data, error} : error);
                // Coin not exists
                expect(error.response.data.error.code).toBe('102');
            });
    }, 70000);
});


describe('PostTx: sell', () => {
    const txParamsData = (apiType, data) => ({
        chainId: 2,
        type: TX_TYPE.SELL,
        data: new SellTxData(Object.assign({
            coinToSell: 0,
            coinToBuy: apiType.customCoinId,
            valueToSell: 1,
        }, data)),
        gasCoin: 0,
        payload: 'custom message',
    });

    test.each(API_TYPE_LIST)('should work %s', (apiType) => {
        expect.assertions(2);
        const txParams = txParamsData(apiType);
        return apiType.postTx(txParams, {privateKey: apiType.privateKey})
            .then(({hash: txHash}) => {
                // console.log(txHash);
                // txHash = txHash.replace(/^Mt/);
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                console.log(error?.response?.data ? {data: error.response.data, errorData: error.response.data.error?.data, error} : error);
            });
    }, 30000);

    test.each(API_TYPE_LIST)('should fail %s', (apiType) => {
        expect.assertions(1);
        const txParams = txParamsData(apiType, {valueToSell: COIN_MAX_AMOUNT, coinToSell: NOT_EXISTENT_COIN});
        return apiType.postTx(txParams, {privateKey: apiType.privateKey})
            .catch((error) => {
                console.log(error.response?.data ? {data: error.response.data, errorData: error.response.data.error?.data, error} : error);
                // Coin not exists
                expect(error.response.data.error.code).toBe('102');
            });
    }, 70000);
});

// @TODO sellAll
// @TODO create coin


describe('PostTx: buy', () => {
    const txParamsData = (apiType, data) => ({
        chainId: 2,
        type: TX_TYPE.BUY,
        data: new BuyTxData(Object.assign({
            coinToSell: 0,
            coinToBuy: apiType.customCoinId,
            valueToBuy: 1,
        }, data)),
        gasCoin: 0,
        payload: 'custom message',
    });

    test.each(API_TYPE_LIST)('should work %s', (apiType) => {
        expect.assertions(2);
        const txParams = txParamsData(apiType);
        return apiType.postTx(txParams, {privateKey: apiType.privateKey})
            .then(({hash: txHash}) => {
                // console.log(txHash);
                // txHash = txHash.replace(/^Mt/);
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                console.log(error.response?.data ? {data: error.response.data, errorData: error.response.data.error?.data, error} : error);
            });
    }, 30000);

    test.each(API_TYPE_LIST)('should fail %s', (apiType) => {
        expect.assertions(1);
        const txParams = txParamsData(apiType, {valueToBuy: COIN_MAX_AMOUNT, coinToSell: NOT_EXISTENT_COIN});
        return apiType.postTx(txParams, {privateKey: apiType.privateKey})
            .catch((error) => {
                console.log(error.response?.data ? {data: error.response.data, errorData: error.response.data.error?.data, error} : error);
                // Coin not exists
                expect(error.response.data.error.code).toBe('102');
            });
    }, 70000);
});


describe('validator', () => {
    describe('PostTx: declare candidacy', () => {
        const txParamsData = (apiType, data) => ({
            chainId: 2,
            type: TX_TYPE.DECLARE_CANDIDACY,
            data: new DeclareCandidacyTxData(Object.assign({
                address: apiType.address,
                publicKey: apiType.newCandidatePublicKey,
                coin: 0,
                stake: 1.211,
                commission: 50,
            }, data)),
            gasCoin: 0,
            payload: 'custom message',
        });

        test.each(API_TYPE_LIST)('should work %s', async (apiType) => {
            expect.assertions(2);
            const txParams = txParamsData(apiType);
            return apiType.postTx(txParams, {privateKey: apiType.privateKey})
                .then(({hash: txHash}) => {
                    console.log(txHash);
                    // txHash = txHash.replace(/^Mt/);
                    expect(txHash).toHaveLength(66);
                    expect(txHash.substr(0, 2)).toEqual('Mt');
                })
                .catch((error) => {
                    console.log(error.response?.data ? {data: error.response.data, errorData: error.response.data.error?.data, error} : error);
                });
        }, 30000);

        test.each(API_TYPE_LIST)('should fail %s', (apiType) => {
            expect.assertions(1);
            const txParams = txParamsData(apiType, {stake: COIN_MAX_AMOUNT, publicKey: generateWallet().getPublicKeyString()});
            return apiType.postTx(txParams, {privateKey: apiType.privateKey})
                .catch((error) => {
                    console.log(error.response?.data ? {data: error.response.data, errorData: error.response.data.error?.data, error} : error);
                    // Insufficient funds for sender account
                    expect(error.response.data.error.code).toBe('107');
                });
        }, 70000);
    });


    describe('PostTx: edit candidate', () => {
        const txParamsData = (apiType, data) => ({
            chainId: 2,
            type: TX_TYPE.EDIT_CANDIDATE,
            data: new EditCandidateTxData(Object.assign({
                publicKey: apiType.newCandidatePublicKey,
                rewardAddress: apiType.address,
                ownerAddress: apiType.address,
                controlAddress: apiType.address,
            }, data)),
            gasCoin: 0,
            payload: 'custom message',
        });

        test.each(API_TYPE_LIST)('should work %s', async (apiType) => {
            expect.assertions(2);
            const txParams = txParamsData(apiType);
            return apiType.postTx(txParams, {privateKey: apiType.privateKey})
                .then(({hash: txHash}) => {
                    console.log(txHash);
                    // txHash = txHash.replace(/^Mt/);
                    expect(txHash).toHaveLength(66);
                    expect(txHash.substr(0, 2)).toEqual('Mt');
                })
                .catch((error) => {
                    console.log(error.response?.data ? {data: error.response.data, errorData: error.response.data.error?.data, error} : error);
                });
        }, 30000);

        test.each(API_TYPE_LIST)('should fail %s', (apiType) => {
            expect.assertions(1);
            const txParams = txParamsData(apiType, {publicKey: generateWallet().getPublicKeyString()});
            return apiType.postTx(txParams, {privateKey: apiType.privateKey})
                .catch((error) => {
                    console.log(error.response?.data ? {data: error.response.data, errorData: error.response.data.error?.data, error} : error);
                    // Candidate with such public key not found
                    expect(error.response.data.error.code).toBe('403');
                });
        }, 70000);
    });


    describe('PostTx: delegate', () => {
        const txParamsData = (apiType, data) => ({
            chainId: 2,
            type: TX_TYPE.DELEGATE,
            data: new DelegateTxData(Object.assign({
                publicKey: apiType.newCandidatePublicKey,
                coin: 0,
                stake: 10,
            }, data)),
            gasCoin: 0,
            payload: 'custom message',
        });

        test.each(API_TYPE_LIST)('should work %s', (apiType) => {
            expect.assertions(2);
            const txParams = txParamsData(apiType);
            return apiType.postTx(txParams, {privateKey: apiType.privateKey})
                .then(({hash: txHash}) => {
                    // console.log(txHash);
                    // txHash = txHash.replace(/^Mt/);
                    expect(txHash).toHaveLength(66);
                    expect(txHash.substr(0, 2)).toEqual('Mt');
                })
                .catch((error) => {
                    console.log(error.response?.data ? {data: error.response.data, errorData: error.response.data.error?.data, error} : error);
                });
        }, 30000);

        test.each(API_TYPE_LIST)('should fail %s', (apiType) => {
            expect.assertions(1);
            const txParams = txParamsData(apiType, {stake: COIN_MAX_AMOUNT});
            return apiType.postTx(txParams, {privateKey: apiType.privateKey})
                .catch((error) => {
                    console.log(error.response?.data ? {data: error.response.data, errorData: error.response.data.error?.data, error} : error);
                    // Insufficient funds for sender account
                    expect(error.response.data.error.code).toBe('107');
                });
        }, 70000);
    });


    describe.skip('PostTx: unbond', () => {
        const txParamsData = (apiType, data) => ({
            chainId: 2,
            type: TX_TYPE.UNBOND,
            data: new UnbondTxData(Object.assign({
                publicKey: apiType.newCandidatePublicKey,
                coin: 0,
                stake: 10,
            }, data)),
            gasCoin: 0,
            payload: 'custom message',
        });


        test.each(API_TYPE_LIST)('should work %s', (apiType) => {
            console.log('unbond from:', apiType.newCandidatePublicKey);
            expect.assertions(2);
            const txParams = txParamsData(apiType);
            return apiType.postTx(txParams, {privateKey: apiType.privateKey})
                .then(({hash: txHash}) => {
                    // console.log(txHash);
                    // txHash = txHash.replace(/^Mt/);
                    expect(txHash).toHaveLength(66);
                    expect(txHash.substr(0, 2)).toEqual('Mt');
                })
                .catch((error) => {
                    console.log(error.response?.data ? {data: error.response.data, errorData: error.response.data.error?.data, error} : error);
                });
        }, 30000);

        test.each(API_TYPE_LIST)('should fail %s', (apiType) => {
            // expect.assertions(1);
            const txParams = txParamsData(apiType, {stake: COIN_MAX_AMOUNT});
            return apiType.postTx(txParams, {privateKey: apiType.privateKey})
                .catch((error) => {
                    console.log(error.response?.data ? {data: error.response.data, errorData: error.response.data.error?.data, error} : error);
                    // Candidate with such public key not found
                    expect(error.response.data.error.code).toBe('403');
                });
        }, 70000);
    });


    describe('PostTx: set candidate on', () => {
        const txParamsData = (apiType, data) => ({
            chainId: 2,
            type: TX_TYPE.SET_CANDIDATE_ON,
            data: new SetCandidateOnTxData(Object.assign({
                publicKey: apiType.newCandidatePublicKey,
            }, data)),
            gasCoin: 0,
            payload: 'custom message',
        });

        test.each(API_TYPE_LIST)('should work %s', (apiType) => {
            expect.assertions(2);
            const txParams = txParamsData(apiType);
            return apiType.postTx(txParams, {privateKey: apiType.privateKey})
                .then(({hash: txHash}) => {
                    // console.log(txHash);
                    // txHash = txHash.replace(/^Mt/);
                    expect(txHash).toHaveLength(66);
                    expect(txHash.substr(0, 2)).toEqual('Mt');
                })
                .catch((error) => {
                    console.log(error.response?.data ? {data: error.response.data, errorData: error.response.data.error?.data, error} : error);
                });
        }, 30000);

        test.each(API_TYPE_LIST)('should fail %s', (apiType) => {
            expect.assertions(1);
            const txParams = txParamsData(apiType, {publicKey: generateWallet().getPublicKeyString()});
            return apiType.postTx(txParams, {privateKey: apiType.privateKey})
                .then((res) => {
                    console.log({res});
                })
                .catch((error) => {
                    console.log(error.response?.data ? {data: error.response.data, errorData: error.response.data.error?.data, error} : error);
                    // Candidate with such public key not found
                    expect(error.response.data.error.code).toBe('403');
                });
        }, 70000);
    });


    describe('PostTx: set candidate off', () => {
        const txParamsData = (apiType, data) => ({
            chainId: 2,
            type: TX_TYPE.SET_CANDIDATE_OFF,
            data: new SetCandidateOffTxData(Object.assign({
                publicKey: apiType.newCandidatePublicKey,
            }, data)),
            gasCoin: 0,
            payload: 'custom message',
        });

        test.each(API_TYPE_LIST)('should work %s', (apiType) => {
            expect.assertions(2);
            const txParams = txParamsData(apiType);
            return apiType.postTx(txParams, {privateKey: apiType.privateKey})
                .then(({hash: txHash}) => {
                    // console.log(txHash);
                    // txHash = txHash.replace(/^Mt/);
                    expect(txHash).toHaveLength(66);
                    expect(txHash.substr(0, 2)).toEqual('Mt');
                })
                .catch((error) => {
                    console.log(error.response?.data ? {data: error.response.data, errorData: error.response.data.error?.data, error} : error);
                });
        }, 30000);

        test.each(API_TYPE_LIST)('should fail %s', (apiType) => {
            expect.assertions(1);
            const txParams = txParamsData(apiType, {publicKey: generateWallet().getPublicKeyString()});
            return apiType.postTx(txParams, {privateKey: apiType.privateKey})
                .then((res) => {
                    console.log({res});
                })
                .catch((error) => {
                    console.log(error.response?.data ? {data: error.response.data, errorData: error.response.data.error?.data, error} : error);
                    // Candidate with such public key not found
                    expect(error.response.data.error.code).toBe('403');
                });
        }, 70000);
    });
});


describe('PostTx: redeem check', () => {
    const password = '123';

    function getRandomCheck(apiType, gasCoin = 0, dueBlock) {
        return issueCheck({
            privateKey: apiType.privateKey,
            chainId: 2,
            password,
            nonce: 1,
            coin: 0,
            value: Math.random(),
            gasCoin,
            dueBlock,
        });
    }

    const txParamsData = (apiType, data, gasCoin) => ({
        chainId: 2,
        type: TX_TYPE.REDEEM_CHECK,
        data: new RedeemCheckTxData(Object.assign({
            check: getRandomCheck(apiType, gasCoin),
        }, data), {password, privateKey: apiType.privateKey}),
    });

    test.each(API_TYPE_LIST)('should work %s', (apiType) => {
        expect.assertions(2);
        const txParams = txParamsData(apiType);
        return apiType.postTx(txParams, {privateKey: apiType.privateKey})
            .then(({hash: txHash}) => {
                // console.log(txHash);
                // txHash = txHash.replace(/^Mt/);
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                console.log(error.response?.data ? {data: error.response.data, errorData: error.response.data.error?.data, error} : error);
            });
    }, 30000);

    test.each(API_TYPE_LIST)('should work with custom coin %s', (apiType) => {
        expect.assertions(2);
        const txParams = txParamsData(apiType, {}, apiType.customCoinId);
        return apiType.postTx(txParams, {privateKey: apiType.privateKey})
            .then(({hash: txHash}) => {
                // console.log(txHash);
                // txHash = txHash.replace(/^Mt/);
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response.data);
            });
    }, 30000);

    test.each(API_TYPE_LIST)('should fail %s', (apiType) => {
        expect.assertions(1);
        const txParams = txParamsData(apiType, {check: getRandomCheck(apiType, 0, 1)});
        return apiType.postTx(txParams, {privateKey: apiType.privateKey})
            .catch((error) => {
                console.log(error.response?.data ? {data: error.response.data, errorData: error.response.data.error?.data, error} : error);
                // Check expired
                expect(error.response.data.error.code).toBe('502');
            });
    }, 70000);
});


describe('PostTx: create multisig', () => {
    const txParamsData = (apiType, data) => ({
        chainId: 2,
        type: TX_TYPE.CREATE_MULTISIG,
        data: new CreateMultisigTxData(Object.assign({
            addresses: [apiType.address, 'Mx7633980c000139dd3bd24a3f54e06474fa941e01'],
            weights: [1, 2],
            threshold: 100,
        }, data)),
        gasCoin: 0,
    });

    test.each(API_TYPE_LIST)('should work %s', (apiType) => {
        expect.assertions(2);
        const txParams = txParamsData(apiType, {
            weights: [Math.random(), Math.random()].map((item) => item.toString().replace(/\D/, '').substr(0, 3)),
        });
        return apiType.postTx(txParams, {privateKey: apiType.privateKey})
            .then(({hash: txHash}) => {
                // console.log(txHash);
                // txHash = txHash.replace(/^Mt/);
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response.data);
            });
    }, 30000);

    test.each(API_TYPE_LIST)('should fail %s', (apiType) => {
        expect.assertions(1);
        const txParams = txParamsData(apiType, {threshold: 100000000000000000000});
        return apiType.postTx(txParams, {privateKey: apiType.privateKey})
            .catch((error) => {
                console.log(error.response?.data ? {data: error.response.data, errorData: error.response.data.error?.data, error} : error);
                // rlp: input string too long for uint, decoding into (transaction.CreateMultisigData).Threshold
                expect(error.response.data.error.code).toBe('106');
            });
    }, 70000);
});

// @TODO test multisig tx
