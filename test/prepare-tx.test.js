import {prepareSignedTx, SendTxParams} from '~/src';


describe('prepareSignedTx', () => {
    const privateKey = '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da';
    const txParamsData = {
        privateKey,
        address: 'Mx376615B9A3187747dC7c32e51723515Ee62e37Dc',
        amount: 10,
        coinSymbol: 'MNT',
        gasPrice: 2,
        message: 'custom message',
    };
    const validTxHex = 'f89101028a4d4e540000000000000001aae98a4d4e540000000000000094376615b9a3187747dc7c32e51723515ee62e37dc888ac7230489e800008e637573746f6d206d6573736167658001b845f8431ba0bcb650859f2c20d67a821c6e0eb4f8eb577b08c95bd2796ff59704bb79e97d75a003bc12bb05d225beca9801e1fa049e30ce17068e2475dcc657af0af84228e683';

    test('should work', () => {
        const txParams = new SendTxParams(txParamsData);
        const tx = prepareSignedTx(txParams);

        expect(tx.serialize().toString('hex'))
            .toEqual(validTxHex);
    });

    test('should throw on invalid amount', () => {
        expect(() => {
            const txParams = new SendTxParams({
                ...txParamsData,
                amount: '123asd',
            });
        }).toThrow();
    });

    test('should throw on invalid gasPrice', () => {
        expect(() => {
            const txParams = new SendTxParams({
                ...txParamsData,
                gasPrice: '123asd',
            });
            prepareSignedTx(txParams);
        }).toThrow();
    });
});
