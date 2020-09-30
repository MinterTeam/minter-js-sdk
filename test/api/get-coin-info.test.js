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
                expect(Number(coinInfo.id)).toBeGreaterThan(0);
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
                expect(Number(coinInfo.id)).toBeGreaterThan(0);
            })
            .catch((error) => {
                logError(error);
                throw error;
            });
    }, 30000);
});
