import {TxDataRedeemCheck} from 'minterjs-tx';
import {prepareLink, decodeLink, SendTxParams, RedeemCheckTxParams} from '~/src';

const TX_PARAMS_DATA_SEND = {
    address: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
    amount: 10,
    coinSymbol: 'MNT',
    feeCoinSymbol: 'ASD',
    payload: 'custom message',
};
const LINK_SEND = 'https://bip.to/tx?d=f84801aae98a4d4e5400000000000000947633980c000139dd3bd24a3f54e06474fa941e16888ac7230489e800008e637573746f6d206d65737361676580808a41534400000000000000';
const TX_PARAMS_DATA_CHECK = {
    check: 'Mcf8ab3101830f423f8a4d4e5400000000000000888ac7230489e800008a4d4e5400000000000000b841f69950a210196529f47df938f7af84958cdb336daf304616c37ef8bebca324910910f046e2ff999a7f2ab564bd690c1102ab65a20e0f27b57a93854339b60837011ba00a07cbf311148a6b62c1d1b34a5e0c2b6931a0547ede8b9dfb37aedff4480622a023ac93f7173ca41499624f06dfdd58c4e65d1279ea526777c194ddb623d57027',
    password: '123',
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
};
const LINK_CHECK = 'https://bip.to/tx?d=f9010509b8f4f8f2b8adf8ab3101830f423f8a4d4e5400000000000000888ac7230489e800008a4d4e5400000000000000b841f69950a210196529f47df938f7af84958cdb336daf304616c37ef8bebca324910910f046e2ff999a7f2ab564bd690c1102ab65a20e0f27b57a93854339b60837011ba00a07cbf311148a6b62c1d1b34a5e0c2b6931a0547ede8b9dfb37aedff4480622a023ac93f7173ca41499624f06dfdd58c4e65d1279ea526777c194ddb623d57027b8417adcf6a62a66b177b266c767c5ebd906651fb66269401a8c66d053574dc29c67296b93af2e276fbdf5f606a98419ae69191450f67a2d273ee6c5d3016773c16d018080018a4d4e5400000000000000';
const LINK_CHECK_PASSWORD = 'https://bip.to/tx?d=f8c309b8b2f8b0b8adf8ab3101830f423f8a4d4e5400000000000000888ac7230489e800008a4d4e5400000000000000b841f69950a210196529f47df938f7af84958cdb336daf304616c37ef8bebca324910910f046e2ff999a7f2ab564bd690c1102ab65a20e0f27b57a93854339b60837011ba00a07cbf311148a6b62c1d1b34a5e0c2b6931a0547ede8b9dfb37aedff4480622a023ac93f7173ca41499624f06dfdd58c4e65d1279ea526777c194ddb623d57027808080018a4d4e5400000000000000&p=83313233';


describe('prepareLink()', () => {
    test('should work', () => {
        const link = prepareLink(new SendTxParams(TX_PARAMS_DATA_SEND));
        expect(link).toEqual(LINK_SEND);
    });

    describe('check', () => {
        test('should work with proof', () => {
            const redeemCheckTxParams = new RedeemCheckTxParams(TX_PARAMS_DATA_CHECK);
            const link = prepareLink(redeemCheckTxParams);
            expect(link).toEqual(LINK_CHECK);
        });

        test('should work with password', () => {
            const redeemCheckTxParams = new RedeemCheckTxParams(TX_PARAMS_DATA_CHECK);
            const redeemCheckTxParamsWithoutProof = removeProofFromData(redeemCheckTxParams);
            const link = prepareLink({
                ...redeemCheckTxParamsWithoutProof,
                password: '123',
            });
            expect(link).toEqual(LINK_CHECK_PASSWORD);
        });
    });
});

function removeProofFromData(txParams) {
    const redeemCheckTxData = new TxDataRedeemCheck(txParams.txData);
    // delete proof from data
    redeemCheckTxData.proof = Buffer.from([]);

    return {
        ...txParams,
        txData: redeemCheckTxData.serialize(),
    };
}


describe('decodeLink()', () => {
    test('should work', () => {
        const txParams = decodeLink(LINK_SEND);
        console.log(txParams);
        expect(txParams).toEqual(new SendTxParams(TX_PARAMS_DATA_SEND));
    });

    describe('check', () => {
        test('should work with proof', () => {
            const txParams = decodeLink(LINK_CHECK);
            const validTxParams = new RedeemCheckTxParams(TX_PARAMS_DATA_CHECK);
            // clean valid params
            delete validTxParams.privateKey;
            // ensure string payload
            validTxParams.payload = validTxParams.payload || '';
            expect(txParams).toEqual(validTxParams);
        });

        test('should work with password', () => {
            const txParams = decodeLink(LINK_CHECK_PASSWORD, TX_PARAMS_DATA_CHECK.privateKey);
            const validTxParams = new RedeemCheckTxParams(TX_PARAMS_DATA_CHECK);
            // ensure string private key
            validTxParams.privateKey = validTxParams.privateKey.toString('hex');
            // ensure string payload
            validTxParams.payload = validTxParams.payload || '';
            expect(txParams).toEqual(validTxParams);
        });

        test('should throw on password without private key', () => {
            expect(() => decodeLink(LINK_CHECK_PASSWORD)).toThrow();
        });
    });
});
