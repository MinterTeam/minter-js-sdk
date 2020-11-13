import {normalizeTxType, TX_TYPE, txTypeList} from 'minterjs-util';
import {prepareLink, decodeLink, RedeemCheckTxData} from '~/src';
import {checkParams} from '~/test/check.test';
import {testData, fullTestData} from '~/test/test-data.js';


const LINK_CHECK_PROOF = 'https://bip.to/tx/-OcJuOD43riZ-JcxAYMPQj-AiIrHIwSJ6AAAgLhBmZU_Se8O0Q2XG43ywBjnaZzXSf7KA8rZ0D8yqJktd6tsgY13BGZQC0EWXBihgmZi-w1Fs6kZP8rME6QTFwLgFwEboGn3z96tDqlx6fPnsGBGPhCSnM8vQwm4FFwJFvUfTFBAoCV2fU6oNe6PwqCWuPmXF-9lYnytXpnCQn40qZKIgbo0uEEEl-pYjw_CvUSN520Dp0zzcSaeEKwaAnZftfo3wp9n4DSPs_qs0zcLiAlAHn1WLYlD82Qs6WZnGI08NE6OW_9tAYABAYA';

describe('prepareLink()', () => {
    describe('should work', () => {
        const txListTable = testData.txList.map((item) => {
            item.toString = () => txTypeList[item.params.type].name;
            return [item];
        });

        test.each(txListTable)('%s', (item) => {
            const link = prepareLink({...item.params, ...item.options});
            expect(link).toEqual(item.link);
        });
    });

    describe('check', () => {
        const txItem = findTxItem(TX_TYPE.REDEEM_CHECK);
        test('should work with proof', () => {
            const data = new RedeemCheckTxData(txItem.params.data, txItem.options);
            const link = prepareLink({...txItem.params, data});
            expect(data.proof).toBeTruthy();
            expect(link).toEqual(LINK_CHECK_PROOF);
        });

        test('should work with password', () => {
            const link = prepareLink({
                ...txItem.params,
                password: txItem.options.password,
            });
            expect(txItem.params.data.proof).toBeFalsy();
            expect(link).toEqual(txItem.link);
        });
    });

    describe('host', () => {
        const txItem = findTxItem(TX_TYPE.SEND);
        const testnetLink = txItem.link.replace('https://bip.to', 'https://testnet.bip.to');
        test('should work with custom host', () => {
            const link = prepareLink(txItem.params, 'https://testnet.bip.to');
            expect(link).toEqual(testnetLink);
        });
        test('should work with ending slash', () => {
            const link = prepareLink(txItem.params, 'https://testnet.bip.to/');
            expect(link).toEqual(testnetLink);
        });
        test('should work without scheme', () => {
            const link = prepareLink(txItem.params, 'testnet.bip.to');
            expect(link).toEqual(testnetLink);
        });
    });
});


describe('decodeLink()', () => {
    describe('should work', () => {
        const txListTable = fullTestData.txList.map((item) => {
            const name = txTypeList[Number(item.params.type)].name;
            item.toString = () => name;
            // item.params = stringifyLeafs(item.params);
            // item.params.type = normalizeTxType(item.params.type);
            delete item.params.chainId;
            delete item.params.signatureData;
            delete item.params.signatureType;
            // delete item.params.gasCoin;
            return [item];
        });

        test.each(txListTable)('%s', (item) => {
            const txParams = decodeLink(item.link, item.options);
            expect(txParams).toEqual(item.params);
        });
    });

    describe('check', () => {
        const fullItem = findFullItem(TX_TYPE.REDEEM_CHECK);
        const txItem = findFullItem(TX_TYPE.REDEEM_CHECK);
        test('should work with proof %s', () => {
            const txParams = decodeLink(LINK_CHECK_PROOF);
            // add proof
            const validTxParams = {
                ...fullItem.params,
                data: new RedeemCheckTxData(fullItem.params.data, fullItem.options).fields,
            };
            expect(txParams).toEqual(ensurePayload(validTxParams));
        });

        test('should work decodeCheck', () => {
            const txParams = decodeLink(LINK_CHECK_PROOF, {decodeCheck: true});
            // add proof
            const validTxParams = {
                ...fullItem.params,
                data: new RedeemCheckTxData(fullItem.params.data, fullItem.options).fields,
            };
            delete checkParams.password;
            delete checkParams.privateKey;
            validTxParams.data.checkData = checkParams;
            expect(txParams).toEqual(ensurePayload(validTxParams));
        });

        test('should work with password LINK_CHECK_PASSWORD', () => {
            const txParams = decodeLink(txItem.link, {privateKey: txItem.options.privateKey});
            // add proof
            const validTxParams = {
                ...txItem.params,
                data: new RedeemCheckTxData(txItem.params.data, txItem.options).fields,
            };
            expect(txParams).toEqual(ensurePayload(validTxParams));
        });

        test('should throw on password without private key', () => {
            expect(() => decodeLink(txItem.params)).toThrow();
        });
    });

    // empty nonce should allow omit nonce in link and request actual nonce in the app
    test('empty nonce', () => {
        const fullItem = findFullItem(TX_TYPE.SEND);
        const link = prepareLink({
            ...fullItem.params,
            nonce: undefined,
        });
        expect(decodeLink(link).nonce).toEqual(undefined);
    });

    // empty gasCoin should allow omit gasCoin in link and choose suitable in the app
    test('empty gasCoin', () => {
        const fullItem = findFullItem(TX_TYPE.SEND);
        const link = prepareLink({
            ...fullItem.params,
            gasCoin: undefined,
        });
        expect(decodeLink(link).gasCoin).toEqual(undefined);
    });

    // zero gasCoin should allow specify base coin (e.g. BIP)
    test('zero gasCoin', () => {
        const fullItem = findFullItem(TX_TYPE.SEND);
        const link = prepareLink({
            ...fullItem.params,
            gasCoin: 0,
        });
        expect(decodeLink(link).gasCoin).toEqual('0');
    });

    // non zero gasCoin should allow specify custom coin
    test('non zero gasCoin', () => {
        const fullItem = findFullItem(TX_TYPE.SEND);
        const link = prepareLink({
            ...fullItem.params,
            gasCoin: 123,
        });
        expect(decodeLink(link).gasCoin).toEqual('123');
    });

    test('should not lose precision', () => {
        const fullItem = findFullItem(TX_TYPE.SEND);
        const bigValue = '123456789012345.123456789012345678';
        const link = prepareLink({
            ...fullItem.params,
            data: {...fullItem.params.data, value: bigValue},
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

function findTxItem(type) {
    return testData.txList.find((item) => item.params.type === Number(type));
}
function findFullItem(type) {
    return fullTestData.txList.find((item) => item.params.type === type);
}

function stringifyLeafs(obj) {
    const result = Array.isArray(obj) ? [] : {};
    Object.entries(obj).forEach(([key, value]) => {
        if (value && typeof value === 'object') {
            result[key] = stringifyLeafs(value);
        } else {
            result[key] = value.toString();
        }
    });

    return result;
}
