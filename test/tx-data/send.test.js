import {prepareSignedTx, SendTxData} from '~/src';

describe('SendTxData', () => {
    const txParamsData = {
        to: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        value: '10',
        coin: '0',
    };
    const txData = new SendTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = SendTxData.fromRlp(txData).fields;
        expect(params)
            .toEqual(txParamsData);
    });

    test('should throw on invalid amount', () => {
        expect(() => {
            const data = new SendTxData({
                ...txParamsData,
                value: '123asd',
            });
        }).toThrow();
    });
});
