import {TxDataUnbond} from 'minterjs-tx';
import {convertToPip, convertFromPip, toBuffer, publicToString} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter.js';
// import {toBuffer} from 'minterjs-util/src/prefix.js';
import {addTxDataFields, bufferToInteger, validateAmount, validateUint, validatePublicKey, integerToHexString} from '../utils.js';

/**
 * @param {string} publicKey
 * @param {number|string} coin - coin id
 * @param {number|string} stake
 * @constructor
 */
export default function UnbondTxData({publicKey, coin, stake}) {
    validatePublicKey(publicKey, 'publicKey');
    validateUint(coin, 'coin');
    validateAmount(stake, 'stake');

    this.publicKey = publicKey;
    this.coin = coin;
    this.stake = stake;

    this.txData = new TxDataUnbond({
        publicKey: toBuffer(publicKey),
        coin: integerToHexString(coin),
        stake: `0x${convertToPip(stake, 'hex')}`,
    });

    addTxDataFields(this);

    // proxy TxDataUnbond
    this.raw = this.txData.raw;
    this.serialize = this.txData.serialize;
}


/**
 *
 * @param {Buffer|string} publicKey
 * @param {Buffer|string} stake
 * @param {Buffer|string} coin
 * @return {UnbondTxData}
 */
UnbondTxData.fromBufferFields = function fromBufferFields({publicKey, coin, stake}) {
    return new UnbondTxData({
        publicKey: publicToString(publicKey),
        coin: bufferToInteger(toBuffer(coin)),
        stake: convertFromPip(bufferToInteger(toBuffer(stake))),
    });
};

/**
 * @param {Buffer|string} data
 * @return {UnbondTxData}
 */
UnbondTxData.fromRlp = function fromRlp(data) {
    return UnbondTxData.fromBufferFields(new TxDataUnbond(data));
};
