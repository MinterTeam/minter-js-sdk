import {TX_TYPE} from 'minterjs-util';
import {prepareLink, decodeLink, RedeemCheckTxData} from '~/src';
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
const LINK_SEND = 'https://bip.to/tx/-EgBqumKTU5UAAAAAAAAAJR2M5gMAAE53TvSSj9U4GR0-pQeFoiKxyMEiegAAI5jdXN0b20gbWVzc2FnZYCAikFTRAAAAAAAAAA';
const LINK_SEND_OLD = 'https://bip.to/tx?d=f84801aae98a4d4e5400000000000000947633980c000139dd3bd24a3f54e06474fa941e16888ac7230489e800008e637573746f6d206d65737361676580808a41534400000000000000';

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
const LINK_MULTISEND = 'https://bip.to/tx/-F8NuFj4VvhU6YpNTlQAAAAAAAAAlP5gAUpumskWGPXRyrP9WM3tYe6ZiAFjRXhdigAA6YpNTlQAAAAAAAAAlN2rYoF2athkl3Qf-RtrSP6FAS48iALGivC7FAAAgICAgA';
const LINK_MULTISEND_OLD = 'https://bip.to/tx?d=f85f0db858f856f854e98a4d4e540000000000000094fe60014a6e9ac91618f5d1cab3fd58cded61ee9988016345785d8a0000e98a4d4e540000000000000094ddab6281766ad86497741ff91b6b48fe85012e3c8802c68af0bb14000080808080';

const TX_PARAMS_CHECK = {
    type: TX_TYPE.REDEEM_CHECK,
    data: {
        check: VALID_CHECK,
    },
};
const TX_CHECK_OPTIONS = {
    password: 'pass',
    privateKey: '0x5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
};

const LINK_CHECK = 'https://bip.to/tx/-PsJuPT48rit-KsxAYMPQj-KTU5UAAAAAAAAAIiKxyMEiegAAIpNTlQAAAAAAAAAuEH2mVCiEBllKfR9-Tj3r4SVjNszba8wRhbDfvi-vKMkkQkQ8Ebi_5mafyq1ZL1pDBECq2WiDg8ntXqThUM5tgg3ARugCgfL8xEUimtiwdGzSl4MK2kxoFR-3oud-zeu3_RIBiKgI6yT9xc8pBSZYk8G391YxOZdEnnqUmd3wZTdtiPVcCe4QQSX6liPD8K9RI3nbQOnTPNxJp4QrBoCdl-1-jfCn2fgNI-z-qzTNwuICUAefVYtiUPzZCzpZmcYjTw0To5b_20BgICAgA';
const LINK_CHECK_PASSWORD = 'https://bip.to/tx/-LkJuLL4sLit-KsxAYMPQj-KTU5UAAAAAAAAAIiKxyMEiegAAIpNTlQAAAAAAAAAuEH2mVCiEBllKfR9-Tj3r4SVjNszba8wRhbDfvi-vKMkkQkQ8Ebi_5mafyq1ZL1pDBECq2WiDg8ntXqThUM5tgg3ARugCgfL8xEUimtiwdGzSl4MK2kxoFR-3oud-zeu3_RIBiKgI6yT9xc8pBSZYk8G391YxOZdEnnqUmd3wZTdtiPVcCeAgICAgA?p=cGFzcw';
const LINK_CHECK_OLD = 'https://bip.to/tx?d=f8fb09b8f4f8f2b8adf8ab3101830f423f8a4d4e5400000000000000888ac7230489e800008a4d4e5400000000000000b841f69950a210196529f47df938f7af84958cdb336daf304616c37ef8bebca324910910f046e2ff999a7f2ab564bd690c1102ab65a20e0f27b57a93854339b60837011ba00a07cbf311148a6b62c1d1b34a5e0c2b6931a0547ede8b9dfb37aedff4480622a023ac93f7173ca41499624f06dfdd58c4e65d1279ea526777c194ddb623d57027b8410497ea588f0fc2bd448de76d03a74cf371269e10ac1a02765fb5fa37c29f67e0348fb3faacd3370b8809401e7d562d8943f3642ce96667188d3c344e8e5bff6d0180808080';
const LINK_CHECK_PASSWORD_OLD = 'https://bip.to/tx?d=f8b909b8b2f8b0b8adf8ab3101830f423f8a4d4e5400000000000000888ac7230489e800008a4d4e5400000000000000b841f69950a210196529f47df938f7af84958cdb336daf304616c37ef8bebca324910910f046e2ff999a7f2ab564bd690c1102ab65a20e0f27b57a93854339b60837011ba00a07cbf311148a6b62c1d1b34a5e0c2b6931a0547ede8b9dfb37aedff4480622a023ac93f7173ca41499624f06dfdd58c4e65d1279ea526777c194ddb623d570278080808080&p=8470617373';

const TX_PARAMS_SET_CANDIDATE_OFF = {
    type: TX_TYPE.SET_CANDIDATE_OFF,
    data: {
        publicKey: 'Mp0eb98ea04ae466d8d38f490db3c99b3996a90e24243952ce9822c6dc1e2c1a43',
    },
    gasCoin: 'MNT',
    gasPrice: '1',
};
const LINK_SET_CANDIDATE_OFF = 'https://bip.to/tx/8gui4aAOuY6gSuRm2NOPSQ2zyZs5lqkOJCQ5Us6YIsbcHiwaQ4CAAYpNTlQAAAAAAAAA';
const LINK_SET_CANDIDATE_OFF_OLD = 'https://bip.to/tx?d=eb0ba2e1a00eb98ea04ae466d8d38f490db3c99b3996a90e24243952ce9822c6dc1e2c1a43808001834d4e54';

const TX_PARAMS_CREATE_COIN = {
    type: TX_TYPE.CREATE_COIN,
    nonce: '1',
    data: {
        name: 'SUPER TEST',
        symbol: 'SPRTEST000',
        initialAmount: '1000',
        initialReserve: '1000',
        constantReserveRatio: '10',
        maxSupply: '1000',
    },
    gasCoin: 'MNT',
    gasPrice: '1',
};
const LINK_CREATE_COIN = 'https://bip.to/tx/-EYFtvWKU1VQRVIgVEVTVIpTUFJURVNUMDAwiTY1ya3F3qAAAIk2Ncmtxd6gAAAKiTY1ya3F3qAAAIABAYpNTlQAAAAAAAAA';

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
            const data = new RedeemCheckTxData(TX_PARAMS_CHECK.data, TX_CHECK_OPTIONS);
            const link = prepareLink({...TX_PARAMS_CHECK, data});
            expect(link).toEqual(LINK_CHECK);
        });

        test('should work with password', () => {
            const link = prepareLink({
                type: TX_PARAMS_CHECK.type,
                data: {check: TX_PARAMS_CHECK.data.check},
                password: TX_CHECK_OPTIONS.password,
            });
            expect(link).toEqual(LINK_CHECK_PASSWORD);
        });
    });

    test('set candidate off', () => {
        const link = prepareLink(TX_PARAMS_SET_CANDIDATE_OFF);
        expect(link).toEqual(LINK_SET_CANDIDATE_OFF);
    });

    test('create coin', () => {
        const link = prepareLink(TX_PARAMS_CREATE_COIN);
        expect(link).toEqual(LINK_CREATE_COIN);
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
    test.each(makeLinkArray(LINK_SEND, LINK_SEND_OLD))('send %s', ({value: linkValue}) => {
        const txParams = decodeLink(linkValue);
        expect(txParams).toEqual(TX_PARAMS_SEND);
    });

    describe('check', () => {
        test.each(makeLinkArray(LINK_CHECK, LINK_CHECK_OLD))('should work with proof %s', ({value: linkValue}) => {
            const txParams = decodeLink(linkValue);
            // add proof
            const validTxParams = {type: TX_PARAMS_CHECK.type, data: new RedeemCheckTxData(TX_PARAMS_CHECK.data, TX_CHECK_OPTIONS).fields};
            expect(txParams).toEqual(ensurePayload(validTxParams));
        });

        test('should work decodeCheck', () => {
            const txParams = decodeLink(LINK_CHECK, {decodeCheck: true});
            // add proof
            const validTxParams = {type: TX_PARAMS_CHECK.type, data: new RedeemCheckTxData(TX_PARAMS_CHECK.data, TX_CHECK_OPTIONS).fields};
            validTxParams.data.checkData = {
                chainId: '1',
                coin: 'MNT',
                dueBlock: '999999',
                gasCoin: 'MNT',
                nonce: '1',
                value: '10',
            };
            expect(txParams).toEqual(ensurePayload(validTxParams));
        });

        test.each(makeLinkArray(LINK_CHECK_PASSWORD, LINK_CHECK_PASSWORD_OLD))('should work with password %s', ({value: linkValue}) => {
            const txParams = decodeLink(linkValue, {privateKey: TX_CHECK_OPTIONS.privateKey});
            // add proof
            const validTxParams = {type: TX_PARAMS_CHECK.type, data: new RedeemCheckTxData(TX_PARAMS_CHECK.data, TX_CHECK_OPTIONS).fields};
            expect(txParams).toEqual(ensurePayload(validTxParams));
        });

        test('should throw on password without private key', () => {
            expect(() => decodeLink(LINK_CHECK_PASSWORD)).toThrow();
        });
    });

    test.each(makeLinkArray(LINK_SET_CANDIDATE_OFF, LINK_SET_CANDIDATE_OFF_OLD))('set candidate off %s', ({value: linkValue}) => {
        const txParams = decodeLink(linkValue);
        expect(txParams).toEqual(ensurePayload(TX_PARAMS_SET_CANDIDATE_OFF));
    });

    test('create coin', () => {
        const txParams = decodeLink(LINK_CREATE_COIN);
        expect(txParams).toEqual(ensurePayload(TX_PARAMS_CREATE_COIN));
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

function ensurePayload(txParams) {
    return {
        ...txParams,
        payload: txParams.payload || '',
    };
}

function makeLinkArray(currentLink, oldLink) {
    return [
        {
            value: currentLink,
            toString() {
                return '';
            },
        },
        {
            value: oldLink,
            toString() {
                return 'old';
            },
        },
    ];
}
