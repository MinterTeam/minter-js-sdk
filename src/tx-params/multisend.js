import {MinterTxDataMultisend, TX_TYPE_MULTISEND, formatCoin} from 'minterjs-tx';
import {convertToPip, toBuffer} from 'minterjs-util';

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
