import {VoteUpdateTxData} from '~/src';

describe('VoteUpdateTxData', () => {
    const txParamsData = {
        version: '0.0.1',
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        height: '123456789',
    };
    const txData = new VoteUpdateTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = VoteUpdateTxData.fromRlp(txData).fields;
        expect(params)
            .toEqual(txParamsData);
    });
});
