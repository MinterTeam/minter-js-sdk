import {MinterTxDataMultisend, TX_TYPE_MULTISEND, coinToBuffer} from 'minterjs-tx';
// import MinterTxDataMultisend from 'minterjs-tx/src/tx-data/create-coin';
// import {TX_TYPE_MULTISEND} from 'minterjs-tx/src/tx-types';
// import {coinToBuffer} from 'minterjs-tx/src/helpers';
import {convertToPip, toBuffer} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter';
// import {toBuffer} from 'minterjs-util/src/prefix';

/**
 * @constructor
 * @param {Array} list
 * @param {string} [feeCoinSymbol]
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function MultisendTxParams({list, feeCoinSymbol, ...otherParams}) {
    const txData = new MinterTxDataMultisend({
        list: list.map((item) => {
            return {
                to: toBuffer(item.to),
                coin: coinToBuffer(item.coin),
                value: `0x${convertToPip(item.value, 'hex')}`,
            };
        }),
    });

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_MULTISEND,
        txData: txData.serialize(),
    };
}
