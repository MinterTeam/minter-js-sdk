import {TxDataMultisend, coinToBuffer} from 'minterjs-tx';
// import TxDataMultisend from 'minterjs-tx/src/tx-data/create-coin';
// import {coinToBuffer} from 'minterjs-tx/src/helpers';
import {convertToPip, toBuffer} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter';
// import {toBuffer} from 'minterjs-util/src/prefix';
import SendTxData from './send';
import {addTxDataFields} from '../utils';

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
