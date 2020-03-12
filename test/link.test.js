import {TX_TYPE} from 'minterjs-tx';
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

const TX_PARAMS_CHECK = {
    type: TX_TYPE.REDEEM_CHECK,
    data: {
        check: VALID_CHECK,
        password: 'pass',
        privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
    },
};

const LINK_CHECK = 'https://bip.to/tx/-PsJuPT48rit-KsxAYMPQj-KTU5UAAAAAAAAAIiKxyMEiegAAIpNTlQAAAAAAAAAuEH2mVCiEBllKfR9-Tj3r4SVjNszba8wRhbDfvi-vKMkkQkQ8Ebi_5mafyq1ZL1pDBECq2WiDg8ntXqThUM5tgg3ARugCgfL8xEUimtiwdGzSl4MK2kxoFR-3oud-zeu3_RIBiKgI6yT9xc8pBSZYk8G391YxOZdEnnqUmd3wZTdtiPVcCe4QQSX6liPD8K9RI3nbQOnTPNxJp4QrBoCdl-1-jfCn2fgNI-z-qzTNwuICUAefVYtiUPzZCzpZmcYjTw0To5b_20BgICAgA';
const LINK_CHECK_PASSWORD = 'https://bip.to/tx/-LkJuLL4sLit-KsxAYMPQj-KTU5UAAAAAAAAAIiKxyMEiegAAIpNTlQAAAAAAAAAuEH2mVCiEBllKfR9-Tj3r4SVjNszba8wRhbDfvi-vKMkkQkQ8Ebi_5mafyq1ZL1pDBECq2WiDg8ntXqThUM5tgg3ARugCgfL8xEUimtiwdGzSl4MK2kxoFR-3oud-zeu3_RIBiKgI6yT9xc8pBSZYk8G391YxOZdEnnqUmd3wZTdtiPVcCeAgICAgA?p=cGFzcw';

const TX_PARAMS_SET_CANDIDATE_OFF = {
    type: TX_TYPE.SET_CANDIDATE_OFF,
    data: {
        publicKey: 'Mp0eb98ea04ae466d8d38f490db3c99b3996a90e24243952ce9822c6dc1e2c1a43',
    },
    gasCoin: 'MNT',
    gasPrice: '1',
};
const LINK_SET_CANDIDATE_OFF = 'https://bip.to/tx/8gui4aAOuY6gSuRm2NOPSQ2zyZs5lqkOJCQ5Us6YIsbcHiwaQ4CAAYpNTlQAAAAAAAAA';

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
    test('should work', () => {
        const txParams = decodeLink(LINK_SEND);
        expect(txParams).toEqual(TX_PARAMS_SEND);
    });

    describe('check', () => {
        test('should work with proof', () => {
            const txParams = decodeLink(LINK_CHECK);
            // add proof
            const validTxParams = {type: TX_PARAMS_CHECK.type, data: new RedeemCheckTxData(TX_PARAMS_CHECK.data).fields};
            expect(txParams).toEqual(ensurePayload(validTxParams));
        });

        test('should work decodeCheck', () => {
            const txParams = decodeLink(LINK_CHECK, {decodeCheck: true});
            // add proof
            const validTxParams = {type: TX_PARAMS_CHECK.type, data: new RedeemCheckTxData(TX_PARAMS_CHECK.data).fields};
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

        test('should work with password', () => {
            const txParams = decodeLink(LINK_CHECK_PASSWORD, {privateKey: TX_PARAMS_CHECK.data.privateKey});
            // add proof
            const validTxParams = {type: TX_PARAMS_CHECK.type, data: new RedeemCheckTxData(TX_PARAMS_CHECK.data).fields};
            expect(txParams).toEqual(ensurePayload(validTxParams));
        });

        test('should throw on password without private key', () => {
            expect(() => decodeLink(LINK_CHECK_PASSWORD)).toThrow();
        });
    });

    test('set candidate off', () => {
        const txParams = decodeLink(LINK_SET_CANDIDATE_OFF);
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
