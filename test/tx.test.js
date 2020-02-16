import {TX_TYPE} from 'minterjs-tx';
import {prepareSignedTx, decodeTx, SendTxParams, CreateCoinTxParams, SellTxParams, SellAllTxParams, BuyTxParams, DeclareCandidacyTxParams, EditCandidateTxParams, DelegateTxParams, UnbondTxParams, SetCandidateOnTxParams, SetCandidateOffTxParams, CreateMultisigTxParams, MultisendTxParams, RedeemCheckTxParams} from '~/src';
import {VALID_CHECK} from '~/test/check.test.js';


describe('prepareSignedTx', () => {
    const privateKey = '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da';

    describe('send', () => {
        const txParamsData = {
            privateKey,
            nonce: 11111,
            chainId: 1,
            address: 'Mx376615B9A3187747dC7c32e51723515Ee62e37Dc',
            amount: 10,
            coinSymbol: 'MNT',
            gasPrice: 2,
            message: 'custom message',
        };
        const txParamsRaw = {
            privateKey,
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

        test('should work tx params', () => {
            const txParams = new SendTxParams(txParamsData);
            const tx = prepareSignedTx(txParams);

            expect(tx.serialize().toString('hex'))
                .toEqual(validTxHex);
        });

        test('should work', () => {
            const tx = prepareSignedTx(txParamsRaw);

            expect(tx.serialize().toString('hex'))
                .toEqual(validTxHex);
        });

        test('default chainId: 1', () => {
            expect(prepareSignedTx({
                ...new SendTxParams(txParamsData),
                chainId: undefined,
            }).serialize()).toEqual(prepareSignedTx({
                ...new SendTxParams(txParamsData),
                chainId: 1,
            }).serialize());
        });

        test('default gasCoin: BIP', () => {
            expect(prepareSignedTx({
                ...new SendTxParams(txParamsData),
                gasCoin: undefined,
            }).serialize()).toEqual(prepareSignedTx({
                ...new SendTxParams(txParamsData),
                gasCoin: 'BIP',
            }).serialize());
        });

        test('default gasPrice: 1', () => {
            expect(prepareSignedTx({
                ...new SendTxParams(txParamsData),
                gasPrice: undefined,
            }).serialize()).toEqual(prepareSignedTx({
                ...new SendTxParams(txParamsData),
                gasPrice: 1,
            }).serialize());
        });

        test('should throw on invalid amount', () => {
            expect(() => {
                const txParams = new SendTxParams({
                    ...txParamsData,
                    amount: '123asd',
                });
            }).toThrow();
        });

        test('should throw on invalid gasPrice', () => {
            expect(() => {
                const txParams = new SendTxParams({
                    ...txParamsData,
                    gasPrice: '123asd',
                });
                prepareSignedTx(txParams);
            }).toThrow();
        });
    });

    describe('create coin', () => {
        const txParamsData = {
            privateKey,
            nonce: 11111,
            coinName: 'My Coin',
            coinSymbol: 'MYCOIN',
            initialAmount: 5,
            crr: 10,
            initialReserve: 20,
            feeCoinSymbol: 'ASD',
            message: 'custom message',
        };
        const txParamsRaw = {
            privateKey,
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
        const validTxHex = 'f892822b6701018a4153440000000000000005a8e7874d7920436f696e8a4d59434f494e00000000884563918244f400008901158e460913d000000a8e637573746f6d206d6573736167658001b845f8431ca0c37235cf4b9c17843a412ef3b19cfbcf73f19e396290c889fd06d754e5b7ad9ea056538f80ae17f8234ab5239f74f70ebff4651307e16b719694e7d41bfef5a417';

        test('should work tx params', () => {
            const txParams = new CreateCoinTxParams(txParamsData);
            const tx = prepareSignedTx(txParams);

            expect(tx.serialize().toString('hex'))
                .toEqual(validTxHex);
        });

        test('should work', () => {
            const tx = prepareSignedTx(txParamsRaw);

            expect(tx.serialize().toString('hex'))
                .toEqual(validTxHex);
        });
    });

    describe('sell', () => {
        const txParamsData = {
            privateKey,
            nonce: 11111,
            coinFrom: 'MNT',
            coinTo: 'BELTCOIN',
            sellAmount: 10,
            feeCoinSymbol: 'ASD',
            message: 'custom message',
        };
        const txParamsRaw = {
            privateKey,
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

        test('should work tx params', () => {
            const txParams = new SellTxParams(txParamsData);
            const tx = prepareSignedTx(txParams);

            expect(tx.serialize().toString('hex'))
                .toEqual(validTxHex);
        });

        test('should work', () => {
            const tx = prepareSignedTx(txParamsRaw);

            expect(tx.serialize().toString('hex'))
                .toEqual(validTxHex);
        });
    });

    describe('sell all', () => {
        const txParamsData = {
            privateKey,
            nonce: 11111,
            coinFrom: 'MNT',
            coinTo: 'BELTCOIN',
            feeCoinSymbol: 'ASD',
            message: 'custom message',
        };
        const txParamsRaw = {
            privateKey,
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

        test('should work tx params', () => {
            const txParams = new SellAllTxParams(txParamsData);
            const tx = prepareSignedTx(txParams);

            expect(tx.serialize().toString('hex'))
                .toEqual(validTxHex);
        });

        test('should work', () => {
            const tx = prepareSignedTx(txParamsRaw);

            expect(tx.serialize().toString('hex'))
                .toEqual(validTxHex);
        });
    });

    describe('buy', () => {
        const txParamsData = {
            privateKey,
            nonce: 11111,
            coinFrom: 'MNT',
            coinTo: 'BELTCOIN',
            buyAmount: 10,
            feeCoinSymbol: 'ASD',
            message: 'custom message',
        };
        const txParamsRaw = {
            privateKey,
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

        test('should work tx params', () => {
            const txParams = new BuyTxParams(txParamsData);
            const tx = prepareSignedTx(txParams);

            expect(tx.serialize().toString('hex'))
                .toEqual(validTxHex);
        });

        test('should work', () => {
            const tx = prepareSignedTx(txParamsRaw);

            expect(tx.serialize().toString('hex'))
                .toEqual(validTxHex);
        });
    });

    describe('declare candidacy', () => {
        const txParamsData = {
            privateKey,
            nonce: 11111,
            address: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
            publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
            commission: 10,
            coinSymbol: 'MNT',
            stake: 100,
            feeCoinSymbol: 'ASD',
            message: 'custom message',
        };
        const txParamsRaw = {
            privateKey,
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

        test('should work tx params', () => {
            const txParams = new DeclareCandidacyTxParams(txParamsData);
            const tx = prepareSignedTx(txParams);

            expect(tx.serialize().toString('hex'))
                .toEqual(validTxHex);
        });

        test('should work', () => {
            const tx = prepareSignedTx(txParamsRaw);

            expect(tx.serialize().toString('hex'))
                .toEqual(validTxHex);
        });
    });

    describe('edit candidate', () => {
        const txParamsData = {
            privateKey,
            nonce: 11111,
            publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
            rewardAddress: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
            ownerAddress: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
            feeCoinSymbol: 'ASD',
            message: 'custom message',
        };
        const txParamsRaw = {
            privateKey,
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

        test('should work tx params', () => {
            const txParams = new EditCandidateTxParams(txParamsData);
            const tx = prepareSignedTx(txParams);

            expect(tx.serialize().toString('hex'))
                .toEqual(validTxHex);
        });

        test('should work', () => {
            const tx = prepareSignedTx(txParamsRaw);

            expect(tx.serialize().toString('hex'))
                .toEqual(validTxHex);
        });
    });

    describe('delegate', () => {
        const txParamsData = {
            privateKey,
            nonce: 11111,
            publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
            coinSymbol: 'MNT',
            stake: 100,
            feeCoinSymbol: 'ASD',
            message: 'custom message',
        };
        const txParamsRaw = {
            privateKey,
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

        test('should work tx params', () => {
            const txParams = new DelegateTxParams(txParamsData);
            const tx = prepareSignedTx(txParams);

            expect(tx.serialize().toString('hex'))
                .toEqual(validTxHex);
        });

        test('should work', () => {
            const tx = prepareSignedTx(txParamsRaw);

            expect(tx.serialize().toString('hex'))
                .toEqual(validTxHex);
        });
    });

    describe('unbond', () => {
        const txParamsData = {
            privateKey,
            nonce: 11111,
            publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
            coinSymbol: 'MNT',
            stake: 100,
            feeCoinSymbol: 'ASD',
            message: 'custom message',
        };
        const txParamsRaw = {
            privateKey,
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

        test('should work tx params', () => {
            const txParams = new UnbondTxParams(txParamsData);
            const tx = prepareSignedTx(txParams);

            expect(tx.serialize().toString('hex'))
                .toEqual(validTxHex);
        });

        test('should work', () => {
            const tx = prepareSignedTx(txParamsRaw);

            expect(tx.serialize().toString('hex'))
                .toEqual(validTxHex);
        });
    });

    describe('set candidate on', () => {
        const txParamsData = {
            privateKey,
            nonce: 11111,
            publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
            feeCoinSymbol: 'ASD',
            message: 'custom message',
        };
        const txParamsRaw = {
            privateKey,
            nonce: 11111,
            type: TX_TYPE.SET_CANDIDATE_ON,
            data: {
                publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
            },
            gasCoin: 'ASD',
            payload: 'custom message',
        };
        const validTxHex = 'f88c822b6701018a415344000000000000000aa2e1a0f9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a38e637573746f6d206d6573736167658001b845f8431ca00f597bd303a1b6ad8e5d505035e9536dc51a6b55aa3813b167ad92bb4d002f6ea007b4a548888530cb191b1de134517a2b8c19f512a0400730228fb375c0b49ec6';

        test('should work tx params', () => {
            const txParams = new SetCandidateOnTxParams(txParamsData);
            const tx = prepareSignedTx(txParams);

            expect(tx.serialize().toString('hex'))
                .toEqual(validTxHex);
        });

        test('should work', () => {
            const tx = prepareSignedTx(txParamsRaw);

            expect(tx.serialize().toString('hex'))
                .toEqual(validTxHex);
        });
    });

    describe('set candidate off', () => {
        const txParamsData = {
            privateKey,
            nonce: 11111,
            publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
            feeCoinSymbol: 'ASD',
            message: 'custom message',
        };
        const txParamsRaw = {
            privateKey,
            nonce: 11111,
            type: TX_TYPE.SET_CANDIDATE_OFF,
            data: {
                publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
            },
            gasCoin: 'ASD',
            payload: 'custom message',
        };
        const validTxHex = 'f88c822b6701018a415344000000000000000ba2e1a0f9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a38e637573746f6d206d6573736167658001b845f8431ca07602995a9de9ac77bbfd343a6613c94ecb0af4d3d607e73c3e40a6f71fd9c19aa062616a584ca08f608cbbec8ddd306894d22867f14d0603301ce8ee0201f68ceb';

        test('should work tx params', () => {
            const txParams = new SetCandidateOffTxParams(txParamsData);
            const tx = prepareSignedTx(txParams);

            expect(tx.serialize().toString('hex'))
                .toEqual(validTxHex);
        });

        test('should work', () => {
            const tx = prepareSignedTx(txParamsRaw);

            expect(tx.serialize().toString('hex'))
                .toEqual(validTxHex);
        });
    });

    describe('create multisig', () => {
        const txParamsData = {
            privateKey,
            nonce: 11111,
            addresses: ['Mxee81347211c72524338f9680072af90744333146', 'Mxee81347211c72524338f9680072af90744333145', 'Mxee81347211c72524338f9680072af90744333144'],
            weights: [1, 3, 5],
            threshold: 7,
            feeCoinSymbol: 'MNT',
            message: 'custom message',
        };
        const txParamsRaw = {
            privateKey,
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

        test('should work tx params', () => {
            const txParams = new CreateMultisigTxParams(txParamsData);
            const tx = prepareSignedTx(txParams);

            expect(tx.serialize().toString('hex'))
                .toEqual(validTxHex);
        });

        test('should work', () => {
            const tx = prepareSignedTx(txParamsRaw);

            expect(tx.serialize().toString('hex'))
                .toEqual(validTxHex);
        });
    });

    describe('multisend', () => {
        const txParamsData = {
            privateKey,
            nonce: 11111,
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
            feeCoinSymbol: 'ASD',
            message: 'custom message',
        };
        const txParamsRaw = {
            privateKey,
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

        test('should work tx params', () => {
            const txParams = new MultisendTxParams(txParamsData);
            const tx = prepareSignedTx(txParams);

            expect(tx.serialize().toString('hex'))
                .toEqual(validTxHex);
        });

        test('should work', () => {
            const tx = prepareSignedTx(txParamsRaw);

            expect(tx.serialize().toString('hex'))
                .toEqual(validTxHex);
        });
    });

    describe('redeem check', () => {
        const txParamsData = {
            privateKey,
            nonce: 11111,
            check: VALID_CHECK,
            password: '123',
            feeCoinSymbol: 'MNT',
        };
        const txParamsRaw = {
            privateKey,
            nonce: 11111,
            type: TX_TYPE.REDEEM_CHECK,
            data: {
                check: VALID_CHECK,
                password: '123',
            },
            gasCoin: 'MNT',
        };
        const validTxHex = 'f90146822b6701018a4d4e540000000000000009b8e9f8e7b8a2f8a03101830f423f8a4d4e5400000000000000888ac7230489e80000b84149eba2361855724bbd3d20eb97a54ea15ad7dc28c1111b8dcf3bb15db26f874f095803cad9f8fc88b2b4eec9ba706325a7929be31b6ccfef01260791a844cb55011ba06c63ad17bfe07b82be8a0144fd4daf8b4144281fdf88f313205ceacf37fd877fa03c243ad79cab6205f4b753bd402c4cfa5d570888659090b2f923071ac52bdf75b8417adcf6a62a66b177b266c767c5ebd906651fb66269401a8c66d053574dc29c67296b93af2e276fbdf5f606a98419ae69191450f67a2d273ee6c5d3016773c16d01808001b845f8431ca0a8513cffcd642540ccf2f56d76898de62a7f312c41418410ffa77b93a78edd6aa01fc3a03e19a1db7bd8b6c08681632b5373d4d5e38995ae73e0cf9d880bed677e';

        test('should work tx params', () => {
            const txParams = new RedeemCheckTxParams(txParamsData);
            const tx = prepareSignedTx(txParams);

            expect(tx.serialize().toString('hex'))
                .toEqual(validTxHex);
        });

        test('should work', () => {
            const tx = prepareSignedTx(txParamsRaw);

            expect(tx.serialize().toString('hex'))
                .toEqual(validTxHex);
        });
    });
});

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

    test('should work decodeCheckt', () => {
        console.log(decodeTx('f90146822b6701018a4d4e540000000000000009b8e9f8e7b8a2f8a03101830f423f8a4d4e5400000000000000888ac7230489e80000b84149eba2361855724bbd3d20eb97a54ea15ad7dc28c1111b8dcf3bb15db26f874f095803cad9f8fc88b2b4eec9ba706325a7929be31b6ccfef01260791a844cb55011ba06c63ad17bfe07b82be8a0144fd4daf8b4144281fdf88f313205ceacf37fd877fa03c243ad79cab6205f4b753bd402c4cfa5d570888659090b2f923071ac52bdf75b8417adcf6a62a66b177b266c767c5ebd906651fb66269401a8c66d053574dc29c67296b93af2e276fbdf5f606a98419ae69191450f67a2d273ee6c5d3016773c16d01808001b845f8431ca0a8513cffcd642540ccf2f56d76898de62a7f312c41418410ffa77b93a78edd6aa01fc3a03e19a1db7bd8b6c08681632b5373d4d5e38995ae73e0cf9d880bed677e', {decodeCheck: true}));

        expect(decodeTx('f90146822b6701018a4d4e540000000000000009b8e9f8e7b8a2f8a03101830f423f8a4d4e5400000000000000888ac7230489e80000b84149eba2361855724bbd3d20eb97a54ea15ad7dc28c1111b8dcf3bb15db26f874f095803cad9f8fc88b2b4eec9ba706325a7929be31b6ccfef01260791a844cb55011ba06c63ad17bfe07b82be8a0144fd4daf8b4144281fdf88f313205ceacf37fd877fa03c243ad79cab6205f4b753bd402c4cfa5d570888659090b2f923071ac52bdf75b8417adcf6a62a66b177b266c767c5ebd906651fb66269401a8c66d053574dc29c67296b93af2e276fbdf5f606a98419ae69191450f67a2d273ee6c5d3016773c16d01808001b845f8431ca0a8513cffcd642540ccf2f56d76898de62a7f312c41418410ffa77b93a78edd6aa01fc3a03e19a1db7bd8b6c08681632b5373d4d5e38995ae73e0cf9d880bed677e', {decodeCheck: true})).toEqual({
            nonce: '11111',
            chainId: '1',
            gasPrice: '1',
            gasCoin: 'MNT',
            type: '0x09',
            data: {
                proof: '0x7adcf6a62a66b177b266c767c5ebd906651fb66269401a8c66d053574dc29c67296b93af2e276fbdf5f606a98419ae69191450f67a2d273ee6c5d3016773c16d01',
                check:
                    'Mcf8a03101830f423f8a4d4e5400000000000000888ac7230489e80000b84149eba2361855724bbd3d20eb97a54ea15ad7dc28c1111b8dcf3bb15db26f874f095803cad9f8fc88b2b4eec9ba706325a7929be31b6ccfef01260791a844cb55011ba06c63ad17bfe07b82be8a0144fd4daf8b4144281fdf88f313205ceacf37fd877fa03c243ad79cab6205f4b753bd402c4cfa5d570888659090b2f923071ac52bdf75',
                checkData: {
                    nonce: '1',
                    chainId: '1',
                    coin: 'MNT',
                    value: '10',
                    dueBlock: '999999',
                },
            },
            payload: '',
            signatureType: '1',
            signatureData: '0xf8431ca0a8513cffcd642540ccf2f56d76898de62a7f312c41418410ffa77b93a78edd6aa01fc3a03e19a1db7bd8b6c08681632b5373d4d5e38995ae73e0cf9d880bed677e',
        });
    });
});
