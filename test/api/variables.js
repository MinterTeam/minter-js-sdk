import {walletFromMnemonic} from 'minterjs-wallet';
import {Minter, API_TYPE_GATE, API_TYPE_NODE} from '~/src';

// mnemonic: exercise fantasy smooth enough arrive steak demise donkey true employ jealous decide blossom bind someone
// private: 5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da
// address: Mx7633980c000139dd3bd24a3f54e06474fa941e16

// qa.gate-api.minter.network wallets with 1 000 000 000
// "Mxeeda61bbe9929bf883af6b22f5796e4b92563ba4" // puzzle feed enlist rack cliff divert exist bind swamp kiwi casino pull
// "Mx634550aa7dc347d5e60888da2529c56f1818e403" // air model item valley auction bullet crisp always erosion paper orient fog
// "Mx49ca5b11f0055347df169985c0b70914150bb567" // erupt level forum warrior mutual wrap this elephant destroy trim habit annual

const ENV_TESTNET = 'testnet';
const ENV_QA_TESTNET = 'qa';
const ENV_CHILI_TESTNET = 'chili';
const TESTNET_MENMONIC = 'exercise fantasy smooth enough arrive steak demise donkey true employ jealous decide blossom bind someone';
const TESTNET_MENMONIC_2 = 'balance exist engage bargain slab genuine urge tooth critic slab admit coyote';
const QA_MNEMONIC = 'puzzle feed enlist rack cliff divert exist bind swamp kiwi casino pull';
const QA_MNEMONIC_2 = 'air model item valley auction bullet crisp always erosion paper orient fog';
const CHILI_MNEMONIC = 'puzzle feed enlist rack cliff divert exist bind swamp kiwi casino pull';
const CHILI_MNEMONIC_2 = 'air model item valley auction bullet crisp always erosion paper orient fog';
// const CHILI_MNEMONIC = 'echo figure script juice spell trigger climb south special school biology motor';
// const CHILI_MNEMONIC_2 = 'measure enhance jealous amateur object cash reflect blood lab dawn oxygen garage';

const ENV_SETTINGS = {
    [ENV_TESTNET]: {
        nodeBaseUrl: 'https://minter-node-1.testnet.minter.network/',
        gateBaseUrl: 'https://gate-api.testnet.minter.network/api/v1/',
        mnemonic: TESTNET_MENMONIC,
        // 5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da
        privateKey: walletFromMnemonic(TESTNET_MENMONIC).getPrivateKeyString(),
        address: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        mnemonic2: TESTNET_MENMONIC_2,
        privateKey2: walletFromMnemonic(TESTNET_MENMONIC_2).getPrivateKeyString(),
        address2: 'Mx116932f4353d643ac2410714f74fc1dfbc9c4053',
        customCoin: 'TESTCOIN01',
    },
    [ENV_QA_TESTNET]: {
        nodeBaseUrl: 'https://qa.node-api.minter.network/',
        gateBaseUrl: 'https://qa.gate-api.minter.network/api/v1/',
        mnemonic: QA_MNEMONIC,
        privateKey: walletFromMnemonic(QA_MNEMONIC).getPrivateKeyString(),
        address: 'Mxeeda61bbe9929bf883af6b22f5796e4b92563ba4',
        mnemonic2: QA_MNEMONIC_2,
        privateKey2: walletFromMnemonic(QA_MNEMONIC_2).getPrivateKeyString(),
        address2: 'Mx634550aa7dc347d5e60888da2529c56f1818e403',
        customCoin: 'TESTCOIN01',
    },
    [ENV_CHILI_TESTNET]: {
        nodeBaseUrl: 'http://node.chilinet.minter.network:28843/',
        gateBaseUrl: 'https://gate-api.chilinet.minter.network/api/v2/',
        mnemonic: CHILI_MNEMONIC,
        privateKey: walletFromMnemonic(CHILI_MNEMONIC).getPrivateKeyString(),
        address: 'Mxeeda61bbe9929bf883af6b22f5796e4b92563ba4',
        mnemonic2: CHILI_MNEMONIC_2,
        privateKey2: walletFromMnemonic(CHILI_MNEMONIC_2).getPrivateKeyString(),
        address2: 'Mx634550aa7dc347d5e60888da2529c56f1818e403',
        customCoin: 'TESTCOIN01',
    },
};

// select environment
const currentEnv = ENV_CHILI_TESTNET;
export const ENV_DATA = ENV_SETTINGS[currentEnv];


export const minterNode = new Minter({apiType: API_TYPE_NODE, baseURL: ENV_DATA.nodeBaseUrl, timeout: 25000});
export const minterGate = new Minter({apiType: API_TYPE_GATE, baseURL: ENV_DATA.gateBaseUrl, timeout: 25000});
