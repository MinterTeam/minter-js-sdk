import {TxDataDelegate, coinToBuffer, bufferToCoin} from 'minterjs-tx';
import {convertToPip, convertFromPip, toBuffer, publicToString} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter.js';
// import {toBuffer} from 'minterjs-util/src/prefix.js';
import {addTxDataFields, bufferToInteger, validateAmount, validateCoin, validatePublicKey} from '../utils.js';

/**
 * @param {string} publicKey
 * @param {string} coin
 * @param {number|string} stake
 * @constructor
 */
export default function DelegateTxData({publicKey, coin, stake}) {
    validatePublicKey(publicKey, 'publicKey');
    validateCoin(coin, 'coin');
    validateAmount(stake, 'stake');

    this.publicKey = publicKey;
    this.coin = coin;
    this.stake = stake;

    this.txData = new TxDataDelegate({
        publicKey: toBuffer(publicKey),
        coin: coinToBuffer(coin),
        stake: `0x${convertToPip(stake, 'hex')}`,
    });

    addTxDataFields(this);

    // proxy TxDataDelegate
    this.raw = this.txData.raw;
    this.serialize = this.txData.serialize;
}


/**
 *
 * @param {Buffer|string} publicKey
 * @param {Buffer|string} stake
 * @param {Buffer|string} coin
 * @return {DelegateTxData}
 */
DelegateTxData.fromBufferFields = function fromBufferFields({publicKey, coin, stake}) {
    if (Buffer.isBuffer(stake)) {
        stake = bufferToInteger(stake);
    }
    return new DelegateTxData({
        publicKey: publicToString(publicKey),
        coin: bufferToCoin(toBuffer(coin)),
        stake: convertFromPip(stake),
    });
};

/**
 * @param {Buffer|string} data
 * @return {DelegateTxData}
 */
DelegateTxData.fromRlp = function fromRlp(data) {
    return DelegateTxData.fromBufferFields(new TxDataDelegate(data));
};
