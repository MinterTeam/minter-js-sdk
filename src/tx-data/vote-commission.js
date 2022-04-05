import {TxDataVoteCommission} from 'minterjs-tx';
import {toBuffer, convertToPip} from 'minterjs-util';
import {dataToInteger, dataPipToAmount, dataToPublicKey, integerToHexString, proxyNestedTxData, validateUint, validatePublicKey, validateAmount} from '../utils.js';


/**
 * @param {string} publicKey
 * @param {number|string} height
 * @param {number|string} coin
 * @param {number|string} payloadByte
 * @param {number|string} send
 * @param {number|string} buyBancor
 * @param {number|string} sellBancor
 * @param {number|string} sellAllBancor
 * @param {number|string} buyPoolBase
 * @param {number|string} buyPoolDelta
 * @param {number|string} sellPoolBase
 * @param {number|string} sellPoolDelta
 * @param {number|string} sellAllPoolBase
 * @param {number|string} sellAllPoolDelta
 * @param {number|string} createTicker3
 * @param {number|string} createTicker4
 * @param {number|string} createTicker5
 * @param {number|string} createTicker6
 * @param {number|string} createTicker7to10
 * @param {number|string} createCoin
 * @param {number|string} createToken
 * @param {number|string} recreateCoin
 * @param {number|string} recreateToken
 * @param {number|string} declareCandidacy
 * @param {number|string} delegate
 * @param {number|string} unbond
 * @param {number|string} redeemCheck
 * @param {number|string} setCandidateOn
 * @param {number|string} setCandidateOff
 * @param {number|string} createMultisig
 * @param {number|string} multisendBase
 * @param {number|string} multisendDelta
 * @param {number|string} editCandidate
 * @param {number|string} setHaltBlock
 * @param {number|string} editTickerOwner
 * @param {number|string} editMultisig
 * @param {number|string} [priceVote]
 * @param {number|string} editCandidatePublicKey
 * @param {number|string} addLiquidity
 * @param {number|string} removeLiquidity
 * @param {number|string} editCandidateCommission
 * @param {number|string} burnToken
 * @param {number|string} mintToken
 * @param {number|string} voteCommission
 * @param {number|string} voteUpdate
 * @param {number|string} createSwapPool
 * @param {number|string} failedTx
 * @param {number|string} addLimitOrder
 * @param {number|string} removeLimitOrder
 * @param {number|string} moveStake
 * @param {number|string} lockStake
 * @param {number|string} lock
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
 * @param {Buffer|string} publicKey
 * @param {Buffer|string|number} height
 * @param {Buffer|string|number} coin
 * @param {Buffer|string|number} payloadByte
 * @param {Buffer|string|number} send
 * @param {Buffer|string|number} buyBancor
 * @param {Buffer|string|number} sellBancor
 * @param {Buffer|string|number} sellAllBancor
 * @param {Buffer|string|number} buyPoolBase
 * @param {Buffer|string|number} buyPoolDelta
 * @param {Buffer|string|number} sellPoolBase
 * @param {Buffer|string|number} sellPoolDelta
 * @param {Buffer|string|number} sellAllPoolBase
 * @param {Buffer|string|number} sellAllPoolDelta
 * @param {Buffer|string|number} createTicker3
 * @param {Buffer|string|number} createTicker4
 * @param {Buffer|string|number} createTicker5
 * @param {Buffer|string|number} createTicker6
 * @param {Buffer|string|number} createTicker7to10
 * @param {Buffer|string|number} createCoin
 * @param {Buffer|string|number} createToken
 * @param {Buffer|string|number} recreateCoin
 * @param {Buffer|string|number} recreateToken
 * @param {Buffer|string|number} declareCandidacy
 * @param {Buffer|string|number} delegate
 * @param {Buffer|string|number} unbond
 * @param {Buffer|string|number} redeemCheck
 * @param {Buffer|string|number} setCandidateOn
 * @param {Buffer|string|number} setCandidateOff
 * @param {Buffer|string|number} createMultisig
 * @param {Buffer|string|number} multisendBase
 * @param {Buffer|string|number} multisendDelta
 * @param {Buffer|string|number} editCandidate
 * @param {Buffer|string|number} setHaltBlock
 * @param {Buffer|string|number} editTickerOwner
 * @param {Buffer|string|number} editMultisig
 * @param {Buffer|string|number} [priceVote]
 * @param {Buffer|string|number} editCandidatePublicKey
 * @param {Buffer|string|number} addLiquidity
 * @param {Buffer|string|number} removeLiquidity
 * @param {Buffer|string|number} editCandidateCommission
 * @param {Buffer|string|number} burnToken
 * @param {Buffer|string|number} mintToken
 * @param {Buffer|string|number} voteCommission
 * @param {Buffer|string|number} voteUpdate
 * @param {Buffer|string|number} createSwapPool
 * @param {Buffer|string|number} failedTx
 * @param {Buffer|string|number} addLimitOrder
 * @param {Buffer|string|number} removeLimitOrder
 * @param {Buffer|string|number} moveStake
 * @param {Buffer|string|number} lockStake
 * @param {Buffer|string|number} lock
 * @param {TxOptions} [options]
 * @return {VoteCommissionTxData}
 */
VoteCommissionTxData.fromBufferFields = function fromBufferFields({publicKey, height, coin, payloadByte, send, buyBancor, sellBancor, sellAllBancor, buyPoolBase, buyPoolDelta, sellPoolBase, sellPoolDelta, sellAllPoolBase, sellAllPoolDelta, createTicker3, createTicker4, createTicker5, createTicker6, createTicker7to10, createCoin, createToken, recreateCoin, recreateToken, declareCandidacy, delegate, unbond, redeemCheck, setCandidateOn, setCandidateOff, createMultisig, multisendBase, multisendDelta, editCandidate, setHaltBlock, editTickerOwner, editMultisig, priceVote, editCandidatePublicKey, addLiquidity, removeLiquidity, editCandidateCommission, burnToken, mintToken, voteCommission, voteUpdate, createSwapPool, failedTx, addLimitOrder, removeLimitOrder, moveStake, lockStake, lock}, options = {}) {
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
