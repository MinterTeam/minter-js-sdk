import {EditCandidateTxData} from '~/src';
import {clearData} from '~/test/utils';

describe('EditCandidateTxData', () => {
    const txParamsData = {
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        rewardAddress: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        ownerAddress: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
    };
    const txData = new EditCandidateTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = clearData(EditCandidateTxData.fromRlp(txData));
        expect(params)
            .toEqual(clearData(txParamsData));
    });
});
