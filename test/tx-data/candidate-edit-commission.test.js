import {EditCandidateCommissionTxData} from '~/src';

describe('EditCandidateCommissionTxData', () => {
    const txParamsData = {
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        commission: '10',
    };
    const txData = new EditCandidateCommissionTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = EditCandidateCommissionTxData.fromRlp(txData).fields;
        expect(params)
            .toEqual(txParamsData);
    });
});
