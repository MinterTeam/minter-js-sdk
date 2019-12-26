import {TxDataUnbond, coinToBuffer, bufferToCoin} from 'minterjs-tx';
import {convertToPip, convertFromPip, toBuffer, publicToString} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter';
// import {toBuffer} from 'minterjs-util/src/prefix';
import {addTxDataFields, bufferToInteger} from '../utils';

/**
 * @param {string} publicKey
 * @param {string} coin
 * @param {number|string} stake
 * @constructor
 */
export default function UnbondTxData({publicKey, coin, stake}) {
    this.publicKey = publicKey;
    this.coin = coin;
    this.stake = stake;

    this.txData = new TxDataUnbond({
        publicKey: toBuffer(publicKey),
        coin: coinToBuffer(coin),
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
    if (Buffer.isBuffer(stake)) {
        stake = bufferToInteger(stake);
    }
    return new UnbondTxData({
        publicKey: publicToString(publicKey),
        coin: bufferToCoin(toBuffer(coin)),
        stake: convertFromPip(stake),
    });
};

/**
 * @param {Buffer|string} data
 * @return {UnbondTxData}
 */
UnbondTxData.fromRlp = function fromRlp(data) {
    return UnbondTxData.fromBufferFields(new TxDataUnbond(data));
};
