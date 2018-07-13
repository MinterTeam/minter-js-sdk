import RedeemCheckTxData from 'minterjs-tx/src/tx-data/redeem-check';
import {TX_TYPE_REDEEM_CHECK} from 'minterjs-tx/src/tx-types';
import {toBuffer} from 'minterjs-util';
import {sendTx, getProofWithRecovery} from "./utils";
import {Buffer} from "safe-buffer";

export function redeemCheck({nodeUrl, privateKey, check, password}) {
    if (typeof privateKey === 'string') {
        privateKey = Buffer.from(privateKey, 'hex');
    }
    const proofWithRecovery = getProofWithRecovery(privateKey, password)
    const txData = new RedeemCheckTxData({
        check: toBuffer(check),
        proof: `0x${proofWithRecovery.toString('hex')}`,
    });

    return sendTx({
        nodeUrl,
        privateKey,
        txType: TX_TYPE_REDEEM_CHECK,
        txData: txData.serialize(),
    });
}
