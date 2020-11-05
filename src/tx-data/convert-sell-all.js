import {TxDataSellAll} from 'minterjs-tx';
// import TxDataSellAll from 'minterjs-tx/src/tx-data/sell-all.js';
import {convertFromPip, convertToPip, toBuffer} from 'minterjs-util';
import {proxyNestedTxData, bufferToInteger, integerToHexString, validateAmount, validateUint} from '../utils.js';
// import {convertToPip} from 'minterjs-util/src/converter.js';

/**
 * @param {number|string} coinToSell - coin id
 * @param {number|string} coinToBuy - coin id
 * @param {number|string} [minimumValueToBuy=0]
 * @constructor
 */
export default function SellAllTxData({coinToSell, coinToBuy, minimumValueToBuy = 0}) {
    validateUint(coinToSell, 'coinToSell');
    validateUint(coinToBuy, 'coinToBuy');
    validateAmount(minimumValueToBuy, 'minimumValueToBuy');

    this.coinToSell = coinToSell;
    this.coinToBuy = coinToBuy;
    this.minimumValueToBuy = minimumValueToBuy;

    this.txData = new TxDataSellAll({
        coinToSell: integerToHexString(coinToSell),
        coinToBuy: integerToHexString(coinToBuy),
        minimumValueToBuy: `0x${convertToPip(minimumValueToBuy, 'hex')}`,
    });

    proxyNestedTxData(this);
}

/**
 * @param {Buffer|string} coinToSell
 * @param {Buffer|string} coinToBuy
 * @param {Buffer|string} minimumValueToBuy
 * @return {SellAllTxData}
 */
SellAllTxData.fromBufferFields = function fromBufferFields({coinToSell, coinToBuy, minimumValueToBuy}) {
    return new SellAllTxData({
        coinToSell: bufferToInteger(toBuffer(coinToSell)),
        coinToBuy: bufferToInteger(toBuffer(coinToBuy)),
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
