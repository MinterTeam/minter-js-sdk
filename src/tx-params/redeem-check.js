import {TX_TYPE} from 'minterjs-util';
// import TxDataRedeemCheck from 'minterjs-tx/src/tx-data/redeem-check.js';
// import {TX_TYPE} from 'minterjs-tx/src/tx-types.js';
import {getGasCoinFromCheck} from '../check.js';
import RedeemCheckTxData from '../tx-data/redeem-check.js';


/**
 * @deprecated
 * //@TODO https://github.com/MinterTeam/minter-js-sdk/issues/13 to allow easy `prepareLink` without proof
 * @constructor
 * @param {string|Buffer} [privateKey]
 * @param {string|Buffer} check
 * @param {string} [password]
 * @param {string|Buffer} [proof]
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function RedeemCheckTxParams({privateKey, check, password, proof, ...otherParams}) {
    // eslint-disable-next-line no-console
    console.warn('RedeemCheckTxParams is deprecated');

    const gasCoin = getGasCoinFromCheck(check);
    if (typeof privateKey === 'string') {
        privateKey = Buffer.from(privateKey, 'hex');
    }

    const txData = new RedeemCheckTxData({privateKey, check, password, proof});

    return {
        ...otherParams,
        privateKey,
        // only gasPrice: 1 is allowed by blockchain
        gasPrice: 1,
        gasCoin,
        txType: TX_TYPE.REDEEM_CHECK,
        txData: txData.serialize(),
    };
}
