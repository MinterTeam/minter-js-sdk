import {TX_TYPE} from 'minterjs-util';
import {MultisendTxParams} from '~/src';


describe('MultisendTxParams', () => {
    const privateKey = '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da';
    const txParamsData = {
        privateKey,
        list: [
            {
                value: 0.1,
                coin: 'MNT',
                to: 'Mxfe60014a6e9ac91618f5d1cab3fd58cded61ee99',
            },
            {
                value: 0.2,
                coin: 'MNT',
                to: 'Mxddab6281766ad86497741ff91b6b48fe85012e3c',
            },
        ],
        feeCoinSymbol: 'ASD',
        payload: 'custom message',
    };
    const validTxParams = {
        privateKey,
        gasCoin: 'ASD',
        payload: 'custom message',
        txType: TX_TYPE.MULTISEND,
        txData: Buffer.from('f856f854e98a4d4e540000000000000094fe60014a6e9ac91618f5d1cab3fd58cded61ee9988016345785d8a0000e98a4d4e540000000000000094ddab6281766ad86497741ff91b6b48fe85012e3c8802c68af0bb140000', 'hex'),
    };

    test('fields', () => {
        const txParams = new MultisendTxParams(txParamsData);

        expect(txParams)
            .toEqual(validTxParams);
    });
});
