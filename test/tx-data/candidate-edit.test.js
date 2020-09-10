import {EditCandidateTxData} from '~/src';

describe('EditCandidateTxData', () => {
    const txParamsData = {
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        newPublicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        rewardAddress: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        ownerAddress: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        controlAddress: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
    };
    const txData = new EditCandidateTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = EditCandidateTxData.fromRlp(txData).fields;
        expect(params)
            .toEqual(txParamsData);
    });
});
