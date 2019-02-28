import {Buffer} from 'safe-buffer';
import MinterTx, {MinterTxSignature, formatCoin} from 'minterjs-tx';
import {toHexString} from './utils';

/**
 * @typedef {Object} TxParams
 * @property {string|Buffer} privateKey
 * @property {number} [nonce]
 * @property {number} [gasPrice]
 * @property {string} [gasCoin]
 * @property {string|Buffer} txType
 * @property {Buffer} txData
 * @property {string} [message]
 */


/**
 * @param {TxParams} txParams
 * @return {MinterTx}
 */
export default function prepareSignedTx(txParams) {
    const {privateKey, nonce = 1, gasPrice = 1, gasCoin = 'BIP', txType, txData, message} = txParams;
    // @TODO asserts
    const privateKeyBuffer = typeof privateKey === 'string' ? Buffer.from(privateKey, 'hex') : privateKey;

    const txProps = {
        nonce: `0x${toHexString(nonce)}`,
        gasPrice: `0x${toHexString(gasPrice)}`,
        gasCoin: formatCoin(gasCoin),
        type: txType,
        data: txData,
        signatureType: '0x01',
    };
    if (message) {
        txProps.payload = `0x${Buffer.from(message, 'utf-8').toString('hex')}`;
    }

    const tx = new MinterTx(txProps);
    tx.signatureData = (new MinterTxSignature()).sign(tx.hash(false), privateKeyBuffer).serialize();

    return tx;
}
