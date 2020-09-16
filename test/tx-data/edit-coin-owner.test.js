import {EditCoinOwnerTxData} from '~/src';

describe('RecreateCoinTxData', () => {
    const txParamsData = {
        symbol: 'MYCOIN',
        newOwner: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',

    };
    const txData = new EditCoinOwnerTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = EditCoinOwnerTxData.fromRlp(txData).fields;
        expect(params)
            .toEqual(txParamsData);
    });
});
