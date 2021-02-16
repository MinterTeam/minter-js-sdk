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

    test('same as minterjs-tx', () => {
        expect(new EditMultisigTxData({
            addresses: ['Mxee81347211c72524338f9680072af90744333144', 'Mxee81347211c72524338f9680072af90744333145', 'Mxee81347211c72524338f9680072af90744333146'],
            weights: [5, 3, 1],
            threshold: 1023,
        }).serialize())
            .toEqual(Buffer.from([248, 72, 130, 3, 255, 195, 5, 3, 1, 248, 63, 148, 238, 129, 52, 114, 17, 199, 37, 36, 51, 143, 150, 128, 7, 42, 249, 7, 68, 51, 49, 68, 148, 238, 129, 52, 114, 17, 199, 37, 36, 51, 143, 150, 128, 7, 42, 249, 7, 68, 51, 49, 69, 148, 238, 129, 52, 114, 17, 199, 37, 36, 51, 143, 150, 128, 7, 42, 249, 7, 68, 51, 49, 70]));
    });
});
