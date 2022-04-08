import {toBuffer} from 'ethereumjs-util/dist/bytes.js';
import {Tx, TxSignature, TxMultisignature} from 'minterjs-tx';
import {normalizeTxType} from 'minterjs-util';
// import Tx from 'minterjs-tx/src/tx';
// import TxSignature from 'minterjs-tx/src/tx-signature.js';
import {bufferToInteger, getPrivateKeyFromSeedPhrase, integerToHexString, toInteger, validateUint} from './utils.js';
import decorateTxParams from './tx-decorator/index.js';
import {decodeTxData, ensureBufferData} from './tx-data/index.js';

/**
 * @typedef {object} TxParams
 * @property {number} [nonce]
 * @property {number} [chainId=1]
 * @property {number} [gasPrice=1]
 * @property {number|string} [gasCoin='0']
 * @property {string|Buffer|TX_TYPE} type
 * @property {string|Buffer|TX_TYPE} [txType] - deprecated
 * @property {Buffer|TxData|object} data
 * @property {Buffer|TxData|object} [txData] - deprecated
 * @property {string} [payload]
 * @property {string} [message] - deprecated
 * @property {number} [signatureType]
 * @property {ByteArray|{multisig: ByteArray, signatures: Array<ByteArray>}} [signatureData]
 */

/**
 * @typedef {object} TxOptions
 * @property {string} [seedPhrase] - to sign tx or get nonce or to make proof for redeemCheck tx
 * @property {ByteArray} [privateKey] - alternative to seedPhrase
 * @property {ByteArray} [address] - to get nonce (useful for multisignatures) or to make proof for redeemCheck tx
 * @property {ByteArray} [password] - to make proof for RedeemCheckTxData
 * @property {boolean} [disableValidation] - to disable validation of Tx or TxData constructors
 * @property {boolean} [disableDecorationParams] - to disable TxParams decoration (in `prepareTx`)
 */

/**
 * @typedef {Buffer|Uint8Array|string} ByteArray
 */


/**
 * @param {TxParams} txParams
 * @param {TxOptions} [options]
 * @return {Tx}
 */
export default function prepareSignedTx(txParams = {}, options = {}) {
    if (!options.privateKey && txParams.privateKey) {
        options.privateKey = txParams.privateKey;
        // eslint-disable-next-line no-console
        console.warn('privateKey field in tx params is deprecated, pass it to the second argument');
    }
    if (toInteger(txParams.signatureType) === '2') {
        throw new Error('prepareSignedTx doesn\'t support multi signatures');
    }
    const tx = prepareTx({...txParams, signatureType: 1}, options);

    return tx;
}

/**
 * @param {TxParams} txParams
 * @param {TxOptions} [options]
 * @return {Tx}
 */
export function prepareTx(txParams = {}, options = {}) {
    txParams = {
        ...txParams,
        data: txParams.data || txParams.txData,
        type: normalizeTxType(txParams.type || txParams.txType),
        payload: txParams.payload || txParams.message,
    };
    if (!options.disableDecorationParams) {
        txParams = decorateTxParams(txParams);
    }
    const {nonce, chainId = 1, gasPrice = 1, gasCoin = 0, type: txType, signatureType, signatureData} = txParams;
    let {payload, data: txData} = txParams;

    if (!options.disableValidation) {
        validateUint(nonce, 'nonce');
        validateUint(chainId, 'chainId');
        validateUint(gasPrice, 'gasPrice');
        validateUint(gasCoin, 'gasCoin');
        if (!txType && typeof txType !== 'number') {
            throw new Error('Falsy tx type specified, tx can\'t be prepared');
        }
        if (!signatureType && typeof signatureType !== 'number') {
            throw new Error('Falsy signatureType specified, tx can\'t be prepared');
        }
    }

    txData = ensureBufferData(txData, txType, options);

    const txProps = {
        nonce: integerToHexString(nonce || 0),
        chainId: integerToHexString(chainId),
        gasPrice: integerToHexString(gasPrice),
        gasCoin: integerToHexString(gasCoin),
        type: txType,
        data: txData,
        signatureType: integerToHexString(signatureType || 0),
        signatureData: ensureBufferSignature(signatureData, signatureType),
    };

    if (payload) {
        if (typeof payload === 'string') {
            payload = Buffer.from(payload, 'utf8');
        }
        txProps.payload = payload;
    }

    const tx = new Tx(txProps);

    const privateKey = options.seedPhrase && !options.privateKey ? getPrivateKeyFromSeedPhrase(options.seedPhrase) : options.privateKey;
    if (toInteger(signatureType) === '1' && privateKey) {
        tx.signatureData = makeSignature(tx, privateKey);
    }

    return tx;
}

/**
 * @param {Tx} tx
 * @param {ByteArray} privateKey
 */
export function makeSignature(tx, privateKey) {
    // @TODO asserts
    const privateKeyBuffer = toBuffer(privateKey);
    return (new TxSignature()).sign(tx.hash(false), privateKeyBuffer).serialize();
}


/**
 * @param {string|ByteArray} txRlp
 * @param {boolean} [decodeCheck]
 * @return {TxParams}
 */
export function decodeTx(txRlp, {decodeCheck} = {}) {
    const tx = new Tx(txRlp);
    const txType = normalizeTxType(tx.type);
    const txData = decodeTxData(tx.type, tx.data, {decodeCheck});

    return {
        nonce: tx.nonce.length > 0 ? bufferToInteger(tx.nonce) : undefined,
        chainId: tx.chainId.length > 0 ? bufferToInteger(tx.chainId) : undefined,
        gasPrice: tx.gasPrice.length > 0 ? bufferToInteger(tx.gasPrice) : undefined,
        gasCoin: bufferToInteger(tx.gasCoin),
        type: txType,
        data: txData,
        payload: tx.payload.toString('utf8'),
        signatureType: tx.signatureType.length > 0 ? bufferToInteger(tx.signatureType) : undefined,
        signatureData: tx.signatureData.length > 0 ? `0x${tx.signatureData.toString('hex')}` : '',
    };
}

/**
 * @param {Buffer|TxMultisignature|object} signatureData
 * @param {number} signatureType
 * @return {Buffer}
 */
export function ensureBufferSignature(signatureData, signatureType) {
    if (!signatureData) {
        return signatureData;
    }
    // serialize, if it TxMultisignature
    if (signatureData && toInteger(signatureType) === '2' && typeof signatureData.serialize === 'function') {
        signatureData = signatureData.serialize();
    }

    // make buffer from object
    if (typeof signatureData.length === 'undefined') {
        signatureData = new TxMultisignature(signatureData);
        signatureData = signatureData.serialize();
    }

    return signatureData;
}
