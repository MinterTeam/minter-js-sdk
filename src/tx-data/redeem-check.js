import secp256k1 from 'secp256k1';
import {sha256, rlphash} from 'ethereumjs-util/dist/hash.js';
import {walletFromMnemonic, walletFromPrivateKey} from 'minterjs-wallet';
import {TxDataRedeemCheck} from 'minterjs-tx';
// import TxDataRedeemCheck from 'minterjs-tx/src/tx-data/redeem-check.js';
import {toBuffer, checkToString} from 'minterjs-util';
import {proxyNestedTxData, validateCheck} from '../utils.js';


/**
 * @param {object} txData
 * @param {ByteArray} txData.check
 * @param {ByteArray} [txData.proof]
 * @param {TxOptions} [options]
 * @constructor
 */
export default function RedeemCheckTxData({check, proof}, options = {}) {
    if (!options.disableValidation) {
        validateCheck(check, 'check');
    }

    // eslint-disable-next-line prefer-rest-params
    if (!options.password && arguments[0].password) {
        // eslint-disable-next-line prefer-rest-params
        options.password = arguments[0].password;
        // eslint-disable-next-line no-console
        console.warn('Check password in tx data is deprecated. Pass it as field in the second argument.');
    }
    // eslint-disable-next-line prefer-rest-params
    if (!options.privateKey && arguments[0].privateKey) {
        // eslint-disable-next-line prefer-rest-params
        options.privateKey = arguments[0].privateKey;
        // eslint-disable-next-line no-console
        console.warn('Private key in tx data is deprecated. Pass it as field in the second argument.');
    }
    this.check = checkToString(check);

    if (proof) {
        proof = toBuffer(proof);
    } else if (options.address || options.privateKey || options.seedPhrase) {
        proof = getProofWithRecovery(options);
    }

    this.txData = new TxDataRedeemCheck({
        check: toBuffer(check),
        proof,
    });
    this.proof = proof ? `0x${proof.toString('hex')}` : undefined;

    proxyNestedTxData(this);
}

/**
 * @param {object} txData
 * @param {Buffer|string} txData.check
 * @param {Buffer|string} txData.proof
 * @param {TxOptions} [options]
 * @return {RedeemCheckTxData}
 */
RedeemCheckTxData.fromBufferFields = function fromBufferFields({check, proof}, options = {}) {
    return new RedeemCheckTxData({
        check,
        proof,
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {RedeemCheckTxData}
 */
RedeemCheckTxData.fromRlp = function fromRlp(data) {
    return RedeemCheckTxData.fromBufferFields(new TxDataRedeemCheck(data));
};

/**
 * @param {TxOptions} options
 * @param {ByteArray} options.password
 * @param {ByteArray} [options.address]
 * @param {ByteArray} [options.privateKey]
 * @param {string} [options.seedPhrase]
 * @return {ArrayBuffer|Buffer}
 */
function getProofWithRecovery({password, address, privateKey, seedPhrase}) {
    let addressBuffer;
    if (address) {
        addressBuffer = toBuffer(address);
    } else if (privateKey) {
        privateKey = toBuffer(privateKey);
        addressBuffer = walletFromPrivateKey(privateKey).getAddress();
    } else if (seedPhrase) {
        addressBuffer = walletFromMnemonic(seedPhrase).getAddress();
    } else {
        throw new Error('No address nor seed phrase nor private key given to generate proof');
    }
    const addressHash = rlphash([
        addressBuffer,
    ]);

    // ensure Buffer
    password = typeof password === 'string' ? Buffer.from(password, 'utf8') : toBuffer(password);

    const passwordBuffer = sha256(password);
    const proof = secp256k1.ecdsaSign(addressHash, passwordBuffer);
    const proofWithRecovery = Buffer.alloc(65);
    proofWithRecovery.set(proof.signature, 0);
    proofWithRecovery[64] = proof.recid;

    return proofWithRecovery;
}
