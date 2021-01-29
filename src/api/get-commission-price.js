import {TX_TYPE} from 'minterjs-util';

/**
 * @param {MinterApiInstance} apiInstance
 * @return {function(*): (Promise<CoinInfo>)}
 */
export default function GetCommissionPrice(apiInstance) {
    /**
     * Get nonce for new transaction: last transaction number + 1
     * @param {boolean} mapData
     * @param {AxiosRequestConfig} [axiosOptions]
     * @return {Promise<CommissionPriceData|CommissionPriceMapped>}
     */
    return function getCommissionPrice({mapData}, axiosOptions) {
        return apiInstance.get('price_commissions', axiosOptions)
            .then((response) => {
                /** @type CommissionPriceData */
                const priceData = response.data;

                return mapData ? mapApiData(priceData) : priceData;
            });
    };
}

/**
 * @param {CommissionPriceData} data
 * @return {CommissionPriceMapped}
 */
function mapApiData(data) {
    const coin = data.coin;
    const payloadByteFee = data.payload_byte;
    const multisendRecipientFee = data.multisend_delta;
    const tickerFeeList = {
        3: data.create_ticker3,
        4: data.create_ticker4,
        5: data.create_ticker5,
        6: data.create_ticker6,
        7: data.create_ticker7_10,
    };
    const baseFeeList = {
        [TX_TYPE.SEND]: data.send,
        [TX_TYPE.SELL]: data.sell_bancor,
        [TX_TYPE.SELL_ALL]: data.sell_all_bancor,
        [TX_TYPE.BUY]: data.buy_bancor,
        [TX_TYPE.CREATE_COIN]: data.create_coin,
        [TX_TYPE.DECLARE_CANDIDACY]: data.declare_candidacy,
        [TX_TYPE.DELEGATE]: data.delegate,
        [TX_TYPE.UNBOND]: data.unbond,
        [TX_TYPE.REDEEM_CHECK]: data.redeem_check,
        [TX_TYPE.SET_CANDIDATE_ON]: data.set_candidate_on,
        [TX_TYPE.SET_CANDIDATE_OFF]: data.set_candidate_off,
        [TX_TYPE.CREATE_MULTISIG]: data.create_multisig,
        [TX_TYPE.MULTISEND]: data.multisend_base,
        [TX_TYPE.EDIT_CANDIDATE]: data.edit_candidate,
        [TX_TYPE.SET_HALT_BLOCK]: data.set_halt_block,
        [TX_TYPE.RECREATE_COIN]: data.recreate_coin,
        [TX_TYPE.EDIT_TICKER_OWNER]: data.edit_ticker_owner,
        [TX_TYPE.EDIT_MULTISIG]: data.edit_multisig,
        [TX_TYPE.PRICE_VOTE]: data.price_vote,
        [TX_TYPE.EDIT_CANDIDATE_PUBLIC_KEY]: data.edit_candidate_public_key,
        [TX_TYPE.ADD_LIQUIDITY]: data.add_liquidity,
        [TX_TYPE.REMOVE_LIQUIDITY]: data.remove_liquidity,
        [TX_TYPE.SELL_SWAP_POOL]: data.sell_pool,
        [TX_TYPE.BUY_SWAP_POOL]: data.buy_pool,
        [TX_TYPE.SELL_ALL_SWAP_POOL]: data.sell_all_pool,
        [TX_TYPE.EDIT_CANDIDATE_COMMISSION]: data.edit_candidate_commission,
        [TX_TYPE.MOVE_STAKE]: data.move_stake,
        [TX_TYPE.MINT_TOKEN]: data.mint_token,
        [TX_TYPE.BURN_TOKEN]: data.burn_token,
        [TX_TYPE.CREATE_TOKEN]: data.create_token,
        [TX_TYPE.RECREATE_TOKEN]: data.recreate_token,
        [TX_TYPE.VOTE_COMMISSION]: data.price_commission,
        [TX_TYPE.VOTE_UPDATE]: data.update_network,
        [TX_TYPE.CREATE_SWAP_POOL]: data.create_pool,
    };

    return {
        coin,
        baseFeeList,
        tickerFeeList,
        payloadByteFee,
        multisendRecipientFee,
    };
}

/**
 * @typedef {Object} CommissionPriceMapped
 * @property {Coin} coin
 * @property {BaseFeeList} baseFeeList
 * @property {TickerFeeLest} tickerFeeList
 * @property {number|string} payloadByteFee
 * @property {number|string} multisendRecipientFee
 */

/**
 * @typedef {Object} CommissionPriceData
 * @property {Coin} coin
 * @property {string|number} payload_byte
 * @property {string|number} send
 * @property {string|number} buy_bancor
 * @property {string|number} sell_bancor
 * @property {string|number} sell_all_bancor
 * @property {string|number} buy_pool
 * @property {string|number} sell_pool
 * @property {string|number} sell_all_pool
 * @property {string|number} create_ticker3
 * @property {string|number} create_ticker4
 * @property {string|number} create_ticker5
 * @property {string|number} create_ticker6
 * @property {string|number} create_ticker7_10
 * @property {string|number} create_coin
 * @property {string|number} create_token
 * @property {string|number} recreate_coin
 * @property {string|number} recreate_token
 * @property {string|number} declare_candidacy
 * @property {string|number} delegate
 * @property {string|number} unbond
 * @property {string|number} redeem_check
 * @property {string|number} set_candidate_on
 * @property {string|number} set_candidate_off
 * @property {string|number} create_multisig
 * @property {string|number} multisend_delta
 * @property {string|number} edit_candidate
 * @property {string|number} set_halt_block
 * @property {string|number} edit_ticker_owner
 * @property {string|number} edit_multisig
 * @property {string|number} price_vote
 * @property {string|number} edit_candidate_public_key
 * @property {string|number} add_liquidity
 * @property {string|number} remove_liquidity
 * @property {string|number} edit_candidate_commission
 * @property {string|number} move_stake
 * @property {string|number} mint_token
 * @property {string|number} burn_token
 * @property {string|number} price_commission
 * @property {string|number} update_network
 */
