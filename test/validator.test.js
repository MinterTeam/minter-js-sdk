import {Buffer} from 'safe-buffer';
import {TX_TYPE_DECLARE_CANDIDACY, TX_TYPE_DELEGATE, TX_TYPE_UNBOND, TX_TYPE_SET_CANDIDATE_ON, TX_TYPE_SET_CANDIDATE_OFF} from 'minterjs-tx/src/tx-types';
import {DeclareCandidacyTxParams, DelegateTxParams, UnbondTxParams, SetCandidateOnTxParams, SetCandidateOffTxParams} from '~/src/validator';


describe('DeclareCandidacyTxParams', () => {
    const privateKey = '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da';
    const txParamsData = {
        privateKey,
        address: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        commission: 10,
        coinSymbol: 'MNT',
        stake: 100,
        feeCoinSymbol: 'ASD',
        message: 'custom message',
    };
    const validTxParams = {
        privateKey,
        gasCoin: 'ASD',
        message: 'custom message',
        txType: TX_TYPE_DECLARE_CANDIDACY,
        txData: Buffer.from([248, 76, 148, 118, 51, 152, 12, 0, 1, 57, 221, 59, 210, 74, 63, 84, 224, 100, 116, 250, 148, 30, 22, 160, 249, 224, 54, 131, 154, 41, 247, 251, 162, 213, 57, 75, 212, 137, 237, 169, 39, 204, 185, 90, 204, 153, 229, 6, 230, 136, 228, 136, 128, 130, 179, 163, 10, 138, 77, 78, 84, 0, 0, 0, 0, 0, 0, 0, 137, 5, 107, 199, 94, 45, 99, 16, 0, 0]),
    };

    test('fields', () => {
        const txParams = new DeclareCandidacyTxParams(txParamsData);

        expect(txParams)
            .toEqual(validTxParams);
    });

    test('default gasCoin', () => {
        const txParams = new DeclareCandidacyTxParams({
            ...txParamsData,
            feeCoinSymbol: undefined,
        });

        expect(txParams)
            .toEqual({
                ...validTxParams,
                gasCoin: txParamsData.coinSymbol,
            });
    });
});

describe('DelegateTxParams', () => {
    const privateKey = '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da';
    const txParamsData = {
        privateKey,
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        coinSymbol: 'MNT',
        stake: 100,
        feeCoinSymbol: 'ASD',
        message: 'custom message',
    };
    const validTxParams = {
        privateKey,
        gasCoin: 'ASD',
        message: 'custom message',
        txType: TX_TYPE_DELEGATE,
        txData: Buffer.from([246, 160, 249, 224, 54, 131, 154, 41, 247, 251, 162, 213, 57, 75, 212, 137, 237, 169, 39, 204, 185, 90, 204, 153, 229, 6, 230, 136, 228, 136, 128, 130, 179, 163, 138, 77, 78, 84, 0, 0, 0, 0, 0, 0, 0, 137, 5, 107, 199, 94, 45, 99, 16, 0, 0]),
    };

    test('fields', () => {
        const txParams = new DelegateTxParams(txParamsData);

        expect(txParams)
            .toEqual(validTxParams);
    });

    test('default gasCoin', () => {
        const txParams = new DelegateTxParams({
            ...txParamsData,
            feeCoinSymbol: undefined,
        });

        expect(txParams)
            .toEqual({
                ...validTxParams,
                gasCoin: txParamsData.coinSymbol,
            });
    });
});

describe('UnbondTxParams', () => {
    const privateKey = '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da';
    const txParamsData = {
        privateKey,
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        coinSymbol: 'MNT',
        stake: 100,
        feeCoinSymbol: 'ASD',
        message: 'custom message',
    };
    const validTxParams = {
        privateKey,
        gasCoin: 'ASD',
        message: 'custom message',
        txType: TX_TYPE_UNBOND,
        txData: Buffer.from([246, 160, 249, 224, 54, 131, 154, 41, 247, 251, 162, 213, 57, 75, 212, 137, 237, 169, 39, 204, 185, 90, 204, 153, 229, 6, 230, 136, 228, 136, 128, 130, 179, 163, 138, 77, 78, 84, 0, 0, 0, 0, 0, 0, 0, 137, 5, 107, 199, 94, 45, 99, 16, 0, 0]),
    };

    test('fields', () => {
        const txParams = new UnbondTxParams(txParamsData);

        expect(txParams)
            .toEqual(validTxParams);
    });

    test('default gasCoin', () => {
        const txParams = new UnbondTxParams({
            ...txParamsData,
            feeCoinSymbol: undefined,
        });

        expect(txParams)
            .toEqual({
                ...validTxParams,
                gasCoin: txParamsData.coinSymbol,
            });
    });
});

describe('SetCandidateOnTxParams', () => {
    const privateKey = '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da';
    const txParamsData = {
        privateKey,
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        feeCoinSymbol: 'ASD',
        message: 'custom message',
    };
    const validTxParams = {
        privateKey,
        gasCoin: 'ASD',
        message: 'custom message',
        txType: TX_TYPE_SET_CANDIDATE_ON,
        txData: Buffer.from([225, 160, 249, 224, 54, 131, 154, 41, 247, 251, 162, 213, 57, 75, 212, 137, 237, 169, 39, 204, 185, 90, 204, 153, 229, 6, 230, 136, 228, 136, 128, 130, 179, 163]),
    };

    test('fields', () => {
        const txParams = new SetCandidateOnTxParams(txParamsData);

        expect(txParams)
            .toEqual(validTxParams);
    });

    test('default gasCoin', () => {
        const txParams = new SetCandidateOnTxParams({
            ...txParamsData,
            feeCoinSymbol: undefined,
        });

        expect(txParams)
            .toEqual({
                ...validTxParams,
                gasCoin: txParamsData.coinSymbol,
            });
    });
});

describe('SetCandidateOffTxParams', () => {
    const privateKey = '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da';
    const txParamsData = {
        privateKey,
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        feeCoinSymbol: 'ASD',
        message: 'custom message',
    };
    const validTxParams = {
        privateKey,
        gasCoin: 'ASD',
        message: 'custom message',
        txType: TX_TYPE_SET_CANDIDATE_OFF,
        txData: Buffer.from([225, 160, 249, 224, 54, 131, 154, 41, 247, 251, 162, 213, 57, 75, 212, 137, 237, 169, 39, 204, 185, 90, 204, 153, 229, 6, 230, 136, 228, 136, 128, 130, 179, 163]),
    };

    test('fields', () => {
        const txParams = new SetCandidateOffTxParams(txParamsData);

        expect(txParams)
            .toEqual(validTxParams);
    });

    test('default gasCoin', () => {
        const txParams = new SetCandidateOffTxParams({
            ...txParamsData,
            feeCoinSymbol: undefined,
        });

        expect(txParams)
            .toEqual({
                ...validTxParams,
                gasCoin: txParamsData.coinSymbol,
            });
    });
});
