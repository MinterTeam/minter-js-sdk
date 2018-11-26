import MinterApi from './api';
import GetNonce from './api/get-nonce';
import PostTx from './api/post-tx';
import EstimateCoinSell from './api/estimate-coin-sell';
import EstimateCoinBuy from './api/estimate-coin-buy';
import EstimateTxCommission from './api/estimate-tx-commission';
import issueCheck from './issue-check';

/**
 * @param {Object} [options]
 * @param {string} [options.apiType]
 * @param {string} [options.baseURL]
 * @constructor
 */
export default function (options) {
    const apiInstance = new MinterApi(options);

    this.postTx = new PostTx(apiInstance);

    this.getNonce = new GetNonce(apiInstance);

    this.estimateCoinSell = new EstimateCoinSell(apiInstance);

    this.estimateCoinBuy = new EstimateCoinBuy(apiInstance);

    this.estimateTxCommission = new EstimateTxCommission(apiInstance);

    this.issueCheck = issueCheck;
}
