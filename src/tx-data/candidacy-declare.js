import {TxDataDeclareCandidacy} from 'minterjs-tx';
// import TxDataDeclareCandidacy from 'minterjs-tx/src/tx-data/declare-candidacy.js';
import {convertToPip, toBuffer} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter';
// import {toBuffer} from 'minterjs-util/src/prefix';
import {proxyNestedTxData, dataToInteger, dataPipToAmount, dataToAddress, dataToPublicKey, integerToHexString, validateAddress, validateAmount, validateUint, validatePublicKey} from '../utils.js';

/**
 * @param {object} txData
 * @param {string} txData.address
 * @param {string} txData.publicKey
 * @param {number|string} txData.commission
 * @param {number|string} txData.coin - coin id
 * @param {number|string} txData.stake
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
 * @param {object} txData
 * @param {Buffer|string} txData.address
 * @param {Buffer|string} txData.publicKey
 * @param {Buffer|string} txData.commission
 * @param {Buffer|string} txData.coin
 * @param {Buffer|string} txData.stake
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
