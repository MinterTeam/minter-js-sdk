import MinterApi from './api/index.js';
import GetNonce from './api/get-nonce.js';
import GetCoinInfo from './api/get-coin-info.js';
import GetMinGasPrice from './api/get-min-gas-price.js';
import PostTx, {EnsureNonce} from './api/post-tx.js';
import PostSignedTx from './api/post-signed-tx.js';
import EstimateCoinSell from './api/estimate-coin-sell.js';
import EstimateCoinSellAll from './api/estimate-coin-sell-all.js';
import EstimateCoinBuy from './api/estimate-coin-buy.js';
import EstimateTxCommission from './api/estimate-tx-commission.js';
import {ReplaceCoinSymbol, ReplaceCoinSymbolByPath, GetCoinId, ReplaceCoinId, ReplaceCoinIdByPath, GetCoinSymbol} from './api/replace-coin.js';
import GetCommissionPrice from './api/get-commission-price.js';
import GetPoolInfo from './api/get-pool-info.js';

/**
 * @param {object} [options]
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
    this.estimateCoinSellAll = EstimateCoinSellAll(apiInstance);
    this.estimateCoinBuy = EstimateCoinBuy(apiInstance);
    this.estimateTxCommission = EstimateTxCommission(apiInstance);

    this.replaceCoinSymbol = ReplaceCoinSymbol(apiInstance);
    this.replaceCoinId = ReplaceCoinId(apiInstance);
    this.replaceCoinSymbolByPath = ReplaceCoinSymbolByPath(apiInstance);
    this.replaceCoinIdByPath = ReplaceCoinIdByPath(apiInstance);
    this.getCoinId = GetCoinId(apiInstance);
    this.getCoinSymbol = GetCoinSymbol(apiInstance);

    this.getPoolInfo = GetPoolInfo(apiInstance);

    this.getCommissionPrice = GetCommissionPrice(apiInstance);
}
