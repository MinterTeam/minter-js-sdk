import {Buffer} from 'safe-buffer';
import {issueCheck} from '~/src';


describe('issueCheck()', () => {
    const checkParams = {
        privateKey: '2919c43d5c712cae66f869a524d9523999998d51157dc40ac4d8d80a7602ce02',
        passPhrase: 'pass',
        nonce: 1,
        chainId: 1,
        coinSymbol: 'MNT',
        value: 10,
        dueBlock: 999999,
    };
    test('should work', () => {
        const check = issueCheck(checkParams);
        expect(check).toEqual('Mcf8a00101830f423f8a4d4e5400000000000000888ac7230489e80000b841e383eff7dc2b162fe6b3af68d1b4a877c629693275e58010cd87f419b24c34bd31e66d8bb36fc0005be3d7f4a446f8bb56c32c738a241c1cb02337d86398b5e7001ca0b053a8ee3b9e32545aa13c77173abc91f5edc07a60695f85b00d94003e27459ea06835ad40bd0cbdc2ae7568eef4f5cbc513ae11d13c465f7ead85e1d2365007bd');
    });

    test('should accept buffer private key', () => {
        const check = issueCheck({
            ...checkParams,
            privateKey: Buffer.from(checkParams.privateKey, 'hex'),
        });
        expect(check).toEqual('Mcf8a00101830f423f8a4d4e5400000000000000888ac7230489e80000b841e383eff7dc2b162fe6b3af68d1b4a877c629693275e58010cd87f419b24c34bd31e66d8bb36fc0005be3d7f4a446f8bb56c32c738a241c1cb02337d86398b5e7001ca0b053a8ee3b9e32545aa13c77173abc91f5edc07a60695f85b00d94003e27459ea06835ad40bd0cbdc2ae7568eef4f5cbc513ae11d13c465f7ead85e1d2365007bd');
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

    test('should throw on invalid dueBlock', () => {
        expect(() => issueCheck({
            ...checkParams,
            dueBlock: '123asd',
        })).toThrow();
    });

    test('should throw on invalid nonce', () => {
        expect(() => issueCheck({
            ...checkParams,
            nonce: '123asd',
        })).toThrow();
    });

    test('should throw on invalid value', () => {
        expect(() => issueCheck({
            ...checkParams,
            value: '123asd',
        })).toThrow();
    });
});
