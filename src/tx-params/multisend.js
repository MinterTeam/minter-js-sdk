import MinterMultisendTxData from 'minterjs-tx/src/tx-data/multisend';
import {TX_TYPE_MULTISEND} from 'minterjs-tx/src/tx-types';
import {convertToPip} from 'minterjs-util/src/converter';
import {formatCoin} from 'minterjs-tx/src/helpers';
import {toBuffer} from 'minterjs-util/src/prefix';

/**
 * @constructor
 * @param {Array} list
 * @param {string} [feeCoinSymbol]
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function MultisendTxParams({list, feeCoinSymbol, ...otherParams}) {
    const txData = new MinterMultisendTxData({
        list: list.map((item) => {
            return {
                to: toBuffer(item.to),
                coin: formatCoin(item.coin),
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
