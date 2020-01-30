import {generateWallet} from 'minterjs-wallet';
import {SendTxParams, MultisendTxParams, SellTxParams, BuyTxParams, DeclareCandidacyTxParams, EditCandidateTxParams, DelegateTxParams, UnbondTxParams, RedeemCheckTxParams, SetCandidateOnTxParams, SetCandidateOffTxParams, CreateMultisigTxParams, CreateCoinTxParams, SellAllTxParams, issueCheck, prepareSignedTx} from '~/src';
import {ENV_DATA, minterGate, minterNode} from './variables';

const newCandidatePublicKeyGate = generateWallet().getPublicKeyString();
const newCandidatePublicKeyNode = generateWallet().getPublicKeyString();

const NOT_EXISTENT_COIN = 'ASD09431XC';

const API_TYPE_LIST = [
    {
        minterApi: minterGate,
        privateKey: ENV_DATA.privateKey,
        address: ENV_DATA.address,
        customCoin: ENV_DATA.customCoin,
        newCandidatePublicKey: newCandidatePublicKeyGate,
        toString() {
            return 'gate';
        },
    },
    {
        minterApi: minterNode,
        privateKey: ENV_DATA.privateKey2,
        address: ENV_DATA.address2,
        customCoin: 'TESTCOIN02',
        newCandidatePublicKey: newCandidatePublicKeyNode,
        toString() {
            return 'node';
        },
    },
];

function wait(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
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
        const txParams = new CreateCoinTxParams({
            privateKey: apiType.privateKey,
            chainId: 2,
            coinName: 'testcoin',
            coinSymbol: apiType.customCoin,
            initialAmount: 500,
            initialReserve: 1000,
            crr: 50,
            feeCoinSymbol: 'MNT',
            message: 'custom message',
        });
        return apiType.minterApi.postTx(txParams);
    });

    try {
        await Promise.all(coinPromises);
    } catch (e) {
        console.log(e?.response.data || e);
    }
}, 30000);

// only one tx from given address can exist in mempool
// beforeEach(async () => {
//     await new Promise((resolve) => {
//         setTimeout(resolve, 5000);
//     });
// }, 10000);


describe('PostTx: send', () => {
    const txParamsData = (apiType) => ({
        privateKey: apiType.privateKey,
        chainId: 2,
        address: apiType.address,
        amount: 10,
        coinSymbol: 'MNT',
        feeCoinSymbol: 'MNT',
        message: 'custom message',
    });

    test('should return signed tx', async () => {
        const nonce = await minterGate.getNonce(ENV_DATA.address);
        const txParams = new SendTxParams({...txParamsData(API_TYPE_LIST[0]), nonce, gasPrice: 1});
        const tx = prepareSignedTx(txParams);
        console.log(tx.serialize().toString('hex'));
        expect(tx.serialize().toString('hex').length)
            .toBeGreaterThan(0);
    }, 30000);

    test.each(API_TYPE_LIST)('should work %s', (apiType) => {
        expect.assertions(2);
        const txParams = new SendTxParams(txParamsData(apiType));
        return apiType.minterApi.postTx(txParams)
            .then((txHash) => {
                console.log(txHash);
                // txHash = txHash.replace(/^Mt/);
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response.data);
            });
    }, 30000);

    describe('wait', () => {
        // beforeAll(async () => {
        //     await wait(6000);
        // }, 30000);

        test.each(API_TYPE_LIST)('should fail %s', async (apiType) => {
            expect.assertions(1);
            const txParams = new SendTxParams({...txParamsData(apiType), amount: Number.MAX_SAFE_INTEGER, coinSymbol: NOT_EXISTENT_COIN});
            return apiType.minterApi.postTx(txParams)
                .catch((error) => {
                    // console.log(error);
                    console.log(error.response.data);
                    // Coin not exists
                    expect(error.response.data.error.code === 102 || error.response.data.error.tx_result.code === 102).toBe(true);
                });
        }, 70000);
    });
});


describe('PostTx handle low gasPrice', () => {
    const txParamsData = (apiType) => ({
        privateKey: apiType.privateKey,
        chainId: 2,
        address: apiType.address,
        amount: 10,
        coinSymbol: 'MNT',
        feeCoinSymbol: 'MNT',
        gasPrice: 0, // <= low gas
        message: 'custom message',
    });

    describe.each(API_TYPE_LIST)('should fail when 0 retries | %s', (apiType) => {
        test('should fail with parsable error', () => {
            expect.assertions(1);
            const txParams = new SendTxParams(txParamsData(apiType));
            return apiType.minterApi.postTx(txParams, {gasRetryLimit: 0})
                .catch((error) => {
                    // console.log(error);
                    // console.log(error.response.data);
                    const errorMessage = error.response.data.error.tx_result?.message || error.response.data.error.message;
                    expect(errorMessage).toMatch(/^Gas price of tx is too low to be included in mempool\. Expected \d+(\.\d+)?$/);
                });
        }, 70000);
    });

    // @TODO enable after EX-179 will be resolved
    test.skip.each(API_TYPE_LIST)('should work with retries | %s', (apiType) => {
        expect.assertions(2);
        const txParams = new SendTxParams(txParamsData(apiType));
        return apiType.minterApi.postTx(txParams)
            .then((txHash) => {
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
});


describe('PostTx: multisend', () => {
    const txParamsData = (apiType) => ({
        privateKey: apiType.privateKey,
        chainId: 2,
        list: [
            {
                value: 10,
                coin: 'MNT',
                to: apiType.address,
            },
            {
                value: 0.1,
                coin: 'MNT',
                to: 'Mxddab6281766ad86497741ff91b6b48fe85012e3c',
            },
        ],
        feeCoinSymbol: 'MNT',
        message: 'custom message',
    });

    test.each(API_TYPE_LIST)('should work %s', (apiType) => {
        expect.assertions(2);
        const txParams = new MultisendTxParams(txParamsData(apiType));
        return apiType.minterApi.postTx(txParams)
            .then((txHash) => {
                console.log(txHash);
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
        const txParamsDataInstance = txParamsData(apiType);
        txParamsDataInstance.list[0].value = Number.MAX_SAFE_INTEGER;
        txParamsDataInstance.list[0].coin = NOT_EXISTENT_COIN;
        const txParams = new MultisendTxParams(txParamsDataInstance);
        return apiType.minterApi.postTx(txParams)
            .catch((error) => {
                // console.log(error);
                console.log(error.response.data);
                // Coin not exists
                expect(error.response.data.error.code === 102 || error.response.data.error.tx_result.code === 102).toBe(true);
            });
    }, 70000);
});


describe('PostTx: sell', () => {
    const txParamsData = (apiType) => ({
        privateKey: apiType.privateKey,
        chainId: 2,
        coinFrom: 'MNT',
        coinTo: apiType.customCoin,
        sellAmount: 1,
        feeCoinSymbol: 'MNT',
        message: 'custom message',
    });

    test.each(API_TYPE_LIST)('should work %s', (apiType) => {
        expect.assertions(2);
        const txParams = new SellTxParams(txParamsData(apiType));
        return apiType.minterApi.postTx(txParams)
            .then((txHash) => {
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
        const txParams = new SellTxParams({...txParamsData(apiType), sellAmount: Number.MAX_SAFE_INTEGER, coinFrom: NOT_EXISTENT_COIN});
        return apiType.minterApi.postTx(txParams)
            .catch((error) => {
                // console.log(error);
                console.log(error.response.data);
                // Coin not exists
                expect(error.response.data.error.code === 102 || error.response.data.error.tx_result.code === 102).toBe(true);
            });
    }, 70000);
});

// @TODO sellAll
// @TODO create coin


describe('PostTx: buy', () => {
    const txParamsData = (apiType) => ({
        privateKey: apiType.privateKey,
        chainId: 2,
        coinFrom: 'MNT',
        coinTo: apiType.customCoin,
        buyAmount: 1,
        feeCoinSymbol: 'MNT',
        message: 'custom message',
    });

    test.each(API_TYPE_LIST)('should work %s', (apiType) => {
        expect.assertions(2);
        const txParams = new BuyTxParams(txParamsData(apiType));
        return apiType.minterApi.postTx(txParams)
            .then((txHash) => {
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
        const txParams = new BuyTxParams({...txParamsData(apiType), buyAmount: Number.MAX_SAFE_INTEGER, coinFrom: NOT_EXISTENT_COIN});
        return apiType.minterApi.postTx(txParams)
            .catch((error) => {
                // console.log(error);
                console.log(error.response.data);
                // Coin not exists
                expect(error.response.data.error.code === 102 || error.response.data.error.tx_result.code === 102).toBe(true);
            });
    }, 70000);
});


describe('validator', () => {
    describe('PostTx: declare candidacy', () => {
        const txParamsData = (apiType) => ({
            privateKey: apiType.privateKey,
            chainId: 2,
            address: apiType.address,
            publicKey: 'Mp00',
            coinSymbol: 'MNT',
            stake: 1.2,
            commission: 50,
            feeCoinSymbol: 'MNT',
            message: 'custom message',
        });

        test.each(API_TYPE_LIST)('should work %s', async (apiType) => {
            expect.assertions(2);
            const txParams = new DeclareCandidacyTxParams({...txParamsData(apiType), publicKey: apiType.newCandidatePublicKey});
            return apiType.minterApi.postTx(txParams)
                .then((txHash) => {
                    console.log(txHash);
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
            const txParams = new DeclareCandidacyTxParams(txParamsData(apiType)); // empty publicKey specified
            return apiType.minterApi.postTx(txParams)
                .catch((error) => {
                    // console.log(error);
                    console.log(error.response.data);
                    // Incorrect PubKey
                    expect(error.response.data.error.code === 407 || error.response.data.error.tx_result.code === 407).toBe(true);
                });
        }, 70000);
    });


    describe('PostTx: edit candidate', () => {
        const txParamsData = (apiType) => ({
            privateKey: apiType.privateKey,
            chainId: 2,
            publicKey: 'Mp00',
            rewardAddress: apiType.address,
            ownerAddress: apiType.address,
            feeCoinSymbol: 'MNT',
            message: 'custom message',
        });

        test.each(API_TYPE_LIST)('should work %s', async (apiType) => {
            expect.assertions(2);
            const txParams = new EditCandidateTxParams({...txParamsData(apiType), publicKey: apiType.newCandidatePublicKey});
            return apiType.minterApi.postTx(txParams)
                .then((txHash) => {
                    console.log(txHash);
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
            const txParams = new EditCandidateTxParams(txParamsData(apiType)); // empty publicKey specified
            return apiType.minterApi.postTx(txParams)
                .catch((error) => {
                    // console.log(error);
                    console.log(error.response.data);
                    // andidate with such public key (Mp) not found
                    expect(error.response.data.error.code === 403 || error.response.data.error.tx_result.code === 403).toBe(true);
                });
        }, 70000);
    });


    describe('PostTx: delegate', () => {
        const txParamsData = (apiType) => ({
            privateKey: apiType.privateKey,
            chainId: 2,
            publicKey: 'Mp00',
            coinSymbol: 'MNT',
            stake: 10,
            feeCoinSymbol: 'MNT',
            message: 'custom message',
        });

        test.each(API_TYPE_LIST)('should work %s', (apiType) => {
            expect.assertions(2);
            const txParams = new DelegateTxParams({...txParamsData(apiType), publicKey: apiType.newCandidatePublicKey});
            return apiType.minterApi.postTx(txParams)
                .then((txHash) => {
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
            const txParams = new DelegateTxParams(txParamsData(apiType)); // empty publicKey specified
            return apiType.minterApi.postTx(txParams)
                .catch((error) => {
                    // console.log(error);
                    console.log(error.response.data);
                    // Candidate with such public key not found
                    expect(error.response.data.error.code === 403 || error.response.data.error.tx_result.code === 403).toBe(true);
                });
        }, 70000);
    });


    describe('PostTx: unbond', () => {
        const txParamsData = (apiType) => ({
            privateKey: apiType.privateKey,
            chainId: 2,
            publicKey: 'Mp00',
            coinSymbol: 'MNT',
            stake: 10,
            feeCoinSymbol: 'MNT',
            message: 'custom message',
        });


        test.each(API_TYPE_LIST)('should work %s', (apiType) => {
            console.log('unbond from:', apiType.newCandidatePublicKey);
            expect.assertions(2);
            const txParams = new UnbondTxParams({...txParamsData(apiType), publicKey: apiType.newCandidatePublicKey});
            return apiType.minterApi.postTx(txParams)
                .then((txHash) => {
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
            // expect.assertions(1);
            const txParams = new UnbondTxParams(txParamsData(apiType)); // empty publicKey specified
            return apiType.minterApi.postTx(txParams)
                .catch((error) => {
                    // console.log(error);
                    console.log(error.response.data);
                    // Candidate with such public key not found
                    expect(error.response.data.error.code === 403 || error.response.data.error.tx_result.code === 403).toBe(true);
                });
        }, 70000);
    });


    describe('PostTx: set candidate on', () => {
        const txParamsData = (apiType) => ({
            privateKey: apiType.privateKey,
            chainId: 2,
            publicKey: 'Mp00',
            feeCoinSymbol: 'MNT',
            message: 'custom message',
        });

        test.each(API_TYPE_LIST)('should work %s', (apiType) => {
            expect.assertions(2);
            const txParams = new SetCandidateOnTxParams({...txParamsData(apiType), publicKey: apiType.newCandidatePublicKey});
            return apiType.minterApi.postTx(txParams)
                .then((txHash) => {
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
            const txParams = new SetCandidateOnTxParams(txParamsData(apiType)); // empty publicKey specified
            return apiType.minterApi.postTx(txParams)
                .catch((error) => {
                    // console.log(error);
                    console.log(error.response.data);
                    // Candidate with such public key not found
                    expect(error.response.data.error.code === 403 || error.response.data.error.tx_result.code === 403).toBe(true);
                });
        }, 70000);
    });


    describe('PostTx: set candidate off', () => {
        const txParamsData = (apiType) => ({
            privateKey: apiType.privateKey,
            chainId: 2,
            publicKey: 'Mp00',
            feeCoinSymbol: 'MNT',
            message: 'custom message',
        });

        test.each(API_TYPE_LIST)('should work %s', (apiType) => {
            expect.assertions(2);
            const txParams = new SetCandidateOffTxParams({...txParamsData(apiType), publicKey: apiType.newCandidatePublicKey});
            return apiType.minterApi.postTx(txParams)
                .then((txHash) => {
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
            const txParams = new SetCandidateOffTxParams(txParamsData(apiType)); // empty publicKey specified
            return apiType.minterApi.postTx(txParams)
                .then((res) => {
                    console.log({res});
                })
                .catch((error) => {
                    // console.log(error);
                    console.log(error.response.data);
                    // Candidate with such public key not found
                    expect(error.response.data.error.code === 403 || error.response.data.error.tx_result.code === 403).toBe(true);
                });
        }, 70000);
    });
});


describe('PostTx: redeem check', () => {
    function getRandomCheck(apiType) {
        return issueCheck({
            privateKey: apiType.privateKey,
            chainId: 2,
            passPhrase: '123',
            nonce: 1,
            coinSymbol: 'MNT',
            value: Math.random(),
        });
    }

    const txParamsData = (apiType) => ({
        privateKey: apiType.privateKey,
        chainId: 2,
        check: 'Mcf8993002843b9ac9ff8a4d4e540000000000000080b841ab6a04641d3f732dff72cd6c2435c54aef3ad0f3413d98c8e1f52f4cffb0f5541e09ad0a6b5b67600f3949d47cfb6299e83ded68c4ba825bfe7f7315bfb9958e011ba07b116f57f084df995f0f1a0cb382614a15c149547895af4ef0354d171fc0590ca00f12ab3095a7c3fb0c4ad5e97f1b6cbd92636e67ae9045f35c60740a815703c1',
        password: '123',
        feeCoinSymbol: 'MNT',
    });

    test.each(API_TYPE_LIST)('should work %s', (apiType) => {
        expect.assertions(2);
        const txParams = new RedeemCheckTxParams({...txParamsData(apiType), check: getRandomCheck(apiType)});
        return apiType.minterApi.postTx(txParams)
            .then((txHash) => {
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
        const txParams = new RedeemCheckTxParams(txParamsData(apiType)); // empty check specified
        return apiType.minterApi.postTx(txParams)
            .catch((error) => {
                // console.log(error);
                console.log(error.response.data);
                // Invalid proof
                expect(error.response.data.error.code === 501 || error.response.data.error.tx_result.code === 501).toBe(true);
            });
    }, 70000);
});


describe('PostTx: create multisig', () => {
    const txParamsData = (apiType) => ({
        privateKey: apiType.privateKey,
        chainId: 2,
        addresses: [apiType.address, 'Mx7633980c000139dd3bd24a3f54e06474fa941e00'],
        weights: [],
        threshold: 100,
        feeCoinSymbol: 'MNT',
    });

    test.skip.each(API_TYPE_LIST)('should work %s', (apiType) => {
        expect.assertions(2);
        const txParams = new CreateMultisigTxParams({...txParamsData(apiType), weights: [Math.random().toString().replace(/\D/, ''), Math.random().toString().replace(/\D/, '')]});
        return apiType.minterApi.postTx(txParams)
            .then((txHash) => {
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

    test.skip.each(API_TYPE_LIST)('should fail %s', (apiType) => {
        expect.assertions(1);
        const txParams = new CreateMultisigTxParams({...txParamsData(apiType), weights: []});
        return apiType.minterApi.postTx(txParams)
            .catch((error) => {
                // console.log(error);
                console.log(error.response.data);
                // Incorrect multisig weights
                expect(error.response.data.error.code === 601 || error.response.data.error.tx_result.code === 601).toBe(true);
            });
    }, 70000);
});

// @TODO test multisig tx
