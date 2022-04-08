import {TxDataDelegate} from 'minterjs-tx';
import {convertToPip, toBuffer} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter.js';
// import {toBuffer} from 'minterjs-util/src/prefix.js';
import {proxyNestedTxData, dataToInteger, dataPipToAmount, dataToPublicKey, validateAmount, validateUint, validatePublicKey, integerToHexString} from '../utils.js';

/**
 * @param {object} txData
 * @param {string} txData.publicKey
 * @param {number|string} txData.coin - coin id
 * @param {number|string} txData.stake
 * @param {TxOptions} [options]
 * @constructor
 */
export default function DelegateTxData({publicKey, coin, stake}, options = {}) {
    if (!options.disableValidation) {
        validatePublicKey(publicKey, 'publicKey');
        validateUint(coin, 'coin');
        validateAmount(stake, 'stake');
    }

    this.publicKey = publicKey;
    this.coin = coin;
    this.stake = stake;

    this.txData = new TxDataDelegate({
        publicKey: toBuffer(publicKey),
        coin: integerToHexString(coin),
        stake: `0x${convertToPip(stake, 'hex')}`,
    });

    proxyNestedTxData(this);
}


/**
 * @param {object} txData
 * @param {Buffer|string} txData.publicKey
 * @param {Buffer|string} txData.stake
 * @param {Buffer|string} txData.coin
 * @param {TxOptions} [options]
 * @return {DelegateTxData}
 */
DelegateTxData.fromBufferFields = function fromBufferFields({publicKey, coin, stake}, options = {}) {
    return new DelegateTxData({
        publicKey: dataToPublicKey(publicKey),
        coin: dataToInteger(coin),
        stake: dataPipToAmount(stake),
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {DelegateTxData}
 */
DelegateTxData.fromRlp = function fromRlp(data) {
    return DelegateTxData.fromBufferFields(new TxDataDelegate(data));
};
