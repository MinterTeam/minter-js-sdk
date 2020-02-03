import {TX_TYPE} from 'minterjs-tx';
import {prepareLink, decodeLink, RedeemCheckTxData, issueCheck, decodeCheck} from '~/src';
import {VALID_CHECK} from '~/test/check.test';

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
                value: '0.1',
                coin: 'MNT',
                to: 'Mxfe60014a6e9ac91618f5d1cab3fd58cded61ee99',
            },
            {
                value: '0.2',
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
        check: VALID_CHECK,
        password: 'pass',
        privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    },
};
const LINK_CHECK = 'https://bip.to/tx?d=f8f009b8e9f8e7b8a2f8a03101830f423f8a4d4e5400000000000000888ac7230489e80000b84149eba2361855724bbd3d20eb97a54ea15ad7dc28c1111b8dcf3bb15db26f874f095803cad9f8fc88b2b4eec9ba706325a7929be31b6ccfef01260791a844cb55011ba06c63ad17bfe07b82be8a0144fd4daf8b4144281fdf88f313205ceacf37fd877fa03c243ad79cab6205f4b753bd402c4cfa5d570888659090b2f923071ac52bdf75b8410497ea588f0fc2bd448de76d03a74cf371269e10ac1a02765fb5fa37c29f67e0348fb3faacd3370b8809401e7d562d8943f3642ce96667188d3c344e8e5bff6d0180808080';
const LINK_CHECK_PASSWORD = 'https://bip.to/tx?d=f8ae09b8a7f8a5b8a2f8a03101830f423f8a4d4e5400000000000000888ac7230489e80000b84149eba2361855724bbd3d20eb97a54ea15ad7dc28c1111b8dcf3bb15db26f874f095803cad9f8fc88b2b4eec9ba706325a7929be31b6ccfef01260791a844cb55011ba06c63ad17bfe07b82be8a0144fd4daf8b4144281fdf88f313205ceacf37fd877fa03c243ad79cab6205f4b753bd402c4cfa5d570888659090b2f923071ac52bdf758080808080&p=8470617373';

const TX_PARAMS_SET_CANDIDATE_OFF = {
    type: TX_TYPE.SET_CANDIDATE_OFF,
    data: {
        publicKey: 'Mp0eb98ea04ae466d8d38f490db3c99b3996a90e24243952ce9822c6dc1e2c1a43',
    },
    gasCoin: 'MNT',
    gasPrice: '1',
};
const LINK_SET_CANDIDATE_OFF = 'https://bip.to/tx?d=eb0ba2e1a00eb98ea04ae466d8d38f490db3c99b3996a90e24243952ce9822c6dc1e2c1a43808001834d4e54';


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
            const link = prepareLink({
                type: TX_PARAMS_CHECK.type,
                data: {check: TX_PARAMS_CHECK.data.check, password: TX_PARAMS_CHECK.data.password},
                password: TX_PARAMS_CHECK.data.password,
            });
            expect(link).toEqual(LINK_CHECK_PASSWORD);
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
            // add proof
            const validTxParams = {type: TX_PARAMS_CHECK.type, data: new RedeemCheckTxData(TX_PARAMS_CHECK.data).fields};
            // @TODO remove when rawCheck renamed
            validTxParams.data.check = `Mc${(new RedeemCheckTxData(TX_PARAMS_CHECK.data)).txData.rawCheck.toString('hex')}`;
            // ensure string payload
            validTxParams.payload = validTxParams.payload || '';
            expect(txParams).toEqual(validTxParams);
        });

        test('should work with password', () => {
            const txParams = decodeLink(LINK_CHECK_PASSWORD, TX_PARAMS_CHECK.data.privateKey);
            // add proof
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

    test('set candidate off', () => {
        const txParams = decodeLink(LINK_SET_CANDIDATE_OFF);
        expect(txParams).toEqual({
            ...TX_PARAMS_SET_CANDIDATE_OFF,
            payload: TX_PARAMS_SET_CANDIDATE_OFF.payload || '',
        });
    });

    test('should not lose precision', () => {
        const bigValue = '123456789012345.123456789012345678';
        const link = prepareLink({
            ...TX_PARAMS_SEND,
            data: {...TX_PARAMS_SEND.data, value: bigValue},
        });
        expect(decodeLink(link).data.value).toEqual(bigValue);
    });
});
