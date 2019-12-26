import DeclareCandidacyTxData from '~/src/tx-data/candidacy-declare';
import {clearData} from '~/test/utils';

describe('DeclareCandidacyTxData', () => {
    const txParamsData = {
        address: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        commission: 10,
        coin: 'MNT',
        stake: '100',
    };
    const txData = new DeclareCandidacyTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = DeclareCandidacyTxData.fromRlp(txData).fields;
        expect(params)
            .toEqual(txParamsData);
    });
});
