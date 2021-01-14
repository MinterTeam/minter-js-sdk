import {MoveStakeTxData} from '~/src';

describe('MoveStakeTxData', () => {
    const txParamsData = {
        from: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        to: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a4',
        coin: '0',
        stake: '100',
    };
    const txData = new MoveStakeTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = MoveStakeTxData.fromRlp(txData).fields;
        expect(params)
            .toEqual(txParamsData);
    });
});
