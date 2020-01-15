import MinterApi from './api';
import GetNonce from './api/get-nonce';
import GetMinGasPrice from './api/get-min-gas-price';
import PostTx from './api/post-tx';
import EstimateCoinSell from './api/estimate-coin-sell';
import EstimateCoinBuy from './api/estimate-coin-buy';
import EstimateTxCommission from './api/estimate-tx-commission';

/**
 * @param {Object} [options]
 * @param {string} [options.apiType]
 * @param {string} [options.chainId]
 * @param {string} [options.baseURL]
 * @constructor
 */
export default function (options) {
    const apiInstance = new MinterApi(options);

    this.postTx = new PostTx(apiInstance);

    this.getNonce = new GetNonce(apiInstance);

    this.getMinGasPrice = new GetMinGasPrice(apiInstance);

    this.estimateCoinSell = new EstimateCoinSell(apiInstance);

    this.estimateCoinBuy = new EstimateCoinBuy(apiInstance);

    this.estimateTxCommission = new EstimateTxCommission(apiInstance);
}
