import {generateWallet} from 'minterjs-wallet';
import {TX_TYPE, COIN_MAX_AMOUNT} from 'minterjs-util';
import {
    SendTxData,
    MultisendTxData,
    SellTxData,
    SellAllTxData,
    BuyTxData,
    CreateCoinTxData,
    RecreateCoinTxData,
    EditTickerOwnerTxData,
    // - validator
    DeclareCandidacyTxData,
    SetCandidateOnTxData,
    SetCandidateOffTxData,
    EditCandidateTxData,
    EditCandidatePublicKeyTxData,
    EditCandidateCommissionTxData,
    // - vote
    SetHaltBlockTxData,
    PriceVoteTxData,
    VoteCommissionTxData,
    VoteUpdateTxData,
    // - delegation
    DelegateTxData,
    UnbondTxData,
    MoveStakeTxData,
    LockStakeTxData,
    // - misc
    RedeemCheckTxData,
    LockTxData,
    // - multisig
    CreateMultisigTxData,
    EditMultisigTxData,
    // - pool
    CreatePoolTxData,
    AddLiquidityTxData,
    RemoveLiquidityTxData,
    BuyPoolTxData,
    SellPoolTxData,
    SellAllPoolTxData,
    // - limit order
    AddLimitOrderTxData,
    RemoveLimitOrderTxData,
    // - token
    CreateTokenTxData,
    RecreateTokenTxData,
    MintTokenTxData,
    BurnTokenTxData,

    issueCheck,
    prepareTx,
    prepareSignedTx,
    makeSignature,
} from '~/src';
import {ensureCustomCoin, getValidatorMinStake, logError, wait} from '~/test/test-utils.js';
import {ENV_DATA, minterGate, minterNode} from './variables';

function getRandomCoin() {
    const digits = Math.random().toString().substring(2, 9 + 2);
    return `Z${digits}`;
}

const NOT_EXISTENT_COIN = '4294967295';
const NOT_EXISTENT_TICKER = 'X294967295';

const API_TYPE_LIST = [
    {
        ...minterNode,
        postTx: makePostTx(minterNode),
        seedPhrase: ENV_DATA.mnemonic2,
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
        seedPhrase: ENV_DATA.mnemonic,
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

function checkApiTypeFieldPersistence(fieldName, errorText) {
    const notFoundList = API_TYPE_LIST.filter((item) => !item[fieldName]);
    const notFound = notFoundList.map((item) => item.toString()).join(', ');
    if (notFound) {
        throw new Error(`${errorText} for: ${notFound}`);
    }
}

function makePostTx(minterApi) {
    return function postTxDecorated(txParams, options) {
        return minterApi.postTx(txParams, {mempoolRetryLimit: 5, nonceRetryLimit: 3, ...options});
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
        // return [Promise.resolve(), Promise.resolve()];
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
        const apiType = API_TYPE_LIST[0];
        const nonce = await minterGate.getNonce(apiType.address);
        const txParams = {...txParamsData(apiType), nonce, gasPrice: 1};
        const tx = prepareSignedTx(txParams, {privateKey: apiType.privateKey});
        console.log(tx.serializeToString());
        expect(tx.serializeToString().length)
            .toBeGreaterThan(0);
    }, 30000);

    test.each(API_TYPE_LIST)('should work %s', (apiType) => {
        expect.assertions(2);
        const txParams = txParamsData(apiType);
        return apiType.postTx(txParams, {privateKey: apiType.privateKey})
            .then(({hash: txHash}) => {
                console.log(`send ${apiType}:`, txHash);
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                logError(error);
                throw error;
            });
    }, 30000);

    test.each(API_TYPE_LIST)('should work with seedPhrase %s', (apiType) => {
        expect.assertions(2);
        const txParams = txParamsData(apiType);
        return apiType.postTx(txParams, {seedPhrase: apiType.seedPhrase})
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
                console.log(`multisend ${apiType}:`, txHash);
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
                console.log(`multisend 100 items ${apiType}:`, txHash);
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
            const txParams = txParamsData(apiType, {symbol: NOT_EXISTENT_TICKER});
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

    describe('PostTx: edit ticker owner', () => {
        const txParamsData = (apiType, data) => ({
            chainId: 2,
            type: TX_TYPE.EDIT_TICKER_OWNER,
            data: new EditTickerOwnerTxData(Object.assign({
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
            const txParams = txParamsData(apiType, {symbol: NOT_EXISTENT_TICKER});
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
                    console.log(`declare ${apiType}:`, txHash);
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
            const txParams = txParamsData(apiType, {coin: 0xffffffff, publicKey: generateWallet().getPublicKeyString()});
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


    describe('depend on declare', () => {
        beforeAll(() => {
            checkApiTypeFieldPersistence('newCandidatePublicKey', 'Candidate was not declared');
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
                        console.log(`edit candidate ${apiType}:`, txHash);
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
                const txParams = txParamsData(apiType, {coin: 0xffffffff});
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


        // can't unbond, because delegated stake is not recalculated yet
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
                expect.assertions(1);
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

        // can't move, because delegated stake is not recalculated yet
        describe.skip('PostTx: move stake', () => {
            const txParamsData = (apiType, data) => ({
                chainId: 2,
                type: TX_TYPE.MOVE_STAKE,
                data: new MoveStakeTxData(Object.assign({
                    from: apiType.newCandidatePublicKey,
                    to: apiType.newCandidatePublicKey,
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

        // price vote is disabled in the blockchain since v2
        describe.skip('PostTx: price vote', () => {
            const txParamsData = (apiType, data) => ({
                chainId: 2,
                type: TX_TYPE.PRICE_VOTE,
                data: new PriceVoteTxData(Object.assign({
                    price: 123456789,
                }, data)),
                gasCoin: 0,
                payload: 'custom message',
            });

            test.skip.each(API_TYPE_LIST)('should work %s', async (apiType) => {
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
                        console.log(`edit candidate public key ${apiType}:`, txHash);
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

    function getRandomCheck(apiType, gasCoin = 0, dueBlock = undefined) {
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
                    console.log(`create multisig ${apiType}:`, txHash);
                    if (tx.tags?.['tx.created_multisig']) {
                        apiType.multisigAddress = tx.tags['tx.created_multisig'];
                    }
                    apiType.multisigTxHash = txHash;
                    expect(txHash).toHaveLength(66);
                    expect(txHash.substr(0, 2)).toEqual('Mt');

                    // wait for tx to get into block
                    return wait(5000);
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

    describe('top-up multisig with coins', () => {
        beforeAll(() => {
            checkApiTypeFieldPersistence('multisigTxHash', 'Multisig was not created');
        });

        const txParamsData = (apiType, data) => ({
            chainId: 2,
            type: TX_TYPE.SEND,
            data: Object.assign({
                to: '',
                coin: 0,
                value: 100000,
            }, data),
            gasCoin: 0,
        });

        test.each(API_TYPE_LIST)('should top-up %s', (apiType) => {
            expect.assertions(1);
            return getMultisigAddress(apiType)
                .then((multisigAddress) => {
                    const txParams = txParamsData(apiType, {to: multisigAddress});
                    return apiType.postTx(txParams, {privateKey: apiType.privateKey});
                })
                .then(({hash: txHash}) => {
                    console.log(`top-up multisig ${apiType}:`, txHash);
                    expect(txHash).toHaveLength(66);
                });
        }, 30000);
    });

    // @TODO should not retry nonce
    // @TODO should not retry gasPrice
    describe('PostTx: send multisig', () => {
        beforeAll(() => {
            checkApiTypeFieldPersistence('multisigTxHash', 'Multisig was not created');
        });

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
                        expect(error.response.data.error?.code).toBe('102');
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

    function getMultisigAddress(apiType) {
        let multisigAddressPromise;
        if (apiType.multisigAddress) {
            multisigAddressPromise = Promise.resolve(apiType.multisigAddress);
        } else if (apiType.multisigTxHash) {
            multisigAddressPromise = apiType.apiInstance.get(`transaction/${apiType.multisigTxHash}`)
                .then((response) => {
                    return response.data.tags['tx.created_multisig'];
                });
        } else {
            throw new Error('No multisigAddress nor multisigTxHash found');
        }

        return multisigAddressPromise
            .then((multisigAddress) => {
                return `Mx${multisigAddress}`;
            });
    }

    async function getMultisigAddressAndNonce(apiType) {
        const multisigAddress = await getMultisigAddress(apiType);
        const nonce = await apiType.getNonce(multisigAddress);

        return [multisigAddress, nonce];
    }

    function postMultiSign(apiType, txParams) {
        return getMultisigAddressAndNonce(apiType)
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

describe('PostTx: lock stake', () => {
    const txParamsData = (apiType, data) => ({
        chainId: 2,
        type: TX_TYPE.LOCK_STAKE,
        data: new LockStakeTxData(Object.assign({
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
});

describe('PostTx: lock', () => {
    const txParamsData = (apiType, data) => ({
        chainId: 2,
        type: TX_TYPE.LOCK,
        data: new LockTxData(Object.assign({
            dueBlock: 123456789,
            value: 10,
            coin: 0,
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
