import {generateWallet} from 'minterjs-wallet';
import {TX_TYPE, COIN_MAX_AMOUNT} from 'minterjs-util';
import {
    SendTxData,
    MultisendTxData,
    SellTxData,
    BuyTxData,
    DeclareCandidacyTxData,
    EditCandidateTxData,
    EditCandidatePublicKeyTxData,
    DelegateTxData,
    UnbondTxData,
    RedeemCheckTxData,
    SetCandidateOnTxData,
    SetCandidateOffTxData,
    CreateMultisigTxData,
    EditMultisigTxData,
    CreateCoinTxData,
    RecreateCoinTxData,
    EditCoinOwnerTxData,
    SetHaltBlockTxData,
    PriceVoteTxData,
    SellAllTxData,
    issueCheck,
    prepareTx,
    prepareSignedTx,
    makeSignature,
} from '~/src';
import {ENV_DATA, minterGate, minterNode} from './variables';
import {ensureCustomCoin, getValidatorMinStake, logError} from '~/test/utils.js';

function getRandomCoin() {
    return Math.random().toString().substring(2, 10 + 2);
}

const NOT_EXISTENT_COIN = '4294967295';

const API_TYPE_LIST = [
    {
        ...minterNode,
        postTx: makePostTx(minterNode),
        privateKey: ENV_DATA.privateKey2,
        address: ENV_DATA.address2,
        customCoin: 'TESTCOIN03',
        newCoin: getRandomCoin(),
        // will be updated during declaration
        newCandidatePublicKey: '',
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
        newCoin: getRandomCoin(),
        // will be updated during declaration
        newCandidatePublicKey: '',
        toString() {
            return 'gate';
        },
    },
];

function makePostTx(minterApi) {
    return function postTxDecorated(txParams, options) {
        return minterApi.postTx(txParams, {mempoolRetryLimit: 5, nonceRetryLimit: 2, ...options});
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
    } catch (error) {
        logError(error);
    }
    try {
        await coinPromises[1];
    } catch (error) {
        logError(error);
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
        console.log(tx.serializeToString());
        expect(tx.serializeToString().length)
            .toBeGreaterThan(0);
    }, 30000);

    test.each(API_TYPE_LIST)('should work %s', (apiType) => {
        expect.assertions(2);
        const txParams = txParamsData(apiType);
        return apiType.postTx(txParams, {privateKey: apiType.privateKey})
            .then(({hash: txHash}) => {
                console.log(txHash);
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                logError(error);
                throw error;
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
                    try {
                        // Coin not exists
                        expect(error.response.data.error.code).toBe('102');
                    } catch (jestError) {
                        logError(error);
                        throw jestError;
                    }
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
                    try {
                        expect(Number(error.response.data.error.data.min_gas_price)).toBeGreaterThan(0);
                    } catch (jestError) {
                        logError(error);
                        throw jestError;
                    }
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
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                logError(error);
                throw error;
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
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                logError(error);
                throw error;
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
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                logError(error);
                throw error;
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
                try {
                    // Coin not exists
                    expect(error.response.data.error.code).toBe('102');
                } catch (jestError) {
                    logError(error);
                    throw jestError;
                }
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
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                logError(error);
                throw error;
            });
    }, 30000);

    test.each(API_TYPE_LIST)('should fail %s', (apiType) => {
        expect.assertions(1);
        const txParams = txParamsData(apiType, {valueToSell: COIN_MAX_AMOUNT, coinToSell: NOT_EXISTENT_COIN});
        return apiType.postTx(txParams, {privateKey: apiType.privateKey})
            .catch((error) => {
                try {
                    // Coin not exists
                    expect(error.response.data.error.code).toBe('102');
                } catch (jestError) {
                    logError(error);
                    throw jestError;
                }
            });
    }, 70000);
});

// @TODO sellAll

describe('coin', () => {
    describe('PostTx: create coin', () => {
        const txParamsData = (apiType, data) => ({
            chainId: 2,
            type: TX_TYPE.CREATE_COIN,
            data: new CreateCoinTxData(Object.assign({
                name: apiType.newCoin,
                symbol: apiType.newCoin,
                initialAmount: 20000,
                initialReserve: 10000,
                constantReserveRatio: 50,
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
                    expect(txHash).toHaveLength(66);
                    expect(txHash.substr(0, 2)).toEqual('Mt');
                })
                .catch((error) => {
                    logError(error);
                    throw error;
                });
        }, 30000);

        test.each(API_TYPE_LIST)('should fail %s', (apiType) => {
            expect.assertions(1);
            const txParams = txParamsData(apiType, {symbol: getRandomCoin(), initialReserve: 0});
            return apiType.postTx(txParams, {privateKey: apiType.privateKey})
                .catch((error) => {
                    try {
                        // Coin reserve should be greater
                        expect(error.response.data.error.code).toBe('205');
                    } catch (jestError) {
                        logError(error);
                        throw jestError;
                    }
                });
        }, 70000);
    });

    describe('PostTx: recreate coin', () => {
        const txParamsData = (apiType, data) => ({
            chainId: 2,
            type: TX_TYPE.RECREATE_COIN,
            data: new RecreateCoinTxData(Object.assign({
                name: `${apiType.newCoin} recreated`,
                symbol: apiType.newCoin,
                initialAmount: 20000,
                initialReserve: 10000,
                constantReserveRatio: 100,
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
                    expect(txHash).toHaveLength(66);
                    expect(txHash.substr(0, 2)).toEqual('Mt');
                })
                .catch((error) => {
                    logError(error);
                    throw error;
                });
        }, 30000);

        test.each(API_TYPE_LIST)('should fail %s', (apiType) => {
            expect.assertions(1);
            const txParams = txParamsData(apiType, {symbol: NOT_EXISTENT_COIN});
            return apiType.postTx(txParams, {privateKey: apiType.privateKey})
                .catch((error) => {
                    try {
                        // Coin not exists
                        expect(error.response.data.error.code).toBe('102');
                    } catch (jestError) {
                        logError(error);
                        throw jestError;
                    }
                });
        }, 70000);
    });

    describe('PostTx: edit coin owner', () => {
        const txParamsData = (apiType, data) => ({
            chainId: 2,
            type: TX_TYPE.EDIT_COIN_OWNER,
            data: new EditCoinOwnerTxData(Object.assign({
                symbol: apiType.newCoin,
                newOwner: generateWallet().getAddressString(),
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
                    expect(txHash).toHaveLength(66);
                    expect(txHash.substr(0, 2)).toEqual('Mt');
                })
                .catch((error) => {
                    logError(error);
                    throw error;
                });
        }, 30000);

        test.each(API_TYPE_LIST)('should fail %s', (apiType) => {
            expect.assertions(1);
            const txParams = txParamsData(apiType, {symbol: NOT_EXISTENT_COIN});
            return apiType.postTx(txParams, {privateKey: apiType.privateKey})
                .catch((error) => {
                    try {
                        // Coin not exists
                        expect(error.response.data.error.code).toBe('102');
                    } catch (jestError) {
                        logError(error);
                        throw jestError;
                    }
                });
        }, 70000);
    });
});


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
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                logError(error);
                throw error;
            });
    }, 30000);

    test.each(API_TYPE_LIST)('should fail %s', (apiType) => {
        expect.assertions(1);
        const txParams = txParamsData(apiType, {valueToBuy: COIN_MAX_AMOUNT, coinToSell: NOT_EXISTENT_COIN});
        return apiType.postTx(txParams, {privateKey: apiType.privateKey})
            .catch((error) => {
                try {
                    // Coin not exists
                    expect(error.response.data.error.code).toBe('102');
                } catch (jestError) {
                    logError(error);
                    throw jestError;
                }
            });
    }, 70000);
});


describe('validator', () => {
    let validatorMinStake = 0;
    beforeAll(async () => {
        validatorMinStake = await getValidatorMinStake();
    }, 30000);

    describe('PostTx: declare candidacy', () => {
        const txParamsData = (apiType, data) => ({
            chainId: 2,
            type: TX_TYPE.DECLARE_CANDIDACY,
            data: new DeclareCandidacyTxData(Object.assign({
                address: apiType.address,
                publicKey: '',
                coin: 0,
                stake: validatorMinStake,
                commission: 50,
            }, data)),
            gasCoin: 0,
            payload: 'custom message',
        });

        test.each(API_TYPE_LIST)('should work %s', async (apiType) => {
            expect.assertions(2);
            const newCandidatePublicKey = generateWallet().getPublicKeyString();
            const txParams = txParamsData(apiType, {publicKey: newCandidatePublicKey});
            return apiType.postTx(txParams, {privateKey: apiType.privateKey})
                .then(({hash: txHash}) => {
                    apiType.newCandidatePublicKey = newCandidatePublicKey;
                    console.log(txHash);
                    expect(txHash).toHaveLength(66);
                    expect(txHash.substr(0, 2)).toEqual('Mt');
                })
                .catch((error) => {
                    logError(error);
                    throw error;
                });
        }, 30000);

        test.each(API_TYPE_LIST)('should fail %s', (apiType) => {
            expect.assertions(1);
            const txParams = txParamsData(apiType, {stake: COIN_MAX_AMOUNT, publicKey: generateWallet().getPublicKeyString()});
            return apiType.postTx(txParams, {privateKey: apiType.privateKey})
                .catch((error) => {
                    try {
                        // Insufficient funds for sender account
                        expect(error.response.data.error.code).toBe('107');
                    } catch (jestError) {
                        logError(error);
                        throw jestError;
                    }
                });
        }, 70000);
    });


    describe('depend on declare', () => {
        beforeAll(() => {
            const notDeclaredList = API_TYPE_LIST.filter((item) => !item.newCandidatePublicKey);
            const notDeclared = notDeclaredList.map((item) => item.toString()).join(', ');
            if (notDeclared) {
                throw new Error(`Candidate was not declared for: ${notDeclared}`);
            }
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
                        expect(txHash).toHaveLength(66);
                        expect(txHash.substr(0, 2)).toEqual('Mt');
                    })
                    .catch((error) => {
                        logError(error);
                        throw error;
                    });
            }, 30000);

            test.each(API_TYPE_LIST)('should fail %s', (apiType) => {
                expect.assertions(1);
                const txParams = txParamsData(apiType, {publicKey: generateWallet().getPublicKeyString()});
                return apiType.postTx(txParams, {privateKey: apiType.privateKey})
                    .catch((error) => {
                        try {
                            // Candidate with such public key not found
                            expect(error.response.data.error.code).toBe('403');
                        } catch (jestError) {
                            logError(error);
                            throw jestError;
                        }
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
                        expect(txHash).toHaveLength(66);
                        expect(txHash.substr(0, 2)).toEqual('Mt');
                    })
                    .catch((error) => {
                        logError(error);
                        throw error;
                    });
            }, 30000);

            test.each(API_TYPE_LIST)('should fail %s', (apiType) => {
                expect.assertions(1);
                const txParams = txParamsData(apiType, {stake: COIN_MAX_AMOUNT});
                return apiType.postTx(txParams, {privateKey: apiType.privateKey})
                    .catch((error) => {
                        try {
                            // Insufficient funds for sender account
                            expect(error.response.data.error.code).toBe('107');
                        } catch (jestError) {
                            logError(error);
                            throw jestError;
                        }
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
                        expect(txHash).toHaveLength(66);
                        expect(txHash.substr(0, 2)).toEqual('Mt');
                    })
                    .catch((error) => {
                        logError(error);
                        throw error;
                    });
            }, 30000);

            test.each(API_TYPE_LIST)('should fail %s', (apiType) => {
                // expect.assertions(1);
                const txParams = txParamsData(apiType, {stake: COIN_MAX_AMOUNT});
                return apiType.postTx(txParams, {privateKey: apiType.privateKey})
                    .catch((error) => {
                        try {
                            // Candidate with such public key not found
                            expect(error.response.data.error.code).toBe('403');
                        } catch (jestError) {
                            logError(error);
                            throw jestError;
                        }
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
                        expect(txHash).toHaveLength(66);
                        expect(txHash.substr(0, 2)).toEqual('Mt');
                    })
                    .catch((error) => {
                        logError(error);
                        throw error;
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
                        try {
                            // Candidate with such public key not found
                            expect(error.response.data.error.code).toBe('403');
                        } catch (jestError) {
                            logError(error);
                            throw jestError;
                        }
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
                        expect(txHash).toHaveLength(66);
                        expect(txHash.substr(0, 2)).toEqual('Mt');
                    })
                    .catch((error) => {
                        logError(error);
                        throw error;
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
                        try {
                            // Candidate with such public key not found
                            expect(error.response.data.error.code).toBe('403');
                        } catch (jestError) {
                            logError(error);
                            throw jestError;
                        }
                    });
            }, 70000);
        });

        describe('PostTx: set halt block', () => {
            const txParamsData = (apiType, data) => ({
                chainId: 2,
                type: TX_TYPE.SET_HALT_BLOCK,
                data: new SetHaltBlockTxData(Object.assign({
                    publicKey: apiType.newCandidatePublicKey,
                    height: 123456789,
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
                        expect(txHash).toHaveLength(66);
                        expect(txHash.substr(0, 2)).toEqual('Mt');
                    })
                    .catch((error) => {
                        logError(error);
                        throw error;
                    });
            }, 30000);

            test.each(API_TYPE_LIST)('should fail %s', (apiType) => {
                expect.assertions(1);
                const txParams = txParamsData(apiType, {publicKey: generateWallet().getPublicKeyString()});
                return apiType.postTx(txParams, {privateKey: apiType.privateKey})
                    .catch((error) => {
                        try {
                            // Candidate with such public key not found
                            expect(error.response.data.error.code).toBe('403');
                        } catch (jestError) {
                            logError(error);
                            throw jestError;
                        }
                    });
            }, 70000);
        });

        describe('PostTx: price vote', () => {
            const txParamsData = (apiType, data) => ({
                chainId: 2,
                type: TX_TYPE.PRICE_VOTE,
                data: new PriceVoteTxData(Object.assign({
                    price: 123456789,
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
                        expect(txHash).toHaveLength(66);
                        expect(txHash.substr(0, 2)).toEqual('Mt');
                    })
                    .catch((error) => {
                        logError(error);
                        throw error;
                    });
            }, 30000);

            test.each(API_TYPE_LIST)('should fail %s', (apiType) => {
                expect.assertions(1);
                const txParams = txParamsData(apiType, {price: 100000000000000000000000000000000});
                return apiType.postTx(txParams, {privateKey: apiType.privateKey})
                    .then(({hash: txHash}) => {
                        console.log(txHash);
                    })
                    .catch((error) => {
                        try {
                            // rlp: input string too long for uint
                            expect(error.response.data.error.code).toBe('106');
                        } catch (jestError) {
                            logError(error);
                            throw jestError;
                        }
                    });
            }, 70000);
        });

        describe('PostTx: edit candidate public key', () => {
            const txParamsData = (apiType, data) => ({
                chainId: 2,
                type: TX_TYPE.EDIT_CANDIDATE_PUBLIC_KEY,
                data: new EditCandidatePublicKeyTxData(Object.assign({
                    publicKey: apiType.newCandidatePublicKey,
                    newPublicKey: generateWallet().getPublicKeyString(),
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
                        expect(txHash).toHaveLength(66);
                        expect(txHash.substr(0, 2)).toEqual('Mt');
                    })
                    .catch((error) => {
                        logError(error);
                        throw error;
                    });
            }, 30000);

            test.each(API_TYPE_LIST)('should fail %s', (apiType) => {
                expect.assertions(1);
                const txParams = txParamsData(apiType, {publicKey: generateWallet().getPublicKeyString()});
                return apiType.postTx(txParams, {privateKey: apiType.privateKey})
                    .catch((error) => {
                        try {
                            // Candidate with such public key not found
                            expect(error.response.data.error.code).toBe('403');
                        } catch (jestError) {
                            logError(error);
                            throw jestError;
                        }
                    });
            }, 70000);
        });
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
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                logError(error);
                throw error;
            });
    }, 30000);

    test.each(API_TYPE_LIST)('should work with custom coin %s', (apiType) => {
        expect.assertions(2);
        const txParams = txParamsData(apiType, {}, apiType.customCoinId);
        return apiType.postTx(txParams, {privateKey: apiType.privateKey})
            .then(({hash: txHash}) => {
                console.log(txHash);
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                logError(error);
                throw error;
            });
    }, 30000);

    test.each(API_TYPE_LIST)('should fail %s', (apiType) => {
        expect.assertions(1);
        const txParams = txParamsData(apiType, {check: getRandomCheck(apiType, 0, 1)});
        return apiType.postTx(txParams, {privateKey: apiType.privateKey})
            .catch((error) => {
                try {
                    // Check expired
                    expect(error.response.data.error.code).toBe('502');
                } catch (jestError) {
                    logError(error);
                    throw jestError;
                }
            });
    }, 70000);
});


describe('multisig', () => {
    describe('PostTx: create multisig', () => {
        const txParamsData = (apiType, data) => ({
            chainId: 2,
            type: TX_TYPE.CREATE_MULTISIG,
            data: new CreateMultisigTxData(Object.assign({
                addresses: [apiType.address, 'Mx7633980c000139dd3bd24a3f54e06474fa941e01'],
                weights: [2, 2],
                threshold: 2,
            }, data)),
            gasCoin: 0,
        });

        test.each(API_TYPE_LIST)('should work %s', (apiType) => {
            expect.assertions(2);
            const txParams = txParamsData(apiType, {
                weights: [2, Math.random()].map((item) => item.toString().replace(/\D/, '').substr(0, 3)),
            });
            return apiType.postTx(txParams, {privateKey: apiType.privateKey})
                .then((tx) => {
                    const {hash: txHash} = tx;
                    console.log(txHash);
                    if (tx.tags?.['tx.created_multisig']) {
                        apiType.multisigAddress = tx.tags['tx.created_multisig'];
                    } else {
                        apiType.multisigTxHash = txHash;
                    }
                    expect(txHash).toHaveLength(66);
                    expect(txHash.substr(0, 2)).toEqual('Mt');
                })
                .catch((error) => {
                    logError(error);
                    throw error;
                });
        }, 30000);

        test.each(API_TYPE_LIST)('should fail %s', (apiType) => {
            expect.assertions(1);
            const txParams = txParamsData(apiType, {threshold: 100000000000000000000});
            return apiType.postTx(txParams, {privateKey: apiType.privateKey})
                .catch((error) => {
                    try {
                        // rlp: input string too long for uint
                        expect(error.response.data.error.code).toBe('106');
                    } catch (jestError) {
                        logError(error);
                        throw jestError;
                    }
                });
        }, 70000);
    });

    describe('fill multisig', () => {
        const txParamsData = (apiType, data) => ({
            chainId: 2,
            type: TX_TYPE.SEND,
            data: Object.assign({
                to: '',
                coin: 0,
                value: 150, // edit 100 + send 2.23
            }, data),
            gasCoin: 0,
        });

        test.each(API_TYPE_LIST)('should fill %s', (apiType) => {
            return getAddress(apiType)
                .then((multisigAddress) => {
                    const txParams = txParamsData(apiType, {to: multisigAddress});
                    return apiType.postTx(txParams, {privateKey: apiType.privateKey});
                })
                .then(({hash: txHash}) => {
                    console.log(txHash);
                });
        }, 30000);
    });

    // @TODO should not retry nonce
    // @TODO should not retry gasPrice
    describe('PostTx: send multisig', () => {
        const txParamsData = (apiType, data) => ({
            chainId: 2,
            type: TX_TYPE.SEND,
            data: new SendTxData(Object.assign({
                to: apiType.address,
                value: 1.23,
                coin: 0,
            }, data)),
            gasCoin: 0,
            signatureType: 2,
        });

        test.each(API_TYPE_LIST)('should work %s', (apiType) => {
            expect.assertions(2);
            const txParams = txParamsData(apiType);

            return postMultiSign(apiType, txParams)
                .then(({hash: txHash}) => {
                    // console.log(txHash);
                    expect(txHash).toHaveLength(66);
                    expect(txHash.substr(0, 2)).toEqual('Mt');
                })
                .catch((error) => {
                    logError(error);
                    throw error;
                });
        }, 30000);

        test.each(API_TYPE_LIST)('should fail %s', (apiType) => {
            expect.assertions(1);
            const txParams = txParamsData(apiType, {coin: NOT_EXISTENT_COIN});
            return postMultiSign(apiType, txParams)
                .catch((error) => {
                    try {
                        // Coin not exists
                        expect(error.response.data.error.code).toBe('102');
                    } catch (jestError) {
                        logError(error);
                        throw jestError;
                    }
                });
        }, 70000);
    });

    describe('PostTx: edit multisig', () => {
        const txParamsData = (apiType, data) => ({
            chainId: 2,
            type: TX_TYPE.EDIT_MULTISIG,
            data: new EditMultisigTxData(Object.assign({
                addresses: [apiType.address, 'Mx7633980c000139dd3bd24a3f54e06474fa941e01'],
                weights: [3, 3],
                threshold: 3,
            }, data)),
            gasCoin: 0,
            signatureType: 2,
        });

        test.each(API_TYPE_LIST)('should work %s', (apiType) => {
            expect.assertions(2);
            const txParams = txParamsData(apiType, {
                weights: [3, Math.random()].map((item) => item.toString().replace(/\D/, '').substr(0, 3)),
            });



            return postMultiSign(apiType, txParams)
                .then(({hash: txHash}) => {
                    // console.log(txHash);
                    expect(txHash).toHaveLength(66);
                    expect(txHash.substr(0, 2)).toEqual('Mt');
                })
                .catch((error) => {
                    logError(error);
                    throw error;
                });
        }, 30000);

        test.each(API_TYPE_LIST)('should fail %s', (apiType) => {
            expect.assertions(1);
            const txParams = txParamsData(apiType, {threshold: 100000000000000000000});
            return postMultiSign(apiType, txParams)
                .catch((error) => {
                    try {
                        // rlp: input string too long for uint
                        expect(error.response.data.error.code).toBe('106');
                    } catch (jestError) {
                        logError(error);
                        throw jestError;
                    }
                });
        }, 70000);
    });

    function getAddress(apiType) {
        let multisigAddressPromise;
        if (apiType.multisigAddress) {
            multisigAddressPromise = Promise.resolve(apiType.multisigAddress);
        } else {
            multisigAddressPromise = apiType.apiInstance.get(`transaction/${apiType.multisigTxHash}`)
                .then((response) => {
                    return response.data.tags['tx.created_multisig'];
                });
        }

        return multisigAddressPromise
            .then((multisigAddress) => {
                return `Mx${multisigAddress}`;
            });
    }

    function getAddressAndNonce(apiType) {
        return getAddress(apiType).then((multisigAddress) => {
            return Promise.all([Promise.resolve(multisigAddress), apiType.getNonce(multisigAddress)]);
        });
    }

    function postMultiSign(apiType, txParams) {
        return getAddressAndNonce(apiType)
            .then(([multisigAddress, nonce]) => {
                const tx = prepareTx({...txParams, nonce});
                const signature = makeSignature(tx, apiType.privateKey);
                return apiType.postTx({
                    ...txParams,
                    nonce,
                    signatureData: {
                        multisig: multisigAddress,
                        signatures: [signature],
                    },
                });
            });
    }
});
