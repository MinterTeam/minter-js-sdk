import {TX_TYPE} from 'minterjs-util';

import {API_TYPE_NODE, API_TYPE_GATE} from './variables.js';
import Minter from './minter.js';
import MinterApi from './api/index.js';
import PostTx, {EnsureNonce} from './api/post-tx.js';
import PostSignedTx from './api/post-signed-tx.js';
import GetNonce from './api/get-nonce.js';
import GetCoinInfo from './api/get-coin-info.js';
import GetMinGasPrice from './api/get-min-gas-price.js';
import EstimateCoinSell from './api/estimate-coin-sell.js';
import EstimateCoinBuy from './api/estimate-coin-buy.js';
import EstimateTxCommission from './api/estimate-tx-commission.js';
import {ReplaceCoinSymbol, ReplaceCoinSymbolByPath} from './api/replace-coin.js';
import issueCheck, {decodeCheck, getGasCoinFromCheck} from './check.js';
import {prepareLink, decodeLink} from './link.js';

import prepareSignedTx, {decodeTx, prepareTx, makeSignature} from './tx.js';

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
import EditCoinOwnerTxData from './tx-data/edit-coin-owner.js';
import CreateMultisigTxData from './tx-data/create-multisig.js';
import EditMultisigTxData from './tx-data/edit-multisig.js';
import SetHaltBlockTxData from './tx-data/set-halt-block.js';
import PriceVoteTxData from './tx-data/price-vote.js';

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
    // - coin
    SendTxData,
    MultisendTxData,
    SellTxData,
    SellAllTxData,
    BuyTxData,
    CreateCoinTxData,
    RecreateCoinTxData,
    EditCoinOwnerTxData,
    // - validator
    DeclareCandidacyTxData,
    SetCandidateOnTxData,
    SetCandidateOffTxData,
    EditCandidateTxData,
    EditCandidatePublicKeyTxData,
    DelegateTxData,
    UnbondTxData,
    SetHaltBlockTxData,
    PriceVoteTxData,
    // - check
    RedeemCheckTxData,
    // - multisig
    CreateMultisigTxData,
    EditMultisigTxData,
};
