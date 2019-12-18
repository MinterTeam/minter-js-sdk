import {TX_TYPE} from 'minterjs-tx';
// import TxDataRedeemCheck from 'minterjs-tx/src/tx-data/redeem-check';
// import {TX_TYPE} from 'minterjs-tx/src/tx-types';
import RedeemCheckTxData from '../tx-data/redeem-check';


/**
 * //@TODO https://github.com/MinterTeam/minter-js-sdk/issues/13 to allow easy `prepareLink` without proof
 * @constructor
 * @param {string|Buffer} [privateKey]
 * @param {string|Buffer} check
 * @param {string} [password]
 * @param {string|Buffer} [proof]
 * @param {string} [feeCoinSymbol] - should be base coin
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function RedeemCheckTxParams({privateKey, check, password, proof, feeCoinSymbol, ...otherParams}) {
    // @TODO set gasCoin automatically after #263 resolved @see https://github.com/MinterTeam/minter-go-node/issues/263
    if (feeCoinSymbol && (feeCoinSymbol.toUpperCase() !== 'MNT' && feeCoinSymbol.toUpperCase() !== 'BIP')) {
        throw new Error('feeCoinSymbol should be baseCoin');
    }

    const txData = new RedeemCheckTxData({privateKey, check, password, proof});

    return {
        ...otherParams,
        privateKey,
        // only gasPrice: 1 is allowed by blockchain
        gasPrice: 1,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE.REDEEM_CHECK,
        txData: txData.serialize(),
    };
}
