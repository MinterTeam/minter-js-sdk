import {TxDataRedeemCheck, TX_TYPE} from 'minterjs-tx';
import {toBuffer} from 'minterjs-util';
import {RedeemCheckTxParams} from '~/src';
// import {getProofWithRecovery} from '~/src/tx-params/redeem-check';


describe('RedeemCheckTxParams', () => {
    const privateKey = '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da';
    const check = 'Mcf8ab3101830f423f8a4d4e5400000000000000888ac7230489e800008a4d4e5400000000000000b841f69950a210196529f47df938f7af84958cdb336daf304616c37ef8bebca324910910f046e2ff999a7f2ab564bd690c1102ab65a20e0f27b57a93854339b60837011ba00a07cbf311148a6b62c1d1b34a5e0c2b6931a0547ede8b9dfb37aedff4480622a023ac93f7173ca41499624f06dfdd58c4e65d1279ea526777c194ddb623d57027';
    const validTxParams = {
        privateKey: Buffer.from(privateKey, 'hex'),
        gasPrice: 1,
        gasCoin: 'MNT',
        txType: TX_TYPE.REDEEM_CHECK,
        txData: Buffer.from([248, 242, 184, 173, 248, 171, 49, 1, 131, 15, 66, 63, 138, 77, 78, 84, 0, 0, 0, 0, 0, 0, 0, 136, 138, 199, 35, 4, 137, 232, 0, 0, 138, 77, 78, 84, 0, 0, 0, 0, 0, 0, 0, 184, 65, 246, 153, 80, 162, 16, 25, 101, 41, 244, 125, 249, 56, 247, 175, 132, 149, 140, 219, 51, 109, 175, 48, 70, 22, 195, 126, 248, 190, 188, 163, 36, 145, 9, 16, 240, 70, 226, 255, 153, 154, 127, 42, 181, 100, 189, 105, 12, 17, 2, 171, 101, 162, 14, 15, 39, 181, 122, 147, 133, 67, 57, 182, 8, 55, 1, 27, 160, 10, 7, 203, 243, 17, 20, 138, 107, 98, 193, 209, 179, 74, 94, 12, 43, 105, 49, 160, 84, 126, 222, 139, 157, 251, 55, 174, 223, 244, 72, 6, 34, 160, 35, 172, 147, 247, 23, 60, 164, 20, 153, 98, 79, 6, 223, 221, 88, 196, 230, 93, 18, 121, 234, 82, 103, 119, 193, 148, 221, 182, 35, 213, 112, 39, 184, 65, 122, 220, 246, 166, 42, 102, 177, 119, 178, 102, 199, 103, 197, 235, 217, 6, 101, 31, 182, 98, 105, 64, 26, 140, 102, 208, 83, 87, 77, 194, 156, 103, 41, 107, 147, 175, 46, 39, 111, 189, 245, 246, 6, 169, 132, 25, 174, 105, 25, 20, 80, 246, 122, 45, 39, 62, 230, 197, 211, 1, 103, 115, 193, 109, 1]),
    };

    test('fields', () => {
        const txParams = new RedeemCheckTxParams({
            privateKey,
            check,
            password: '123',
            feeCoinSymbol: 'MNT',
        });

        expect(txParams)
            .toEqual({
                privateKey: Buffer.from(privateKey, 'hex'),
                gasPrice: 1,
                gasCoin: 'MNT',
                txType: TX_TYPE.REDEEM_CHECK,
                txData: (new TxDataRedeemCheck({
                    rawCheck: toBuffer(check),
                    proof: '0x7adcf6a62a66b177b266c767c5ebd906651fb66269401a8c66d053574dc29c67296b93af2e276fbdf5f606a98419ae69191450f67a2d273ee6c5d3016773c16d01',
                })).serialize(),
            });

        expect(txParams)
            .toEqual(validTxParams);
    });

    test('accept only base coin', () => {
        expect(() => {
            /* eslint-disable-next-line no-new */
            new RedeemCheckTxParams({
                privateKey,
                check,
                password: '123',
                feeCoinSymbol: 'ASD',
            });
        }).toThrow();
    });

    test('accept buffer private key', () => {
        expect(new RedeemCheckTxParams({
            privateKey: Buffer.from(privateKey, 'hex'),
            check,
            password: '123',
            feeCoinSymbol: 'MNT',
        })).toEqual(validTxParams);
    });
});

// describe('getProofWithRecovery()', () => {
//     test('should work', () => {
//         const privateKey = Buffer.from('5a34ec45e683c5254f6ef11723b9fd859f14677e04e4a8bb7768409eff12f07d', 'hex');
//         const proof = getProofWithRecovery(privateKey, '123456');
//         expect(proof.toString('hex')).toEqual('7f8b6d3ed18d2fe131bbdc9f9bce3b96724ac354ce2cfb49b4ffc4bd71aabf580a8dfed407a34122e45d290941d855d744a62110fa1c11448078b13d3117bdfc01');
//     });
//     test('should work 123', () => {
//         const privateKey = Buffer.from('5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da', 'hex');
//         const proof = getProofWithRecovery(privateKey, '123');
//         expect(proof.toString('hex')).toEqual('7adcf6a62a66b177b266c767c5ebd906651fb66269401a8c66d053574dc29c67296b93af2e276fbdf5f606a98419ae69191450f67a2d273ee6c5d3016773c16d01');
//     });
// });
