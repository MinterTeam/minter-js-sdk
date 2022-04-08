import {TxDataSellAll} from 'minterjs-tx';
// import TxDataSellAll from 'minterjs-tx/src/tx-data/sell-all.js';
import {convertToPip} from 'minterjs-util';
import {proxyNestedTxData, dataToInteger, dataPipToAmount, integerToHexString, validateAmount, validateUint} from '../utils.js';
// import {convertToPip} from 'minterjs-util/src/converter.js';

/**
 * @param {object} txData
 * @param {number|string} txData.coinToSell - coin id
 * @param {number|string} txData.coinToBuy - coin id
 * @param {number|string} [txData.minimumValueToBuy=0]
 * @param {TxOptions} [options]
 * @constructor
 */
export default function SellAllTxData({coinToSell, coinToBuy, minimumValueToBuy = 0}, options = {}) {
    if (!options.disableValidation) {
        validateUint(coinToSell, 'coinToSell');
        validateUint(coinToBuy, 'coinToBuy');
        validateAmount(minimumValueToBuy, 'minimumValueToBuy');
    }

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
 * @param {object} txData
 * @param {Buffer|string} txData.coinToSell
 * @param {Buffer|string} txData.coinToBuy
 * @param {Buffer|string} txData.minimumValueToBuy
 * @param {TxOptions} [options]
 * @return {SellAllTxData}
 */
SellAllTxData.fromBufferFields = function fromBufferFields({coinToSell, coinToBuy, minimumValueToBuy}, options = {}) {
    return new SellAllTxData({
        coinToSell: dataToInteger(coinToSell),
        coinToBuy: dataToInteger(coinToBuy),
        minimumValueToBuy: dataPipToAmount(minimumValueToBuy),
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {SellAllTxData}
 */
SellAllTxData.fromRlp = function fromRlp(data) {
    return SellAllTxData.fromBufferFields(new TxDataSellAll(data));
};
