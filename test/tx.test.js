import {TX_TYPE, bufferToCoin} from 'minterjs-tx';
import {prepareSignedTx, prepareTx, decodeTx, SendTxParams} from '~/src';
import {VALID_CHECK} from '~/test/check.test.js';


describe('prepareTx', () => {
    const privateKey = '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da';

    describe('send', () => {
        const txParams = {
            nonce: 11111,
            chainId: 1,
            type: TX_TYPE.SEND,
            data: {
                to: 'Mx376615B9A3187747dC7c32e51723515Ee62e37Dc',
                value: 10,
                coin: 'MNT',
            },
            gasPrice: 2,
            payload: 'custom message',
        };
        const validTxHex = 'f894822b6701028a4d4e540000000000000001aae98a4d4e540000000000000094376615b9a3187747dc7c32e51723515ee62e37dc888ac7230489e800008e637573746f6d206d6573736167658001b845f8431ba05f6a0aceb55347029037555354dae6a1542ebafe8a43b9bb934c5ffce4ff1153a001e86cce1a5d37a3a9c552e0cfef8c93bff9c058c831edb2fd431dc88754f27e';

        test('should work prepareSignedTx', shouldWorkPrepareSignedTx(txParams, privateKey, validTxHex));
        test('should work prepareTx', shouldWorkPrepareTx(txParams, privateKey, validTxHex));

        test('default chainId: 1', () => {
            expect(prepareSignedTx({
                ...txParams,
                chainId: undefined,
            }, {privateKey}).serialize()).toEqual(prepareSignedTx({
                ...txParams,
                chainId: 1,
            }, {privateKey}).serialize());
        });

        test('default gasCoin: same as coin to send', () => {
            expect(prepareSignedTx({
                ...txParams,
                gasCoin: undefined,
            }, {privateKey}).serialize()).toEqual(prepareSignedTx({
                ...txParams,
                gasCoin: 'MNT',
            }, {privateKey}).serialize());
        });

        test('default gasPrice: 1', () => {
            expect(prepareSignedTx({
                ...txParams,
                gasPrice: undefined,
            }, {privateKey}).serialize()).toEqual(prepareSignedTx({
                ...txParams,
                gasPrice: 1,
            }, {privateKey}).serialize());
        });
    });

    describe('create coin', () => {
        const txParams = {
            nonce: 11111,
            type: TX_TYPE.CREATE_COIN,
            data: {
                name: 'My Coin',
                symbol: 'MYCOIN',
                initialAmount: 5,
                constantReserveRatio: 10,
                initialReserve: 20,
            },
            gasCoin: 'ASD',
            payload: 'custom message',
        };
        const validTxHex = 'f8a1822b6701018a4153440000000000000005b7f6874d7920436f696e8a4d59434f494e00000000884563918244f400008901158e460913d000000a8e314dc6448d9338c15b0a000000008e637573746f6d206d6573736167658001b845f8431ba06946f3b3b081c038324c18085202f55554aa5511f514179906b6d4e46e4e22b9a05219c1511a43900bc9a5aa4a07644dd1a8a717654150fbaffe795ab67f79eca1';

        test('should work prepareSignedTx', shouldWorkPrepareSignedTx(txParams, privateKey, validTxHex));
        test('should work prepareTx', shouldWorkPrepareTx(txParams, privateKey, validTxHex));
    });

    describe('sell', () => {
        const txParams = {
            nonce: 11111,
            type: TX_TYPE.SELL,
            data: {
                coinToSell: 'MNT',
                coinToBuy: 'BELTCOIN',
                valueToSell: 10,
            },
            gasCoin: 'ASD',
            payload: 'custom message',
        };
        const validTxHex = 'f88b822b6701018a4153440000000000000002a1e08a4d4e5400000000000000888ac7230489e800008a42454c54434f494e0000808e637573746f6d206d6573736167658001b845f8431ca05da995b71460e720d756832c993dc0bff1b1bfb768ecafe9e2602edfbc8d2ddca06199941291b94457dea63d921df33f726b3c17774b1f6727de77723d6000fdae';

        test('should work prepareSignedTx', shouldWorkPrepareSignedTx(txParams, privateKey, validTxHex));
        test('should work prepareTx', shouldWorkPrepareTx(txParams, privateKey, validTxHex));
    });

    describe('sell all', () => {
        const txParams = {
            nonce: 11111,
            type: TX_TYPE.SELL_ALL,
            data: {
                coinToSell: 'MNT',
                coinToBuy: 'BELTCOIN',
            },
            gasCoin: 'ASD',
            payload: 'custom message',
        };
        const validTxHex = 'f882822b6701018a415344000000000000000398d78a4d4e54000000000000008a42454c54434f494e0000808e637573746f6d206d6573736167658001b845f8431ca0e8eac6a35bc94226dcaff7f23de1001f24bc8bffd438367464535b1ece503304a0670c0fce60ba46c3eb3a1c64a8ad3ee44c8b59952f02826c663d24ead8ca1867';

        test('should work prepareSignedTx', shouldWorkPrepareSignedTx(txParams, privateKey, validTxHex));
        test('should work prepareTx', shouldWorkPrepareTx(txParams, privateKey, validTxHex));
    });

    describe('buy', () => {
        const txParams = {
            nonce: 11111,
            type: TX_TYPE.BUY,
            data: {
                coinToSell: 'MNT',
                coinToBuy: 'BELTCOIN',
                valueToBuy: 10,
            },
            gasCoin: 'ASD',
            payload: 'custom message',
        };
        const validTxHex = 'f89a822b6701018a4153440000000000000004b0ef8a42454c54434f494e0000888ac7230489e800008a4d4e54000000000000008f01bc16d674ec7ff21f494c589c00008e637573746f6d206d6573736167658001b845f8431ba070f02556e599efa4250926596d2c362146798ecce7be9bfbf9843e32a7dee3baa04064883631f62a241b0f865bc4b1801ef49edc3e07728ecc8b000252c47386f4';

        test('should work prepareSignedTx', shouldWorkPrepareSignedTx(txParams, privateKey, validTxHex));
        test('should work prepareTx', shouldWorkPrepareTx(txParams, privateKey, validTxHex));
    });

    describe('declare candidacy', () => {
        const txParams = {
            nonce: 11111,
            type: TX_TYPE.DECLARE_CANDIDACY,
            data: {
                address: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
                publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
                commission: 10,
                coin: 'MNT',
                stake: 100,
            },
            gasCoin: 'ASD',
            payload: 'custom message',
        };
        const validTxHex = 'f8b9822b6701018a4153440000000000000006b84ef84c947633980c000139dd3bd24a3f54e06474fa941e16a0f9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a30a8a4d4e540000000000000089056bc75e2d631000008e637573746f6d206d6573736167658001b845f8431ba01a827314ffe1cbd635e4b35bf8a9eebb65997a6aa78e9eaae3d75564240dba5fa00f95fa024facb394bcd24db9669a090109755a4e5c9746d09bbc19ea2d77dc58';

        test('should work prepareSignedTx', shouldWorkPrepareSignedTx(txParams, privateKey, validTxHex));
        test('should work prepareTx', shouldWorkPrepareTx(txParams, privateKey, validTxHex));
    });

    describe('edit candidate', () => {
        const txParams = {
            nonce: 11111,
            type: TX_TYPE.EDIT_CANDIDATE,
            data: {
                publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
                rewardAddress: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
                ownerAddress: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
            },
            gasCoin: 'ASD',
            payload: 'custom message',
        };
        const validTxHex = 'f8b8822b6701018a415344000000000000000eb84df84ba0f9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3947633980c000139dd3bd24a3f54e06474fa941e16947633980c000139dd3bd24a3f54e06474fa941e168e637573746f6d206d6573736167658001b845f8431ca0a4f5c2c82dcee4a580878b720cf3ad65d3814d3bb5b738060256f79d262c4d96a01e055a5558331283d6ff3f6978d9442f5ed9ff56adf0d0cf6377e9931c7bbaa3';

        test('should work prepareSignedTx', shouldWorkPrepareSignedTx(txParams, privateKey, validTxHex));
        test('should work prepareTx', shouldWorkPrepareTx(txParams, privateKey, validTxHex));
    });

    describe('delegate', () => {
        const txParams = {
            nonce: 11111,
            type: TX_TYPE.DELEGATE,
            data: {
                publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
                coin: 'MNT',
                stake: 100,
            },
            gasCoin: 'ASD',
            payload: 'custom message',
        };
        const validTxHex = 'f8a1822b6701018a4153440000000000000007b7f6a0f9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a38a4d4e540000000000000089056bc75e2d631000008e637573746f6d206d6573736167658001b845f8431ba079f275969d2c4555543d4eaa8afa5f1373d438669d61bfa271552f0b28d47aada0222bff704019345726bcf902c4a06e20df5629479af2c47fcc2d461dec39c090';

        test('should work prepareSignedTx', shouldWorkPrepareSignedTx(txParams, privateKey, validTxHex));
        test('should work prepareTx', shouldWorkPrepareTx(txParams, privateKey, validTxHex));
    });

    describe('unbond', () => {
        const txParams = {
            nonce: 11111,
            type: TX_TYPE.UNBOND,
            data: {
                publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
                coin: 'MNT',
                stake: 100,
            },
            gasCoin: 'ASD',
            payload: 'custom message',
        };
        const validTxHex = 'f8a1822b6701018a4153440000000000000008b7f6a0f9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a38a4d4e540000000000000089056bc75e2d631000008e637573746f6d206d6573736167658001b845f8431ca027d79af61e30dd3f9d1378609d31256817a37ae12204f2413e63b22ccfec1bb0a050a177f4a4c072fe4cc306c58cbac0dfcbfbb5b713f495b69ce174fad15b8c75';

        test('should work prepareSignedTx', shouldWorkPrepareSignedTx(txParams, privateKey, validTxHex));
        test('should work prepareTx', shouldWorkPrepareTx(txParams, privateKey, validTxHex));
    });

    describe('set candidate on', () => {
        const txParams = {
            nonce: 11111,
            type: TX_TYPE.SET_CANDIDATE_ON,
            data: {
                publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
            },
            gasCoin: 'ASD',
            payload: 'custom message',
        };
        const validTxHex = 'f88c822b6701018a415344000000000000000aa2e1a0f9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a38e637573746f6d206d6573736167658001b845f8431ca00f597bd303a1b6ad8e5d505035e9536dc51a6b55aa3813b167ad92bb4d002f6ea007b4a548888530cb191b1de134517a2b8c19f512a0400730228fb375c0b49ec6';

        test('should work prepareSignedTx', shouldWorkPrepareSignedTx(txParams, privateKey, validTxHex));
        test('should work prepareTx', shouldWorkPrepareTx(txParams, privateKey, validTxHex));
    });

    describe('set candidate off', () => {
        const txParams = {
            nonce: 11111,
            type: TX_TYPE.SET_CANDIDATE_OFF,
            data: {
                publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
            },
            gasCoin: 'ASD',
            payload: 'custom message',
        };
        const validTxHex = 'f88c822b6701018a415344000000000000000ba2e1a0f9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a38e637573746f6d206d6573736167658001b845f8431ca07602995a9de9ac77bbfd343a6613c94ecb0af4d3d607e73c3e40a6f71fd9c19aa062616a584ca08f608cbbec8ddd306894d22867f14d0603301ce8ee0201f68ceb';

        test('should work prepareSignedTx', shouldWorkPrepareSignedTx(txParams, privateKey, validTxHex));
        test('should work prepareTx', shouldWorkPrepareTx(txParams, privateKey, validTxHex));
    });

    describe('create multisig', () => {
        const txParams = {
            nonce: 11111,
            type: TX_TYPE.CREATE_MULTISIG,
            data: {
                addresses: ['Mxee81347211c72524338f9680072af90744333146', 'Mxee81347211c72524338f9680072af90744333145', 'Mxee81347211c72524338f9680072af90744333144'],
                weights: [1, 3, 5],
                threshold: 7,
            },
            gasCoin: 'MNT',
            payload: 'custom message',
        };
        const validTxHex = 'f8b3822b6701018a4d4e54000000000000000cb848f84607c3010305f83f94ee81347211c72524338f9680072af9074433314694ee81347211c72524338f9680072af9074433314594ee81347211c72524338f9680072af907443331448e637573746f6d206d6573736167658001b845f8431ca014b221be0ac40814db342d5ffb9e9fc801ab376ed943a8e70925686a2f0dd66ba02619baf57e442d01623b362fc4aa23e0d3f17eea45c6aa6a0924626627d5a1b9';

        test('should work prepareSignedTx', shouldWorkPrepareSignedTx(txParams, privateKey, validTxHex));
        test('should work prepareTx', shouldWorkPrepareTx(txParams, privateKey, validTxHex));
    });

    describe('multisend', () => {
        const txParams = {
            nonce: 11111,
            type: TX_TYPE.MULTISEND,
            data: {
                list: [
                    {
                        value: 0.1,
                        coin: 'MNT',
                        to: 'Mxfe60014a6e9ac91618f5d1cab3fd58cded61ee99',
                    },
                    {
                        value: 0.2,
                        coin: 'ASD',
                        to: 'Mxddab6281766ad86497741ff91b6b48fe85012e3c',
                    },
                ],
            },
            gasCoin: 'ASD',
            payload: 'custom message',
        };
        const validTxHex = 'f8c3822b6701018a415344000000000000000db858f856f854e98a4d4e540000000000000094fe60014a6e9ac91618f5d1cab3fd58cded61ee9988016345785d8a0000e98a4153440000000000000094ddab6281766ad86497741ff91b6b48fe85012e3c8802c68af0bb1400008e637573746f6d206d6573736167658001b845f8431ca01e5347d20d3c60dcd68d46d665bc69c14e3a8579340a78dbed517c8a5a73bd68a007b4044f6744636a7f09563834acf30f8b68f8cc9aa6f422c74b9bb2d4cfcf5a';

        test('should work prepareSignedTx', shouldWorkPrepareSignedTx(txParams, privateKey, validTxHex));
        test('should work prepareTx', shouldWorkPrepareTx(txParams, privateKey, validTxHex));
    });

    describe('redeem check', () => {
        const txParams = {
            nonce: 1,
            type: TX_TYPE.REDEEM_CHECK,
            data: {
                check: VALID_CHECK,
                password: 'pass',
            },
        };
        const validTxHex = 'f9014f0101018a4d4e540000000000000009b8f4f8f2b8adf8ab3101830f423f8a4d4e5400000000000000888ac7230489e800008a4d4e5400000000000000b841f69950a210196529f47df938f7af84958cdb336daf304616c37ef8bebca324910910f046e2ff999a7f2ab564bd690c1102ab65a20e0f27b57a93854339b60837011ba00a07cbf311148a6b62c1d1b34a5e0c2b6931a0547ede8b9dfb37aedff4480622a023ac93f7173ca41499624f06dfdd58c4e65d1279ea526777c194ddb623d57027b8410497ea588f0fc2bd448de76d03a74cf371269e10ac1a02765fb5fa37c29f67e0348fb3faacd3370b8809401e7d562d8943f3642ce96667188d3c344e8e5bff6d01808001b845f8431ba0ce81610fe58f581c84d744d98ac0fc75eebc1bba515ca2d82eff012feb3c41b2a02824f54d075e8aa789d611b6c14fd99b2b9a19d6437c8e6388ffd1943029cb03';

        test('should work prepareSignedTx', shouldWorkPrepareSignedTx(txParams, privateKey, validTxHex));
        test('should work prepareTx', shouldWorkPrepareTx(txParams, privateKey, validTxHex));

        test('should work with custom gasCoin', () => {
            const tx = prepareSignedTx({
                ...txParams,
                data: {
                    ...txParams.data,
                    // check with TESTCOIN01 gasCoin
                    check: 'Mcf8ab3101830f423f8a4d4e5400000000000000888ac7230489e800008a54455354434f494e3031b84189f86abe44c82ccee1964abcdf8a4aea6f4abffd4c709a3a9157951dfe8ead5805b15cf8359e2c6c5ae842d8e27ee21a46467df01ee1fead399c241682547b0e011ba0d1ca0e59e5d23edf41afa22f5258aeadf80f329d7ce8f32d30034ec614b292dda02f136ee0a48911e2470b170cc2ff3a2362c4c17f69360ada11efecd62f35c595',
                },
            }, {privateKey});

            expect(bufferToCoin(tx.gasCoin)).toEqual('TESTCOIN01');
            expect(tx.serialize().toString('hex'))
                .toEqual('f9014f0101018a54455354434f494e303109b8f4f8f2b8adf8ab3101830f423f8a4d4e5400000000000000888ac7230489e800008a54455354434f494e3031b84189f86abe44c82ccee1964abcdf8a4aea6f4abffd4c709a3a9157951dfe8ead5805b15cf8359e2c6c5ae842d8e27ee21a46467df01ee1fead399c241682547b0e011ba0d1ca0e59e5d23edf41afa22f5258aeadf80f329d7ce8f32d30034ec614b292dda02f136ee0a48911e2470b170cc2ff3a2362c4c17f69360ada11efecd62f35c595b8410497ea588f0fc2bd448de76d03a74cf371269e10ac1a02765fb5fa37c29f67e0348fb3faacd3370b8809401e7d562d8943f3642ce96667188d3c344e8e5bff6d01808001b845f8431ba0b38607701ae1d1081315545fe9f74eee42bd740d446f4ff6ad2342c716e6043fa005372587886f4b7aa4f9d2dc1a7387c63ebb6eea6fdde424016d5e6c8d10c834');
        });
    });
});

function shouldWorkPrepareSignedTx(txParams, privateKey, validTxHex) {
    return function test() {
        const tx = prepareSignedTx(txParams, {privateKey});

        expect(tx.serialize().toString('hex'))
            .toEqual(validTxHex);
    };
}

function shouldWorkPrepareTx(txParams, privateKey, validTxHex) {
    return function test() {
        const tx = prepareTx({...txParams, signatureType: 1}, {privateKey});

        expect(tx.serialize().toString('hex'))
            .toEqual(validTxHex);
    };
}


describe('decodeTx', () => {
    test('should work', () => {
        expect(decodeTx('0xf87e818102018a42414e414e415445535402a3e28a42414e414e41544553548a067d59060c9f4d7282328a4d4e540000000000000080808001b845f8431ca01d568386460de1dd40a7c73084a84be68bbf4696aea0208530d3bae2ccf47e4ba059cb6cbfb12e56d7f5f4f8c367a76a867aff09afca15e8d61a7ef4cf7e0d26be')).toEqual({
            nonce: '129',
            chainId: '2',
            gasPrice: '1',
            gasCoin: 'BANANATEST',
            type: '0x02',
            data:
                { coinToSell: 'BANANATEST',
                    valueToSell: '30646.456735029139767858',
                    coinToBuy: 'MNT',
                    minimumValueToBuy: '0' },
            payload: '',
            signatureType: '1',
            signatureData: '0xf8431ca01d568386460de1dd40a7c73084a84be68bbf4696aea0208530d3bae2ccf47e4ba059cb6cbfb12e56d7f5f4f8c367a76a867aff09afca15e8d61a7ef4cf7e0d26be',
        });
    });

    test('should work decodeCheck', () => {
        expect(decodeTx('f9014f0101018a4d4e540000000000000009b8f4f8f2b8adf8ab3101830f423f8a4d4e5400000000000000888ac7230489e800008a4d4e5400000000000000b841f69950a210196529f47df938f7af84958cdb336daf304616c37ef8bebca324910910f046e2ff999a7f2ab564bd690c1102ab65a20e0f27b57a93854339b60837011ba00a07cbf311148a6b62c1d1b34a5e0c2b6931a0547ede8b9dfb37aedff4480622a023ac93f7173ca41499624f06dfdd58c4e65d1279ea526777c194ddb623d57027b8410497ea588f0fc2bd448de76d03a74cf371269e10ac1a02765fb5fa37c29f67e0348fb3faacd3370b8809401e7d562d8943f3642ce96667188d3c344e8e5bff6d01808001b845f8431ba0ce81610fe58f581c84d744d98ac0fc75eebc1bba515ca2d82eff012feb3c41b2a02824f54d075e8aa789d611b6c14fd99b2b9a19d6437c8e6388ffd1943029cb03', {decodeCheck: true})).toEqual({
            nonce: '1',
            chainId: '1',
            gasPrice: '1',
            gasCoin: 'MNT',
            type: '0x09',
            data: {
                proof: '0x0497ea588f0fc2bd448de76d03a74cf371269e10ac1a02765fb5fa37c29f67e0348fb3faacd3370b8809401e7d562d8943f3642ce96667188d3c344e8e5bff6d01',
                check:
                    'Mcf8ab3101830f423f8a4d4e5400000000000000888ac7230489e800008a4d4e5400000000000000b841f69950a210196529f47df938f7af84958cdb336daf304616c37ef8bebca324910910f046e2ff999a7f2ab564bd690c1102ab65a20e0f27b57a93854339b60837011ba00a07cbf311148a6b62c1d1b34a5e0c2b6931a0547ede8b9dfb37aedff4480622a023ac93f7173ca41499624f06dfdd58c4e65d1279ea526777c194ddb623d57027',
                checkData: {
                    nonce: '1',
                    chainId: '1',
                    coin: 'MNT',
                    value: '10',
                    dueBlock: '999999',
                    gasCoin: 'MNT',
                },
            },
            payload: '',
            signatureType: '1',
            signatureData: '0xf8431ba0ce81610fe58f581c84d744d98ac0fc75eebc1bba515ca2d82eff012feb3c41b2a02824f54d075e8aa789d611b6c14fd99b2b9a19d6437c8e6388ffd1943029cb03',
        });
    });
});
