import {LockStakeTxData} from '~/src';

describe('LockStakeTxData', () => {
    const txParamsData = {
    };
    const txData = new LockStakeTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = LockStakeTxData.fromRlp(txData).fields;
        expect(params)
            .toEqual(txParamsData);
    });
});
