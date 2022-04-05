import {TxDataDeclareCandidacy} from 'minterjs-tx';
// import TxDataDeclareCandidacy from 'minterjs-tx/src/tx-data/declare-candidacy.js';
import {convertToPip, toBuffer} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter';
// import {toBuffer} from 'minterjs-util/src/prefix';
import {proxyNestedTxData, dataToInteger, dataPipToAmount, dataToAddress, dataToPublicKey, integerToHexString, validateAddress, validateAmount, validateUint, validatePublicKey} from '../utils.js';

/**
 * @param {string} address
 * @param {string} publicKey
 * @param {number|string} commission
 * @param {number|string} coin - coin id
 * @param {number|string} stake
 * @param {TxOptions} [options]
 * @constructor
 */
export default function DeclareCandidacyTxData({address, publicKey, commission, coin, stake}, options = {}) {
    if (!options.disableValidation) {
        validateAddress(address, 'address');
        validatePublicKey(publicKey, 'publicKey');
        validateUint(commission, 'commission');
        validateUint(coin, 'coin');
        validateAmount(stake, 'stake');
    }

    this.address = address;
    this.publicKey = publicKey;
    this.commission = commission;
    this.coin = coin;
    this.stake = stake;

    this.txData = new TxDataDeclareCandidacy({
        address: toBuffer(address),
        publicKey: toBuffer(publicKey),
        commission: integerToHexString(commission),
        coin: integerToHexString(coin),
        stake: `0x${convertToPip(stake, 'hex')}`,
    });

    proxyNestedTxData(this);
}

/**
 * @param {Buffer|string} address
 * @param {Buffer|string} publicKey
 * @param {Buffer|string} commission
 * @param {Buffer|string} coin
 * @param {Buffer|string} stake
 * @param {TxOptions} [options]
 * @return {DeclareCandidacyTxData}
 */
DeclareCandidacyTxData.fromBufferFields = function fromBufferFields({address, publicKey, commission, coin, stake}, options = {}) {
    return new DeclareCandidacyTxData({
        address: dataToAddress(address),
        publicKey: dataToPublicKey(publicKey),
        commission: dataToInteger(commission),
        coin: dataToInteger(coin),
        stake: dataPipToAmount(stake),
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {DeclareCandidacyTxData}
 */
DeclareCandidacyTxData.fromRlp = function fromRlp(data) {
    return DeclareCandidacyTxData.fromBufferFields(new TxDataDeclareCandidacy(data));
};
