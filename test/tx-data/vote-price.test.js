import {PriceVoteTxData} from '~/src';

describe('PriceVoteTxData', () => {
    const txParamsData = {
        price: '123456789',
    };
    const txData = new PriceVoteTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = PriceVoteTxData.fromRlp(txData).fields;
        expect(params)
            .toEqual(txParamsData);
    });
});
