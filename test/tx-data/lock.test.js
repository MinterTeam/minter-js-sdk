import {LockTxData} from '~/src';

describe('LockTxData', () => {
    const txParamsData = {
        dueBlock: '123',
        value: '10',
        coin: '0',
    };
    const txData = new LockTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = LockTxData.fromRlp(txData).fields;
        expect(params)
            .toEqual(txParamsData);
    });

    test('should throw on invalid amount', () => {
        expect(() => {
            const data = new LockTxData({
                ...txParamsData,
                value: '123asd',
            });
        }).toThrow();
    });
});
