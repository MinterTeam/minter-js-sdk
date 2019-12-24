import {API_TYPE_NODE, API_TYPE_GATE} from './variables';
import Minter from './minter';
import MinterApi from './api';
import PostTx from './api/post-tx';
import EstimateCoinSell from './api/estimate-coin-sell';
import GetNonce from './api/get-nonce';
import issueCheck, {decodeCheck, getGasCoinFromCheck} from './check';
import {prepareLink, decodeLink} from './link';

import prepareSignedTx from './tx';
import RedeemCheckTxParams from './tx-params/redeem-check';
import SendTxParams from './tx-params/send';
import MultisendTxParams from './tx-params/multisend';
import SellTxParams from './tx-params/convert-sell';
import SellAllTxParams from './tx-params/convert-sell-all';
import BuyTxParams from './tx-params/convert-buy';
import DeclareCandidacyTxParams from './tx-params/candidacy-declare';
import SetCandidateOnTxParams from './tx-params/candidate-set-on';
import SetCandidateOffTxParams from './tx-params/candidate-set-off';
import EditCandidateTxParams from './tx-params/candidate-edit';
import DelegateTxParams from './tx-params/stake-delegate';
import UnbondTxParams from './tx-params/stake-unbond';
import CreateCoinTxParams from './tx-params/create-coin';
import CreateMultisigTxParams from './tx-params/create-multisig';

// import RedeemCheckTxData from './tx-data/redeem-check';
// import SendTxData from './tx-data/send';
// import MultisendTxData from './tx-data/multisend';
// import SellTxData from './tx-data/convert-sell';
// import SellAllTxData from './tx-data/convert-sell-all';
// import BuyTxData from './tx-data/convert-buy';
// import DeclareCandidacyTxData from './tx-data/candidacy-declare';
// import SetCandidateOnTxData from './tx-data/candidate-set-on';
// import SetCandidateOffTxData from './tx-data/candidate-set-off';
// import EditCandidateTxData from './tx-data/candidate-edit';
// import DelegateTxData from './tx-data/stake-delegate';
// import UnbondTxData from './tx-data/stake-unbond';
// import CreateCoinTxData from './tx-data/create-coin';
// import CreateMultisigTxData from './tx-data/create-multisig';

export default Minter;
export {
    API_TYPE_NODE,
    API_TYPE_GATE,
    Minter,
    MinterApi,
    PostTx,
    EstimateCoinSell,
    GetNonce,
    //
    prepareSignedTx,
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
    // // - coin
    // SendTxData,
    // MultisendTxData,
    // SellTxData,
    // SellAllTxData,
    // BuyTxData,
    // CreateCoinTxData,
    // // - validator
    // DeclareCandidacyTxData,
    // SetCandidateOnTxData,
    // SetCandidateOffTxData,
    // EditCandidateTxData,
    // DelegateTxData,
    // UnbondTxData,
    // // - check
    // RedeemCheckTxData,
    // // - multisig
    // CreateMultisigTxData,
};
