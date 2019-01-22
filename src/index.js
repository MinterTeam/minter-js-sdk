import {generateWallet, walletFromMnemonic, walletFromPrivateKey} from 'minterjs-wallet';
import {API_TYPE_NODE, API_TYPE_EXPLORER} from './variables';
import Minter from './minter';
import MinterApi from './api';
import PostTx from './api/post-tx';
import EstimateCoinSell from './api/estimate-coin-sell';
import GetNonce from './api/get-nonce';
import issueCheck from './issue-check';
import prepareSignedTx from './prepare-tx';
import RedeemCheckTxParams from './tx-params/redeem-check';
import SendTxParams from './tx-params/send';
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

export default Minter;
export {
    API_TYPE_NODE,
    API_TYPE_EXPLORER,
    Minter,
    MinterApi,
    PostTx,
    EstimateCoinSell,
    GetNonce,
    //
    prepareSignedTx,
    // check
    issueCheck,
    RedeemCheckTxParams,
    // coin
    SendTxParams,
    SellTxParams,
    SellAllTxParams,
    BuyTxParams,
    CreateCoinTxParams,
    // validator
    DeclareCandidacyTxParams,
    SetCandidateOnTxParams,
    SetCandidateOffTxParams,
    EditCandidateTxParams,
    DelegateTxParams,
    UnbondTxParams,
    // multisig
    CreateMultisigTxParams,
    // wallet
    generateWallet,
    walletFromMnemonic,
    walletFromPrivateKey,
};
