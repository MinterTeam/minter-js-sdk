import {CreateMultisigTxData} from '~/src';
import {clearData} from '~/test/utils';

describe('CreateMultisigTxData', () => {
    const txParamsData = {
        addresses: ['Mxee81347211c72524338f9680072af90744333146', 'Mxee81347211c72524338f9680072af90744333145', 'Mxee81347211c72524338f9680072af90744333144'],
        weights: [1, 3, 5],
        threshold: 7,
    };
    const txData = new CreateMultisigTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = clearData(CreateMultisigTxData.fromRlp(txData));
        expect(params)
            .toEqual(clearData(txParamsData));
    });
});
