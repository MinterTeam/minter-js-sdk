/**
 * @param {TxParams} params
 * @return {TxParams}
 */
export default function decorateRedeemCheckTxParams(params) {
    // @TODO set gasCoin automatically after #263 resolved @see https://github.com/MinterTeam/minter-go-node/issues/263
    if (params.gasCoin && (params.gasCoin.toUpperCase() !== 'MNT' && params.gasCoin.toUpperCase() !== 'BIP')) {
        throw new Error('gasCoin should be base coin');
    }
    // only gasPrice: 1 is allowed by blockchain
    params.gasPrice = 1;

    return params;
}
