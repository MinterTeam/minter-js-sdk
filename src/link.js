import {defineProperties} from 'ethereumjs-util/dist/object.js';
import {toBuffer as toBufferUtil} from 'ethereumjs-util/dist/bytes.js';
import {decode as rlpDecode} from 'rlp';
import {isHexPrefixed} from 'ethjs-util';
import {fromByteArray as base64encode, toByteArray as base64decode} from 'base64-js';
import {bufferToCoin, coinToBuffer, TxDataRedeemCheck, TX_TYPE, normalizeTxType} from 'minterjs-tx';
import {ensureBufferData, decodeTxData} from './tx-data/index.js';
import {bufferToInteger, integerToHexString} from './utils.js';
import RedeemCheckTxParams from './tx-params/redeem-check.js';

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
            default: Buffer.from([]),
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
 * @property {string} [gasCoin]
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
        nonce: nonce && `0x${integerToHexString(nonce)}`,
        gasPrice: gasPrice && `0x${integerToHexString(gasPrice)}`,
        gasCoin: gasCoin && coinToBuffer(gasCoin),
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
 * @param {string} [privateKey]
 * @param {boolean} [decodeCheck]
 * @return {TxParams}
 */
export function decodeLink(url, {privateKey, decodeCheck} = {}) {
    const txBase64 = url.replace(/^.*\/tx\//, '').replace(/\?.*$/, '');
    const txBytes = rlpDecode(base64urlDecode(txBase64));
    const passwordBase64 = url.search(/[?&]p=/) >= 0 ? url.replace(/^.*[?&]p=/, '') : '';
    const password = passwordBase64 ? Buffer.from(base64urlDecode(passwordBase64)) : '';
    const tx = new Link(txBytes);
    const txType = normalizeTxType(tx.type);
    if (txType === TX_TYPE.REDEEM_CHECK && password && !privateKey) {
        throw new Error('privateKey param required if link has password');
    }
    if (txType === TX_TYPE.REDEEM_CHECK && password && privateKey) {
        // get check from data
        const {check} = new TxDataRedeemCheck(tx.data);
        // proof from password
        const {txData} = new RedeemCheckTxParams({privateKey, check, password});
        tx.data = txData;
    }
    const txData = decodeTxData(tx.type, tx.data, {decodeCheck});

    return {
        nonce: tx.nonce.length ? bufferToInteger(tx.nonce) : undefined,
        gasPrice: tx.gasPrice.length ? bufferToInteger(tx.gasPrice) : undefined,
        gasCoin: tx.gasCoin.length ? bufferToCoin(tx.gasCoin) : undefined,
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
 * @param val
 * @return {Buffer}
 */
function toBuffer(val) {
    if (typeof val === 'string' && !isHexPrefixed(val)) {
        return Buffer.from(val, 'utf8');
    } else {
        return toBufferUtil(val);
    }
}
