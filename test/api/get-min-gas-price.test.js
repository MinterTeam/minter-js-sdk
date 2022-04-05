import {minterGate, minterNode} from './variables';
import {logError} from '~/test/test-utils.js';


describe('GetMinGasPrice', () => {
    test('should work gate', () => {
        expect.assertions(1);

        return minterGate.getMinGasPrice()
            .then((gasPrice) => {
                expect(gasPrice).toBeGreaterThan(0);
            })
            .catch((error) => {
                logError(error);
                throw error;
            });
    }, 30000);

    test('should work node', () => {
        expect.assertions(1);

        return minterNode.getMinGasPrice()
            .then((gasPrice) => {
                expect(Number(gasPrice)).toBeGreaterThan(0);
            })
            .catch((error) => {
                logError(error);
                throw error;
            });
    }, 30000);
});
