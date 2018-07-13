import ethUtil from 'ethereumjs-util';
//@TODO replace with ethUtil.sha256
import sha256 from 'js-sha256'
import secp256k1 from 'secp256k1'
import RedeemCheckTxData from 'minterjs-tx/src/tx-data/redeem-check';
import {TX_TYPE_REDEEM_CHECK} from 'minterjs-tx/src/tx-types';
import {mToBuffer} from 'minterjs-tx/src/helpers';
import {sendTx} from "./utils";
import {Buffer} from "safe-buffer";

export function redeemCheck({nodeUrl, privateKey, check, password}) {
    if (typeof privateKey === 'string') {
        privateKey = Buffer.from(privateKey, 'hex');
    }
    const addressBuffer = ethUtil.privateToAddress(privateKey);
    const addressHash = ethUtil.rlphash([
        addressBuffer,
    ]);

    const passphraseBuffer = Buffer.from(sha256(password), 'hex');
    const proof = secp256k1.sign(addressHash, passphraseBuffer);
    const proofWithRecovery = new (proof.signature.constructor)(65);
    proofWithRecovery.set(proof.signature, 0);
    proofWithRecovery[64] = proof.recovery;


    const txData = new RedeemCheckTxData({
        check: mToBuffer(check),
        proof: `0x${proofWithRecovery.toString('hex')}`,
    });

    return sendTx({
        nodeUrl,
        privateKey,
        message,
        txType: TX_TYPE_REDEEM_CHECK,
        txData: txData.serialize(),
    });
}
