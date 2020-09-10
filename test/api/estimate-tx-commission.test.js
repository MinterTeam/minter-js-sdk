import {minterGate, minterNode} from './variables';
import {testData} from '~/test/test-data.js';


describe('EstimateTxCommission', () => {
    const rawTx = testData.txList[0].result;

    test('should work gate', () => {
        expect.assertions(1);

        return minterGate.estimateTxCommission(rawTx)
            .then((commission) => {
                expect(Number(commission)).toBeGreaterThan(0);
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);

    test('should work node', () => {
        expect.assertions(1);

        return minterNode.estimateTxCommission(rawTx)
            .then((commission) => {
                expect(Number(commission)).toBeGreaterThan(0);
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);
});
