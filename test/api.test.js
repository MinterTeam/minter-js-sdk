import axios from 'axios';
import {generateWallet, walletFromMnemonic} from 'minterjs-wallet';
import {Minter, SendTxParams, SellTxParams, BuyTxParams, DeclareCandidacyTxParams, EditCandidateTxParams, DelegateTxParams, UnbondTxParams, RedeemCheckTxParams, SetCandidateOnTxParams, SetCandidateOffTxParams, CreateMultisigTxParams, CreateCoinTxParams, SellAllTxParams, issueCheck} from '~/src';
import {API_TYPE_EXPLORER, API_TYPE_NODE} from '~/src/variables';

// mnemonic: exercise fantasy smooth enough arrive steak demise donkey true employ jealous decide blossom bind someone
// private: 5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da
// address: Mx7633980c000139dd3bd24a3f54e06474fa941e16

const ENV_TESTNET = 'testnet';
const ENV_TEST_TESTNET = 'test';

const ENV_SETTINGS = {
    [ENV_TESTNET]: {
        nodeBaseUrl: 'https://minter-node-1.testnet.minter.network',
        explorerBaseUrl: 'https://testnet.explorer.minter.network',
        mnemonic: 'exercise fantasy smooth enough arrive steak demise donkey true employ jealous decide blossom bind someone',
        privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
        address: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        customCoin: 'TESTCOIN01',
    },
    [ENV_TEST_TESTNET]: {
        nodeBaseUrl: 'http://159.89.107.246:8841',
        explorerBaseUrl: 'https://tst.explorer.minter.network',
    },
};

// select environment
const CURRENT_ENV = ENV_TEST_TESTNET;
let ENV_DATA = ENV_SETTINGS[CURRENT_ENV];


const minterNode = new Minter({apiType: API_TYPE_NODE, baseURL: ENV_DATA.nodeBaseUrl});
const minterExplorer = new Minter({apiType: API_TYPE_EXPLORER, baseURL: ENV_DATA.explorerBaseUrl});

const newCandidatePublicKeyExplorer = generateWallet().getPublicKeyString();
const newCandidatePublicKeyNode = generateWallet().getPublicKeyString();

beforeAll(async () => {
    // fill test ENV_DATA with data from the server
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
        address: ENV_DATA.address,
        amount: 10,
        coinSymbol: 'MNT',
        feeCoinSymbol: 'MNT',
        message: 'custom message',
    });

    test('should work explorer', () => {
        expect.assertions(2);
        const txParams = new SendTxParams(txParamsData());
        return minterExplorer.postTx(txParams)
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

    test('should fail explorer', () => {
        expect.assertions(1);
        const txParams = new SendTxParams({...txParamsData(), amount: Number.MAX_SAFE_INTEGER, coinSymbol: 'ASD999'});
        return minterExplorer.postTx(txParams)
            .catch((error) => {
                // console.log(error);
                // console.log(error.response);
                expect(error.response.data.error.log.length).toBeGreaterThan(0);
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
                expect(error.response.data.error.log.length).toBeGreaterThan(0);
            });
    }, 30000);
});

describe('PostTx: sell', () => {
    const txParamsData = () => ({
        privateKey: ENV_DATA.privateKey,
        coinFrom: 'MNT',
        coinTo: ENV_DATA.customCoin,
        sellAmount: 1,
        feeCoinSymbol: 'MNT',
        message: 'custom message',
    });

    test('should work explorer', () => {
        expect.assertions(2);
        const txParams = new SellTxParams(txParamsData());
        return minterExplorer.postTx(txParams)
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

    test('should fail explorer', () => {
        expect.assertions(1);
        const txParams = new SellTxParams({...txParamsData(), sellAmount: Number.MAX_SAFE_INTEGER, coinFrom: 'ASD999'});
        return minterExplorer.postTx(txParams)
            .catch((error) => {
                // console.log(error);
                // console.log(error.response);
                expect(error.response.data.error.log.length).toBeGreaterThan(0);
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
                expect(error.response.data.error.log.length).toBeGreaterThan(0);
            });
    }, 30000);
});

// @TODO sellAll
// @TODO create coin


describe('PostTx: buy', () => {
    const txParamsData = () => ({
        privateKey: ENV_DATA.privateKey,
        coinFrom: 'MNT',
        coinTo: ENV_DATA.customCoin,
        buyAmount: 1,
        feeCoinSymbol: 'MNT',
        message: 'custom message',
    });

    test('should work explorer', () => {
        expect.assertions(2);
        const txParams = new BuyTxParams(txParamsData());
        return minterExplorer.postTx(txParams)
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

    test('should fail explorer', () => {
        expect.assertions(1);
        const txParams = new BuyTxParams({...txParamsData(), buyAmount: Number.MAX_SAFE_INTEGER, coinFrom: 'ASD999'});
        return minterExplorer.postTx(txParams)
            .catch((error) => {
                // console.log(error);
                // console.log(error.response);
                expect(error.response.data.error.log.length).toBeGreaterThan(0);
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
                expect(error.response.data.error.log.length).toBeGreaterThan(0);
            });
    }, 30000);
});


describe('validator', () => {
    describe('PostTx: declare candidacy', () => {
        const txParamsData = () => ({
            privateKey: ENV_DATA.privateKey,
            address: ENV_DATA.address,
            publicKey: '',
            coinSymbol: 'MNT',
            stake: 1,
            commission: 50,
            feeCoinSymbol: 'MNT',
            message: 'custom message',
        });

        test('should work explorer', async () => {
            // wait for getNonce to work correctly
            // await new Promise((resolve) => {
            //     setTimeout(resolve, 5000);
            // });
            expect.assertions(2);
            const txParams = new DeclareCandidacyTxParams({...txParamsData(), publicKey: newCandidatePublicKeyExplorer});
            return minterExplorer.postTx(txParams)
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

        test('should fail explorer', () => {
            expect.assertions(1);
            const txParams = new DeclareCandidacyTxParams(txParamsData()); // empty publicKey specified
            return minterExplorer.postTx(txParams)
                .catch((error) => {
                    // console.log(error);
                    // console.log(error.response);
                    expect(error.response.data.error.log.length).toBeGreaterThan(0);
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
                    expect(error.response.data.error.log.length).toBeGreaterThan(0);
                });
        }, 30000);
    });


    describe('PostTx: edit candidate', () => {
        const txParamsData = () => ({
            privateKey: ENV_DATA.privateKey,
            publicKey: '',
            rewardAddress: ENV_DATA.address,
            ownerAddress: ENV_DATA.address,
            feeCoinSymbol: 'MNT',
            message: 'custom message',
        });

        test('should work explorer', async () => {
            // wait for getNonce to work correctly
            // await new Promise((resolve) => {
            //     setTimeout(resolve, 5000);
            // });
            expect.assertions(2);
            const txParams = new EditCandidateTxParams({...txParamsData(), publicKey: newCandidatePublicKeyExplorer});
            return minterExplorer.postTx(txParams)
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

        test('should fail explorer', () => {
            expect.assertions(1);
            const txParams = new EditCandidateTxParams(txParamsData()); // empty publicKey specified
            return minterExplorer.postTx(txParams)
                .catch((error) => {
                    // console.log(error);
                    // console.log(error.response);
                    expect(error.response.data.error.log.length).toBeGreaterThan(0);
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
                    expect(error.response.data.error.log.length).toBeGreaterThan(0);
                });
        }, 30000);
    });


    describe('PostTx: delegate', () => {
        const txParamsData = () => ({
            privateKey: ENV_DATA.privateKey,
            publicKey: '',
            coinSymbol: 'MNT',
            stake: 10,
            feeCoinSymbol: 'MNT',
            message: 'custom message',
        });

        test('should work explorer', () => {
            expect.assertions(2);
            const txParams = new DelegateTxParams({...txParamsData(), publicKey: newCandidatePublicKeyExplorer});
            return minterExplorer.postTx(txParams)
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

        test('should fail explorer', () => {
            expect.assertions(1);
            const txParams = new DelegateTxParams(txParamsData()); // empty publicKey specified
            return minterExplorer.postTx(txParams)
                .catch((error) => {
                    // console.log(error);
                    // console.log(error.response);
                    expect(error.response.data.error.log.length).toBeGreaterThan(0);
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
                    expect(error.response.data.error.log.length).toBeGreaterThan(0);
                });
        }, 30000);
    });


    describe('PostTx: unbond', () => {
        const txParamsData = () => ({
            privateKey: ENV_DATA.privateKey,
            publicKey: '',
            coinSymbol: 'MNT',
            stake: 10,
            feeCoinSymbol: 'MNT',
            message: 'custom message',
        });


        test('should work explorer', () => {
            console.log('unbond from:', newCandidatePublicKeyExplorer);
            expect.assertions(2);
            const txParams = new UnbondTxParams({...txParamsData(), publicKey: newCandidatePublicKeyExplorer});
            return minterExplorer.postTx(txParams)
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

        test('should fail explorer', () => {
            expect.assertions(1);
            const txParams = new UnbondTxParams(txParamsData()); // empty publicKey specified
            return minterExplorer.postTx(txParams)
                .catch((error) => {
                    // console.log(error);
                    // console.log(error.response);
                    expect(error.response.data.error.log.length).toBeGreaterThan(0);
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
                    expect(error.response.data.error.log.length).toBeGreaterThan(0);
                });
        }, 30000);
    });


    describe('PostTx: set candidate on', () => {
        const txParamsData = () => ({
            privateKey: ENV_DATA.privateKey,
            publicKey: '',
            feeCoinSymbol: 'MNT',
            message: 'custom message',
        });

        test('should work explorer', () => {
            expect.assertions(2);
            const txParams = new SetCandidateOnTxParams({...txParamsData(), publicKey: newCandidatePublicKeyExplorer});
            return minterExplorer.postTx(txParams)
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

        test('should fail explorer', () => {
            expect.assertions(1);
            const txParams = new SetCandidateOnTxParams(txParamsData()); // empty publicKey specified
            return minterExplorer.postTx(txParams)
                .catch((error) => {
                    // console.log(error);
                    // console.log(error.response);
                    expect(error.response.data.error.log.length).toBeGreaterThan(0);
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
                    expect(error.response.data.error.log.length).toBeGreaterThan(0);
                });
        }, 30000);
    });


    describe('PostTx: set candidate off', () => {
        const txParamsData = () => ({
            privateKey: ENV_DATA.privateKey,
            publicKey: '',
            feeCoinSymbol: 'MNT',
            message: 'custom message',
        });

        test('should work explorer', () => {
            expect.assertions(2);
            const txParams = new SetCandidateOffTxParams({...txParamsData(), publicKey: newCandidatePublicKeyExplorer});
            return minterExplorer.postTx(txParams)
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

        test('should fail explorer', () => {
            expect.assertions(1);
            const txParams = new SetCandidateOffTxParams(txParamsData()); // empty publicKey specified
            return minterExplorer.postTx(txParams)
                .then((res) => {
                    console.log({res});
                })
                .catch((error) => {
                    // console.log(error);
                    // console.log(error.response);
                    expect(error.response.data.error.log.length).toBeGreaterThan(0);
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
                    expect(error.response.data.error.log.length).toBeGreaterThan(0);
                });
        }, 30000);
    });
});


describe('PostTx: redeem check', () => {
    function getRandomCheck() {
        return issueCheck({
            privateKey: ENV_DATA.privateKey,
            passPhrase: '123',
            nonce: 1,
            coinSymbol: 'MNT',
            value: Math.random(),
        });
    }

    const txParamsData = () => ({
        privateKey: ENV_DATA.privateKey,
        check: '',
        password: '123',
        feeCoinSymbol: 'MNT',
    });

    test('should work explorer', () => {
        expect.assertions(2);
        const txParams = new RedeemCheckTxParams({...txParamsData(), check: getRandomCheck()});
        return minterExplorer.postTx(txParams)
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

    test('should fail explorer', () => {
        expect.assertions(1);
        const txParams = new RedeemCheckTxParams(txParamsData()); // empty check specified
        return minterExplorer.postTx(txParams)
            .catch((error) => {
                // console.log(error);
                // console.log(error.response);
                expect(error.response.data.error.log.length).toBeGreaterThan(0);
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
                expect(error.response.data.error.log.length).toBeGreaterThan(0);
            });
    }, 30000);
});


describe('PostTx: create multisig', () => {
    const txParamsData = () => ({
        privateKey: ENV_DATA.privateKey,
        addresses: [ENV_DATA.address, 'Mx7633980c000139dd3bd24a3f54e06474fa941e00'],
        weights: [],
        threshold: 100,
        feeCoinSymbol: 'MNT',
    });

    test('should work explorer', () => {
        expect.assertions(2);
        const txParams = new CreateMultisigTxParams({...txParamsData(), weights: [Math.random().toString().replace(/\D/, ''), Math.random().toString().replace(/\D/, '')]});
        return minterExplorer.postTx(txParams)
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

    test('should fail explorer', () => {
        expect.assertions(1);
        const txParams = new CreateMultisigTxParams({...txParamsData(), weights: []});
        return minterExplorer.postTx(txParams)
            .catch((error) => {
                // console.log(error);
                // console.log(error.response);
                expect(error.response.data.error.log.length).toBeGreaterThan(0);
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
                expect(error.response.data.error.log.length).toBeGreaterThan(0);
            });
    }, 30000);
});

// @TODO test multisig tx

describe('EstimateCoinSell', () => {
    test('should work explorer', () => {
        expect.assertions(2);

        return minterExplorer.estimateCoinSell({
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

    test('should fail explorer', () => {
        expect.assertions(1);
        return minterExplorer.estimateCoinSell({
            coinToSell: 'MNT',
            valueToSell: 1,
            coinToBuy: 'MNT',
        })
            .catch((error) => {
                expect(error.response.data.error.log.length).toBeGreaterThan(0);
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
                expect(error.response.data.error.log.length).toBeGreaterThan(0);
            });
    }, 30000);
});

describe('EstimateCoinBuy', () => {
    test('should work explorer', () => {
        expect.assertions(2);

        return minterExplorer.estimateCoinBuy({
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

    test('should fail explorer', () => {
        expect.assertions(1);
        return minterExplorer.estimateCoinBuy({
            coinToSell: 'MNT',
            valueToBuy: 1,
            coinToBuy: 'MNT',
        })
            .catch((error) => {
                // console.log(error);
                expect(error.response.data.error.log.length).toBeGreaterThan(0);
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
                expect(error.response.data.error.log.length).toBeGreaterThan(0);
            });
    }, 30000);
});

describe('EstimateTxCommission', () => {
    const rawTx = 'f8911a018a4d4e540000000000000001aae98a4d4e5400000000000000947633980c000139dd3bd24a3f54e06474fa941e16888ac7230489e800008e637573746f6d206d6573736167658001b845f8431ca0c0716faaac63263c8c6106fa17f863eec2de60431214dd8d775147d4ed972410a05f881fb3938acf69a0a7eb761e5479fbbd60780e1db0c85a0670150eb7b070ab';

    test('should work explorer', () => {
        expect.assertions(1);

        return minterExplorer.estimateTxCommission({
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
