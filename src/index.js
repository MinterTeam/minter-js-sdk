import {TX_TYPE} from 'minterjs-tx';

import {API_TYPE_NODE, API_TYPE_GATE} from './variables.js';
import Minter from './minter.js';
import MinterApi from './api/index.js';
import PostTx from './api/post-tx.js';
import EstimateCoinSell from './api/estimate-coin-sell.js';
import GetNonce from './api/get-nonce.js';
import issueCheck, {decodeCheck, getGasCoinFromCheck} from './check.js';
import {prepareLink, decodeLink} from './link.js';

import prepareSignedTx, {decodeTx} from './tx.js';
import RedeemCheckTxParams from './tx-params/redeem-check.js';
import SendTxParams from './tx-params/send.js';
import MultisendTxParams from './tx-params/multisend.js';
import SellTxParams from './tx-params/convert-sell.js';
import SellAllTxParams from './tx-params/convert-sell-all.js';
import BuyTxParams from './tx-params/convert-buy.js';
import DeclareCandidacyTxParams from './tx-params/candidacy-declare.js';
import SetCandidateOnTxParams from './tx-params/candidate-set-on.js';
import SetCandidateOffTxParams from './tx-params/candidate-set-off.js';
import EditCandidateTxParams from './tx-params/candidate-edit.js';
import DelegateTxParams from './tx-params/stake-delegate.js';
import UnbondTxParams from './tx-params/stake-unbond.js';
import CreateCoinTxParams from './tx-params/create-coin.js';
import CreateMultisigTxParams from './tx-params/create-multisig.js';

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
import DelegateTxData from './tx-data/stake-delegate.js';
import UnbondTxData from './tx-data/stake-unbond.js';
import CreateCoinTxData from './tx-data/create-coin.js';
import CreateMultisigTxData from './tx-data/create-multisig.js';

export default Minter;
export {
    TX_TYPE,
    API_TYPE_NODE,
    API_TYPE_GATE,
    Minter,
    MinterApi,
    PostTx,
    EstimateCoinSell,
    GetNonce,
    //
    prepareSignedTx,
    decodeTx,
    // link
    prepareLink,
    decodeLink,
    // check
    issueCheck,
    decodeCheck,
    getGasCoinFromCheck,
    // tx params
    // - coin
    SendTxParams,
    MultisendTxParams,
    SellTxParams,
    SellAllTxParams,
    BuyTxParams,
    CreateCoinTxParams,
    // - validator
    DeclareCandidacyTxParams,
    SetCandidateOnTxParams,
    SetCandidateOffTxParams,
    EditCandidateTxParams,
    DelegateTxParams,
    UnbondTxParams,
    // - check
    RedeemCheckTxParams,
    // - multisig
    CreateMultisigTxParams,
    // not sure if it should be exported
    // tx data
    // - coin
    SendTxData,
    MultisendTxData,
    SellTxData,
    SellAllTxData,
    BuyTxData,
    CreateCoinTxData,
    // - validator
    DeclareCandidacyTxData,
    SetCandidateOnTxData,
    SetCandidateOffTxData,
    EditCandidateTxData,
    DelegateTxData,
    UnbondTxData,
    // - check
    RedeemCheckTxData,
    // - multisig
    CreateMultisigTxData,
};
