import {prepareSignedTx, prepareTx, decodeTx, decodeLink} from '~/src';
import {VALID_CHECK} from '~/test/check.test.js';

const PRIVATE_KEY = '0x5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da';

const testData = {
    txList: [
        // 0x01 SEND
        {
            params: {
                nonce: 11111,
                gasPrice: 2,
                gasCoin: 0,
                type: 1,
                data: {
                    to: 'Mx376615b9a3187747dc7c32e51723515ee62e37dc',
                    value: 10,
                    coin: 0,
                },
                payload: 'custom message',
            },
            result: '0xf880822b6701028001a0df8094376615b9a3187747dc7c32e51723515ee62e37dc888ac7230489e800008e637573746f6d206d6573736167658001b845f8431ba0857e5fe7a1936395c13d83c1f5447e56920cca78f8b833dc3f2cccc8e0f9f46ba04d24dda57912af84a705077d922933b5d13ce940fedc2c44e00cda6a35576b21',
            link: 'https://bip.to/tx/9gGg34CUN2YVuaMYd0fcfDLlFyNRXuYuN9yIiscjBInoAACOY3VzdG9tIG1lc3NhZ2WCK2cCgA',
        },
        // 0x02 SELL
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 0,
                type: 2,
                data: {
                    coinToSell: 0,
                    coinToBuy: 5,
                    valueToSell: 10,
                },
                payload: 'custom message',
            },
            result: '0xf86d822b67010180028dcc80888ac7230489e8000005808e637573746f6d206d6573736167658001b845f8431ca0ced6b4f1f2110bfed2e83431eae1a79399deec833571e6f64ea794d2b01151faa0429cfa65deae96f49c762dc163ff449939bc20c1ceed1871003b1aea0dcd8170',
            link: 'https://bip.to/tx/4wKNzICIiscjBInoAAAFgI5jdXN0b20gbWVzc2FnZYIrZwGA',
        },
        // 0x03 SELL ALL
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 0,
                type: 3,
                data: {
                    coinToSell: 0,
                    coinToBuy: 5,
                },
                payload: 'custom message',
            },
            result: '0xf864822b670101800384c38005808e637573746f6d206d6573736167658001b845f8431ca0b5c2593e3bb9541533b973ab28c2052564de0f57b4f4b49c1b86adcedc8759bfa02e296e7e49c114183112b2e6e27d045b9e9dcc6303654cc3b3527953527a5f87',
            link: 'https://bip.to/tx/2gOEw4AFgI5jdXN0b20gbWVzc2FnZYIrZwGA',
        },
        // 0x04 BUY
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 0,
                type: 4,
                data: {
                    coinToSell: 0,
                    coinToBuy: 5,
                    valueToBuy: 10,
                },
                payload: 'custom message',
            },
            result: '0xf87b822b67010180049bda05888ac7230489e80000808e314dc6448d9338c15b0a000000008e637573746f6d206d6573736167658001b845f8431ca08690bdcc1cf8a2c2bedad0d6802c1c7d4c458455af8b9469f3bf9706ff741b46a051c02193a34b96325e32b0fb310fe155960cfe02a7fd0fb3ec36e97e5e967a66',
            link: 'https://bip.to/tx/8QSb2gWIiscjBInoAACAjjFNxkSNkzjBWwoAAAAAjmN1c3RvbSBtZXNzYWdlgitnAYA',
        },
        // 0x05 CREATE COIN
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 0,
                type: 5,
                data: {
                    name: 'My Coin',
                    symbol: 'MYCOIN',
                    initialAmount: 5,
                    constantReserveRatio: 10,
                    initialReserve: 20,
                },
                payload: 'custom message',
            },
            result: '0xf897822b6701018005b7f6874d7920436f696e8a4d59434f494e00000000884563918244f400008901158e460913d000000a8e314dc6448d9338c15b0a000000008e637573746f6d206d6573736167658001b845f8431ba002656d861accfa8764b31ca89d5b5b575e706d0008ecb3b3b465dbf25e8839d2a070301dcff07d500054731e54417b0629888524718e5f55e538ccfab10653a12f',
            link: 'https://bip.to/tx/-E0Ft_aHTXkgQ29pbopNWUNPSU4AAAAAiEVjkYJE9AAAiQEVjkYJE9AAAAqOMU3GRI2TOMFbCgAAAACOY3VzdG9tIG1lc3NhZ2WCK2cBgA',
        },
        // 0x06 DECLARE CANDIDACY
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 5,
                type: 6,
                data: {
                    address: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
                    publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
                    commission: 10,
                    coin: 0,
                    stake: 100,
                },
                payload: 'custom message',
            },
            result: '0xf8a5822b6701010506b844f842947633980c000139dd3bd24a3f54e06474fa941e16a0f9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a30a8089056bc75e2d631000008e637573746f6d206d6573736167658001b845f8431ba08e3526126be7ea6216cebff2b70994092de78d5056a29c57190787cdf1582b9fa00d4ee7f2ade6e4cc219729a87459f5ce3fe214d931ddcc4596dedec814a4c1a5',
            link: 'https://bip.to/tx/-FsGuET4QpR2M5gMAAE53TvSSj9U4GR0-pQeFqD54DaDmin3-6LVOUvUie2pJ8y5WsyZ5QbmiOSIgIKzowqAiQVrx14tYxAAAI5jdXN0b20gbWVzc2FnZYIrZwEF',
        },
        // 0x07 DELEGATE
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 0,
                type: 7,
                data: {
                    publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
                    coin: 0,
                    stake: 100,
                },
                payload: 'custom message',
            },
            result: '0xf88d822b6701018007adeca0f9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a38089056bc75e2d631000008e637573746f6d206d6573736167658001b845f8431ba0f1c462ad21a2c4c855077348f6b18d12b16dd38400e48f2be03b07e0b3c2ce81a01cfef836e4b8878a9cd51137f4d01dafc6a0abb69034917aefd8b20143cea5af',
            link: 'https://bip.to/tx/-EMHreyg-eA2g5op9_ui1TlL1IntqSfMuVrMmeUG5ojkiICCs6OAiQVrx14tYxAAAI5jdXN0b20gbWVzc2FnZYIrZwGA',
        },
        // 0x08 UNBOND
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 0,
                type: 8,
                data: {
                    publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
                    coin: 0,
                    stake: 100,
                },
                payload: 'custom message',
            },
            result: '0xf88d822b6701018008adeca0f9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a38089056bc75e2d631000008e637573746f6d206d6573736167658001b845f8431ca0a007dfc1b8c21a4564cff980c7d066050f8d7b6b7083f0805828c3e91aa0bf63a010cc83602990213f6b338cdafe2249f137abcaba4bb656b5e46f540b90c76998',
            link: 'https://bip.to/tx/-EMIreyg-eA2g5op9_ui1TlL1IntqSfMuVrMmeUG5ojkiICCs6OAiQVrx14tYxAAAI5jdXN0b20gbWVzc2FnZYIrZwGA',
        },
        // 0x0A SET CANDIDATE ON
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 0,
                type: 10,
                data: {
                    publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
                },
                payload: 'custom message',
            },
            result: '0xf882822b670101800aa2e1a0f9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a38e637573746f6d206d6573736167658001b845f8431ca0fc15746ddfa49d279c6d5b7493250b73e28b08a12a1ea57e69888082fcb13678a00e17789f9be5832c70d53253c70b4e70207e60eab36e7b83cd2fece12252d38a',
            link: 'https://bip.to/tx/-DgKouGg-eA2g5op9_ui1TlL1IntqSfMuVrMmeUG5ojkiICCs6OOY3VzdG9tIG1lc3NhZ2WCK2cBgA',
        },
        // 0x0B SET CANDIDATE OFF
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 0,
                type: 11,
                data: {
                    publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
                },
                payload: 'custom message',
            },
            result: '0xf882822b670101800ba2e1a0f9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a38e637573746f6d206d6573736167658001b845f8431ca0ef308c01aa7fd43d3f1528e98a81d561633f0337cb6fe92d6215f2b476884066a03ab8ca73f023ee82fe77f7f72b3f953ea58e29408a2f27915120458faf8bed89',
            link: 'https://bip.to/tx/-DgLouGg-eA2g5op9_ui1TlL1IntqSfMuVrMmeUG5ojkiICCs6OOY3VzdG9tIG1lc3NhZ2WCK2cBgA',
        },
        // 0x09 REDEEM CHECK
        {
            params: {
                nonce: 1,
                gasPrice: 1,
                gasCoin: 0,
                type: 9,
                data: {
                    check: VALID_CHECK,
                },
            },
            options: {
                password: 'pass',
            },
            result: '0xf901310101018009b8e0f8deb899f8973101830f423f80888ac7230489e8000080b84199953f49ef0ed10d971b8df2c018e7699cd749feca03cad9d03f32a8992d77ab6c818d770466500b41165c18a1826662fb0d45b3a9193fcacc13a4131702e017011ba069f7cfdead0ea971e9f3e7b060463e10929ccf2f4309b8145c0916f51f4c5040a025767d4ea835ee8fc2a096b8f99717ef65627cad5e99c2427e34a9928881ba34b8410497ea588f0fc2bd448de76d03a74cf371269e10ac1a02765fb5fa37c29f67e0348fb3faacd3370b8809401e7d562d8943f3642ce96667188d3c344e8e5bff6d01808001b845f8431ca0133f06b794c07acf1a7663ca0ea996be81c5f94edbf6f7152c06ab57ce71685ca0421b94ac1df5185ed885004edcf5d732ff142688fa63eefb5340f29d6423f310',
            link: 'https://bip.to/tx/-KUJuJ74nLiZ-JcxAYMPQj-AiIrHIwSJ6AAAgLhBmZU_Se8O0Q2XG43ywBjnaZzXSf7KA8rZ0D8yqJktd6tsgY13BGZQC0EWXBihgmZi-w1Fs6kZP8rME6QTFwLgFwEboGn3z96tDqlx6fPnsGBGPhCSnM8vQwm4FFwJFvUfTFBAoCV2fU6oNe6PwqCWuPmXF-9lYnytXpnCQn40qZKIgbo0gIABAYA?p=cGFzcw',
        },
        // 0x0C CREATE MULTISIG
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 0,
                type: 12,
                data: {
                    addresses: ['Mxee81347211c72524338f9680072af90744333146', 'Mxee81347211c72524338f9680072af90744333145', 'Mxee81347211c72524338f9680072af90744333144'],
                    weights: [1, 3, 5],
                    threshold: 7,
                },
                payload: 'custom message',
            },
            result: '0xf8a9822b670101800cb848f84607c3010305f83f94ee81347211c72524338f9680072af9074433314694ee81347211c72524338f9680072af9074433314594ee81347211c72524338f9680072af907443331448e637573746f6d206d6573736167658001b845f8431ca02d2d8cc884fde9ee6c32936ec506f47e3b8084b004423f843a0c2f165975c8d9a0247130295d0a835c6db0fad888f0c8628d3a2989ea4aac5ac6cb27f077bb9992',
            link: 'https://bip.to/tx/-F8MuEj4RgfDAQMF-D-U7oE0chHHJSQzj5aAByr5B0QzMUaU7oE0chHHJSQzj5aAByr5B0QzMUWU7oE0chHHJSQzj5aAByr5B0QzMUSOY3VzdG9tIG1lc3NhZ2WCK2cBgA',
        },
        // 0x0D MULTISEND
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 0,
                type: 13,
                data: {
                    list: [
                        {
                            value: 0.1,
                            coin: 0,
                            to: 'Mxfe60014a6e9ac91618f5d1cab3fd58cded61ee99',
                        },
                        {
                            value: 0.2,
                            coin: 5,
                            to: 'Mxddab6281766ad86497741ff91b6b48fe85012e3c',
                        },
                    ],
                },
                payload: 'custom message',
            },
            result: '0xf8a5822b670101800db844f842f840df8094fe60014a6e9ac91618f5d1cab3fd58cded61ee9988016345785d8a0000df0594ddab6281766ad86497741ff91b6b48fe85012e3c8802c68af0bb1400008e637573746f6d206d6573736167658001b845f8431ca0fae201de825c4c536bada44bb4ae738a5d7deec77a630d42a3510b71ca5ee8fda040b0a55a561d4a38d809635a6f3ac03ae5efe6e5b211b4f812d1113fa6ca16e0',
            link: 'https://bip.to/tx/-FsNuET4QvhA34CU_mABSm6ayRYY9dHKs_1Yze1h7pmIAWNFeF2KAADfBZTdq2KBdmrYZJd0H_kba0j-hQEuPIgCxorwuxQAAI5jdXN0b20gbWVzc2FnZYIrZwGA',
        },
        // 0x0E EDIT CANDIDATE
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 0,
                type: 14,
                data: {
                    publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
                    newPublicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
                    rewardAddress: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
                    ownerAddress: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
                    controlAddress: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
                },
                payload: 'custom message',
            },
            result: '0xf8e4822b670101800eb883f881a0f9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3a0f9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3947633980c000139dd3bd24a3f54e06474fa941e16947633980c000139dd3bd24a3f54e06474fa941e16947633980c000139dd3bd24a3f54e06474fa941e168e637573746f6d206d6573736167658001b845f8431ca0429d4e1321c8d8f5ffbd66487ef445cd2ab572cfd2a73932e77c5b4304c8427fa0674e406edd99588301a9ba6e82daf5886108cd32ff676fe5c71816ce9feae68a',
            link: 'https://bip.to/tx/-JoOuIP4gaD54DaDmin3-6LVOUvUie2pJ8y5WsyZ5QbmiOSIgIKzo6D54DaDmin3-6LVOUvUie2pJ8y5WsyZ5QbmiOSIgIKzo5R2M5gMAAE53TvSSj9U4GR0-pQeFpR2M5gMAAE53TvSSj9U4GR0-pQeFpR2M5gMAAE53TvSSj9U4GR0-pQeFo5jdXN0b20gbWVzc2FnZYIrZwGA',
        },
    ],
};

testData.txList.forEach((item) => {
    if (!item.options) {
        item.options = {};
    }
    item.options.privateKey = PRIVATE_KEY;
});

const fullTestData = JSON.parse(JSON.stringify(testData));
fullTestData.txList = fullTestData.txList.map((item) => {
    item.params = decodeTx(prepareSignedTx(item.params, item.options).serialize().toString('hex'));
    return item;
});

export {testData, fullTestData};
