import {minterGate, minterNode} from './variables';


describe('EstimateTxCommission', () => {
    const rawTx = 'f8920101028a4d4e540000000000000001aae98a4d4e540000000000000094376615b9a3187747dc7c32e51723515ee62e37dc888ac7230489e800008e637573746f6d206d6573736167658001b845f8431ba0647b5465b656962e88cec2e1883830b7e231cacea0fd57bdb329650729144147a015b593a0301dfa4cf6ec9357be065221455b279674944bb7534d6ea650eb35c8';

    test('should work gate', () => {
        expect.assertions(1);

        return minterGate.estimateTxCommission({
            transaction: rawTx,
        })
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

        return minterNode.estimateTxCommission({
            transaction: rawTx,
        })
            .then((commission) => {
                expect(Number(commission)).toBeGreaterThan(0);
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);
});
