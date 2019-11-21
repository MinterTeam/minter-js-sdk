import {MinterTx, MinterTxSignature, coinToBuffer} from 'minterjs-tx';
// import MinterTx from 'minterjs-tx/src/tx';
// import MinterTxSignature from 'minterjs-tx/src/tx-signature';
// import {coinToBuffer} from 'minterjs-tx/src/helpers';
import {integerToHexString} from './utils';

/**
 * @typedef {Object} TxParams
 * @property {string|Buffer} privateKey
 * @property {number} [nonce]
 * @property {Number} [chainId=1]
 * @property {number} [gasPrice=1]
 * @property {string} [gasCoin='BIP']
 * @property {string|Buffer} txType
 * @property {Buffer} txData
 * @property {string} [payload]
 * @property {string} [message]
 */


/**
 * @param {TxParams} txParams
 * @return {MinterTx}
 */
export default function prepareSignedTx(txParams = {}) {
    const {privateKey, nonce, chainId = 1, gasPrice = 1, txType, txData} = txParams;
    // throw on falsy nonce except 0
    if (!nonce && typeof nonce !== 'number') {
        throw new Error('Invalid nonce specified, tx can\'t be prepared');
    }

    let gasCoin = txParams.gasCoin;
    if (!gasCoin) {
        if (chainId === 2) {
            gasCoin = 'MNT';
        } else {
            gasCoin = 'BIP';
        }
    }
    // @TODO asserts
    const privateKeyBuffer = typeof privateKey === 'string' ? Buffer.from(privateKey, 'hex') : privateKey;

    const txProps = {
        nonce: `0x${integerToHexString(nonce)}`,
        chainId: `0x${integerToHexString(chainId)}`,
        gasPrice: `0x${integerToHexString(gasPrice)}`,
        gasCoin: coinToBuffer(gasCoin),
        type: txType,
        data: txData,
        signatureType: '0x01',
    };

    let payload = txParams.message || txParams.payload;
    if (payload) {
        if (typeof payload === 'string') {
            payload = Buffer.from(payload, 'utf-8');
        }
        txProps.payload = payload;
    }

    const tx = new MinterTx(txProps);
    tx.signatureData = (new MinterTxSignature()).sign(tx.hash(false), privateKeyBuffer).serialize();

    return tx;
}
