import {TxDataLockStake} from 'minterjs-tx';
import {proxyNestedTxData} from '../utils.js';

/**
 * @constructor
 */
export default function LockStakeTxData(/* {}, options */) {
    this.txData = new TxDataLockStake({});

    proxyNestedTxData(this);
}


/**
 * @return {LockStakeTxData}
 */
LockStakeTxData.fromBufferFields = function fromBufferFields() {
    return new LockStakeTxData({});
};

/**
 * @param {Buffer|string} [data]
 * @return {LockStakeTxData}
 */
LockStakeTxData.fromRlp = function fromRlp(data) {
    return LockStakeTxData.fromBufferFields(new TxDataLockStake(data));
};
