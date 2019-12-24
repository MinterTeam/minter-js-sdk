import {TxDataDeclareCandidacy, coinToBuffer, bufferToCoin} from 'minterjs-tx';
// import TxDataDeclareCandidacy from 'minterjs-tx/src/tx-data/declare-candidacy';
// import {coinToBuffer} from 'minterjs-tx/src/helpers';
import {addressToString, convertFromPip, convertToPip, publicToString, toBuffer} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter';
// import {toBuffer} from 'minterjs-util/src/prefix';
import {bufferToInteger, integerToHexString} from '../utils';

/**
 * @param {string} address
 * @param {string} publicKey
 * @param {number|string} commission
 * @param {string} coin
 * @param {number|string} stake
 * @constructor
 */
export default function DeclareCandidacyTxData({address, publicKey, commission, coin, stake}) {
    this.address = address;
    this.publicKey = publicKey;
    this.commission = commission;
    this.coin = coin;
    this.stake = stake;

    this.txData = new TxDataDeclareCandidacy({
        address: toBuffer(address),
        publicKey: toBuffer(publicKey),
        commission: `0x${integerToHexString(commission)}`,
        coin: coinToBuffer(coin),
        stake: `0x${convertToPip(stake, 'hex')}`,
    });

    // proxy TxDataDeclareCandidacy
    this.raw = this.txData.raw;
    this.serialize = this.txData.serialize;
}

/**
 * @param {Buffer|string} address
 * @param {Buffer|string} publicKey
 * @param {Buffer|string} commission
 * @param {Buffer|string} coin
 * @param {Buffer|string} stake
 * @return {DeclareCandidacyTxData}
 */
DeclareCandidacyTxData.fromBufferFields = function fromBufferFields({address, publicKey, commission, coin, stake}) {
    return new DeclareCandidacyTxData({
        address: addressToString(address),
        publicKey: publicToString(publicKey),
        commission: bufferToInteger(toBuffer(commission)),
        coin: bufferToCoin(toBuffer(coin)),
        stake: convertFromPip(bufferToInteger(toBuffer(stake))),
    });
};

/**
 * @param {Buffer|string} data
 * @return {DeclareCandidacyTxData}
 */
DeclareCandidacyTxData.fromRlp = function fromRlp(data) {
    return DeclareCandidacyTxData.fromBufferFields(new TxDataDeclareCandidacy(data));
};
