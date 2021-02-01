import {TX_TYPE} from 'minterjs-util';

import {API_TYPE_NODE, API_TYPE_GATE} from './variables.js';
import Minter from './minter.js';
import MinterApi from './api/index.js';
import PostTx, {EnsureNonce} from './api/post-tx.js';
import PostSignedTx from './api/post-signed-tx.js';
import GetNonce from './api/get-nonce.js';
import GetCoinInfo from './api/get-coin-info.js';
import GetCoinInfoById from './api/get-coin-info-by-id.js';
import GetMinGasPrice from './api/get-min-gas-price.js';
import EstimateCoinSell from './api/estimate-coin-sell.js';
import EstimateCoinBuy from './api/estimate-coin-buy.js';
import EstimateTxCommission from './api/estimate-tx-commission.js';
import {ReplaceCoinSymbol, ReplaceCoinSymbolByPath} from './api/replace-coin.js';
import issueCheck, {decodeCheck, getGasCoinFromCheck} from './check.js';
import {prepareLink, decodeLink} from './link.js';

import prepareSignedTx, {decodeTx, prepareTx, makeSignature} from './tx.js';
import getTxData from './tx-data/index.js';

import RedeemCheckTxData from './tx-data/redeem-check.js';
import SendTxData from './tx-data/send.js';
import MultisendTxData from './tx-data/multisend.js';
import SellTxData from './tx-data/convert-sell.js';
import SellAllTxData from './tx-data/convert-sell-all.js';
import BuyTxData from './tx-data/convert-buy.js';
import DeclareCandidacyTxData from './tx-data/candidacy-declare.js';
import SetCandidateOnTxData from './tx-data/candidate-set-on.js';
import SetCandidateOffTxData from './tx-data/candidate-set-off.js';
import EditCandidateTxData from './tx-data/candidate-edit.js';
import EditCandidatePublicKeyTxData from './tx-data/candidate-edit-public-key.js';
import DelegateTxData from './tx-data/stake-delegate.js';
import UnbondTxData from './tx-data/stake-unbond.js';
import CreateCoinTxData from './tx-data/create-coin.js';
import RecreateCoinTxData from './tx-data/recreate-coin.js';
import EditTickerOwnerTxData from './tx-data/edit-ticker-owner.js';
import CreateMultisigTxData from './tx-data/create-multisig.js';
import EditMultisigTxData from './tx-data/edit-multisig.js';
import SetHaltBlockTxData from './tx-data/vote-halt-block.js';
import PriceVoteTxData from './tx-data/vote-price.js';
import AddLiquidityTxData from './tx-data/pool-add-liquidity.js';
import RemoveLiquidityTxData from './tx-data/pool-remove-liquidity.js';
import BuySwapPoolTxData from './tx-data/pool-buy.js';
import SellSwapPoolTxData from './tx-data/pool-sell.js';
import SellAllSwapPoolTxData from './tx-data/pool-sell-all.js';
import EditCandidateCommissionTxData from './tx-data/candidate-edit-commission.js';
import MoveStakeTxData from './tx-data/stake-move.js';
import MintTokenTxData from './tx-data/token-mint.js';
import BurnTokenTxData from './tx-data/token-burn.js';
import CreateTokenTxData from './tx-data/token-create.js';
import RecreateTokenTxData from './tx-data/token-recreate.js';
import VoteCommissionTxData from './tx-data/vote-commission.js';
import VoteUpdateTxData from './tx-data/vote-update.js';
import CreateSwapPoolTxData from './tx-data/pool-create.js';

export default Minter;
export {
    TX_TYPE,
    API_TYPE_NODE,
    API_TYPE_GATE,
    Minter,
    MinterApi,
    PostTx,
    PostSignedTx,
    GetNonce,
    EnsureNonce,
    GetCoinInfo,
    GetCoinInfoById,
    GetMinGasPrice,
    EstimateCoinSell,
    EstimateCoinBuy,
    EstimateTxCommission,
    ReplaceCoinSymbol,
    ReplaceCoinSymbolByPath,
    //
    prepareSignedTx,
    prepareTx,
    makeSignature,
    decodeTx,
    // link
    prepareLink,
    decodeLink,
    // check
    issueCheck,
    decodeCheck,
    getGasCoinFromCheck,
    // tx data
    getTxData,
    // - coin
    SendTxData,
    MultisendTxData,
    SellTxData,
    SellAllTxData,
    BuyTxData,
    CreateCoinTxData,
    RecreateCoinTxData,
    EditTickerOwnerTxData,
    // - validator
    DeclareCandidacyTxData,
    SetCandidateOnTxData,
    SetCandidateOffTxData,
    EditCandidateTxData,
    EditCandidatePublicKeyTxData,
    EditCandidateCommissionTxData,
    // - vote
    SetHaltBlockTxData,
    PriceVoteTxData,
    VoteCommissionTxData,
    VoteUpdateTxData,
    // - delegation
    DelegateTxData,
    UnbondTxData,
    MoveStakeTxData,
    // - check
    RedeemCheckTxData,
    // - multisig
    CreateMultisigTxData,
    EditMultisigTxData,
    // - pool
    CreateSwapPoolTxData,
    AddLiquidityTxData,
    RemoveLiquidityTxData,
    BuySwapPoolTxData,
    SellSwapPoolTxData,
    SellAllSwapPoolTxData,
    // - token
    CreateTokenTxData,
    RecreateTokenTxData,
    MintTokenTxData,
    BurnTokenTxData,
};
