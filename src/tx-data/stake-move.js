import {TxDataMoveStake} from 'minterjs-tx';
import {convertToPip, toBuffer} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter.js';
// import {toBuffer} from 'minterjs-util/src/prefix.js';
import { proxyNestedTxData, dataToInteger, dataPipToAmount, dataToPublicKey, validateAmount, validateUint, validatePublicKey, integerToHexString} from '../utils.js';

/**
 * @param {string} from
 * @param {string} to
 * @param {number|string} coin - coin id
 * @param {number|string} stake
 * @param {TxOptions} [options]
 * @constructor
 */
export default function MoveStakeTxData({from, to, coin, stake}, options = {}) {
    if (!options.disableValidation) {
        validatePublicKey(from, 'from');
        validatePublicKey(to, 'to');
        validateUint(coin, 'coin');
        validateAmount(stake, 'stake');
    }

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
 * @param {TxOptions} [options]
 * @return {MoveStakeTxData}
 */
MoveStakeTxData.fromBufferFields = function fromBufferFields({from, to, coin, stake}, options = {}) {
    return new MoveStakeTxData({
        from: dataToPublicKey(from),
        to: dataToPublicKey(to),
        coin: dataToInteger(coin),
        stake: dataPipToAmount(stake),
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {MoveStakeTxData}
 */
MoveStakeTxData.fromRlp = function fromRlp(data) {
    return MoveStakeTxData.fromBufferFields(new TxDataMoveStake(data));
};
