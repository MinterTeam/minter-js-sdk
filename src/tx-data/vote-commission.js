import {TxDataVoteCommission} from 'minterjs-tx';
import {toBuffer, convertToPip} from 'minterjs-util';
import {dataToInteger, dataPipToAmount, dataToPublicKey, integerToHexString, proxyNestedTxData, validateUint, validatePublicKey, validateAmount} from '../utils.js';


/**
 * @param {object} txData
 * @param {string} txData.publicKey
 * @param {number|string} txData.height
 * @param {number|string} txData.coin
 * @param {number|string} txData.payloadByte
 * @param {number|string} txData.send
 * @param {number|string} txData.buyBancor
 * @param {number|string} txData.sellBancor
 * @param {number|string} txData.sellAllBancor
 * @param {number|string} txData.buyPoolBase
 * @param {number|string} txData.buyPoolDelta
 * @param {number|string} txData.sellPoolBase
 * @param {number|string} txData.sellPoolDelta
 * @param {number|string} txData.sellAllPoolBase
 * @param {number|string} txData.sellAllPoolDelta
 * @param {number|string} txData.createTicker3
 * @param {number|string} txData.createTicker4
 * @param {number|string} txData.createTicker5
 * @param {number|string} txData.createTicker6
 * @param {number|string} txData.createTicker7to10
 * @param {number|string} txData.createCoin
 * @param {number|string} txData.createToken
 * @param {number|string} txData.recreateCoin
 * @param {number|string} txData.recreateToken
 * @param {number|string} txData.declareCandidacy
 * @param {number|string} txData.delegate
 * @param {number|string} txData.unbond
 * @param {number|string} txData.redeemCheck
 * @param {number|string} txData.setCandidateOn
 * @param {number|string} txData.setCandidateOff
 * @param {number|string} txData.createMultisig
 * @param {number|string} txData.multisendBase
 * @param {number|string} txData.multisendDelta
 * @param {number|string} txData.editCandidate
 * @param {number|string} txData.setHaltBlock
 * @param {number|string} txData.editTickerOwner
 * @param {number|string} txData.editMultisig
 * //param {number|string} [txData.priceVote]
 * @param {number|string} txData.editCandidatePublicKey
 * @param {number|string} txData.addLiquidity
 * @param {number|string} txData.removeLiquidity
 * @param {number|string} txData.editCandidateCommission
 * @param {number|string} txData.burnToken
 * @param {number|string} txData.mintToken
 * @param {number|string} txData.voteCommission
 * @param {number|string} txData.voteUpdate
 * @param {number|string} txData.createSwapPool
 * @param {number|string} txData.failedTx
 * @param {number|string} txData.addLimitOrder
 * @param {number|string} txData.removeLimitOrder
 * @param {number|string} txData.moveStake
 * @param {number|string} txData.lockStake
 * @param {number|string} txData.lock
 * @param {TxOptions} [options]
 * @constructor
 */
export default function VoteCommissionTxData({
    publicKey,
    height,
    coin,
    payloadByte,
    send,
    buyBancor,
    sellBancor,
    sellAllBancor,
    buyPoolBase,
    buyPoolDelta,
    sellPoolBase,
    sellPoolDelta,
    sellAllPoolBase,
    sellAllPoolDelta,
    createTicker3,
    createTicker4,
    createTicker5,
    createTicker6,
    createTicker7to10,
    createCoin,
    createToken,
    recreateCoin,
    recreateToken,
    declareCandidacy,
    delegate,
    unbond,
    redeemCheck,
    setCandidateOn,
    setCandidateOff,
    createMultisig,
    multisendBase,
    multisendDelta,
    editCandidate,
    setHaltBlock,
    editTickerOwner,
    editMultisig,
    // priceVote,
    editCandidatePublicKey,
    addLiquidity,
    removeLiquidity,
    editCandidateCommission,
    burnToken,
    mintToken,
    voteCommission,
    voteUpdate,
    createSwapPool,
    failedTx,
    addLimitOrder,
    removeLimitOrder,
    moveStake,
    lockStake,
    lock,
}, options = {}) {
    if (!options.disableValidation) {
        validatePublicKey(publicKey, 'publicKey');
        validateUint(height, 'height');
        validateUint(coin, 'coin');
        validateAmount(payloadByte, 'payloadByte');
        validateAmount(send, 'send');
        validateAmount(buyBancor, 'buyBancor');
        validateAmount(sellBancor, 'sellBancor');
        validateAmount(sellAllBancor, 'sellAllBancor');
        validateAmount(buyPoolBase, 'buyPoolBase');
        validateAmount(buyPoolDelta, 'buyPoolDelta');
        validateAmount(sellPoolBase, 'sellPoolBase');
        validateAmount(sellPoolDelta, 'sellPoolDelta');
        validateAmount(sellAllPoolBase, 'sellAllPoolBase');
        validateAmount(sellAllPoolDelta, 'sellAllPoolDelta');
        validateAmount(createTicker3, 'createTicker3');
        validateAmount(createTicker4, 'createTicker4');
        validateAmount(createTicker5, 'createTicker5');
        validateAmount(createTicker6, 'createTicker6');
        validateAmount(createTicker7to10, 'createTicker7to10');
        validateAmount(createCoin, 'createCoin');
        validateAmount(createToken, 'createToken');
        validateAmount(recreateCoin, 'recreateCoin');
        validateAmount(recreateToken, 'recreateToken');
        validateAmount(declareCandidacy, 'declareCandidacy');
        validateAmount(delegate, 'delegate');
        validateAmount(unbond, 'unbond');
        validateAmount(redeemCheck, 'redeemCheck');
        validateAmount(setCandidateOn, 'setCandidateOn');
        validateAmount(setCandidateOff, 'setCandidateOff');
        validateAmount(createMultisig, 'createMultisig');
        validateAmount(multisendBase, 'multisendBase');
        validateAmount(multisendDelta, 'multisendDelta');
        validateAmount(editCandidate, 'editCandidate');
        validateAmount(setHaltBlock, 'setHaltBlock');
        validateAmount(editTickerOwner, 'editTickerOwner');
        validateAmount(editMultisig, 'editMultisig');
        // validateAmount(priceVote, 'priceVote');
        validateAmount(editCandidatePublicKey, 'editCandidatePublicKey');
        validateAmount(addLiquidity, 'addLiquidity');
        validateAmount(removeLiquidity, 'removeLiquidity');
        validateAmount(editCandidateCommission, 'editCandidateCommission');
        validateAmount(burnToken, 'burnToken');
        validateAmount(mintToken, 'mintToken');
        validateAmount(voteCommission, 'voteCommission');
        validateAmount(voteUpdate, 'voteUpdate');
        validateAmount(createSwapPool, 'createSwapPool');
        validateAmount(failedTx, 'failedTx');
        validateAmount(addLimitOrder, 'addLimitOrder');
        validateAmount(removeLimitOrder, 'removeLimitOrder');
        validateAmount(moveStake, 'moveStake');
        validateAmount(lockStake, 'lockStake');
        validateAmount(lock, 'lock');
    }

    this.publicKey = publicKey;
    this.height = height;
    this.coin = coin;
    this.payloadByte = payloadByte;
    this.send = send;
    this.buyBancor = buyBancor;
    this.sellBancor = sellBancor;
    this.sellAllBancor = sellAllBancor;
    this.buyPoolBase = buyPoolBase;
    this.buyPoolDelta = buyPoolDelta;
    this.sellPoolBase = sellPoolBase;
    this.sellPoolDelta = sellPoolDelta;
    this.sellAllPoolBase = sellAllPoolBase;
    this.sellAllPoolDelta = sellAllPoolDelta;
    this.createTicker3 = createTicker3;
    this.createTicker4 = createTicker4;
    this.createTicker5 = createTicker5;
    this.createTicker6 = createTicker6;
    this.createTicker7to10 = createTicker7to10;
    this.createCoin = createCoin;
    this.createToken = createToken;
    this.recreateCoin = recreateCoin;
    this.recreateToken = recreateToken;
    this.declareCandidacy = declareCandidacy;
    this.delegate = delegate;
    this.unbond = unbond;
    this.redeemCheck = redeemCheck;
    this.setCandidateOn = setCandidateOn;
    this.setCandidateOff = setCandidateOff;
    this.createMultisig = createMultisig;
    this.multisendBase = multisendBase;
    this.multisendDelta = multisendDelta;
    this.editCandidate = editCandidate;
    this.setHaltBlock = setHaltBlock;
    this.editTickerOwner = editTickerOwner;
    this.editMultisig = editMultisig;
    // this.priceVote = priceVote;
    this.editCandidatePublicKey = editCandidatePublicKey;
    this.addLiquidity = addLiquidity;
    this.removeLiquidity = removeLiquidity;
    this.editCandidateCommission = editCandidateCommission;
    this.burnToken = burnToken;
    this.mintToken = mintToken;
    this.voteCommission = voteCommission;
    this.voteUpdate = voteUpdate;
    this.createSwapPool = createSwapPool;
    this.failedTx = failedTx;
    this.addLimitOrder = addLimitOrder;
    this.removeLimitOrder = removeLimitOrder;
    this.moveStake = moveStake;
    this.lockStake = lockStake;
    this.lock = lock;

    this.txData = new TxDataVoteCommission({
        publicKey: toBuffer(publicKey),
        height: integerToHexString(height),
        coin: integerToHexString(coin),
        payloadByte: `0x${convertToPip(payloadByte, 'hex')}`,
        send: `0x${convertToPip(send, 'hex')}`,
        buyBancor: `0x${convertToPip(buyBancor, 'hex')}`,
        sellBancor: `0x${convertToPip(sellBancor, 'hex')}`,
        sellAllBancor: `0x${convertToPip(sellAllBancor, 'hex')}`,
        buyPoolBase: `0x${convertToPip(buyPoolBase, 'hex')}`,
        buyPoolDelta: `0x${convertToPip(buyPoolDelta, 'hex')}`,
        sellPoolBase: `0x${convertToPip(sellPoolBase, 'hex')}`,
        sellPoolDelta: `0x${convertToPip(sellPoolDelta, 'hex')}`,
        sellAllPoolBase: `0x${convertToPip(sellAllPoolBase, 'hex')}`,
        sellAllPoolDelta: `0x${convertToPip(sellAllPoolDelta, 'hex')}`,
        createTicker3: `0x${convertToPip(createTicker3, 'hex')}`,
        createTicker4: `0x${convertToPip(createTicker4, 'hex')}`,
        createTicker5: `0x${convertToPip(createTicker5, 'hex')}`,
        createTicker6: `0x${convertToPip(createTicker6, 'hex')}`,
        createTicker7to10: `0x${convertToPip(createTicker7to10, 'hex')}`,
        createCoin: `0x${convertToPip(createCoin, 'hex')}`,
        createToken: `0x${convertToPip(createToken, 'hex')}`,
        recreateCoin: `0x${convertToPip(recreateCoin, 'hex')}`,
        recreateToken: `0x${convertToPip(recreateToken, 'hex')}`,
        declareCandidacy: `0x${convertToPip(declareCandidacy, 'hex')}`,
        delegate: `0x${convertToPip(delegate, 'hex')}`,
        unbond: `0x${convertToPip(unbond, 'hex')}`,
        redeemCheck: `0x${convertToPip(redeemCheck, 'hex')}`,
        setCandidateOn: `0x${convertToPip(setCandidateOn, 'hex')}`,
        setCandidateOff: `0x${convertToPip(setCandidateOff, 'hex')}`,
        createMultisig: `0x${convertToPip(createMultisig, 'hex')}`,
        multisendBase: `0x${convertToPip(multisendBase, 'hex')}`,
        multisendDelta: `0x${convertToPip(multisendDelta, 'hex')}`,
        editCandidate: `0x${convertToPip(editCandidate, 'hex')}`,
        setHaltBlock: `0x${convertToPip(setHaltBlock, 'hex')}`,
        editTickerOwner: `0x${convertToPip(editTickerOwner, 'hex')}`,
        editMultisig: `0x${convertToPip(editMultisig, 'hex')}`,
        // priceVote: `0x${convertToPip(priceVote, 'hex')}`,
        editCandidatePublicKey: `0x${convertToPip(editCandidatePublicKey, 'hex')}`,
        addLiquidity: `0x${convertToPip(addLiquidity, 'hex')}`,
        removeLiquidity: `0x${convertToPip(removeLiquidity, 'hex')}`,
        editCandidateCommission: `0x${convertToPip(editCandidateCommission, 'hex')}`,
        burnToken: `0x${convertToPip(burnToken, 'hex')}`,
        mintToken: `0x${convertToPip(mintToken, 'hex')}`,
        voteCommission: `0x${convertToPip(voteCommission, 'hex')}`,
        voteUpdate: `0x${convertToPip(voteUpdate, 'hex')}`,
        createSwapPool: `0x${convertToPip(createSwapPool, 'hex')}`,
        failedTx: `0x${convertToPip(failedTx, 'hex')}`,
        addLimitOrder: `0x${convertToPip(addLimitOrder, 'hex')}`,
        removeLimitOrder: `0x${convertToPip(removeLimitOrder, 'hex')}`,
        moveStake: `0x${convertToPip(moveStake, 'hex')}`,
        lockStake: `0x${convertToPip(lockStake, 'hex')}`,
        lock: `0x${convertToPip(lock, 'hex')}`,
    });

    proxyNestedTxData(this);
}

/**
 * @param {object} txData
 * @param {Buffer|string} txData.publicKey
 * @param {Buffer|string|number} txData.height
 * @param {Buffer|string|number} txData.coin
 * @param {Buffer|string|number} txData.payloadByte
 * @param {Buffer|string|number} txData.send
 * @param {Buffer|string|number} txData.buyBancor
 * @param {Buffer|string|number} txData.sellBancor
 * @param {Buffer|string|number} txData.sellAllBancor
 * @param {Buffer|string|number} txData.buyPoolBase
 * @param {Buffer|string|number} txData.buyPoolDelta
 * @param {Buffer|string|number} txData.sellPoolBase
 * @param {Buffer|string|number} txData.sellPoolDelta
 * @param {Buffer|string|number} txData.sellAllPoolBase
 * @param {Buffer|string|number} txData.sellAllPoolDelta
 * @param {Buffer|string|number} txData.createTicker3
 * @param {Buffer|string|number} txData.createTicker4
 * @param {Buffer|string|number} txData.createTicker5
 * @param {Buffer|string|number} txData.createTicker6
 * @param {Buffer|string|number} txData.createTicker7to10
 * @param {Buffer|string|number} txData.createCoin
 * @param {Buffer|string|number} txData.createToken
 * @param {Buffer|string|number} txData.recreateCoin
 * @param {Buffer|string|number} txData.recreateToken
 * @param {Buffer|string|number} txData.declareCandidacy
 * @param {Buffer|string|number} txData.delegate
 * @param {Buffer|string|number} txData.unbond
 * @param {Buffer|string|number} txData.redeemCheck
 * @param {Buffer|string|number} txData.setCandidateOn
 * @param {Buffer|string|number} txData.setCandidateOff
 * @param {Buffer|string|number} txData.createMultisig
 * @param {Buffer|string|number} txData.multisendBase
 * @param {Buffer|string|number} txData.multisendDelta
 * @param {Buffer|string|number} txData.editCandidate
 * @param {Buffer|string|number} txData.setHaltBlock
 * @param {Buffer|string|number} txData.editTickerOwner
 * @param {Buffer|string|number} txData.editMultisig
 * //param {Buffer|string|number} [txData.priceVote]
 * @param {Buffer|string|number} txData.editCandidatePublicKey
 * @param {Buffer|string|number} txData.addLiquidity
 * @param {Buffer|string|number} txData.removeLiquidity
 * @param {Buffer|string|number} txData.editCandidateCommission
 * @param {Buffer|string|number} txData.burnToken
 * @param {Buffer|string|number} txData.mintToken
 * @param {Buffer|string|number} txData.voteCommission
 * @param {Buffer|string|number} txData.voteUpdate
 * @param {Buffer|string|number} txData.createSwapPool
 * @param {Buffer|string|number} txData.failedTx
 * @param {Buffer|string|number} txData.addLimitOrder
 * @param {Buffer|string|number} txData.removeLimitOrder
 * @param {Buffer|string|number} txData.moveStake
 * @param {Buffer|string|number} txData.lockStake
 * @param {Buffer|string|number} txData.lock
 * @param {TxOptions} [options]
 * @return {VoteCommissionTxData}
 */
VoteCommissionTxData.fromBufferFields = function fromBufferFields({publicKey, height, coin, payloadByte, send, buyBancor, sellBancor, sellAllBancor, buyPoolBase, buyPoolDelta, sellPoolBase, sellPoolDelta, sellAllPoolBase, sellAllPoolDelta, createTicker3, createTicker4, createTicker5, createTicker6, createTicker7to10, createCoin, createToken, recreateCoin, recreateToken, declareCandidacy, delegate, unbond, redeemCheck, setCandidateOn, setCandidateOff, createMultisig, multisendBase, multisendDelta, editCandidate, setHaltBlock, editTickerOwner, editMultisig, /* priceVote, */ editCandidatePublicKey, addLiquidity, removeLiquidity, editCandidateCommission, burnToken, mintToken, voteCommission, voteUpdate, createSwapPool, failedTx, addLimitOrder, removeLimitOrder, moveStake, lockStake, lock}, options = {}) {
    return new VoteCommissionTxData({
        publicKey: dataToPublicKey(publicKey),
        height: dataToInteger(height),
        coin: dataToInteger(coin),
        payloadByte: dataPipToAmount(payloadByte),
        send: dataPipToAmount(send),
        buyBancor: dataPipToAmount(buyBancor),
        sellBancor: dataPipToAmount(sellBancor),
        sellAllBancor: dataPipToAmount(sellAllBancor),
        buyPoolBase: dataPipToAmount(buyPoolBase),
        buyPoolDelta: dataPipToAmount(buyPoolDelta),
        sellPoolBase: dataPipToAmount(sellPoolBase),
        sellPoolDelta: dataPipToAmount(sellPoolDelta),
        sellAllPoolBase: dataPipToAmount(sellAllPoolBase),
        sellAllPoolDelta: dataPipToAmount(sellAllPoolDelta),
        createTicker3: dataPipToAmount(createTicker3),
        createTicker4: dataPipToAmount(createTicker4),
        createTicker5: dataPipToAmount(createTicker5),
        createTicker6: dataPipToAmount(createTicker6),
        createTicker7to10: dataPipToAmount(createTicker7to10),
        createCoin: dataPipToAmount(createCoin),
        createToken: dataPipToAmount(createToken),
        recreateCoin: dataPipToAmount(recreateCoin),
        recreateToken: dataPipToAmount(recreateToken),
        declareCandidacy: dataPipToAmount(declareCandidacy),
        delegate: dataPipToAmount(delegate),
        unbond: dataPipToAmount(unbond),
        redeemCheck: dataPipToAmount(redeemCheck),
        setCandidateOn: dataPipToAmount(setCandidateOn),
        setCandidateOff: dataPipToAmount(setCandidateOff),
        createMultisig: dataPipToAmount(createMultisig),
        multisendBase: dataPipToAmount(multisendBase),
        multisendDelta: dataPipToAmount(multisendDelta),
        editCandidate: dataPipToAmount(editCandidate),
        setHaltBlock: dataPipToAmount(setHaltBlock),
        editTickerOwner: dataPipToAmount(editTickerOwner),
        editMultisig: dataPipToAmount(editMultisig),
        // priceVote: dataPipToAmount(priceVote),
        editCandidatePublicKey: dataPipToAmount(editCandidatePublicKey),
        addLiquidity: dataPipToAmount(addLiquidity),
        removeLiquidity: dataPipToAmount(removeLiquidity),
        editCandidateCommission: dataPipToAmount(editCandidateCommission),
        burnToken: dataPipToAmount(burnToken),
        mintToken: dataPipToAmount(mintToken),
        voteCommission: dataPipToAmount(voteCommission),
        voteUpdate: dataPipToAmount(voteUpdate),
        createSwapPool: dataPipToAmount(createSwapPool),
        failedTx: dataPipToAmount(failedTx),
        addLimitOrder: dataPipToAmount(addLimitOrder),
        removeLimitOrder: dataPipToAmount(removeLimitOrder),
        moveStake: dataPipToAmount(moveStake),
        lockStake: dataPipToAmount(lockStake),
        lock: dataPipToAmount(lock),
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {VoteCommissionTxData}
 */
VoteCommissionTxData.fromRlp = function fromRlp(data) {
    return VoteCommissionTxData.fromBufferFields(new TxDataVoteCommission(data));
};
