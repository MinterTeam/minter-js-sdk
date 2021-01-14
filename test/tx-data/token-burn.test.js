import {BurnTokenTxData} from '~/src';

describe('BurnTokenTxData', () => {
    const txParamsData = {
        value: '10',
        coin: '0',
    };
    const txData = new BurnTokenTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = BurnTokenTxData.fromRlp(txData).fields;
        expect(params)
            .toEqual(txParamsData);
    });

    test('should throw on invalid amount', () => {
        expect(() => {
            const data = new BurnTokenTxData({
                ...txParamsData,
                value: '123asd',
            });
        }).toThrow();
    });
});
