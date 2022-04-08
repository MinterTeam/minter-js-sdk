import {toBuffer as toBufferUtil} from 'ethereumjs-util/dist/bytes.js';
import {decode as rlpDecode} from 'rlp';
import {isHexPrefixed} from 'ethjs-util';
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
        }, {
            name: 'data',
            alias: 'input',
        }, {
            name: 'payload',
            allowZero: true,
            default: Buffer.from([]),
        }, {
            name: 'nonce',
            length: 32,
            allowLess: true,
        }, {
            name: 'gasPrice',
            length: 32,
            allowLess: true,
        }, {
            name: 'gasCoin',
            length: 4,
            allowLess: true,
            storeNullAsArray: true,
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
 * @typedef {object} LinkParams
 * @property {number|string} [nonce]
 * @property {number|string} [gasPrice]
 * @property {number|string} [gasCoin]
 * @property {string|Buffer|TX_TYPE} type
 * @property {string|Buffer|TX_TYPE} [txType] - deprecated
 * @property {Buffer|object|TxData} data
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
        nonce: nonce || nonce === 0 ? integerToHexString(nonce) : undefined,
        gasPrice: gasPrice || gasPrice === 0 ? integerToHexString(gasPrice) : undefined,
        gasCoin: gasCoin || gasCoin === 0 ? integerToHexString(gasCoin) : undefined,
        type: type || txType,
        data: ensureBufferData(data || txData, type || txType),
    };

    // eslint-disable-next-line unicorn/consistent-destructuring
    let payload = txParams.message || txParams.payload;
    if (payload) {
        if (typeof payload === 'string') {
            payload = Buffer.from(payload, 'utf8');
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
 * @param {object} [options]
 * @param {string} [options.address]
 * @param {string} [options.seedPhrase]
 * @param {string} [options.privateKey]
 * @param {boolean} [options.decodeCheck]
 * @return {TxParams}
 */
export function decodeLink(url, {address, seedPhrase, privateKey, decodeCheck} = {}) {
    const txBase64 = url.replace(/^.*\/tx\//, '').replace(/\?.*$/, '');
    const txBytes = rlpDecode(base64urlDecode(txBase64));
    const passwordBase64 = url.search(/[?&]p=/) >= 0 ? url.replace(/^.*[?&]p=/, '') : '';
    const password = passwordBase64 ? Buffer.from(base64urlDecode(passwordBase64)) : '';
    const tx = new Link(txBytes);
    const txType = normalizeTxType(tx.type);
    if (txType === TX_TYPE.REDEEM_CHECK && password) {
        if (!seedPhrase && !privateKey && !address) {
            throw new Error('address or seedPhrase or privateKey are required if link has password');
        }

        // get check from data
        const {check} = new TxDataRedeemCheck(tx.data);
        // proof from password
        const txData = new RedeemCheckTxData({check}, {password, address, seedPhrase, privateKey}).serialize();
        tx.data = txData;
    }
    const txData = decodeTxData(tx.type, tx.data, {decodeCheck});

    return {
        nonce: tx.nonce.length > 0 ? bufferToInteger(tx.nonce) : undefined,
        gasPrice: tx.gasPrice.length > 0 ? bufferToInteger(tx.gasPrice) : undefined,
        // [] === undefined, <Buffer > === 0
        gasCoin: Array.isArray(tx.gasCoin) ? undefined : bufferToInteger(tx.gasCoin),
        type: txType,
        data: txData,
        payload: tx.payload.toString('utf8'),
    };
}

/**
 * @param {ByteArray} byteArray
 */
function base64urlEncode(byteArray) {
    return Buffer.from(byteArray).toString('base64').replace(/\+/g, '-').replace(/\//g, '_')
        .replace(/=/g, '');
}

/**
 * @param {string} base64urlString
 */
function base64urlDecode(base64urlString) {
    const padModulus = base64urlString.length % 4;
    const padLength = padModulus ? 4 - padModulus : 0;
    const pad = Array.from({length: padLength}, () => '=').join('');
    return Buffer.from(base64urlString + pad, 'base64');
}

/**
 * toBuffer which supports UTF8 strings
 * @param {ToBufferInputTypes} value
 * @return {Buffer}
 */
function toBuffer(value) {
    return typeof value === 'string' && !isHexPrefixed(value) ? Buffer.from(value, 'utf8') : toBufferUtil(value);
}
