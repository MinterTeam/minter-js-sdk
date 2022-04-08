import {TX_TYPE, txTypeList} from 'minterjs-util';
import {prepareSignedTx, prepareTx, decodeTx, decodeLink} from '~/src';
import {bufferToInteger} from '~/src/utils.js';
import {VALID_CHECK, VALID_CHECK_WITH_CUSTOM_GAS_COIN} from '~/test/check.test.js';
import {testData} from '~/test/test-data.js';


describe('should work', () => {
    const txListTable = testData.txList.map((item) => {
        item.toString = () => txTypeList[item.params.type].name;
        return [item];
    });

    test.each(txListTable)('prepareSignedTx with privateKey: %s', (item) => {
        const tx = prepareSignedTx(item.params, {privateKey: item.options.privateKey, password: item.options.password});

        expect(tx.serializeToString())
            .toEqual(item.result);
    });

    test.each(txListTable)('prepareTx with privateKey: %s', (item) => {
        const tx = prepareTx({...item.params, signatureType: 1}, {privateKey: item.options.privateKey, password: item.options.password});

        expect(tx.serializeToString())
            .toEqual(item.result);
    });

    test.each(txListTable)('prepareSignedTx with seedPhrase: %s', (item) => {
        const tx = prepareSignedTx(item.params, {seedPhrase: item.options.seedPhrase, password: item.options.password});

        expect(tx.serializeToString())
            .toEqual(item.result);
    });

    test.each(txListTable)('prepareTx with seedPhrase: %s', (item) => {
        const tx = prepareTx({...item.params, signatureType: 1}, {seedPhrase: item.options.seedPhrase, password: item.options.password});

        expect(tx.serializeToString())
            .toEqual(item.result);
    });
});


describe('send', () => {
    const txItem = findTxItem(TX_TYPE.SEND);

    test('default chainId: 1', () => {
        expect(prepareSignedTx({
            ...txItem.params,
            chainId: undefined,
        }, txItem.options).serialize()).toEqual(prepareSignedTx({
            ...txItem.params,
            chainId: 1,
        }, txItem.options).serialize());
    });

    test('default gasCoin: same as coin to send', () => {
        expect(prepareSignedTx({
            ...txItem.params,
            gasCoin: undefined,
        }, txItem.options).serialize()).toEqual(prepareSignedTx({
            ...txItem.params,
            gasCoin: txItem.params.data.coin,
        }, txItem.options).serialize());
    });

    test('default gasPrice: 1', () => {
        expect(prepareSignedTx({
            ...txItem.params,
            gasPrice: undefined,
        }, txItem.options).serialize()).toEqual(prepareSignedTx({
            ...txItem.params,
            gasPrice: 1,
        }, txItem.options).serialize());
    });
});

describe('sell', () => {
    const txItem = findTxItem(TX_TYPE.SELL);

    test('default gasCoin: same as coin to sell', () => {
        expect(prepareSignedTx({
            ...txItem.params,
            gasCoin: undefined,
        }, txItem.options).serialize()).toEqual(prepareSignedTx({
            ...txItem.params,
            gasCoin: txItem.params.data.coinToSell,
        }, txItem.options).serialize());
    });
});

describe('sell all', () => {
    const txItem = findTxItem(TX_TYPE.SELL_ALL);

    test('default gasCoin: same as coin to sell', () => {
        expect(prepareSignedTx({
            ...txItem.params,
            gasCoin: undefined,
        }, txItem.options).serialize()).toEqual(prepareSignedTx({
            ...txItem.params,
            gasCoin: txItem.params.data.coinToSell,
        }, txItem.options).serialize());
    });
});

describe('buy', () => {
    const txItem = findTxItem(TX_TYPE.BUY);

    test('default gasCoin: same as coin to sell', () => {
        expect(prepareSignedTx({
            ...txItem.params,
            gasCoin: undefined,
        }, txItem.options).serialize()).toEqual(prepareSignedTx({
            ...txItem.params,
            gasCoin: txItem.params.data.coinToSell,
        }, txItem.options).serialize());
    });
});

// @TODO
// describe('create coin', () => {
//     const txItem = findTxItem(TX_TYPE.CREATE_COIN);
// });

describe('declare candidacy', () => {
    const txItem = findTxItem(TX_TYPE.DECLARE_CANDIDACY);

    test('default gasCoin: same as stake coin', () => {
        expect(prepareSignedTx({
            ...txItem.params,
            gasCoin: undefined,
        }, txItem.options).serialize()).toEqual(prepareSignedTx({
            ...txItem.params,
            gasCoin: txItem.params.data.coin,
        }, txItem.options).serialize());
    });
});

describe('edit candidate', () => {
    const txItem = findTxItem(TX_TYPE.EDIT_CANDIDATE);

    test('default newPublicKey: same as publicKey', () => {
        expect(prepareSignedTx({
            ...txItem.params,
            data: {
                ...txItem.params.data,
                newPublicKey: undefined,
            },
        }, txItem.options).serialize()).toEqual(prepareSignedTx({
            ...txItem.params,
            data: {
                ...txItem.params.data,
                newPublicKey: txItem.params.data.publicKey,
            },
        }, txItem.options).serialize());
    });
});

describe('delegate', () => {
    const txItem = findTxItem(TX_TYPE.DELEGATE);

    test('default gasCoin: same as stake coin', () => {
        expect(prepareSignedTx({
            ...txItem.params,
            gasCoin: undefined,
        }, txItem.options).serialize()).toEqual(prepareSignedTx({
            ...txItem.params,
            gasCoin: txItem.params.data.coin,
        }, txItem.options).serialize());
    });
});

describe('unbond', () => {
    const txItem = findTxItem(TX_TYPE.UNBOND);

    test('default gasCoin: same as stake coin', () => {
        expect(prepareSignedTx({
            ...txItem.params,
            gasCoin: undefined,
        }, txItem.options).serialize()).toEqual(prepareSignedTx({
            ...txItem.params,
            gasCoin: txItem.params.data.coin,
        }, txItem.options).serialize());
    });
});

// @TODO
// describe('set candidate on', () => {
//     const txItem = findTxItem(TX_TYPE.SET_CANDIDATE_ON);
// });

// describe('set candidate off', () => {
//     const txItem = findTxItem(TX_TYPE.SET_CANDIDATE_OFF);
// });

// describe('create multisig', () => {
//     const txItem = findTxItem(TX_TYPE.CREATE_MULTISIG);
// });

// describe('multisend', () => {
//     const txItem = findTxItem(TX_TYPE.MULTISEND);
// });

describe('redeem check', () => {
    const txItem = findTxItem(TX_TYPE.REDEEM_CHECK);

    test('should work with custom gasCoin', () => {
        const tx = prepareSignedTx({
            ...txItem.params,
            data: {
                ...txItem.params.data,
                check: VALID_CHECK_WITH_CUSTOM_GAS_COIN,
            },
        }, txItem.options);

        expect(bufferToInteger(tx.gasCoin)).toEqual('5');
        expect(tx.serializeToString())
            .toEqual('0xf901310101010509b8e0f8deb899f8973101830f423f80888ac7230489e8000005b841b0fe6d3805fae9f38bafefb74d0f61302fb37a20f0e9337871bef91c7423277646555dcb425fbb1ec35eda8a304bda41e9242dd55cb62a48e9b14a07262bc0d3011ba0ec85458016f3ba8de03000cc0a417836da4d0ae4013be482dce89285e04e559ca065b129e4d743a193774bf287a6421f9d39e23177d8bf603b236be337811be10ab8410497ea588f0fc2bd448de76d03a74cf371269e10ac1a02765fb5fa37c29f67e0348fb3faacd3370b8809401e7d562d8943f3642ce96667188d3c344e8e5bff6d01808001b845f8431ca0c1093d36a04837646a5779fb1452f65a59b07e9f42ee1c9f7aadaec6f4259072a06bf274141e66ef8f7f4998f8fbc1835dc32fc4da17e1ddff48c17006c8b7553c');
    });

    test('gasPrice should be overwritten with 1', () => {
        expect(prepareSignedTx({
            ...txItem.params,
            gasPrice: 987,
        }, txItem.options).serialize()).toEqual(prepareSignedTx({
            ...txItem.params,
            gasPrice: 1,
        }, txItem.options).serialize());
    });

    test('gasCoin should be overwritten with gasCoin from check', () => {
        expect(prepareSignedTx({
            ...txItem.params,
            gasCoin: undefined,
        }, txItem.options).serialize()).toEqual(prepareSignedTx({
            ...txItem.params,
            gasCoin: 9876543,
        }, txItem.options).serialize());
    });
});


// @TODO move decode to test-data
describe('decodeTx', () => {
    test('should work', () => {
        expect(decodeTx('f86d822b67010180028dcc80888ac7230489e8000005808e637573746f6d206d6573736167658001b845f8431ca0ced6b4f1f2110bfed2e83431eae1a79399deec833571e6f64ea794d2b01151faa0429cfa65deae96f49c762dc163ff449939bc20c1ceed1871003b1aea0dcd8170')).toEqual({
            nonce: '11111',
            chainId: '1',
            gasPrice: '1',
            gasCoin: '0',
            type: '0x02',
            data: {
                coinToSell: '0',
                coinToBuy: '5',
                valueToSell: '10',
                minimumValueToBuy: '0',
            },
            payload: 'custom message',
            signatureType: '1',
            signatureData: '0xf8431ca0ced6b4f1f2110bfed2e83431eae1a79399deec833571e6f64ea794d2b01151faa0429cfa65deae96f49c762dc163ff449939bc20c1ceed1871003b1aea0dcd8170',
        });
    });

    test('should work decodeCheck', () => {
        expect(decodeTx('f901310101018009b8e0f8deb899f8973101830f423f80888ac7230489e8000080b84199953f49ef0ed10d971b8df2c018e7699cd749feca03cad9d03f32a8992d77ab6c818d770466500b41165c18a1826662fb0d45b3a9193fcacc13a4131702e017011ba069f7cfdead0ea971e9f3e7b060463e10929ccf2f4309b8145c0916f51f4c5040a025767d4ea835ee8fc2a096b8f99717ef65627cad5e99c2427e34a9928881ba34b8410497ea588f0fc2bd448de76d03a74cf371269e10ac1a02765fb5fa37c29f67e0348fb3faacd3370b8809401e7d562d8943f3642ce96667188d3c344e8e5bff6d01808001b845f8431ca0133f06b794c07acf1a7663ca0ea996be81c5f94edbf6f7152c06ab57ce71685ca0421b94ac1df5185ed885004edcf5d732ff142688fa63eefb5340f29d6423f310', {decodeCheck: true})).toEqual({
            nonce: '1',
            chainId: '1',
            gasPrice: '1',
            gasCoin: '0',
            type: '0x09',
            data: {
                proof: '0x0497ea588f0fc2bd448de76d03a74cf371269e10ac1a02765fb5fa37c29f67e0348fb3faacd3370b8809401e7d562d8943f3642ce96667188d3c344e8e5bff6d01',
                check: VALID_CHECK,
                checkData: {
                    nonce: '1',
                    chainId: '1',
                    coin: '0',
                    value: '10',
                    dueBlock: '999999',
                    gasCoin: '0',
                },
            },
            payload: '',
            signatureType: '1',
            signatureData: '0xf8431ca0133f06b794c07acf1a7663ca0ea996be81c5f94edbf6f7152c06ab57ce71685ca0421b94ac1df5185ed885004edcf5d732ff142688fa63eefb5340f29d6423f310',
        });
    });
});

function findTxItem(type) {
    return testData.txList.find((item) => item.params.type === Number(type));
}
