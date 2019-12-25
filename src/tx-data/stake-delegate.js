import {TxDataDelegate, coinToBuffer, bufferToCoin, TxDataSend, TxDataUnbond} from 'minterjs-tx';
import {convertToPip, convertFromPip, toBuffer, publicToString} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter';
// import {toBuffer} from 'minterjs-util/src/prefix';
import {bufferToInteger} from '../utils';

/**
 * @param {string} publicKey
 * @param {string} coin
 * @param {number|string} stake
 * @constructor
 */
export default function DelegateTxData({publicKey, coin, stake}) {
    this.publicKey = publicKey;
    this.coin = coin;
    this.stake = stake;

    this.txData = new TxDataDelegate({
        publicKey: toBuffer(publicKey),
        coin: coinToBuffer(coin),
        stake: `0x${convertToPip(stake, 'hex')}`,
    });

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