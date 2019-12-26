import UnbondTxData from '~/src/tx-data/stake-unbond';

describe('UnbondTxData', () => {
    const txParamsData = {
        publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
        coin: 'MNT',
        stake: '100',
    };
    const txData = new UnbondTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = UnbondTxData.fromRlp(txData).fields;
        expect(params)
            .toEqual(txParamsData);
    });
});
