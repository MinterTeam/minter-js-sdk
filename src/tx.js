import {Tx, TxSignature, TxMultisignature, coinToBuffer, normalizeTxType, TX_TYPE, bufferToCoin} from 'minterjs-tx';
// import Tx from 'minterjs-tx/src/tx';
// import TxSignature from 'minterjs-tx/src/tx-signature.js';
// import {coinToBuffer} from 'minterjs-tx/src/helpers.js';
import {bufferToInteger, integerToHexString, toInteger} from './utils.js';
import decorateTxParams from './tx-decorator/index.js';
import {decodeTxData, ensureBufferData} from './tx-data/index.js';

/**
 * @typedef {Object} TxParams
 * @property {number} [nonce]
 * @property {number} [chainId=1]
 * @property {number} [gasPrice=1]
 * @property {string} [gasCoin='BIP']
 * @property {string|Buffer|TX_TYPE} type
 * @property {string|Buffer|TX_TYPE} [txType] - deprecated
 * @property {Buffer|TxData|Object} data
 * @property {Buffer|TxData|Object} [txData] - deprecated
 * @property {string} payload
 * @property {string} [message] - deprecated
 * @property {number} signatureType
 * @property {ByteArray|Array<ByteArray>} signatureData
 */

/**
 * @typedef {Buffer, Uint8Array, string} ByteArray
 */


/**
 * @param {TxParams} txParams
 * @param {ByteArray} privateKey
 * @return {Tx}
 */
export default function prepareSignedTx(txParams = {}, {privateKey} = {}) {
    if (!privateKey && txParams.privateKey) {
        privateKey = txParams.privateKey;
        // eslint-disable-next-line no-console
        console.warn('privateKey field in tx params is deprecated, pass it to the second parameter');
    }
    console.log({privateKey});
    const tx = prepareTx({...txParams, signatureType: 1}, {privateKey});

    tx.signatureData = makeSignature(tx, privateKey);

    return tx;
}

/**
 * @param {TxParams} txParams
 * @param {ByteArray} privateKey
 * @return {Tx}
 */
export function prepareTx(txParams = {}, {privateKey} = {}) {
    txParams = {
        ...txParams,
        data: txParams.data || txParams.txData,
        type: normalizeTxType(txParams.type || txParams.txType),
        payload: txParams.payload || txParams.message,
    };
    txParams = decorateTxParams(txParams);
    const {nonce, chainId = 1, gasPrice = 1, type: txType, signatureType, signatureData} = txParams;
    let {gasCoin, payload, data: txData} = txParams;
    // throw on falsy nonce except 0
    if (!nonce && typeof nonce !== 'number') {
        throw new Error('Invalid nonce specified, tx can\'t be prepared');
    }

    if (!gasCoin) {
        if (chainId === 2) {
            gasCoin = 'MNT';
        } else {
            gasCoin = 'BIP';
        }
    }

    // pass privateKey from params to data for redeemCheck
    if (txType === TX_TYPE.REDEEM_CHECK && !txData.privateKey) {
        txData.privateKey = privateKey;
    }

    txData = ensureBufferData(txData, txType);

    const txProps = {
        nonce: `0x${integerToHexString(nonce)}`,
        chainId: `0x${integerToHexString(chainId)}`,
        gasPrice: `0x${integerToHexString(gasPrice)}`,
        gasCoin: coinToBuffer(gasCoin),
        type: txType,
        data: txData,
        signatureType: `0x${integerToHexString(signatureType)}`,
        signatureData: ensureBufferSignature(signatureData, signatureType),
    };

    if (payload) {
        if (typeof payload === 'string') {
            payload = Buffer.from(payload, 'utf-8');
        }
        txProps.payload = payload;
    }

    const tx = new Tx(txProps);

    return tx;
}

/**
 * @param {Tx} tx
 * @param {string|Buffer} privateKey
 */
export function makeSignature(tx, privateKey) {
    // @TODO asserts
    const privateKeyBuffer = typeof privateKey === 'string' ? Buffer.from(privateKey, 'hex') : privateKey;
    return (new TxSignature()).sign(tx.hash(false), privateKeyBuffer).serialize();
}


/**
 * @param {string} txRlp
 * @param {boolean} [decodeCheck]
 * @return {TxParams}
 */
export function decodeTx(txRlp, {decodeCheck} = {}) {
    const txString = txRlp.replace('0x', '');
    const tx = new Tx(txString);
    const txType = normalizeTxType(tx.type);
    const txData = decodeTxData(tx.type, tx.data, {decodeCheck});

    return {
        nonce: tx.nonce.length ? bufferToInteger(tx.nonce) : undefined,
        chainId: tx.chainId.length ? bufferToInteger(tx.chainId) : undefined,
        gasPrice: tx.gasPrice.length ? bufferToInteger(tx.gasPrice) : undefined,
        gasCoin: tx.gasCoin.length ? bufferToCoin(tx.gasCoin) : undefined,
        type: txType,
        data: txData,
        payload: tx.payload.toString('utf-8'),
        signatureType: tx.signatureType.length ? bufferToInteger(tx.signatureType) : undefined,
        signatureData: `0x${tx.signatureData.toString('hex')}`,
    };
}

/**
 * @param {Buffer|TxMultisignature|Object} signatureData
 * @param {number} signatureType
 * @return {Buffer}
 */
export function ensureBufferSignature(signatureData, signatureType) {
    if (!signatureData) {
        return signatureData;
    }
    if (signatureData && toInteger(signatureType) === '2') {
        // serialize, if it TxMultisignature
        if (typeof signatureData.serialize === 'function') {
            signatureData = signatureData.serialize();
        }
    }

    // make buffer from object
    if (typeof signatureData.length === 'undefined') {
        signatureData = new TxMultisignature(signatureData);
        signatureData = signatureData.serialize();
    }

    return signatureData;
}
