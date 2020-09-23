import {toBuffer as toBufferUtil} from 'ethereumjs-util/dist/bytes.js';
import {decode as rlpDecode} from 'rlp';
import {isHexPrefixed} from 'ethjs-util';
import {fromByteArray as base64encode, toByteArray as base64decode} from 'base64-js';
import {TxDataRedeemCheck, defineProperties} from 'minterjs-tx';
import {TX_TYPE, normalizeTxType} from 'minterjs-util';
import {ensureBufferData, decodeTxData} from './tx-data/index.js';
import RedeemCheckTxData from './tx-data/redeem-check.js';
import {bufferToInteger, integerToHexString} from './utils.js';

const DEFAULT_LINK_HOST = 'https://bip.to';


class Link {
    constructor(data) {
        data = data || {};

        // Define Properties
        const fields = [{
            name: 'type',
            length: 1,
            allowLess: true,
            default: Buffer.from([]),
        }, {
            name: 'data',
            alias: 'input',
            allowZero: true,
            default: Buffer.from([]),
        }, {
            name: 'payload',
            allowZero: true,
            default: Buffer.from([]),
        }, {
            name: 'nonce',
            length: 32,
            allowLess: true,
            default: Buffer.from([]),
        }, {
            name: 'gasPrice',
            length: 32,
            allowLess: true,
            default: Buffer.from([]),
        }, {
            name: 'gasCoin',
            length: 10,
            allowLess: true,
            allowNonBinaryArray: true,
            default: [],
        }];

        /**
         * Returns the rlp encoding of the transaction
         * @method serialize
         * @return {Buffer}
         * @memberof Transaction
         * @name serialize
         */
        // attached serialize
        defineProperties(this, fields, data);
    }
}

/**
 * @typedef {Object} LinkParams
 * @property {number|string} [nonce]
 * @property {number|string} [gasPrice]
 * @property {number|string} [gasCoin]
 * @property {string|Buffer|TX_TYPE} type
 * @property {string|Buffer|TX_TYPE} [txType] - deprecated
 * @property {Buffer|Object|TxData} data
 * @property {Buffer} [txData] - deprecated
 * @property {string} [payload]
 * @property {string} [message] - deprecated
 * @property {string} [password]
 */

/**
 * @param {LinkParams} txParams
 * @param {string} [linkHost]
 * @return {string}
 */
export function prepareLink(txParams = {}, linkHost = DEFAULT_LINK_HOST) {
    const {nonce, gasPrice, gasCoin, type, txType, data, txData, password} = txParams;

    const txProps = {
        nonce: nonce || nonce === 0 ? integerToHexString(nonce) : [],
        gasPrice: gasPrice || gasPrice === 0 ? integerToHexString(gasPrice) : [],
        gasCoin: gasCoin || gasCoin === 0 ? integerToHexString(gasCoin) : [],
        type: type || txType,
        data: ensureBufferData(data || txData, type || txType),
    };

    let payload = txParams.message || txParams.payload;
    if (payload) {
        if (typeof payload === 'string') {
            payload = Buffer.from(payload, 'utf-8');
        }
        txProps.payload = payload;
    }

    // ensure no ending slash
    linkHost = linkHost.replace(/\/$/, '');
    // ensure scheme
    if (linkHost.indexOf('://') === -1) {
        linkHost = `https://${linkHost}`;
    }

    const tx = new Link(txProps);
    let result = `${linkHost}/tx/${base64urlEncode(tx.serialize())}`;
    if (password) {
        result += `?p=${base64urlEncode(toBuffer(password))}`;
    }

    return result;
}


/**
 * @param {string} url
 * @param {string} [address]
 * @param {string} [privateKey]
 * @param {boolean} [decodeCheck]
 * @return {TxParams}
 */
export function decodeLink(url, {address, privateKey, decodeCheck} = {}) {
    const txBase64 = url.replace(/^.*\/tx\//, '').replace(/\?.*$/, '');
    const txBytes = rlpDecode(base64urlDecode(txBase64));
    const passwordBase64 = url.search(/[?&]p=/) >= 0 ? url.replace(/^.*[?&]p=/, '') : '';
    const password = passwordBase64 ? Buffer.from(base64urlDecode(passwordBase64)) : '';
    const tx = new Link(txBytes);
    const txType = normalizeTxType(tx.type);
    if (txType === TX_TYPE.REDEEM_CHECK && password) {
        if (!privateKey && !address) {
            throw new Error('privateKey or address are required if link has password');
        }

        // get check from data
        const {check} = new TxDataRedeemCheck(tx.data);
        // proof from password
        const txData = new RedeemCheckTxData({check}, {password, address, privateKey}).serialize();
        tx.data = txData;
    }
    const txData = decodeTxData(tx.type, tx.data, {decodeCheck});

    return {
        nonce: Array.isArray(tx.nonce) ? undefined : bufferToInteger(tx.nonce),
        gasPrice: Array.isArray(tx.gasPrice) ? undefined : bufferToInteger(tx.gasPrice),
        gasCoin: Array.isArray(tx.gasCoin) ? undefined : bufferToInteger(tx.gasCoin),
        type: txType,
        data: txData,
        payload: tx.payload.toString('utf-8'),
    };
}

function base64urlEncode(byteArray) {
    return base64encode(byteArray).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64urlDecode(base64urlString) {
    const padModulus = base64urlString.length % 4;
    const padLength = padModulus ? 4 - padModulus : 0;
    const pad = new Array(padLength).fill('=').join('');
    return base64decode(base64urlString + pad);
}

/**
 * toBuffer which supports UTF8 strings
 * @param value
 * @return {Buffer}
 */
function toBuffer(value) {
    if (typeof value === 'string' && !isHexPrefixed(value)) {
        return Buffer.from(value, 'utf8');
    } else {
        return toBufferUtil(value);
    }
}
