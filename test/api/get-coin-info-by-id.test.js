import {ENV_DATA, minterGate, minterNode} from './variables';
import {ensureCustomCoin, logError} from '~/test/utils.js';

beforeAll(async () => {
    await ensureCustomCoin();
}, 30000);

describe('GetCoinInfoById', () => {
    test('should work gate', () => {
        expect.assertions(1);

        return minterGate.getCoinInfoById(0)
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

        return minterNode.getCoinInfoById(0)
            .then((coinInfo) => {
                expect(coinInfo.symbol === 'MNT' || coinInfo.symbol === 'BIP').toBeTruthy();
            })
            .catch((error) => {
                logError(error);
                throw error;
            });
    }, 30000);
});
