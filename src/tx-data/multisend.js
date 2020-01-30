import {TxDataMultisend, coinToBuffer} from 'minterjs-tx';
// import TxDataMultisend from 'minterjs-tx/src/tx-data/create-coin.js';
// import {coinToBuffer} from 'minterjs-tx/src/helpers.js';
import {convertToPip, toBuffer} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter.js';
// import {toBuffer} from 'minterjs-util/src/prefix.js';
import SendTxData from './send.js';
import {addTxDataFields} from '../utils.js';

/**
 * @param {Array} list
 * @constructor
 */
export default function MultisendTxData({list}) {
    this.list = list;

    this.txData = new TxDataMultisend({
        list: list.map((item) => {
            return {
                to: toBuffer(item.to),
                coin: coinToBuffer(item.coin),
                value: `0x${convertToPip(item.value, 'hex')}`,
            };
        }),
    });

    addTxDataFields(this);

    // proxy TxDataMultisend
    this.raw = this.txData.raw;
    this.serialize = this.txData.serialize;
}


/**
 * @param {Array<Buffer>} list
 * @return {MultisendTxData}
 */
MultisendTxData.fromBufferFields = function fromBufferFields({list}) {
    return new MultisendTxData({
        list: list.map((item) => SendTxData.fromRlp(item)),
    });
};

/**
 * @param {Buffer|string} data
 * @return {MultisendTxData}
 */
MultisendTxData.fromRlp = function fromRlp(data) {
    return MultisendTxData.fromBufferFields(new TxDataMultisend(data));
};
