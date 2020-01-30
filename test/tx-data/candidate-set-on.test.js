import {SetCandidateOnTxData} from '~/src';

describe('SetCandidateOnTxData', () => {
    const txParamsData = {
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
    };
    const txData = new SetCandidateOnTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = SetCandidateOnTxData.fromRlp(txData).fields;
        expect(params)
            .toEqual(txParamsData);
    });
});
