import {generateWallet, walletFromMnemonic, walletFromPrivateKey} from 'minterjs-wallet';
import {issueCheck, redeemCheck} from './check';
import {sendCoins, createCoin, sellCoins, buyCoins} from './coin';
import {declareCandidacy, delegate, unbound, setCandidateOn, setCandidateOff} from './validator';


export {
    // check
    issueCheck,
    redeemCheck,
    // coin
    sendCoins,
    createCoin,
    sellCoins,
    buyCoins,
    // validator
    declareCandidacy,
    delegate,
    unbound,
    setCandidateOn,
    setCandidateOff,
    // wallet
    generateWallet,
    walletFromMnemonic,
    walletFromPrivateKey,
};
