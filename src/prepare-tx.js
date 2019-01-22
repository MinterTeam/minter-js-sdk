import {Buffer} from 'safe-buffer';
import MinterTx, {formatCoin} from 'minterjs-tx';
import MinterTxSignature from 'minterjs-tx/src/tx-signature';

/**
 * @param {TxParams} txParams
 * @param {string|Buffer} txParams.privateKey
 * @param {string} txParams.gasCoin
 * @param {string|Buffer} txParams.txType
 * @param {Buffer} txParams.txData
 * @param {string} txParams.message
 * @param {number} nonce
 * @return {MinterTx}
 */
export default function prepareSignedTx(txParams, nonce) {
    const {privateKey, gasCoin = 'BIP', txType, txData, message} = txParams;
    // @TODO asserts
    const privateKeyBuffer = typeof privateKey === 'string' ? Buffer.from(privateKey, 'hex') : privateKey;

    const txProps = {
        nonce: `0x${nonce.toString(16)}`,
        gasPrice: '0x01',
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
