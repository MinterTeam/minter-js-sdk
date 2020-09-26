import MinterApi from './api/index.js';
import GetNonce from './api/get-nonce.js';
import GetCoinInfo from './api/get-coin-info.js';
import GetMinGasPrice from './api/get-min-gas-price.js';
import PostTx, {EnsureNonce} from './api/post-tx.js';
import PostSignedTx from './api/post-signed-tx.js';
import EstimateCoinSell from './api/estimate-coin-sell.js';
import EstimateCoinBuy from './api/estimate-coin-buy.js';
import EstimateTxCommission from './api/estimate-tx-commission.js';
import {ReplaceCoinSymbol, ReplaceCoinSymbolByPath} from './api/replace-coin.js';

/**
 * @param {Object} [options]
 * @param {string} [options.apiType]
 * @param {string} [options.chainId]
 * @param {string} [options.baseURL]
 * @constructor
 */
export default function Minter(options) {
    const apiInstance = new MinterApi(options);
    this.apiInstance = apiInstance;

    this.postTx = PostTx(apiInstance);
    this.postSignedTx = PostSignedTx(apiInstance);

    this.getNonce = GetNonce(apiInstance);
    this.ensureNonce = EnsureNonce(apiInstance);

    this.getCoinInfo = GetCoinInfo(apiInstance);

    this.getMinGasPrice = GetMinGasPrice(apiInstance);

    this.estimateCoinSell = EstimateCoinSell(apiInstance);
    this.estimateCoinBuy = EstimateCoinBuy(apiInstance);
    this.estimateTxCommission = EstimateTxCommission(apiInstance);

    this.replaceCoinSymbol = ReplaceCoinSymbol(apiInstance);
    this.replaceCoinSymbolByPath = ReplaceCoinSymbolByPath(apiInstance);
}
