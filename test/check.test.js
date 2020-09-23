/* eslint-disable jest/no-export */

import {issueCheck, decodeCheck, getGasCoinFromCheck} from '~/src';


export const VALID_CHECK = 'Mcf8973101830f423f80888ac7230489e8000080b84199953f49ef0ed10d971b8df2c018e7699cd749feca03cad9d03f32a8992d77ab6c818d770466500b41165c18a1826662fb0d45b3a9193fcacc13a4131702e017011ba069f7cfdead0ea971e9f3e7b060463e10929ccf2f4309b8145c0916f51f4c5040a025767d4ea835ee8fc2a096b8f99717ef65627cad5e99c2427e34a9928881ba34';
// gasCoin: 5
export const VALID_CHECK_WITH_CUSTOM_GAS_COIN = 'Mcf8973101830f423f80888ac7230489e8000005b841b0fe6d3805fae9f38bafefb74d0f61302fb37a20f0e9337871bef91c7423277646555dcb425fbb1ec35eda8a304bda41e9242dd55cb62a48e9b14a07262bc0d3011ba0ec85458016f3ba8de03000cc0a417836da4d0ae4013be482dce89285e04e559ca065b129e4d743a193774bf287a6421f9d39e23177d8bf603b236be337811be10a';
export const checkParams = {
    privateKey: '0x2919c43d5c712cae66f869a524d9523999998d51157dc40ac4d8d80a7602ce02',
    password: 'pass',
    nonce: '1',
    chainId: '1',
    coin: '0',
    value: '10',
    gasCoin: '0',
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
            gasCoin: '5',
        })).toEqual(VALID_CHECK_WITH_CUSTOM_GAS_COIN);
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

    test('default gasCoin: 0 (base coin)', () => {
        expect(issueCheck({
            ...checkParams,
            gasCoin: undefined,
        })).toEqual(issueCheck({
            ...checkParams,
            gasCoin: '0',
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

    test('should throw with string gasCoin', () => {
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
        expect(getGasCoinFromCheck(check)).toEqual('0');
    });
});
