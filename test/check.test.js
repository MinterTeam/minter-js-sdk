import {issueCheck, decodeCheck, getGasCoinFromCheck} from '~/src';


// eslint-disable-next-line import/prefer-default-export
export const VALID_CHECK = 'Mcf8ab3101830f423f8a4d4e5400000000000000888ac7230489e800008a4d4e5400000000000000b841f69950a210196529f47df938f7af84958cdb336daf304616c37ef8bebca324910910f046e2ff999a7f2ab564bd690c1102ab65a20e0f27b57a93854339b60837011ba00a07cbf311148a6b62c1d1b34a5e0c2b6931a0547ede8b9dfb37aedff4480622a023ac93f7173ca41499624f06dfdd58c4e65d1279ea526777c194ddb623d57027';
const checkParams = {
    privateKey: '0x2919c43d5c712cae66f869a524d9523999998d51157dc40ac4d8d80a7602ce02',
    password: 'pass',
    nonce: '1',
    chainId: '1',
    coin: 'MNT',
    value: '10',
    gasCoin: 'MNT',
    dueBlock: '999999',
};

describe('issueCheck()', () => {
    test('should work', () => {
        const check = issueCheck(checkParams);
        expect(check).toEqual(VALID_CHECK);
    });

    test('should accept buffer private key', () => {
        const check = issueCheck({
            ...checkParams,
            privateKey: Buffer.from(checkParams.privateKey.substr(2), 'hex'),
        });
        expect(check).toEqual(VALID_CHECK);
    });

    test('should work with custom gasCoin', () => {
        expect(issueCheck({
            ...checkParams,
            gasCoin: 'TESTCOIN01',
        })).toEqual('Mcf8ab3101830f423f8a4d4e5400000000000000888ac7230489e800008a54455354434f494e3031b84189f86abe44c82ccee1964abcdf8a4aea6f4abffd4c709a3a9157951dfe8ead5805b15cf8359e2c6c5ae842d8e27ee21a46467df01ee1fead399c241682547b0e011ba0d1ca0e59e5d23edf41afa22f5258aeadf80f329d7ce8f32d30034ec614b292dda02f136ee0a48911e2470b170cc2ff3a2362c4c17f69360ada11efecd62f35c595');
    });

    test('default dueBlock: 999999', () => {
        expect(issueCheck({
            ...checkParams,
            dueBlock: undefined,
        })).toEqual(issueCheck({
            ...checkParams,
            dueBlock: 999999999,
        }));
    });

    test('default chainId: 1', () => {
        expect(issueCheck({
            ...checkParams,
            chainId: undefined,
        })).toEqual(issueCheck({
            ...checkParams,
            chainId: 1,
        }));
    });

    test('default gasCoin: "BIP"', () => {
        expect(issueCheck({
            ...checkParams,
            gasCoin: undefined,
        })).toEqual(issueCheck({
            ...checkParams,
            gasCoin: 'BIP',
        }));
    });

    test('numeric nonce should be treated as string', () => {
        expect(issueCheck({
            ...checkParams,
            nonce: 123,
        })).toEqual(issueCheck({
            ...checkParams,
            nonce: '123',
        }));
    });

    test('should throw on invalid dueBlock', () => {
        expect(() => issueCheck({
            ...checkParams,
            dueBlock: '123asd',
        })).toThrow();
    });

    test('should throw on invalid value', () => {
        expect(() => issueCheck({
            ...checkParams,
            value: '123asd',
        })).toThrow();
    });

    test('should throw with invalid gasCoin', () => {
        expect(() => issueCheck({
            ...checkParams,
            gasCoin: true,
        })).toThrow();
    });

    test('should throw with short gasCoin', () => {
        expect(() => issueCheck({
            ...checkParams,
            gasCoin: 'AA',
        })).toThrow();
    });
});

describe('decodeCheck()', () => {
    const checkParamsWithoutSensitiveData = Object.assign({}, checkParams);
    delete checkParamsWithoutSensitiveData.password;
    delete checkParamsWithoutSensitiveData.privateKey;

    test('should work', () => {
        expect(decodeCheck(VALID_CHECK)).toEqual(checkParamsWithoutSensitiveData);
    });

    test('should not lose precision', () => {
        const bigValue = '123456789012345.123456789012345678';
        const check = issueCheck({...checkParams, value: bigValue});
        expect(decodeCheck(check).value).toEqual(bigValue);
    });
});

describe('getGasCoinFromCheck()', () => {
    test('should work', () => {
        const check = issueCheck(checkParams);
        expect(getGasCoinFromCheck(check)).toEqual('MNT');
    });
});
