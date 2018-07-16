import {Buffer} from 'safe-buffer';
import * as utils from '../src/utils';

describe('.getProofWithRecovery()', () => {
    test('should work', () => {
        const privateKey = Buffer.from('5a34ec45e683c5254f6ef11723b9fd859f14677e04e4a8bb7768409eff12f07d', 'hex');
        const proof = utils.getProofWithRecovery(privateKey, '123456');
        expect(proof.toString('hex')).toEqual('7f8b6d3ed18d2fe131bbdc9f9bce3b96724ac354ce2cfb49b4ffc4bd71aabf580a8dfed407a34122e45d290941d855d744a62110fa1c11448078b13d3117bdfc01');
    });
});
