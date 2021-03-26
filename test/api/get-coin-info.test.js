import {ENV_DATA, minterGate, minterNode} from './variables';
import {ensureCustomCoin, logError} from '~/test/utils.js';

beforeAll(async () => {
    await ensureCustomCoin();
}, 30000);

describe('GetCoinInfo', () => {
    test('should work gate', () => {
        expect.assertions(1);

        return minterGate.getCoinInfo(ENV_DATA.customCoin)
            .then((coinInfo) => {
                expect(coinInfo.id).toBeGreaterThan(0);
            })
            .catch((error) => {
                logError(error);
                throw error;
            });
    }, 30000);

    test('should work node', () => {
        expect.assertions(1);

        return minterNode.getCoinInfo(ENV_DATA.customCoin)
            .then((coinInfo) => {
                expect(coinInfo.id).toBeGreaterThan(0);
            })
            .catch((error) => {
                logError(error);
                throw error;
            });
    }, 30000);
});

describe('GetCoinInfo by ID', () => {
    test('should work gate', () => {
        expect.assertions(1);

        return minterGate.getCoinInfo(0)
            .then((coinInfo) => {
                expect(coinInfo.symbol === 'MNT' || coinInfo.symbol === 'BIP').toBeTruthy();
            })
            .catch((error) => {
                logError(error);
                throw error;
            });
    }, 30000);

    test('should work node', () => {
        expect.assertions(1);

        return minterNode.getCoinInfo(0)
            .then((coinInfo) => {
                expect(coinInfo.symbol === 'MNT' || coinInfo.symbol === 'BIP').toBeTruthy();
            })
            .catch((error) => {
                logError(error);
                throw error;
            });
    }, 30000);
});

