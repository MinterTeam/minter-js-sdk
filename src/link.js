import {defineProperties} from 'ethereumjs-util/dist/object';
import {encode as rlpEncode, decode as rlpDecode} from 'rlp';
import {bufferToCoin, coinToBuffer, TxDataRedeemCheck, TX_TYPE, normalizeTxType} from 'minterjs-tx';
import getTxData, {ensureBufferData} from './tx-data';
import {bufferToInteger, integerToHexString} from './utils';
import RedeemCheckTxParams from './tx-params/redeem-check';

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
 * @property {number} [nonce]
 * @property {number} [gasPrice]
 * @property {string} [gasCoin]
 * @property {string|Buffer|TX_TYPE} type
 * @property {string|Buffer|TX_TYPE} [txType] - deprecated
 * @property {Buffer|Object|TxData} data
 * @property {Buffer} [txData] - deprecated
 * @property {string} [payload]
 * @property {string} [message] - deprecated
 * @property {string} [password]
 * @property {string} [linkHost]
 */

/**
 * @param {LinkParams} txParams
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
    let result = `${linkHost}/tx?d=${tx.serialize().toString('hex')}`;
    if (password) {
        result += `&p=${rlpEncode(password).toString('hex')}`;
    }

    return result;
}


/**
 * @param {string} url
 * @param {string} [privateKey]
 * @return {TxParams}
 */
export function decodeLink(url, privateKey) {
    const txString = url.replace(/^.*\?d=/, '').replace(/&p=.*$/, '');
    const passwordHex = url.indexOf('&p=') >= 0 ? url.replace(/^.*&p=/, '') : '';
    const password = passwordHex ? rlpDecode(Buffer.from(passwordHex, 'hex')) : '';
    const tx = new Link(txString);
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
    const txData = getTxData(tx.type).fromRlp(tx.data).fields;
    // fix rawCheck
    if (txType === TX_TYPE.REDEEM_CHECK) {
        txData.check = getTxData(tx.type).fromRlp(tx.data).check;
    }
    // fix pubKey
    if (txType === TX_TYPE.DECLARE_CANDIDACY || txType === TX_TYPE.EDIT_CANDIDATE || txType === TX_TYPE.DELEGATE || txType === TX_TYPE.UNBOND) {
        txData.publicKey = getTxData(tx.type).fromRlp(tx.data).publicKey;
    }

    return {
        nonce: tx.nonce.length ? bufferToInteger(tx.nonce) : undefined,
        gasPrice: tx.gasPrice.length ? bufferToInteger(tx.gasPrice) : undefined,
        gasCoin: tx.gasCoin.length ? bufferToCoin(tx.gasCoin) : undefined,
        type: txType,
        data: txData,
        payload: tx.payload.toString('utf-8'),
    };
}
