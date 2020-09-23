import {EditMultisigTxData} from '~/src';

describe('EditMultisigTxData', () => {
    const txParamsData = {
        addresses: ['Mxee81347211c72524338f9680072af90744333144', 'Mxee81347211c72524338f9680072af90744333145', 'Mxee81347211c72524338f9680072af90744333146'],
        weights: ['5', '3', '1'],
        threshold: '7',
    };
    const txData = new EditMultisigTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = EditMultisigTxData.fromRlp(txData).fields;
        expect(params)
            .toEqual(txParamsData);
    });

    test('is sorted', () => {
        const data1 = new EditMultisigTxData({
            addresses: ['Mx1111111111111111111111111111111111111111', 'Mx2222222222222222222222222222222222222222'],
            weights: ['1', '3'],
            threshold: '7',
        }).serializeToString();
        const data2 = new EditMultisigTxData({
            addresses: ['Mx2222222222222222222222222222222222222222', 'Mx1111111111111111111111111111111111111111'],
            weights: ['3', '1'],
            threshold: '7',
        }).serializeToString();

        expect(data1).toEqual(data2);
    });
});
