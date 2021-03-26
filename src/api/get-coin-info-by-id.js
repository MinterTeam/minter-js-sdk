import GetCoinInfo from './get-coin-info.js';

/**
 * @deprecated
 * @type {function(MinterApiInstance): function((string|number), AxiosRequestConfig=): Promise<CoinInfo>}
 */
const GetCoinInfoById = GetCoinInfo;

export default GetCoinInfoById;
