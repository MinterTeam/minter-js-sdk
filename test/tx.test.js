import {prepareSignedTx, SendTxParams} from '~/src';


describe('prepareSignedTx', () => {
    const privateKey = '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da';
    const txParamsData = {
        privateKey,
        nonce: 1,
        chainId: 1,
        address: 'Mx376615B9A3187747dC7c32e51723515Ee62e37Dc',
        amount: 10,
        coinSymbol: 'MNT',
        gasPrice: 2,
        message: 'custom message',
    };
    const validTxHex = 'f8920101028a4d4e540000000000000001aae98a4d4e540000000000000094376615b9a3187747dc7c32e51723515ee62e37dc888ac7230489e800008e637573746f6d206d6573736167658001b845f8431ba0647b5465b656962e88cec2e1883830b7e231cacea0fd57bdb329650729144147a015b593a0301dfa4cf6ec9357be065221455b279674944bb7534d6ea650eb35c8';

    test('should work', () => {
        const txParams = new SendTxParams(txParamsData);
        const tx = prepareSignedTx(txParams);

        expect(tx.serialize().toString('hex'))
            .toEqual(validTxHex);
    });

    test('default chainId: 1', () => {
        expect(prepareSignedTx({
            ...new SendTxParams(txParamsData),
            chainId: undefined,
        }).serialize()).toEqual(prepareSignedTx({
            ...new SendTxParams(txParamsData),
            chainId: 1,
        }).serialize());
    });

    test('default gasCoin: BIP', () => {
        expect(prepareSignedTx({
            ...new SendTxParams(txParamsData),
            gasCoin: undefined,
        }).serialize()).toEqual(prepareSignedTx({
            ...new SendTxParams(txParamsData),
            gasCoin: 'BIP',
        }).serialize());
    });

    test('default gasPrice: 1', () => {
        expect(prepareSignedTx({
            ...new SendTxParams(txParamsData),
            gasPrice: undefined,
        }).serialize()).toEqual(prepareSignedTx({
            ...new SendTxParams(txParamsData),
            gasPrice: 1,
        }).serialize());
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
