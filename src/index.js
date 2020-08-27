import {TX_TYPE} from 'minterjs-util';

import {API_TYPE_NODE, API_TYPE_GATE} from './variables.js';
import Minter from './minter.js';
import MinterApi from './api/index.js';
import PostTx from './api/post-tx.js';
import EstimateCoinSell from './api/estimate-coin-sell.js';
import GetNonce from './api/get-nonce.js';
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
