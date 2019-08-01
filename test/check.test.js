import {Buffer} from 'safe-buffer';
import {issueCheck, decodeCheck} from '~/src';


const VALID_CHECK = 'Mcf8a03101830f423f8a4d4e5400000000000000888ac7230489e80000b84149eba2361855724bbd3d20eb97a54ea15ad7dc28c1111b8dcf3bb15db26f874f095803cad9f8fc88b2b4eec9ba706325a7929be31b6ccfef01260791a844cb55011ba06c63ad17bfe07b82be8a0144fd4daf8b4144281fdf88f313205ceacf37fd877fa03c243ad79cab6205f4b753bd402c4cfa5d570888659090b2f923071ac52bdf75';
const checkParams = {
    privateKey: '2919c43d5c712cae66f869a524d9523999998d51157dc40ac4d8d80a7602ce02',
    passPhrase: 'pass',
    nonce: '1',
    chainId: 1,
    coin: 'MNT',
    value: '10',
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
});

describe('decodeCheck()', () => {
    const checkParamsWithoutSensitiveData = Object.assign({}, checkParams);
    delete checkParamsWithoutSensitiveData.passPhrase;
    delete checkParamsWithoutSensitiveData.privateKey;

    expect(decodeCheck(VALID_CHECK)).toEqual(checkParamsWithoutSensitiveData);
});
