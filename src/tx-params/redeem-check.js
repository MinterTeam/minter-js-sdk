import {Buffer} from 'safe-buffer';
import secp256k1 from 'secp256k1';
import {sha256, rlphash, privateToAddress} from 'ethereumjs-util';
import {MinterTxDataRedeemCheck, TX_TYPE_REDEEM_CHECK} from 'minterjs-tx';
import {toBuffer} from 'minterjs-util';


/**
 * @constructor
 * @param {string|Buffer} privateKey
 * @param {string} check
 * @param {string} password
 * @param {string} [feeCoinSymbol] - should be base coin
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function RedeemCheckTxParams({privateKey, check, password, feeCoinSymbol, ...otherParams}) {
    // @TODO set gasCoin automatically after #263 resolved @see https://github.com/MinterTeam/minter-go-node/issues/263
    if (feeCoinSymbol && (feeCoinSymbol.toUpperCase() !== 'MNT' && feeCoinSymbol.toUpperCase() !== 'BIP')) {
        throw new Error('feeCoinSymbol should be baseCoin');
    }
    if (typeof privateKey === 'string') {
        privateKey = Buffer.from(privateKey, 'hex');
    }
    const proofWithRecovery = getProofWithRecovery(privateKey, password);
    const txData = new MinterTxDataRedeemCheck({
        rawCheck: toBuffer(check),
        proof: `0x${proofWithRecovery.toString('hex')}`,
    });

    return {
        ...otherParams,
        privateKey,
        // only gasPrice: 1 is allowed by blockchain
        gasPrice: 1,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_REDEEM_CHECK,
        txData: txData.serialize(),
    };
}

/**
 * @param {Buffer} privateKey
 * @param {string} password
 * @return {ArrayBuffer}
 */
function getProofWithRecovery(privateKey, password) {
    const addressBuffer = privateToAddress(privateKey);
    const addressHash = rlphash([
        addressBuffer,
    ]);

    const passphraseBuffer = sha256(password);
    const proof = secp256k1.sign(addressHash, passphraseBuffer);
    const proofWithRecovery = new (proof.signature.constructor)(65);
    proofWithRecovery.set(proof.signature, 0);
    proofWithRecovery[64] = proof.recovery;

    return proofWithRecovery;
}
