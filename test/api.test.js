import axios from 'axios';
import {generateWallet, walletFromMnemonic} from 'minterjs-wallet';
import {Minter, SendTxParams, MultisendTxParams, SellTxParams, BuyTxParams, DeclareCandidacyTxParams, EditCandidateTxParams, DelegateTxParams, UnbondTxParams, RedeemCheckTxParams, SetCandidateOnTxParams, SetCandidateOffTxParams, CreateMultisigTxParams, CreateCoinTxParams, SellAllTxParams, issueCheck, prepareSignedTx, API_TYPE_GATE, API_TYPE_NODE} from '~/src';

// mnemonic: exercise fantasy smooth enough arrive steak demise donkey true employ jealous decide blossom bind someone
// private: 5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da
// address: Mx7633980c000139dd3bd24a3f54e06474fa941e16

// tst.gate.minter.network wallets with 1 000 000 000
// "Mxeeda61bbe9929bf883af6b22f5796e4b92563ba4" // puzzle feed enlist rack cliff divert exist bind swamp kiwi casino pull
// "Mx634550aa7dc347d5e60888da2529c56f1818e403" // air model item valley auction bullet crisp always erosion paper orient fog
// "Mx49ca5b11f0055347df169985c0b70914150bb567" // erupt level forum warrior mutual wrap this elephant destroy trim habit annual

const ENV_TESTNET = 'testnet';
const ENV_TEST_TESTNET = 'test';
const TESTNET_MENMONIC = 'exercise fantasy smooth enough arrive steak demise donkey true employ jealous decide blossom bind someone';
const TEST_TESTNET_MENMONIC = 'puzzle feed enlist rack cliff divert exist bind swamp kiwi casino pull';

const ENV_SETTINGS = {
    [ENV_TESTNET]: {
        nodeBaseUrl: 'https://minter-node-1.testnet.minter.network',
        gateBaseUrl: 'https://gate.minter.network',
        mnemonic: TESTNET_MENMONIC,
        // 5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da
        privateKey: walletFromMnemonic(TESTNET_MENMONIC).getPrivateKeyString(),
        address: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        customCoin: 'TESTCOIN01',
    },
    [ENV_TEST_TESTNET]: {
        nodeBaseUrl: 'http://front-de.minter.network:48841',
        gateBaseUrl: 'https://tst.gate.minter.network',
        mnemonic: TEST_TESTNET_MENMONIC,
        privateKey: walletFromMnemonic(TEST_TESTNET_MENMONIC).getPrivateKeyString(),
        address: 'Mxeeda61bbe9929bf883af6b22f5796e4b92563ba4',
        customCoin: 'TESTCOIN01',
    },
};

// select environment
const CURRENT_ENV = ENV_TEST_TESTNET;
const ENV_DATA = ENV_SETTINGS[CURRENT_ENV];


const minterNode = new Minter({apiType: API_TYPE_NODE, baseURL: ENV_DATA.nodeBaseUrl, timeout: 25000});
const minterGate = new Minter({apiType: API_TYPE_GATE, baseURL: ENV_DATA.gateBaseUrl, timeout: 25000});

const newCandidatePublicKeyGate = generateWallet().getPublicKeyString();
const newCandidatePublicKeyNode = generateWallet().getPublicKeyString();

beforeAll(async () => {
    // fill test ENV_DATA with data from the server
    /*
    if (CURRENT_ENV === ENV_TEST_TESTNET) {
        const response = await axios.get(`${ENV_DATA.nodeBaseUrl}/make_test_setup?env=bot`);
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
    const txParams = new CreateCoinTxParams({
        privateKey: ENV_DATA.privateKey,
        chainId: 2,
        coinName: ENV_DATA.customCoin,
        coinSymbol: ENV_DATA.customCoin,
        initialAmount: 500,
        initialReserve: 1000,
        crr: 50,
        feeCoinSymbol: 'MNT',
        message: 'custom message',
    });
    try {
        await minterGate.postTx(txParams);
    } catch (e) {
        console.log(e);
    }
}, 30000);

// only one tx from given address can exist in mempool
beforeEach(async () => {
    await new Promise((resolve) => {
        setTimeout(resolve, 5000);
    });
}, 10000);


describe('PostTx: send', () => {
    const txParamsData = () => ({
        privateKey: ENV_DATA.privateKey,
        chainId: 2,
        address: ENV_DATA.address,
        amount: 10,
        coinSymbol: 'MNT',
        feeCoinSymbol: 'MNT',
        message: 'custom message',
    });

    test('should return signed tx', async () => {
        const nonce = await minterGate.getNonce(ENV_DATA.address);
        const txParams = new SendTxParams({...txParamsData(), nonce, gasPrice: 1});
        const tx = prepareSignedTx(txParams);
        console.log(tx.serialize().toString('hex'));
        expect(tx.serialize().toString('hex').length)
            .toBeGreaterThan(0);
    }, 30000);

    test('should work gate', () => {
        expect.assertions(2);
        const txParams = new SendTxParams(txParamsData());
        return minterGate.postTx(txParams)
            .then((txHash) => {
                console.log(txHash);
                // txHash = txHash.replace(/^Mt/);
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);

    test('should fail gate', () => {
        expect.assertions(1);
        const txParams = new SendTxParams({...txParamsData(), amount: Number.MAX_SAFE_INTEGER, coinSymbol: 'ASD999'});
        return minterGate.postTx(txParams)
            .catch((error) => {
                // console.log(error);
                // console.log(error.response);
                expect(error.response.data.error.message.length).toBeGreaterThan(0);
            });
    }, 70000);

    test('should work node', async () => {
        // wait for getNonce to work correctly
        // await new Promise((resolve) => {
        //     setTimeout(resolve, 5000);
        // });
        expect.assertions(2);
        const txParams = new SendTxParams(txParamsData());
        return minterNode.postTx(txParams)
            .then((txHash) => {
                // console.log(txHash);
                // txHash = txHash.replace(/^Mt/);
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);

    test('should fail node', () => {
        expect.assertions(1);
        const txParams = new SendTxParams({...txParamsData(), amount: Number.MAX_SAFE_INTEGER, coinSymbol: 'ASD999'});
        return minterNode.postTx(txParams)
            .then((res) => {
                console.log({res});
            })
            .catch((error) => {
                // console.log(error.response.data);
                expect(error.response.data.error.message.length).toBeGreaterThan(0);
            });
    }, 30000);
});


describe.skip('PostTx handle low gasPrice', () => {
    const txParamsData = () => ({
        privateKey: ENV_DATA.privateKey,
        chainId: 2,
        address: ENV_DATA.address,
        amount: 10,
        coinSymbol: 'MNT',
        feeCoinSymbol: 'MNT',
        gasPrice: 0, // <= low gas
        message: 'custom message',
    });

    describe('should fail when 0 retries | gate', () => {
        test('should fail with parsable error', () => {
            expect.assertions(1);
            const txParams = new SendTxParams(txParamsData());
            return minterGate.postTx(txParams, {gasRetryLimit: 0})
                .catch((error) => {
                    // console.log(error);
                    // console.log(error.response.data);
                    const errorMessage = (error.response.data.error.tx_result && error.response.data.error.tx_result.message) || error.response.data.error.message;
                    expect(errorMessage).toMatch(/^Gas price of tx is too low to be included in mempool\. Expected \d+$/);
                });
        }, 70000);
    });

    test('should work with retries | gate', () => {
        expect.assertions(2);
        const txParams = new SendTxParams(txParamsData());
        return minterGate.postTx(txParams)
            .then((txHash) => {
                // console.log(txHash);
                // txHash = txHash.replace(/^Mt/);
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);

    describe('should fail when 0 retries | node', () => {
        test('should fail with parsable error', () => {
            expect.assertions(1);
            const txParams = new SendTxParams(txParamsData());
            return minterNode.postTx(txParams, {gasRetryLimit: 0})
                .catch((error) => {
                    // console.log(error);
                    // console.log(error.response.data);
                    const errorMessage = (error.response.data.error.tx_result && error.response.data.error.tx_result.message) || error.response.data.error.message;
                    expect(errorMessage).toMatch(/^Gas price of tx is too low to be included in mempool\. Expected \d+$/);
                });
        }, 70000);
    });

    test('should work with retries | node', () => {
        expect.assertions(2);
        const txParams = new SendTxParams(txParamsData());
        return minterNode.postTx(txParams)
            .then((txHash) => {
                // console.log(txHash);
                // txHash = txHash.replace(/^Mt/);
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);
});


describe('PostTx: multisend', () => {
    const txParamsData = () => ({
        privateKey: ENV_DATA.privateKey,
        chainId: 2,
        list: [
            {
                value: 10,
                coin: 'MNT',
                to: ENV_DATA.address,
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

    test('should work gate', () => {
        expect.assertions(2);
        const txParams = new MultisendTxParams(txParamsData());
        return minterGate.postTx(txParams)
            .then((txHash) => {
                console.log(txHash);
                // txHash = txHash.replace(/^Mt/);
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);

    test('should fail gate', () => {
        expect.assertions(1);
        const txParamsDataInstance = txParamsData();
        txParamsDataInstance.list[0].value = Number.MAX_SAFE_INTEGER;
        txParamsDataInstance.list[0].coin = 'ASD999';
        const txParams = new MultisendTxParams(txParamsDataInstance);
        return minterGate.postTx(txParams)
            .catch((error) => {
                // console.log(error);
                // console.log(error.response);
                expect(error.response.data.error.message.length).toBeGreaterThan(0);
            });
    }, 70000);

    test('should work node', async () => {
        // wait for getNonce to work correctly
        // await new Promise((resolve) => {
        //     setTimeout(resolve, 5000);
        // });
        expect.assertions(2);
        const txParams = new MultisendTxParams(txParamsData());
        return minterNode.postTx(txParams)
            .then((txHash) => {
                // console.log(txHash);
                // txHash = txHash.replace(/^Mt/);
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);

    test('should fail node', () => {
        expect.assertions(1);
        const txParamsDataInstance = txParamsData();
        txParamsDataInstance.list[0].value = Number.MAX_SAFE_INTEGER;
        txParamsDataInstance.list[0].coin = 'ASD999';
        const txParams = new MultisendTxParams(txParamsDataInstance);
        return minterNode.postTx(txParams)
            .then((res) => {
                console.log({res});
            })
            .catch((error) => {
                // console.log(error.response.data);
                expect(error.response.data.error.message.length).toBeGreaterThan(0);
            });
    }, 30000);
});


describe('PostTx: sell', () => {
    const txParamsData = () => ({
        privateKey: ENV_DATA.privateKey,
        chainId: 2,
        coinFrom: 'MNT',
        coinTo: ENV_DATA.customCoin,
        sellAmount: 1,
        feeCoinSymbol: 'MNT',
        message: 'custom message',
    });

    test('should work gate', () => {
        expect.assertions(2);
        const txParams = new SellTxParams(txParamsData());
        return minterGate.postTx(txParams)
            .then((txHash) => {
                // console.log(txHash);
                // txHash = txHash.replace(/^Mt/);
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);

    test('should fail gate', () => {
        expect.assertions(1);
        const txParams = new SellTxParams({...txParamsData(), sellAmount: Number.MAX_SAFE_INTEGER, coinFrom: 'ASD999'});
        return minterGate.postTx(txParams)
            .catch((error) => {
                // console.log(error);
                // console.log(error.response);
                expect(error.response.data.error.message.length).toBeGreaterThan(0);
            });
    }, 70000);

    test('should work node', async () => {
        // wait for getNonce to work correctly
        // await new Promise((resolve) => {
        //     setTimeout(resolve, 5000);
        // });
        expect.assertions(2);
        const txParams = new SellTxParams(txParamsData());
        return minterNode.postTx(txParams)
            .then((txHash) => {
                // console.log(txHash);
                // txHash = txHash.replace(/^Mt/);
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);

    test('should fail node', () => {
        expect.assertions(1);
        const txParams = new SellTxParams({...txParamsData(), sellAmount: Number.MAX_SAFE_INTEGER, coinFrom: 'ASD999'});
        return minterNode.postTx(txParams)
            .then((res) => {
                console.log({res});
            })
            .catch((error) => {
                // console.log(error.response.data);
                expect(error.response.data.error.message.length).toBeGreaterThan(0);
            });
    }, 30000);
});

// @TODO sellAll
// @TODO create coin


describe('PostTx: buy', () => {
    const txParamsData = () => ({
        privateKey: ENV_DATA.privateKey,
        chainId: 2,
        coinFrom: 'MNT',
        coinTo: ENV_DATA.customCoin,
        buyAmount: 1,
        feeCoinSymbol: 'MNT',
        message: 'custom message',
    });

    test('should work gate', () => {
        expect.assertions(2);
        const txParams = new BuyTxParams(txParamsData());
        return minterGate.postTx(txParams)
            .then((txHash) => {
                // console.log(txHash);
                // txHash = txHash.replace(/^Mt/);
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);

    test('should fail gate', () => {
        expect.assertions(1);
        const txParams = new BuyTxParams({...txParamsData(), buyAmount: Number.MAX_SAFE_INTEGER, coinFrom: 'ASD999'});
        return minterGate.postTx(txParams)
            .catch((error) => {
                // console.log(error);
                // console.log(error.response);
                expect(error.response.data.error.message.length).toBeGreaterThan(0);
            });
    }, 70000);

    test('should work node', async () => {
        // wait for getNonce to work correctly
        // await new Promise((resolve) => {
        //     setTimeout(resolve, 5000);
        // });
        expect.assertions(2);
        const txParams = new BuyTxParams(txParamsData());
        return minterNode.postTx(txParams)
            .then((txHash) => {
                // console.log(txHash);
                // txHash = txHash.replace(/^Mt/);
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);

    test('should fail node', () => {
        expect.assertions(1);
        const txParams = new BuyTxParams({...txParamsData(), buyAmount: Number.MAX_SAFE_INTEGER, coinFrom: 'ASD999'});
        return minterNode.postTx(txParams)
            .then((res) => {
                console.log({res});
            })
            .catch((error) => {
                // console.log(error.response.data);
                expect(error.response.data.error.message.length).toBeGreaterThan(0);
            });
    }, 30000);
});


describe.skip('validator', () => {
    describe('PostTx: declare candidacy', () => {
        const txParamsData = () => ({
            privateKey: ENV_DATA.privateKey,
            chainId: 2,
            address: ENV_DATA.address,
            publicKey: '',
            coinSymbol: 'MNT',
            stake: 1,
            commission: 50,
            feeCoinSymbol: 'MNT',
            message: 'custom message',
        });

        test('should work gate', async () => {
            // wait for getNonce to work correctly
            // await new Promise((resolve) => {
            //     setTimeout(resolve, 5000);
            // });
            expect.assertions(2);
            const txParams = new DeclareCandidacyTxParams({...txParamsData(), publicKey: newCandidatePublicKeyGate});
            return minterGate.postTx(txParams)
                .then((txHash) => {
                    // console.log(txHash);
                    // txHash = txHash.replace(/^Mt/);
                    expect(txHash).toHaveLength(66);
                    expect(txHash.substr(0, 2)).toEqual('Mt');
                })
                .catch((error) => {
                    console.log(error);
                    console.log(error.response);
                });
        }, 30000);

        test('should fail gate', () => {
            expect.assertions(1);
            const txParams = new DeclareCandidacyTxParams(txParamsData()); // empty publicKey specified
            return minterGate.postTx(txParams)
                .catch((error) => {
                    // console.log(error);
                    // console.log(error.response);
                    expect(error.response.data.error.message.length).toBeGreaterThan(0);
                });
        }, 70000);

        test('should work node', async () => {
            // wait for getNonce to work correctly
            // await new Promise((resolve) => {
            //     setTimeout(resolve, 5000);
            // });
            expect.assertions(2);
            const txParams = new DeclareCandidacyTxParams({...txParamsData(), publicKey: newCandidatePublicKeyNode});
            return minterNode.postTx(txParams)
                .then((txHash) => {
                    // console.log(txHash);
                    // txHash = txHash.replace(/^Mt/);
                    expect(txHash).toHaveLength(66);
                    expect(txHash.substr(0, 2)).toEqual('Mt');
                })
                .catch((error) => {
                    console.log(error);
                    console.log(error.response);
                });
        }, 30000);

        test('should fail node', () => {
            expect.assertions(1);
            const txParams = new DeclareCandidacyTxParams(txParamsData()); // empty publicKey specified
            return minterNode.postTx(txParams)
                .then((res) => {
                    console.log({res});
                })
                .catch((error) => {
                    // console.log(error.response.data);
                    expect(error.response.data.error.message.length).toBeGreaterThan(0);
                });
        }, 30000);
    });


    describe('PostTx: edit candidate', () => {
        const txParamsData = () => ({
            privateKey: ENV_DATA.privateKey,
            chainId: 2,
            publicKey: '',
            rewardAddress: ENV_DATA.address,
            ownerAddress: ENV_DATA.address,
            feeCoinSymbol: 'MNT',
            message: 'custom message',
        });

        test('should work gate', async () => {
            // wait for getNonce to work correctly
            // await new Promise((resolve) => {
            //     setTimeout(resolve, 5000);
            // });
            expect.assertions(2);
            const txParams = new EditCandidateTxParams({...txParamsData(), publicKey: newCandidatePublicKeyGate});
            return minterGate.postTx(txParams)
                .then((txHash) => {
                    console.log(txHash);
                    // txHash = txHash.replace(/^Mt/);
                    expect(txHash).toHaveLength(66);
                    expect(txHash.substr(0, 2)).toEqual('Mt');
                })
                .catch((error) => {
                    console.log(error);
                    console.log(error.response);
                });
        }, 30000);

        test('should fail gate', () => {
            expect.assertions(1);
            const txParams = new EditCandidateTxParams(txParamsData()); // empty publicKey specified
            return minterGate.postTx(txParams)
                .catch((error) => {
                    // console.log(error);
                    // console.log(error.response);
                    expect(error.response.data.error.message.length).toBeGreaterThan(0);
                });
        }, 70000);

        test('should work node', async () => {
            // wait for getNonce to work correctly
            // await new Promise((resolve) => {
            //     setTimeout(resolve, 5000);
            // });
            expect.assertions(2);
            const txParams = new EditCandidateTxParams({...txParamsData(), publicKey: newCandidatePublicKeyNode});
            return minterNode.postTx(txParams)
                .then((txHash) => {
                    console.log(txHash);
                    // txHash = txHash.replace(/^Mt/);
                    expect(txHash).toHaveLength(66);
                    expect(txHash.substr(0, 2)).toEqual('Mt');
                })
                .catch((error) => {
                    console.log(error);
                    console.log(error.response);
                });
        }, 30000);

        test('should fail node', () => {
            expect.assertions(1);
            const txParams = new EditCandidateTxParams(txParamsData()); // empty publicKey specified
            return minterNode.postTx(txParams)
                .then((res) => {
                    console.log({res});
                })
                .catch((error) => {
                    // console.log(error.response.data);
                    expect(error.response.data.error.message.length).toBeGreaterThan(0);
                });
        }, 30000);
    });


    describe('PostTx: delegate', () => {
        const txParamsData = () => ({
            privateKey: ENV_DATA.privateKey,
            chainId: 2,
            publicKey: '',
            coinSymbol: 'MNT',
            stake: 10,
            feeCoinSymbol: 'MNT',
            message: 'custom message',
        });

        test('should work gate', () => {
            expect.assertions(2);
            const txParams = new DelegateTxParams({...txParamsData(), publicKey: newCandidatePublicKeyGate});
            return minterGate.postTx(txParams)
                .then((txHash) => {
                    // console.log(txHash);
                    // txHash = txHash.replace(/^Mt/);
                    expect(txHash).toHaveLength(66);
                    expect(txHash.substr(0, 2)).toEqual('Mt');
                })
                .catch((error) => {
                    console.log(error);
                    console.log(error.response);
                });
        }, 30000);

        test('should fail gate', () => {
            expect.assertions(1);
            const txParams = new DelegateTxParams(txParamsData()); // empty publicKey specified
            return minterGate.postTx(txParams)
                .catch((error) => {
                    // console.log(error);
                    // console.log(error.response);
                    expect(error.response.data.error.message.length).toBeGreaterThan(0);
                });
        }, 70000);

        test('should work node', async () => {
            // wait for getNonce to work correctly
            // await new Promise((resolve) => {
            //     setTimeout(resolve, 5000);
            // });
            expect.assertions(2);
            const txParams = new DelegateTxParams({...txParamsData(), publicKey: newCandidatePublicKeyNode});
            return minterNode.postTx(txParams)
                .then((txHash) => {
                    // console.log(txHash);
                    // txHash = txHash.replace(/^Mt/);
                    expect(txHash).toHaveLength(66);
                    expect(txHash.substr(0, 2)).toEqual('Mt');
                })
                .catch((error) => {
                    console.log(error);
                    console.log(error.response);
                });
        }, 30000);

        test('should fail node', () => {
            expect.assertions(1);
            const txParams = new DelegateTxParams(txParamsData()); // empty publicKey specified
            return minterNode.postTx(txParams)
                .then((res) => {
                    console.log({res});
                })
                .catch((error) => {
                    // console.log(error.response.data);
                    expect(error.response.data.error.message.length).toBeGreaterThan(0);
                });
        }, 30000);
    });


    describe('PostTx: unbond', () => {
        const txParamsData = () => ({
            privateKey: ENV_DATA.privateKey,
            chainId: 2,
            publicKey: '',
            coinSymbol: 'MNT',
            stake: 10,
            feeCoinSymbol: 'MNT',
            message: 'custom message',
        });


        test('should work gate', () => {
            console.log('unbond from:', newCandidatePublicKeyGate);
            expect.assertions(2);
            const txParams = new UnbondTxParams({...txParamsData(), publicKey: newCandidatePublicKeyGate});
            return minterGate.postTx(txParams)
                .then((txHash) => {
                    // console.log(txHash);
                    // txHash = txHash.replace(/^Mt/);
                    expect(txHash).toHaveLength(66);
                    expect(txHash.substr(0, 2)).toEqual('Mt');
                })
                .catch((error) => {
                    console.log(error);
                    console.log(error.response);
                });
        }, 30000);

        test('should fail gate', () => {
            expect.assertions(1);
            const txParams = new UnbondTxParams(txParamsData()); // empty publicKey specified
            return minterGate.postTx(txParams)
                .catch((error) => {
                    // console.log(error);
                    // console.log(error.response);
                    expect(error.response.data.error.message.length).toBeGreaterThan(0);
                });
        }, 70000);

        test('should work node', async () => {
            // wait for getNonce to work correctly
            // await new Promise((resolve) => {
            //     setTimeout(resolve, 5000);
            // });
            expect.assertions(2);
            const txParams = new UnbondTxParams({...txParamsData(), publicKey: newCandidatePublicKeyNode});
            return minterNode.postTx(txParams)
                .then((txHash) => {
                    // console.log(txHash);
                    // txHash = txHash.replace(/^Mt/);
                    expect(txHash).toHaveLength(66);
                    expect(txHash.substr(0, 2)).toEqual('Mt');
                })
                .catch((error) => {
                    console.log(error);
                    console.log(error.response);
                });
        }, 30000);

        test('should fail node', () => {
            expect.assertions(1);
            const txParams = new UnbondTxParams(txParamsData()); // empty publicKey specified
            return minterNode.postTx(txParams)
                .then((res) => {
                    console.log({res});
                })
                .catch((error) => {
                    // console.log(error.response.data);
                    expect(error.response.data.error.message.length).toBeGreaterThan(0);
                });
        }, 30000);
    });


    describe('PostTx: set candidate on', () => {
        const txParamsData = () => ({
            privateKey: ENV_DATA.privateKey,
            chainId: 2,
            publicKey: '',
            feeCoinSymbol: 'MNT',
            message: 'custom message',
        });

        test('should work gate', () => {
            expect.assertions(2);
            const txParams = new SetCandidateOnTxParams({...txParamsData(), publicKey: newCandidatePublicKeyGate});
            return minterGate.postTx(txParams)
                .then((txHash) => {
                    // console.log(txHash);
                    // txHash = txHash.replace(/^Mt/);
                    expect(txHash).toHaveLength(66);
                    expect(txHash.substr(0, 2)).toEqual('Mt');
                })
                .catch((error) => {
                    console.log(error);
                    console.log(error.response);
                });
        }, 30000);

        test('should fail gate', () => {
            expect.assertions(1);
            const txParams = new SetCandidateOnTxParams(txParamsData()); // empty publicKey specified
            return minterGate.postTx(txParams)
                .catch((error) => {
                    // console.log(error);
                    // console.log(error.response);
                    expect(error.response.data.error.message.length).toBeGreaterThan(0);
                });
        }, 70000);

        test('should work node', async () => {
            // wait for getNonce to work correctly
            // await new Promise((resolve) => {
            //     setTimeout(resolve, 5000);
            // });
            expect.assertions(2);
            const txParams = new SetCandidateOnTxParams({...txParamsData(), publicKey: newCandidatePublicKeyNode});
            return minterNode.postTx(txParams)
                .then((txHash) => {
                    // console.log(txHash);
                    // txHash = txHash.replace(/^Mt/);
                    expect(txHash).toHaveLength(66);
                    expect(txHash.substr(0, 2)).toEqual('Mt');
                })
                .catch((error) => {
                    console.log(error);
                    console.log(error.response);
                });
        }, 30000);

        test('should fail node', () => {
            expect.assertions(1);
            const txParams = new SetCandidateOnTxParams(txParamsData()); // empty publicKey specified
            return minterNode.postTx(txParams)
                .then((res) => {
                    console.log({res});
                })
                .catch((error) => {
                    // console.log(error.response.data);
                    expect(error.response.data.error.message.length).toBeGreaterThan(0);
                });
        }, 30000);
    });


    describe('PostTx: set candidate off', () => {
        const txParamsData = () => ({
            privateKey: ENV_DATA.privateKey,
            chainId: 2,
            publicKey: '',
            feeCoinSymbol: 'MNT',
            message: 'custom message',
        });

        test('should work gate', () => {
            expect.assertions(2);
            const txParams = new SetCandidateOffTxParams({...txParamsData(), publicKey: newCandidatePublicKeyGate});
            return minterGate.postTx(txParams)
                .then((txHash) => {
                    // console.log(txHash);
                    // txHash = txHash.replace(/^Mt/);
                    expect(txHash).toHaveLength(66);
                    expect(txHash.substr(0, 2)).toEqual('Mt');
                })
                .catch((error) => {
                    console.log(error);
                    console.log(error.response);
                });
        }, 30000);

        test('should fail gate', () => {
            expect.assertions(1);
            const txParams = new SetCandidateOffTxParams(txParamsData()); // empty publicKey specified
            return minterGate.postTx(txParams)
                .then((res) => {
                    console.log({res});
                })
                .catch((error) => {
                    // console.log(error);
                    // console.log(error.response);
                    expect(error.response.data.error.message.length).toBeGreaterThan(0);
                });
        }, 70000);

        test('should work node', async () => {
            // wait for getNonce to work correctly
            // await new Promise((resolve) => {
            //     setTimeout(resolve, 5000);
            // });
            expect.assertions(2);
            const txParams = new SetCandidateOffTxParams({...txParamsData(), publicKey: newCandidatePublicKeyNode});
            return minterNode.postTx(txParams)
                .then((txHash) => {
                    // console.log(txHash);
                    // txHash = txHash.replace(/^Mt/);
                    expect(txHash).toHaveLength(66);
                    expect(txHash.substr(0, 2)).toEqual('Mt');
                })
                .catch((error) => {
                    console.log(error);
                    console.log(error.response);
                });
        }, 30000);

        test('should fail node', () => {
            expect.assertions(1);
            const txParams = new SetCandidateOffTxParams(txParamsData()); // empty publicKey specified
            return minterNode.postTx(txParams)
                .then((res) => {
                    console.log({res});
                })
                .catch((error) => {
                    // console.log(error.response.data);
                    expect(error.response.data.error.message.length).toBeGreaterThan(0);
                });
        }, 30000);
    });
});


describe('PostTx: redeem check', () => {
    function getRandomCheck() {
        return issueCheck({
            privateKey: ENV_DATA.privateKey,
            chainId: 2,
            passPhrase: '123',
            nonce: 1,
            coinSymbol: 'MNT',
            value: Math.random(),
        });
    }

    const txParamsData = () => ({
        privateKey: ENV_DATA.privateKey,
        chainId: 2,
        check: '',
        password: '123',
        feeCoinSymbol: 'MNT',
    });

    test('should work gate', () => {
        expect.assertions(2);
        const txParams = new RedeemCheckTxParams({...txParamsData(), check: getRandomCheck()});
        return minterGate.postTx(txParams)
            .then((txHash) => {
                // console.log(txHash);
                // txHash = txHash.replace(/^Mt/);
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);

    test('should fail gate', () => {
        expect.assertions(1);
        const txParams = new RedeemCheckTxParams(txParamsData()); // empty check specified
        return minterGate.postTx(txParams)
            .catch((error) => {
                // console.log(error);
                // console.log(error.response);
                expect(error.response.data.error.message.length).toBeGreaterThan(0);
            });
    }, 70000);

    test('should work node', async () => {
        // wait for getNonce to work correctly
        // await new Promise((resolve) => {
        //     setTimeout(resolve, 5000);
        // });
        expect.assertions(2);
        const txParams = new RedeemCheckTxParams({...txParamsData(), check: getRandomCheck()});
        return minterNode.postTx(txParams)
            .then((txHash) => {
                // console.log(txHash);
                // txHash = txHash.replace(/^Mt/);
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);

    test('should fail node', () => {
        expect.assertions(1);
        const txParams = new RedeemCheckTxParams(txParamsData()); // empty check specified
        return minterNode.postTx(txParams)
            .then((res) => {
                console.log({res});
            })
            .catch((error) => {
                // console.log(error.response.data);
                expect(error.response.data.error.message.length).toBeGreaterThan(0);
            });
    }, 30000);
});


describe('PostTx: create multisig', () => {
    const txParamsData = () => ({
        privateKey: ENV_DATA.privateKey,
        chainId: 2,
        addresses: [ENV_DATA.address, 'Mx7633980c000139dd3bd24a3f54e06474fa941e00'],
        weights: [],
        threshold: 100,
        feeCoinSymbol: 'MNT',
    });

    test('should work gate', () => {
        expect.assertions(2);
        const txParams = new CreateMultisigTxParams({...txParamsData(), weights: [Math.random().toString().replace(/\D/, ''), Math.random().toString().replace(/\D/, '')]});
        return minterGate.postTx(txParams)
            .then((txHash) => {
                // console.log(txHash);
                // txHash = txHash.replace(/^Mt/);
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);

    test('should fail gate', () => {
        expect.assertions(1);
        const txParams = new CreateMultisigTxParams({...txParamsData(), weights: []});
        return minterGate.postTx(txParams)
            .catch((error) => {
                // console.log(error);
                // console.log(error.response);
                expect(error.response.data.error.message.length).toBeGreaterThan(0);
            });
    }, 70000);

    test('should work node', async () => {
        // wait for getNonce to work correctly
        // await new Promise((resolve) => {
        //     setTimeout(resolve, 5000);
        // });
        expect.assertions(2);
        const txParams = new CreateMultisigTxParams({...txParamsData(), weights: [Math.random().toString().replace(/\D/, ''), Math.random().toString().replace(/\D/, '')]});
        return minterNode.postTx(txParams)
            .then((txHash) => {
                // console.log(txHash);
                // txHash = txHash.replace(/^Mt/);
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);

    test('should fail node', () => {
        expect.assertions(1);
        const txParams = new CreateMultisigTxParams({...txParamsData(), weights: []});
        return minterNode.postTx(txParams)
            .then((res) => {
                console.log({res});
            })
            .catch((error) => {
                // console.log(error.response.data);
                expect(error.response.data.error.message.length).toBeGreaterThan(0);
            });
    }, 30000);
});

// @TODO test multisig tx

describe('EstimateCoinSell', () => {
    test('should work gate', () => {
        expect.assertions(2);

        return minterGate.estimateCoinSell({
            coinToSell: 'MNT',
            valueToSell: 1,
            coinToBuy: ENV_DATA.customCoin,
        })
            .then((estimateResult) => {
                expect(Number(estimateResult.will_get)).toBeGreaterThan(0);
                expect(Number(estimateResult.commission)).toBeGreaterThan(0);
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);

    test('should fail gate', () => {
        expect.assertions(1);
        return minterGate.estimateCoinSell({
            coinToSell: 'MNT',
            valueToSell: 1,
            coinToBuy: 'MNT',
        })
            .catch((error) => {
                expect(error.response.data.error.message.length).toBeGreaterThan(0);
            });
    }, 30000);

    test('should work node', () => {
        expect.assertions(2);

        return minterNode.estimateCoinSell({
            coinToSell: 'MNT',
            valueToSell: 1,
            coinToBuy: ENV_DATA.customCoin,
        })
            .then((estimateResult) => {
                expect(Number(estimateResult.will_get)).toBeGreaterThan(0);
                expect(Number(estimateResult.commission)).toBeGreaterThan(0);
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);

    test('should fail node', () => {
        expect.assertions(1);
        return minterNode.estimateCoinSell({
            coinToSell: 'MNT',
            valueToSell: 1,
            coinToBuy: 'MNT',
        })
            .catch((error) => {
                expect(error.response.data.error.message.length).toBeGreaterThan(0);
            });
    }, 30000);
});

describe('EstimateCoinBuy', () => {
    test('should work gate', () => {
        expect.assertions(2);

        return minterGate.estimateCoinBuy({
            coinToSell: 'MNT',
            valueToBuy: 1,
            coinToBuy: ENV_DATA.customCoin,
        })
            .then((estimateResult) => {
                expect(Number(estimateResult.will_pay)).toBeGreaterThan(0);
                expect(Number(estimateResult.commission)).toBeGreaterThan(0);
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);

    test('should fail gate', () => {
        expect.assertions(1);
        return minterGate.estimateCoinBuy({
            coinToSell: 'MNT',
            valueToBuy: 1,
            coinToBuy: 'MNT',
        })
            .catch((error) => {
                // console.log(error);
                expect(error.response.data.error.message.length).toBeGreaterThan(0);
            });
    }, 30000);

    test('should work node', () => {
        expect.assertions(2);

        return minterNode.estimateCoinBuy({
            coinToSell: 'MNT',
            valueToBuy: 1,
            coinToBuy: ENV_DATA.customCoin,
        })
            .then((estimateResult) => {
                expect(Number(estimateResult.will_pay)).toBeGreaterThan(0);
                expect(Number(estimateResult.commission)).toBeGreaterThan(0);
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);

    test('should fail node', () => {
        expect.assertions(1);
        return minterNode.estimateCoinBuy({
            coinToSell: 'MNT',
            valueToBuy: 1,
            coinToBuy: 'MNT',
        })
            .catch((error) => {
                expect(error.response.data.error.message.length).toBeGreaterThan(0);
            });
    }, 30000);
});

describe('EstimateTxCommission', () => {
    const rawTx = 'f8920101028a4d4e540000000000000001aae98a4d4e540000000000000094376615b9a3187747dc7c32e51723515ee62e37dc888ac7230489e800008e637573746f6d206d6573736167658001b845f8431ba0647b5465b656962e88cec2e1883830b7e231cacea0fd57bdb329650729144147a015b593a0301dfa4cf6ec9357be065221455b279674944bb7534d6ea650eb35c8';

    test('should work gate', () => {
        expect.assertions(1);

        return minterGate.estimateTxCommission({
            transaction: rawTx,
        })
            .then((commission) => {
                expect(Number(commission)).toBeGreaterThan(0);
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);

    test('should work node', () => {
        expect.assertions(1);

        return minterNode.estimateTxCommission({
            transaction: rawTx,
        })
            .then((commission) => {
                expect(Number(commission)).toBeGreaterThan(0);
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);
});
