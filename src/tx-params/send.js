import {MinterTxDataSend, TX_TYPE_SEND, coinToBuffer} from 'minterjs-tx';
import {convertToPip, toBuffer} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter';
// import {toBuffer} from 'minterjs-util/src/prefix';

/**
 * @constructor
 * @param {string} address
 * @param {number|string} amount
 * @param {string} coinSymbol
 * @param {string} [feeCoinSymbol]
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function SendTxParams({address, amount = 0, coinSymbol, feeCoinSymbol, ...otherParams}) {
    const txData = new MinterTxDataSend({
        to: toBuffer(address),
        coin: coinToBuffer(coinSymbol),
        value: `0x${convertToPip(amount, 'hex')}`,
    });

    if (!feeCoinSymbol) {
        feeCoinSymbol = coinSymbol;
    }

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_SEND,
        txData: txData.serialize(),
    };
}
