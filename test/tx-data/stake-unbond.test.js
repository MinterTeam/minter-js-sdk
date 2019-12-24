import UnbondTxData from '~/src/tx-data/stake-unbond';
import {clearData} from '~/test/utils';

describe('UnbondTxData', () => {
    const txParamsData = {
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        coin: 'MNT',
        stake: 100,
    };
    const txData = new UnbondTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = clearData(UnbondTxData.fromRlp(txData));
        expect(params)
            .toEqual(clearData(txParamsData));
    });
});
