import {SetHaltBlockTxData} from '~/src';

describe('VoteHaltBlockTxData', () => {
    const txParamsData = {
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        height: '123456789',
    };
    const txData = new SetHaltBlockTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = SetHaltBlockTxData.fromRlp(txData).fields;
        expect(params)
            .toEqual(txParamsData);
    });
});
