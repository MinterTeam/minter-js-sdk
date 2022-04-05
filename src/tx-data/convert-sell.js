import {TxDataSell} from 'minterjs-tx';
// import TxDataSell from 'minterjs-tx/src/tx-data/sell.js';
// import {TX_TYPE} from 'minterjs-tx/src/tx-types.js';
import {convertToPip} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter.js';
import {proxyNestedTxData, dataToInteger, dataPipToAmount, integerToHexString, validateAmount, validateUint} from '../utils.js';

/**
 * @param {number|string} coinToSell - coin id
 * @param {number|string} coinToBuy - coin id
 * @param {number|string} valueToSell
 * @param {number|string} [minimumValueToBuy=0]
 * @param {TxOptions} [options]
 * @constructor
 */
export default function SellTxData({coinToSell, coinToBuy, valueToSell, minimumValueToBuy = 0}, options = {}) {
    if (!options.disableValidation) {
        validateUint(coinToSell, 'coinToSell');
        validateUint(coinToBuy, 'coinToBuy');
        validateAmount(valueToSell, 'valueToSell');
        validateAmount(minimumValueToBuy, 'minimumValueToBuy');
    }

    this.coinToSell = coinToSell;
    this.coinToBuy = coinToBuy;
    this.valueToSell = valueToSell;
    this.minimumValueToBuy = minimumValueToBuy;

    this.txData = new TxDataSell({
        coinToSell: integerToHexString(coinToSell),
        coinToBuy: integerToHexString(coinToBuy),
        valueToSell: `0x${convertToPip(valueToSell, 'hex')}`,
        minimumValueToBuy: `0x${convertToPip(minimumValueToBuy, 'hex')}`,
    });

    proxyNestedTxData(this);
}

/**
 * @param {Buffer|string} coinToSell
 * @param {Buffer|string} valueToSell
 * @param {Buffer|string} coinToBuy
 * @param {Buffer|string} minimumValueToBuy
 * @param {TxOptions} [options]
 * @return {SellTxData}
 */
SellTxData.fromBufferFields = function fromBufferFields({coinToSell, valueToSell, coinToBuy, minimumValueToBuy}, options = {}) {
    return new SellTxData({
        coinToSell: dataToInteger(coinToSell),
        coinToBuy: dataToInteger(coinToBuy),
        valueToSell: dataPipToAmount(valueToSell),
        minimumValueToBuy: dataPipToAmount(minimumValueToBuy),
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {SellTxData}
 */
SellTxData.fromRlp = function fromRlp(data) {
    return SellTxData.fromBufferFields(new TxDataSell(data));
};
