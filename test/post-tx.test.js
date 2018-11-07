import {PostTx, SendTxParams} from '~/src';

// private 5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da
// address Mx7633980c000139dd3bd24a3f54e06474fa941e16

describe('PostTx', () => {
    const postTxNode = new PostTx({baseURL: 'https://minter-node-1.testnet.minter.network'});
    const txParamsData = {
        privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
        address: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        amount: 10,
        coinSymbol: 'MNT',
        feeCoinSymbol: 'MNT',
        message: 'custom message',
    };

    test('should work node', () => {
        expect.assertions(2);
        const txParams = new SendTxParams(txParamsData);
        return postTxNode(txParams)
            .then((response) => {
                const txHash = response.data.result.hash;

                expect(txHash).toHaveLength(42);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                console.log(error.response);
            });
    }, 30000);

    test('should fail node', () => {
        expect.assertions(1);
        const txParams = new SendTxParams({...txParamsData, coinSymbol: 'ASD'});
        return postTxNode(txParams)
            .catch((error) => {
                expect(error.response.data.log.length).toBeGreaterThan(0);
            });
    }, 30000);


    const postTxExplorer = new PostTx();
    test('should work explorer', () => {
        expect.assertions(2);
        const txParams = new SendTxParams(txParamsData);
        return postTxExplorer(txParams)
            .then((response) => {
                const txHash = response.data.result.hash;

                expect(txHash).toHaveLength(42);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                console.log(error.response);
            });
    }, 30000);

    test('should fail explorer', () => {
        expect.assertions(1);
        const txParams = new SendTxParams({...txParamsData, coinSymbol: 'ASD'});
        return postTxExplorer(txParams)
            .catch((error) => {
                expect(error.response.data.log.length).toBeGreaterThan(0);
            });
    }, 30000);
});
