import SetCandidateOffTxData from '~/src/tx-data/candidate-set-off';
import {clearData} from '~/test/utils';

describe('SetCandidateOffTxData', () => {
    const txParamsData = {
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
    };
    const txData = new SetCandidateOffTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = clearData(SetCandidateOffTxData.fromRlp(txData));
        expect(params)
            .toEqual(clearData(txParamsData));
    });
});
