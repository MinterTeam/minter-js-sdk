import {Buffer} from 'safe-buffer';
import RedeemCheckTxData from 'minterjs-tx/src/tx-data/redeem-check';
import {TX_TYPE_REDEEM_CHECK} from 'minterjs-tx/src/tx-types';
import {toBuffer} from 'minterjs-util';
import {RedeemCheckTxParams} from '~/src';
import {getProofWithRecovery} from '~/src/tx-params/redeem-check';


describe('RedeemCheckTxParams', () => {
    const privateKey = '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da';
    const check = 'Mcf8a002843b9ac9ff8a4d4e5400000000000000888ac7230489e80000b841ed4e21035ad4d56901422c19e7fc867a63dcab709d6d0dcc0b6333cb7365d187519e1291bbc002189e7030dedfbbc4feb733da73f9409de4f01365dd3f5f4927011ca0507210c64b3aeb7c81a2db06204b935814c28482175dee756b1f05414d18e594a06173c7c8ee51ad76e9704a39ffc5c0ab11514d8b68efcbc8df1db194d9e296ee';
    const validTxParams = {
        privateKey: Buffer.from(privateKey, 'hex'),
        gasCoin: 'MNT',
        txType: TX_TYPE_REDEEM_CHECK,
        txData: Buffer.from([248, 231, 184, 162, 248, 160, 2, 132, 59, 154, 201, 255, 138, 77, 78, 84, 0, 0, 0, 0, 0, 0, 0, 136, 138, 199, 35, 4, 137, 232, 0, 0, 184, 65, 237, 78, 33, 3, 90, 212, 213, 105, 1, 66, 44, 25, 231, 252, 134, 122, 99, 220, 171, 112, 157, 109, 13, 204, 11, 99, 51, 203, 115, 101, 209, 135, 81, 158, 18, 145, 187, 192, 2, 24, 158, 112, 48, 222, 223, 187, 196, 254, 183, 51, 218, 115, 249, 64, 157, 228, 240, 19, 101, 221, 63, 95, 73, 39, 1, 28, 160, 80, 114, 16, 198, 75, 58, 235, 124, 129, 162, 219, 6, 32, 75, 147, 88, 20, 194, 132, 130, 23, 93, 238, 117, 107, 31, 5, 65, 77, 24, 229, 148, 160, 97, 115, 199, 200, 238, 81, 173, 118, 233, 112, 74, 57, 255, 197, 192, 171, 17, 81, 77, 139, 104, 239, 203, 200, 223, 29, 177, 148, 217, 226, 150, 238, 184, 65, 122, 220, 246, 166, 42, 102, 177, 119, 178, 102, 199, 103, 197, 235, 217, 6, 101, 31, 182, 98, 105, 64, 26, 140, 102, 208, 83, 87, 77, 194, 156, 103, 41, 107, 147, 175, 46, 39, 111, 189, 245, 246, 6, 169, 132, 25, 174, 105, 25, 20, 80, 246, 122, 45, 39, 62, 230, 197, 211, 1, 103, 115, 193, 109, 1]),
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
                gasCoin: 'MNT',
                txType: TX_TYPE_REDEEM_CHECK,
                txData: (new RedeemCheckTxData({
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

describe('getProofWithRecovery()', () => {
    test('should work', () => {
        const privateKey = Buffer.from('5a34ec45e683c5254f6ef11723b9fd859f14677e04e4a8bb7768409eff12f07d', 'hex');
        const proof = getProofWithRecovery(privateKey, '123456');
        expect(proof.toString('hex')).toEqual('7f8b6d3ed18d2fe131bbdc9f9bce3b96724ac354ce2cfb49b4ffc4bd71aabf580a8dfed407a34122e45d290941d855d744a62110fa1c11448078b13d3117bdfc01');
    });
    test('should work', () => {
        const privateKey = Buffer.from('5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da', 'hex');
        const proof = getProofWithRecovery(privateKey, '123');
        expect(proof.toString('hex')).toEqual('7adcf6a62a66b177b266c767c5ebd906651fb66269401a8c66d053574dc29c67296b93af2e276fbdf5f606a98419ae69191450f67a2d273ee6c5d3016773c16d01');
    });
});
