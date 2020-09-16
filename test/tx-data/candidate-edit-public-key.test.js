import {EditCandidatePublicKeyTxData} from '~/src';

describe('EditCandidateTxData', () => {
    const txParamsData = {
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        newPublicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a4',
    };
    const txData = new EditCandidatePublicKeyTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = EditCandidatePublicKeyTxData.fromRlp(txData).fields;
        expect(params)
            .toEqual(txParamsData);
    });
});
