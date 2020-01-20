import {TX_TYPE} from 'minterjs-tx';
import {prepareLink, decodeLink} from '~/src';
import RedeemCheckTxData from '~/src/tx-data/redeem-check';

const TX_PARAMS_SEND = {
    type: TX_TYPE.SEND,
    data: {
        coin: 'MNT',
        to: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        value: '10',
    },
    gasCoin: 'ASD',
    payload: 'custom message',
};
const LINK_SEND = 'https://bip.to/tx?d=f84801aae98a4d4e5400000000000000947633980c000139dd3bd24a3f54e06474fa941e16888ac7230489e800008e637573746f6d206d65737361676580808a41534400000000000000';

const TX_PARAMS_MULTISEND = {
    type: TX_TYPE.MULTISEND,
    data: {
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
    },
};
const LINK_MULTISEND = 'https://bip.to/tx?d=f85f0db858f856f854e98a4d4e540000000000000094fe60014a6e9ac91618f5d1cab3fd58cded61ee9988016345785d8a0000e98a4d4e540000000000000094ddab6281766ad86497741ff91b6b48fe85012e3c8802c68af0bb14000080808080';

const TX_PARAMS_CHECK = {
    type: TX_TYPE.REDEEM_CHECK,
    data: {
        check: 'Mcf8a002843b9ac9ff8a4d4e5400000000000000888ac7230489e80000b841ed4e21035ad4d56901422c19e7fc867a63dcab709d6d0dcc0b6333cb7365d187519e1291bbc002189e7030dedfbbc4feb733da73f9409de4f01365dd3f5f4927011ca0507210c64b3aeb7c81a2db06204b935814c28482175dee756b1f05414d18e594a06173c7c8ee51ad76e9704a39ffc5c0ab11514d8b68efcbc8df1db194d9e296ee',
        password: '123',
        privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    },
};
const LINK_CHECK = 'https://bip.to/tx?d=f8f009b8e9f8e7b8a2f8a002843b9ac9ff8a4d4e5400000000000000888ac7230489e80000b841ed4e21035ad4d56901422c19e7fc867a63dcab709d6d0dcc0b6333cb7365d187519e1291bbc002189e7030dedfbbc4feb733da73f9409de4f01365dd3f5f4927011ca0507210c64b3aeb7c81a2db06204b935814c28482175dee756b1f05414d18e594a06173c7c8ee51ad76e9704a39ffc5c0ab11514d8b68efcbc8df1db194d9e296eeb8417adcf6a62a66b177b266c767c5ebd906651fb66269401a8c66d053574dc29c67296b93af2e276fbdf5f606a98419ae69191450f67a2d273ee6c5d3016773c16d0180808080';
const LINK_CHECK_PASSWORD = 'https://bip.to/tx?d=f8ae09b8a7f8a5b8a2f8a002843b9ac9ff8a4d4e5400000000000000888ac7230489e80000b841ed4e21035ad4d56901422c19e7fc867a63dcab709d6d0dcc0b6333cb7365d187519e1291bbc002189e7030dedfbbc4feb733da73f9409de4f01365dd3f5f4927011ca0507210c64b3aeb7c81a2db06204b935814c28482175dee756b1f05414d18e594a06173c7c8ee51ad76e9704a39ffc5c0ab11514d8b68efcbc8df1db194d9e296ee8080808080&p=83313233';


describe('prepareLink()', () => {
    test('should work', () => {
        const link = prepareLink(TX_PARAMS_SEND);
        expect(link).toEqual(LINK_SEND);
    });

    describe('multisend', () => {
        test('should work', () => {
            const link = prepareLink(TX_PARAMS_MULTISEND);
            expect(link).toEqual(LINK_MULTISEND);
        });
    });

    describe('check', () => {
        test('should work with proof', () => {
            const data = new RedeemCheckTxData(TX_PARAMS_CHECK.data);
            const link = prepareLink({...TX_PARAMS_CHECK, data});
            expect(link).toEqual(LINK_CHECK);
        });

        test('should work with password', () => {
            const link = prepareLink(TX_PARAMS_CHECK);
            expect(link).toEqual(LINK_CHECK);
        });
    });

    describe('host', () => {
        const testnetLink = LINK_SEND.replace('https://bip.to', 'https://testnet.bip.to');
        test('should work with custom host', () => {
            const link = prepareLink(TX_PARAMS_SEND, 'https://testnet.bip.to');
            expect(link).toEqual(testnetLink);
        });
        test('should work with ending slash', () => {
            const link = prepareLink(TX_PARAMS_SEND, 'https://testnet.bip.to/');
            expect(link).toEqual(testnetLink);
        });
        test('should work without scheme', () => {
            const link = prepareLink(TX_PARAMS_SEND, 'testnet.bip.to');
            expect(link).toEqual(testnetLink);
        });
    });
});


describe('decodeLink()', () => {
    test('should work', () => {
        const txParams = decodeLink(LINK_SEND);
        expect(txParams).toEqual(TX_PARAMS_SEND);
    });

    describe('check', () => {
        test('should work with proof', () => {
            const txParams = decodeLink(LINK_CHECK);
            const validTxParams = {type: TX_PARAMS_CHECK.type, data: new RedeemCheckTxData(TX_PARAMS_CHECK.data).fields};
            // @TODO remove when rawCheck renamed
            validTxParams.data.check = `Mc${(new RedeemCheckTxData(TX_PARAMS_CHECK.data)).txData.rawCheck.toString('hex')}`;
            // ensure string payload
            validTxParams.payload = validTxParams.payload || '';
            expect(txParams).toEqual(validTxParams);
        });

        test('should work with password', () => {
            const txParams = decodeLink(LINK_CHECK_PASSWORD, TX_PARAMS_CHECK.data.privateKey);
            const validTxParams = {type: TX_PARAMS_CHECK.type, data: new RedeemCheckTxData(TX_PARAMS_CHECK.data).fields};
            // @TODO remove when rawCheck renamed
            validTxParams.data.check = TX_PARAMS_CHECK.data.check;
            // ensure string payload
            validTxParams.payload = validTxParams.payload || '';
            expect(txParams).toEqual(validTxParams);
        });

        test('should throw on password without private key', () => {
            expect(() => decodeLink(LINK_CHECK_PASSWORD)).toThrow();
        });
    });
});
