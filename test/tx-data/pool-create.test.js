import {CreatePoolTxData} from '~/src';

describe('CreatePoolTxData', () => {
    const txParamsData = {
        coin0: '0',
        coin1: '1',
        volume0: '20',
        volume1: '120',
    };
    const txData = new CreatePoolTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = CreatePoolTxData.fromRlp(txData).fields;
        expect(params)
            .toEqual(txParamsData);
    });

    test('independent of coins order', () => {
        const reversedTxData = new CreatePoolTxData({
            coin0: txParamsData.coin1,
            coin1: txParamsData.coin0,
            volume0: txParamsData.volume1,
            volume1: txParamsData.volume0,
        }).serialize();

        expect(txData)
            .toEqual(reversedTxData);
    });
});
