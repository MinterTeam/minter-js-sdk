import secp256k1 from 'secp256k1';
import {sha256, rlphash} from 'ethereumjs-util/dist/hash';
import {privateToAddress} from 'ethereumjs-util/dist/account';
import {MinterTxDataRedeemCheck, TX_TYPE_REDEEM_CHECK} from 'minterjs-tx';
// import MinterTxDataRedeemCheck from 'minterjs-tx/src/tx-data/redeem-check';
// import {TX_TYPE_REDEEM_CHECK} from 'minterjs-tx/src/tx-types';
import {toBuffer} from 'minterjs-util';
// import {toBuffer} from 'minterjs-util/src/prefix';


/**
 * @constructor
 * @param {string|Buffer} privateKey
 * @param {string} check
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
    if (typeof privateKey === 'string') {
        privateKey = Buffer.from(privateKey, 'hex');
    }

    const proofWithRecovery = proof || getProofWithRecovery(privateKey, password);
    const txData = new MinterTxDataRedeemCheck({
        rawCheck: toBuffer(check),
        proof: proofWithRecovery,
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

    if (typeof password === 'string') {
        password = Buffer.from(password, 'utf-8');
    }

    const passphraseBuffer = sha256(password);
    const proof = secp256k1.sign(addressHash, passphraseBuffer);
    const proofWithRecovery = new (proof.signature.constructor)(65);
    proofWithRecovery.set(proof.signature, 0);
    proofWithRecovery[64] = proof.recovery;

    return proofWithRecovery;
}
