import {MintTokenTxData} from '~/src';

describe('MintTokenTxData', () => {
    const txParamsData = {
        value: '10',
        coin: '0',
    };
    const txData = new MintTokenTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = MintTokenTxData.fromRlp(txData).fields;
        expect(params)
            .toEqual(txParamsData);
    });

    test('should throw on invalid amount', () => {
        expect(() => {
            const data = new MintTokenTxData({
                ...txParamsData,
                value: '123asd',
            });
        }).toThrow();
    });
});
