import {TxDataRedeemCheck} from 'minterjs-tx';
import {prepareLink, decodeLink, SendTxParams, RedeemCheckTxParams} from '~/src';
import getTxData from '~/src/tx-data';

const TX_PARAMS_DATA_SEND = {
    address: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
    amount: 10,
    coinSymbol: 'MNT',
    feeCoinSymbol: 'ASD',
    payload: 'custom message',
};
const LINK_SEND = 'https://bip.to/tx?d=f84801aae98a4d4e5400000000000000947633980c000139dd3bd24a3f54e06474fa941e16888ac7230489e800008e637573746f6d206d65737361676580808a41534400000000000000';
const TX_PARAMS_DATA_CHECK = {
    check: 'Mcf8a002843b9ac9ff8a4d4e5400000000000000888ac7230489e80000b841ed4e21035ad4d56901422c19e7fc867a63dcab709d6d0dcc0b6333cb7365d187519e1291bbc002189e7030dedfbbc4feb733da73f9409de4f01365dd3f5f4927011ca0507210c64b3aeb7c81a2db06204b935814c28482175dee756b1f05414d18e594a06173c7c8ee51ad76e9704a39ffc5c0ab11514d8b68efcbc8df1db194d9e296ee',
    password: '123',
    privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
};
const LINK_CHECK = 'https://bip.to/tx?d=f8f009b8e9f8e7b8a2f8a002843b9ac9ff8a4d4e5400000000000000888ac7230489e80000b841ed4e21035ad4d56901422c19e7fc867a63dcab709d6d0dcc0b6333cb7365d187519e1291bbc002189e7030dedfbbc4feb733da73f9409de4f01365dd3f5f4927011ca0507210c64b3aeb7c81a2db06204b935814c28482175dee756b1f05414d18e594a06173c7c8ee51ad76e9704a39ffc5c0ab11514d8b68efcbc8df1db194d9e296eeb8417adcf6a62a66b177b266c767c5ebd906651fb66269401a8c66d053574dc29c67296b93af2e276fbdf5f606a98419ae69191450f67a2d273ee6c5d3016773c16d0180800180';
const LINK_CHECK_PASSWORD = 'https://bip.to/tx?d=f8ae09b8a7f8a5b8a2f8a002843b9ac9ff8a4d4e5400000000000000888ac7230489e80000b841ed4e21035ad4d56901422c19e7fc867a63dcab709d6d0dcc0b6333cb7365d187519e1291bbc002189e7030dedfbbc4feb733da73f9409de4f01365dd3f5f4927011ca0507210c64b3aeb7c81a2db06204b935814c28482175dee756b1f05414d18e594a06173c7c8ee51ad76e9704a39ffc5c0ab11514d8b68efcbc8df1db194d9e296ee8080800180&p=83313233';


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
        const sendTxParams = new SendTxParams(TX_PARAMS_DATA_SEND);
        sendTxParams.txData = getTxData(sendTxParams.txType).fromRlp(sendTxParams.txData).fields;
        expect(txParams).toEqual(sendTxParams);
    });

    describe('check', () => {
        test('should work with proof', () => {
            const txParams = decodeLink(LINK_CHECK);
            const validTxParams = new RedeemCheckTxParams(TX_PARAMS_DATA_CHECK);
            const txData = getTxData(validTxParams.txType).fromRlp(validTxParams.txData);
            validTxParams.txData = {check: txData.check, proof: txData.proof};
            // clean valid params
            delete validTxParams.privateKey;
            // ensure string payload
            validTxParams.payload = validTxParams.payload || '';
            expect(txParams).toEqual(validTxParams);
        });

        test('should work with password', () => {
            const txParams = decodeLink(LINK_CHECK_PASSWORD, TX_PARAMS_DATA_CHECK.privateKey);
            const validTxParams = new RedeemCheckTxParams(TX_PARAMS_DATA_CHECK);
            const txData = getTxData(validTxParams.txType).fromRlp(validTxParams.txData);
            validTxParams.txData = {check: txData.check, proof: txData.proof};
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
