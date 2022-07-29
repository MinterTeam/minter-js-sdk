import {prepareSignedTx, prepareTx, decodeTx, decodeLink} from '~/src';
import {VALID_CHECK} from '~/test/check.test.js';

// Mx7633980c000139dd3bd24a3f54e06474fa941e16
const SEED_PHRASE = 'exercise fantasy smooth enough arrive steak demise donkey true employ jealous decide blossom bind someone';
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
                    rewardAddress: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
                    ownerAddress: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
                    controlAddress: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
                },
                payload: 'custom message',
            },
            result: '0xf8c3822b670101800eb862f860a0f9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3947633980c000139dd3bd24a3f54e06474fa941e16947633980c000139dd3bd24a3f54e06474fa941e16947633980c000139dd3bd24a3f54e06474fa941e168e637573746f6d206d6573736167658001b845f8431ca07f20bc0ff74bd287023324459b8647755e8922ca067be51bd49a863c505510e7a00f30242b6d01af1ef0c50a451ac51840988f304bf6a07a28967051718a8974a2',
            link: 'https://bip.to/tx/-HkOuGL4YKD54DaDmin3-6LVOUvUie2pJ8y5WsyZ5QbmiOSIgIKzo5R2M5gMAAE53TvSSj9U4GR0-pQeFpR2M5gMAAE53TvSSj9U4GR0-pQeFpR2M5gMAAE53TvSSj9U4GR0-pQeFo5jdXN0b20gbWVzc2FnZYIrZwGA',
        },
        // 0x0F SET HALT BLOCK
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 0,
                type: 0x0f,
                data: {
                    publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
                    height: 123456789,
                },
                payload: 'custom message',
            },
            result: '0xf887822b670101800fa7e6a0f9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a384075bcd158e637573746f6d206d6573736167658001b845f8431ba0921cad95b8c005b26781fc4ae1f7154e0ffb8158fb0e6b8d453a63d8294bc95aa063aaa620575ac7d5649e06cce706b4c7811258bca577605ad9ef1068ce63fcda',
            link: 'https://bip.to/tx/-D0Pp-ag-eA2g5op9_ui1TlL1IntqSfMuVrMmeUG5ojkiICCs6OEB1vNFY5jdXN0b20gbWVzc2FnZYIrZwGA',
        },
        // 0x10 RECREATE COIN
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 0,
                type: 0x10,
                data: {
                    name: 'My Coin',
                    symbol: 'MYCOIN',
                    initialAmount: 5,
                    constantReserveRatio: 10,
                    initialReserve: 20,
                },
                payload: 'custom message',
            },
            result: '0xf897822b6701018010b7f6874d7920436f696e8a4d59434f494e00000000884563918244f400008901158e460913d000000a8e314dc6448d9338c15b0a000000008e637573746f6d206d6573736167658001b845f8431ca062dfd967db7228c846dc06ed95c8b035b75dcad212b616804256a345d2d2dc68a02998861fede069768f7f33f3648be61249ced816b8b3cde59293eb9a5d0f7988',
            link: 'https://bip.to/tx/-E0Qt_aHTXkgQ29pbopNWUNPSU4AAAAAiEVjkYJE9AAAiQEVjkYJE9AAAAqOMU3GRI2TOMFbCgAAAACOY3VzdG9tIG1lc3NhZ2WCK2cBgA',
        },
        // 0x11 EDIT COIN OWNER
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 0,
                type: 0x11,
                data: {
                    symbol: 'MYCOIN',
                    newOwner: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
                },
                payload: 'custom message',
            },
            result: '0xf881822b6701018011a1e08a4d59434f494e00000000947633980c000139dd3bd24a3f54e06474fa941e168e637573746f6d206d6573736167658001b845f8431ca0f5e49304699574c6802c1a7f8fe33f4c5771fbf39d1828aca11bd9cf999c7c57a07573ca70f05004bbd1f9c0515fc7b2971c45c2a0559ad72549246aa32a3e2298',
            link: 'https://bip.to/tx/9xGh4IpNWUNPSU4AAAAAlHYzmAwAATndO9JKP1TgZHT6lB4WjmN1c3RvbSBtZXNzYWdlgitnAYA',
        },
        // 0x12 EDIT MULTISIG
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 0,
                type: 0x12,
                data: {
                    addresses: ['Mxee81347211c72524338f9680072af90744333144', 'Mxee81347211c72524338f9680072af90744333145', 'Mxee81347211c72524338f9680072af90744333146'],
                    weights: [5, 3, 1],
                    threshold: 7,
                },
                payload: 'custom message',
            },
            result: '0xf8a9822b6701018012b848f84607c3050301f83f94ee81347211c72524338f9680072af9074433314494ee81347211c72524338f9680072af9074433314594ee81347211c72524338f9680072af907443331468e637573746f6d206d6573736167658001b845f8431ba0fbadd54a67d2b6270f4164919bb0f14a40328feb2ea4bc9c6f1e9542a7c17f11a026284b2d96b16e0219fcb1506a015731f6420d400d2fe447795837650b8e4ea9',
            link: 'https://bip.to/tx/-F8SuEj4RgfDBQMB-D-U7oE0chHHJSQzj5aAByr5B0QzMUSU7oE0chHHJSQzj5aAByr5B0QzMUWU7oE0chHHJSQzj5aAByr5B0QzMUaOY3VzdG9tIG1lc3NhZ2WCK2cBgA',
        },
        // 0x13 PRICE VOTE
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 0,
                type: 0x13,
                data: {
                    price: 1234567890,
                },
                payload: 'custom message',
            },
            result: '0xf866822b670101801386c584499602d28e637573746f6d206d6573736167658001b845f8431ca054932d530253ba3e9cff4db036bb8320e9597e1ad59c429ceff00e572f947240a01bf7641b7ad6e0ef0ed419cdbe91728b66ddd79b62c27e08baf10fea42280ecb',
            link: 'https://bip.to/tx/3BOGxYRJlgLSjmN1c3RvbSBtZXNzYWdlgitnAYA',
        },
        // 0x14 EDIT_CANDIDATE_PUBLIC_KEY
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 0,
                type: 0x14,
                data: {
                    publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
                    newPublicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a4',
                },
                payload: 'custom message',
            },
            result: '0xf8a5822b6701018014b844f842a0f9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3a0f9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a48e637573746f6d206d6573736167658001b845f8431ca0234ca815eb34d27a13a6aa55aabe60af485d932f2042189fcf81bf5e61c4ec77a02f1e24392b66feb555a25de8953e8d6a3d34e95fc6db8a021af98f466010fe21',
            link: 'https://bip.to/tx/-FsUuET4QqD54DaDmin3-6LVOUvUie2pJ8y5WsyZ5QbmiOSIgIKzo6D54DaDmin3-6LVOUvUie2pJ8y5WsyZ5QbmiOSIgIKzpI5jdXN0b20gbWVzc2FnZYIrZwGA',
        },
        // 0x15 ADD_LIQUIDITY
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 0,
                type: 0x15,
                data: {
                    coin0: 12,
                    coin1: 21,
                    volume0: 123456,
                    maximumVolume1: 500,
                },
                payload: 'custom message',
            },
            result: '0xf877822b670101801598d70c158a1a24902bee1421000000891b1ae4d6e2ef5000008e637573746f6d206d6573736167658001b844f8421ca0b41161eab00b8aabd137acc4da4ace7f62f7caa55876dcee5f8729113ccc71939ff46aacd7ff88aa8997c44301f3e0094c30edf9fb181fe1c6410c9266192cee',
            link: 'https://bip.to/tx/7hWY1wwVihokkCvuFCEAAACJGxrk1uLvUAAAjmN1c3RvbSBtZXNzYWdlgitnAYA',
        },
        // 0x16 REMOVE_LIQUIDITY
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 0,
                type: 0x16,
                data: {
                    coin0: 12,
                    coin1: 21,
                    liquidity: 123456,
                    minimumVolume0: 0,
                    minimumVolume1: 0,
                },
                payload: 'custom message',
            },
            result: '0xf870822b670101801690cf0c158a1a24902bee142100000080808e637573746f6d206d6573736167658001b845f8431ca0a5b370216f61f96d4514dd84a6f76ff1bc0cea9caa8b503c8ee34034b677fdbca0277730569e4869c92793c5b87f744f79efa891ede129854935b69cce19b124c2',
            link: 'https://bip.to/tx/5haQzwwVihokkCvuFCEAAACAgI5jdXN0b20gbWVzc2FnZYIrZwGA',
        },
        // 0x17 SELL_SWAP_POOL
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 0,
                type: 0x17,
                data: {
                    coins: [0, 12, 53],
                    valueToSell: 10,
                },
                payload: 'custom message',
            },
            result: '0xf86f822b67010180178fcec3800c35888ac7230489e80000808e637573746f6d206d6573736167658001b845f8431ba0fe9e177021ce5ba3420d09dddbe06bf16a668e463af92dad2a6f986651cef644a06ab1666618965944d019176fbaf6d54c42fa39ddd543dc063ef2b491f4ad77c8',
            link: 'https://bip.to/tx/5RePzsOADDWIiscjBInoAACAjmN1c3RvbSBtZXNzYWdlgitnAYA',
        },
        // 0x18 BUY_SWAP_POOL
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 0,
                type: 0x18,
                data: {
                    coins: [0, 12, 53],
                    valueToBuy: 10,
                },
                payload: 'custom message',
            },
            result: '0xf87d822b67010180189ddcc3800c35888ac7230489e800008e314dc6448d9338c15b0a000000008e637573746f6d206d6573736167658001b845f8431ba0952012ae23fd66e6b1c504a5a5f4ce31d242f8d2d2bf29c64bbaff41fef15528a0164cbb2eabe3112585ea09b26af7ffcd40b8348f6bc69d5f74de48593bcfef49',
            link: 'https://bip.to/tx/8xid3MOADDWIiscjBInoAACOMU3GRI2TOMFbCgAAAACOY3VzdG9tIG1lc3NhZ2WCK2cBgA',
        },
        // 0x19 SELL_ALL_SWAP_POOL
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 0,
                type: 0x19,
                data: {
                    coins: [0, 12, 53],
                },
                payload: 'custom message',
            },
            result: '0xf866822b670101801986c5c3800c35808e637573746f6d206d6573736167658001b845f8431ba040bd12a228ce40350ad1e9bfbec02ea011707fafd86f372364fc79859ef3ce62a04732b811d3aa4af9f5b80bff5469b6ac28ad3c94e76da00797fa0230e6721f3f',
            link: 'https://bip.to/tx/3BmGxcOADDWAjmN1c3RvbSBtZXNzYWdlgitnAYA',
        },
        // 0x1a EDIT_CANDIDATE_COMMISSION
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 0,
                type: 0x1a,
                data: {
                    publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
                    commission: '15',
                },
                payload: 'custom message',
            },
            result: '0xf883822b670101801aa3e2a0f9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a30f8e637573746f6d206d6573736167658001b845f8431ba020c43a56bf377cfa8d2f030d08043985d00d92e0859808ebc95efd9ecd960d5aa03fe083a2a4f5ebe5e3760e7d0093e407bd880cdddd4b8791f8b71f62061a7c94',
            link: 'https://bip.to/tx/-Dkao-Kg-eA2g5op9_ui1TlL1IntqSfMuVrMmeUG5ojkiICCs6MPjmN1c3RvbSBtZXNzYWdlgitnAYA',
        },
        // 0x1b MOVE_STAKE
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 0,
                type: 0x1b,
                data: {
                    from: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
                    to: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a4',
                    coin: 0,
                    stake: 100,
                },
                payload: 'custom message',
            },
            result: '0xf8b0822b670101801bb84ff84da0f9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3a0f9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a48089056bc75e2d631000008e637573746f6d206d6573736167658001b845f8431ba0c115e390323f5b5e5945728d904c4f90c88aa19db2951886865b1508206e299ba072879e6cca100bac1ebd68becfd72a52dda2a72b7936d026d907e7502dd399cf',
            link: 'https://bip.to/tx/-GYbuE_4TaD54DaDmin3-6LVOUvUie2pJ8y5WsyZ5QbmiOSIgIKzo6D54DaDmin3-6LVOUvUie2pJ8y5WsyZ5QbmiOSIgIKzpICJBWvHXi1jEAAAjmN1c3RvbSBtZXNzYWdlgitnAYA',
        },
        // 0x1c MINT_TOKEN
        {
            params: {
                nonce: 11111,
                gasPrice: 2,
                gasCoin: 0,
                type: 0x1c,
                data: {
                    value: 10,
                    coin: 0,
                },
                payload: 'custom message',
            },
            result: '0xf86a822b670102801c8bca80888ac7230489e800008e637573746f6d206d6573736167658001b844f8421ca09c3bc33b412b10f75c9765e12078d85ae45da3c38cf3cf9bb045e139954022a89fc799daf8369ab1e71bca79ea0272abbec4000e685779aabec8f886f5528937',
            link: 'https://bip.to/tx/4RyLyoCIiscjBInoAACOY3VzdG9tIG1lc3NhZ2WCK2cCgA',
        },
        // 0x1d BURN_TOKEN
        {
            params: {
                nonce: 11111,
                gasPrice: 2,
                gasCoin: 0,
                type: 0x1d,
                data: {
                    value: 10,
                    coin: 0,
                },
                payload: 'custom message',
            },
            result: '0xf86b822b670102801d8bca80888ac7230489e800008e637573746f6d206d6573736167658001b845f8431ba00cc2c9dd98314a8ad128bd367d0ec4a20ccf06ce58c1c2b24eab1014d857c8eda0359faea083a59de1b26198c5269aa8d7321c7ed6258bd7f2e017185c9a297cbf',
            link: 'https://bip.to/tx/4R2LyoCIiscjBInoAACOY3VzdG9tIG1lc3NhZ2WCK2cCgA',
        },
        // 0x1e CREATE_TOKEN
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 0,
                type: 0x1e,
                data: {
                    name: 'My Coin',
                    symbol: 'MYCOIN',
                    initialAmount: 5,
                    mintable: false,
                    burnable: true,
                },
                payload: 'custom message',
            },
            result: '0xf88e822b670101801eaeed874d7920436f696e8a4d59434f494e00000000884563918244f400008e314dc6448d9338c15b0a0000000080018e637573746f6d206d6573736167658001b845f8431ca0d8725dde0993ec91be865eb915ca2e0a11fc80d629d9b5d65b072d8a8730d0f4a026166ebf9418a0c189ebcca6b461d220bec7ec5508ecf63c95ad7b6b232f493e',
            link: 'https://bip.to/tx/-EQeru2HTXkgQ29pbopNWUNPSU4AAAAAiEVjkYJE9AAAjjFNxkSNkzjBWwoAAAAAgAGOY3VzdG9tIG1lc3NhZ2WCK2cBgA',
        },
        // 0x1f RECREATE_TOKEN
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 0,
                type: 0x1f,
                data: {
                    name: 'My Coin',
                    symbol: 'MYCOIN',
                    initialAmount: 5,
                    mintable: false,
                    burnable: true,
                },
                payload: 'custom message',
            },
            result: '0xf88e822b670101801faeed874d7920436f696e8a4d59434f494e00000000884563918244f400008e314dc6448d9338c15b0a0000000080018e637573746f6d206d6573736167658001b845f8431ba0858baa534d66875c6619c2b2a282871afe5c48db48bb95f88f46b75bf77534dfa00fc786aef53462f211d27c535a002d14d3dbfff9723ca1690f2e80a3bdc4ec0c',
            link: 'https://bip.to/tx/-EQfru2HTXkgQ29pbopNWUNPSU4AAAAAiEVjkYJE9AAAjjFNxkSNkzjBWwoAAAAAgAGOY3VzdG9tIG1lc3NhZ2WCK2cBgA',
        },
        // 0x20 VOTE_COMMISSION
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 0,
                type: 0x20,
                data: {
                    publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
                    height: '123456789',
                    coin: '0',
                    payloadByte: '12',
                    send: '12',
                    buyBancor: '12',
                    sellBancor: '12',
                    sellAllBancor: '12',
                    buyPoolBase: '12',
                    sellPoolBase: '12',
                    sellAllPoolBase: '12',
                    buyPoolDelta: '12',
                    sellPoolDelta: '12',
                    sellAllPoolDelta: '12',
                    createTicker3: '12',
                    createTicker4: '12',
                    createTicker5: '12',
                    createTicker6: '12',
                    createTicker7to10: '12',
                    createCoin: '12',
                    createToken: '12',
                    recreateCoin: '12',
                    recreateToken: '12',
                    declareCandidacy: '12',
                    delegate: '12',
                    unbond: '12',
                    redeemCheck: '12',
                    setCandidateOn: '12',
                    setCandidateOff: '12',
                    createMultisig: '12',
                    multisendBase: '12',
                    multisendDelta: '12',
                    editCandidate: '12',
                    setHaltBlock: '12',
                    editTickerOwner: '12',
                    editMultisig: '12',
                    // priceVote: '12',
                    editCandidatePublicKey: '12',
                    addLiquidity: '12',
                    removeLiquidity: '12',
                    editCandidateCommission: '12',
                    burnToken: '12',
                    mintToken: '12',
                    voteCommission: '12',
                    voteUpdate: '12',
                    createSwapPool: '12',
                    failedTx: '12',
                    addLimitOrder: '12',
                    removeLimitOrder: '12',
                    moveStake: '12',
                    lockStake: '12',
                    lock: '12',
                },
                payload: 'custom message',
            },
            result: '0xf9023c822b6701018020b901daf901d7a0f9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a384075bcd158088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b0000088a688906bd8b000008e637573746f6d206d6573736167658001b845f8431ca09ddee3029b6e331f40221286df61a3c8632adb5d134c6761db041e2a9c64fb53a04980c306cde9b098791a6dc9000f45b8eeddd6e7777bc8ee2fb9f440f4157840',
            link: 'https://bip.to/tx/-QHyILkB2vkB16D54DaDmin3-6LVOUvUie2pJ8y5WsyZ5QbmiOSIgIKzo4QHW80VgIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAIimiJBr2LAAAI5jdXN0b20gbWVzc2FnZYIrZwGA',
        },
        // 0x21 VOTE_UPDATE
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 0,
                type: 0x21,
                data: {
                    version: 'v0.0.1',
                    publicKey: 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3',
                    height: 123456789,
                },
                payload: 'custom message',
            },
            result: '0xf88e822b6701018021aeed8676302e302e31a0f9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a384075bcd158e637573746f6d206d6573736167658001b845f8431ba0230d92616e42e0fa2d10804cd405201c998763818c9e13656f798dbe74a20695a01df980e931b5f3b2ee498c6598dd99a72339f4f48880f96063098ad9e46e5538',
            link: 'https://bip.to/tx/-EQhru2GdjAuMC4xoPngNoOaKff7otU5S9SJ7aknzLlazJnlBuaI5IiAgrOjhAdbzRWOY3VzdG9tIG1lc3NhZ2WCK2cBgA',
        },
        // 0x22 CREATE_SWAP_POOL
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 0,
                type: 0x22,
                data: {
                    coin0: 12,
                    coin1: 21,
                    volume0: 123456,
                    volume1: 500,
                },
                payload: 'custom message',
            },
            result: '0xf878822b670101802298d70c158a1a24902bee1421000000891b1ae4d6e2ef5000008e637573746f6d206d6573736167658001b845f8431ba0d357edd48f7554f7cc4517e4f77f7c1be0404c794f50e37544f12c9a000ad1dca007b5384c81f522e6b83390bac8a6b3b5a176878962a9abaf9a68a77c5ee0b346',
            link: 'https://bip.to/tx/7iKY1wwVihokkCvuFCEAAACJGxrk1uLvUAAAjmN1c3RvbSBtZXNzYWdlgitnAYA',
        },
        // 0x23 ADD_LIMIT_ORDER
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 0,
                type: 0x23,
                data: {
                    coinToSell: 0,
                    coinToBuy: 5,
                    valueToSell: 10,
                    valueToBuy: 10,
                },
                payload: 'custom message',
            },
            result: '0xf875822b670101802395d480888ac7230489e8000005888ac7230489e800008e637573746f6d206d6573736167658001b845f8431ca0e07b5d227381c9ac85341e9dd2cddf7351a3eafce7ad3b88fbaf9c073297bf86a02d040d2278a94614de1c7597c4bc2e417464acb67fb8adb9cf192580c1953045',
            link: 'https://bip.to/tx/6yOV1ICIiscjBInoAAAFiIrHIwSJ6AAAjmN1c3RvbSBtZXNzYWdlgitnAYA',
        },
        // 0x24 REMOVE_LIMIT_ORDER
        {
            params: {
                nonce: 11111,
                gasPrice: 1,
                gasCoin: 0,
                type: 0x24,
                data: {
                    id: 123456789,
                },
                payload: 'custom message',
            },
            result: '0xf866822b670101802486c584075bcd158e637573746f6d206d6573736167658001b845f8431ba0ea23e9638e5a11771b19fa2b9aebf2ac7e36a5682a2d32cc05b5360c82b6c330a0611808dcab4e39525916c58fa5f57fd63b2e444e5997ae90ff38f7d3f154a9b4',
            link: 'https://bip.to/tx/3CSGxYQHW80VjmN1c3RvbSBtZXNzYWdlgitnAYA',
        },
        // 0x25 LOCK_STAKE
        {
            params: {
                nonce: 11111,
                gasPrice: 2,
                gasCoin: 0,
                type: 0x25,
                data: {
                },
                payload: 'custom message',
            },
            result: '0xf861822b670102802581c08e637573746f6d206d6573736167658001b845f8431ba017ba3944a831866f31413ec94734f766b3ddc2018c501b83df3e8c00b8c24613a063e08d1b702706b65fc0708cdb3f865c73fc0baf0931c78975be6564d697b52c',
            link: 'https://bip.to/tx/1yWBwI5jdXN0b20gbWVzc2FnZYIrZwKA',
        },
        // 0x26 LOCK
        {
            params: {
                nonce: 11111,
                gasPrice: 2,
                gasCoin: 0,
                type: 0x26,
                data: {
                    dueBlock: 123,
                    value: 10,
                    coin: 0,
                },
                payload: 'custom message',
            },
            result: '0xf86c822b67010280268ccb7b80888ac7230489e800008e637573746f6d206d6573736167658001b845f8431ca0e0e54643bdf3eb12d808775d5d1deac0a6b431dccef68aa50ea56fc3c1cc6daca00ec824758abc48c3dd8f9988f95df8ce37765b5fffe40ce564e71f1904929b98',
            link: 'https://bip.to/tx/4iaMy3uAiIrHIwSJ6AAAjmN1c3RvbSBtZXNzYWdlgitnAoA',
        },
    ],
};

testData.txList.forEach((item) => {
    if (!item.options) {
        item.options = {};
    }
    item.options.privateKey = PRIVATE_KEY;
    item.options.seedPhrase = SEED_PHRASE;
});

const fullTestData = JSON.parse(JSON.stringify(testData));
fullTestData.txList = fullTestData.txList.map((item) => {
    item.params = decodeTx(prepareSignedTx(item.params, item.options).serialize());
    return item;
});

export {testData, fullTestData};
