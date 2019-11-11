import {minterGate, minterNode} from './variables';


describe('GetMinGasPrice', () => {
    test('should work gate', () => {
        expect.assertions(1);

        return minterGate.getMinGasPrice()
            .then((gasPrice) => {
                expect(Number(gasPrice)).toBeGreaterThan(0);
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);

    test('should work node', () => {
        expect.assertions(1);

        return minterNode.getMinGasPrice()
            .then((gasPrice) => {
                expect(Number(gasPrice)).toBeGreaterThan(0);
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);
});
