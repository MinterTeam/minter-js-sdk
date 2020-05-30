import {TxDataMultisend, coinToBuffer} from 'minterjs-tx';
// import TxDataMultisend from 'minterjs-tx/src/tx-data/create-coin.js';
// import {coinToBuffer} from 'minterjs-tx/src/helpers.js';
import {convertToPip, toBuffer} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter.js';
// import {toBuffer} from 'minterjs-util/src/prefix.js';
import SendTxData from './send.js';
import {addTxDataFields, validateAddress, validateAmount, validateCoin} from '../utils.js';

/**
 * @param {Array} list
 * @constructor
 */
export default function MultisendTxData({list}) {
    if (!Array.isArray(list)) {
        throw new Error('Field `list` is not an array');
    }
    list.forEach((item, index) => {
        try {
            validateAddress(item.to, `list[${index}].to`);
            validateCoin(item.coin, `list[${index}].coin`);
            validateAmount(item.value, `list[${index}].value`);
        } catch (e) {
            throw new Error(`Field \`list\` contains invalid item at index ${index}. ${e.message}`);
        }
    });

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
