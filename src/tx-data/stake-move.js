import {TxDataMoveStake} from 'minterjs-tx';
import {convertToPip, convertFromPip, toBuffer, publicToString} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter.js';
// import {toBuffer} from 'minterjs-util/src/prefix.js';
import {proxyNestedTxData, bufferToInteger, validateAmount, validateUint, validatePublicKey, integerToHexString} from '../utils.js';

/**
 * @param {string} from
 * @param {string} to
 * @param {number|string} coin - coin id
 * @param {number|string} stake
 * @constructor
 */
export default function MoveStakeTxData({from, to, coin, stake}) {
    validatePublicKey(from, 'from');
    validatePublicKey(to, 'to');
    validateUint(coin, 'coin');
    validateAmount(stake, 'stake');

    this.from = from;
    this.to = to;
    this.coin = coin;
    this.stake = stake;

    this.txData = new TxDataMoveStake({
        from: toBuffer(from),
        to: toBuffer(to),
        coin: integerToHexString(coin),
        stake: `0x${convertToPip(stake, 'hex')}`,
    });

    proxyNestedTxData(this);
}


/**
 *
 * @param {Buffer|string} from
 * @param {Buffer|string} to
 * @param {Buffer|string} stake
 * @param {Buffer|string} coin
 * @return {MoveStakeTxData}
 */
MoveStakeTxData.fromBufferFields = function fromBufferFields({from, to, coin, stake}) {
    return new MoveStakeTxData({
        from: publicToString(from),
        to: publicToString(to),
        coin: bufferToInteger(toBuffer(coin)),
        stake: convertFromPip(bufferToInteger(toBuffer(stake))),
    });
};

/**
 * @param {Buffer|string} data
 * @return {MoveStakeTxData}
 */
MoveStakeTxData.fromRlp = function fromRlp(data) {
    return MoveStakeTxData.fromBufferFields(new TxDataMoveStake(data));
};
