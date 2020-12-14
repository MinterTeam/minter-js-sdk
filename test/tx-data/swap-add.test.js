import {AddSwapPoolTxData} from '~/src';

describe('AddSwapPoolTxData', () => {
    const txParamsData = {
        coin0: '0',
        coin1: '1',
        volume0: '20',
    };
    const txData = new AddSwapPoolTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = AddSwapPoolTxData.fromRlp(txData).fields;
        delete params.maximumVolume1;
        expect(params)
            .toEqual(txParamsData);
    });
});
