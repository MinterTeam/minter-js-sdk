import {issueCheck, decodeCheck, getGasCoinFromCheck} from '~/src';


// eslint-disable-next-line import/prefer-default-export
export const VALID_CHECK = 'Mcf8ab3101830f423f8a4d4e5400000000000000888ac7230489e800008a4d4e5400000000000000b841f69950a210196529f47df938f7af84958cdb336daf304616c37ef8bebca324910910f046e2ff999a7f2ab564bd690c1102ab65a20e0f27b57a93854339b60837011ba00a07cbf311148a6b62c1d1b34a5e0c2b6931a0547ede8b9dfb37aedff4480622a023ac93f7173ca41499624f06dfdd58c4e65d1279ea526777c194ddb623d57027';
const checkParams = {
    privateKey: '2919c43d5c712cae66f869a524d9523999998d51157dc40ac4d8d80a7602ce02',
    password: 'pass',
    nonce: '1',
    chainId: 1,
    coin: 'MNT',
    value: '10',
    gasCoin: 'MNT',
    dueBlock: 999999,
};

describe('issueCheck()', () => {
    test('should work', () => {
        const check = issueCheck(checkParams);
        expect(check).toEqual(VALID_CHECK);
    });

    test('should accept buffer private key', () => {
        const check = issueCheck({
            ...checkParams,
            privateKey: Buffer.from(checkParams.privateKey, 'hex'),
        });
        expect(check).toEqual(VALID_CHECK);
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

    expect(decodeCheck(VALID_CHECK)).toEqual(checkParamsWithoutSensitiveData);
});

describe('getGasCoinFromCheck()', () => {
    test('should work', () => {
        const check = issueCheck(checkParams);
        expect(getGasCoinFromCheck(check)).toEqual('MNT');
    });
});
