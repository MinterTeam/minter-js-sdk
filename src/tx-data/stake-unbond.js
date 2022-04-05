import {TxDataUnbond} from 'minterjs-tx';
import {convertToPip, toBuffer} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter.js';
// import {toBuffer} from 'minterjs-util/src/prefix.js';
import {proxyNestedTxData, dataToInteger, dataPipToAmount, dataToPublicKey, validateAmount, validateUint, validatePublicKey, integerToHexString} from '../utils.js';

/**
 * @param {string} publicKey
 * @param {number|string} coin - coin id
 * @param {number|string} stake
 * @param {TxOptions} [options]
 * @constructor
 */
export default function UnbondTxData({publicKey, coin, stake}, options = {}) {
    if (!options.disableValidation) {
        validatePublicKey(publicKey, 'publicKey');
        validateUint(coin, 'coin');
        validateAmount(stake, 'stake');
    }

    this.publicKey = publicKey;
    this.coin = coin;
    this.stake = stake;

    this.txData = new TxDataUnbond({
        publicKey: toBuffer(publicKey),
        coin: integerToHexString(coin),
        stake: `0x${convertToPip(stake, 'hex')}`,
    });

    proxyNestedTxData(this);
}


/**
 *
 * @param {Buffer|string} publicKey
 * @param {Buffer|string} stake
 * @param {Buffer|string} coin
 * @param {TxOptions} [options]
 * @return {UnbondTxData}
 */
UnbondTxData.fromBufferFields = function fromBufferFields({publicKey, coin, stake}, options = {}) {
    return new UnbondTxData({
        publicKey: dataToPublicKey(publicKey),
        coin: dataToInteger(coin),
        stake: dataPipToAmount(stake),
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {UnbondTxData}
 */
UnbondTxData.fromRlp = function fromRlp(data) {
    return UnbondTxData.fromBufferFields(new TxDataUnbond(data));
};
