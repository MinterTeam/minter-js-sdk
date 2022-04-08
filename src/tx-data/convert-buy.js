import {TxDataBuy} from 'minterjs-tx';
import {convertToPip, COIN_MAX_AMOUNT} from 'minterjs-util';
import {proxyNestedTxData, dataToInteger, dataPipToAmount, integerToHexString, validateAmount, validateUint} from '../utils.js';
// import {convertToPip} from 'minterjs-util/src/converter.js';

/**
 * @param {object} txData
 * @param {number|string} txData.coinToSell - coin id
 * @param {number|string} txData.coinToBuy - coin id
 * @param {number|string} txData.valueToBuy
 * @param {number|string} [txData.maximumValueToSell]
 * @param {TxOptions} [options]
 * @constructor
 */
export default function BuyTxData({coinToSell, coinToBuy, valueToBuy, maximumValueToSell = COIN_MAX_AMOUNT}, options = {}) {
    if (!options.disableValidation) {
        validateUint(coinToSell, 'coinToSell');
        validateUint(coinToBuy, 'coinToBuy');
        validateAmount(valueToBuy, 'valueToBuy');
        validateAmount(maximumValueToSell, 'maximumValueToSell');
    }

    this.coinToSell = coinToSell;
    this.coinToBuy = coinToBuy;
    this.valueToBuy = valueToBuy;
    this.maximumValueToSell = maximumValueToSell;

    this.txData = new TxDataBuy({
        coinToSell: integerToHexString(coinToSell),
        coinToBuy: integerToHexString(coinToBuy),
        valueToBuy: `0x${convertToPip(valueToBuy, 'hex')}`,
        maximumValueToSell: `0x${convertToPip(maximumValueToSell, 'hex')}`,
    });

    proxyNestedTxData(this);
}

/**
 * @param {object} txData
 * @param {Buffer|string} txData.coinToSell
 * @param {Buffer|string} txData.valueToBuy
 * @param {Buffer|string} txData.coinToBuy
 * @param {Buffer|string} txData.maximumValueToSell
 * @param {TxOptions} [options]
 * @return {BuyTxData}
 */
BuyTxData.fromBufferFields = function fromBufferFields({coinToSell, valueToBuy, coinToBuy, maximumValueToSell}, options = {}) {
    return new BuyTxData({
        coinToSell: dataToInteger(coinToSell),
        coinToBuy: dataToInteger(coinToBuy),
        valueToBuy: dataPipToAmount(valueToBuy),
        maximumValueToSell: dataPipToAmount(maximumValueToSell),
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {BuyTxData}
 */
BuyTxData.fromRlp = function fromRlp(data) {
    return BuyTxData.fromBufferFields(new TxDataBuy(data));
};
