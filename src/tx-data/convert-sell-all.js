import {TxDataSellAll, coinToBuffer, bufferToCoin} from 'minterjs-tx';
// import TxDataSellAll from 'minterjs-tx/src/tx-data/sell-all';
// import {coinToBuffer} from 'minterjs-tx/src/helpers';
import {convertFromPip, convertToPip, toBuffer} from 'minterjs-util';
import {bufferToInteger} from '../utils';
// import {convertToPip} from 'minterjs-util/src/converter';

/**
 * @param {string} coinToSell
 * @param {string} coinToBuy
 * @param {number|string} [minimumValueToBuy=0]
 * @constructor
 */
export default function SellAllTxData({coinToSell, coinToBuy, minimumValueToBuy = 0}) {
    this.coinToSell = coinToSell;
    this.coinToBuy = coinToBuy;
    this.minimumValueToBuy = minimumValueToBuy;

    this.txData = new TxDataSellAll({
        coinToSell: coinToBuffer(coinToSell),
        coinToBuy: coinToBuffer(coinToBuy),
        minimumValueToBuy: `0x${convertToPip(minimumValueToBuy, 'hex')}`,
    });

    // proxy TxDataSellAll
    this.raw = this.txData.raw;
    this.serialize = this.txData.serialize;
}

/**
 * @param {Buffer|string} coinToSell
 * @param {Buffer|string} coinToBuy
 * @param {Buffer|string} minimumValueToBuy
 * @return {SellAllTxData}
 */
SellAllTxData.fromBufferFields = function fromBufferFields({coinToSell, coinToBuy, minimumValueToBuy}) {
    return new SellAllTxData({
        coinToSell: bufferToCoin(toBuffer(coinToSell)),
        coinToBuy: bufferToCoin(toBuffer(coinToBuy)),
        minimumValueToBuy: convertFromPip(bufferToInteger(toBuffer(minimumValueToBuy))),
    });
};

/**
 * @param {Buffer|string} data
 * @return {SellAllTxData}
 */
SellAllTxData.fromRlp = function fromRlp(data) {
    return SellAllTxData.fromBufferFields(new TxDataSellAll(data));
};
