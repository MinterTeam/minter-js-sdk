import {TX_TYPE} from 'minterjs-tx';
import {CreateMultisigTxParams} from '~/src';


describe('CreateMultisigTxParams', () => {
    const privateKey = '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da';
    const validTxParams = {
        privateKey,
        gasCoin: 'MNT',
        message: 'custom message',
        txType: TX_TYPE.CREATE_MULTISIG,
        txData: Buffer.from([248, 70, 7, 195, 1, 3, 5, 248, 63, 148, 238, 129, 52, 114, 17, 199, 37, 36, 51, 143, 150, 128, 7, 42, 249, 7, 68, 51, 49, 70, 148, 238, 129, 52, 114, 17, 199, 37, 36, 51, 143, 150, 128, 7, 42, 249, 7, 68, 51, 49, 69, 148, 238, 129, 52, 114, 17, 199, 37, 36, 51, 143, 150, 128, 7, 42, 249, 7, 68, 51, 49, 68]),
    };

    const txParamsData = {
        privateKey,
        addresses: ['Mxee81347211c72524338f9680072af90744333146', 'Mxee81347211c72524338f9680072af90744333145', 'Mxee81347211c72524338f9680072af90744333144'],
        weights: [1, 3, 5],
        threshold: 7,
        feeCoinSymbol: 'MNT',
        message: 'custom message',
    };

    test('fields', () => {
        const txParams = new CreateMultisigTxParams(txParamsData);

        expect(txParams)
            .toEqual(validTxParams);
    });

    test('should throw on negative weight', () => {
        expect(() => new CreateMultisigTxParams({
            ...txParamsData,
            weights: [-1, 3, 5],
        }))
            .toThrow();
    });

    test('should throw on too large weight', () => {
        expect(() => new CreateMultisigTxParams({
            ...txParamsData,
            weights: [1024, 3, 5],
        }))
            .toThrow();
    });

    test('should throw on too large addresses count', () => {
        expect(() => new CreateMultisigTxParams({
            ...txParamsData,
            addresses: new Array(33),
        }))
            .toThrow();
    });

    test('should throw on weights count differ from addresses count', () => {
        expect(() => new CreateMultisigTxParams({
            ...txParamsData,
            weights: [3, 5],
        }))
            .toThrow();
    });
});
