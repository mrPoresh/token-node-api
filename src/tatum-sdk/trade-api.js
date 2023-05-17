import { conf } from "../config.js";

import logger from '../utils/logger.js';
import fetch from "node-fetch";

const _getPriceConversion = async (amount, symbol, convert) => { // sumbol: "ETH", convert: "USD"; can be inverse
    try {
        const query = new URLSearchParams({amount: amount, symbol: symbol, convert: convert}).toString();
        const result = await fetch(
            `https://pro-api.coinmarketcap.com/v2/tools/price-conversion?${query}`,
            {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept-Encoding': 'deflate, gzip',
                  'X-CMC_PRO_API_KEY': conf.COIN_MARKET
                },
            }
        );

        if (!result.ok) {
            throw new Error(`Request failed with status ${result.status}`);
        }

        return result

    } catch(err) {
        logger.error(err);
        return err
    }
};
/*                    sell/buy */
const _trade = async (type, price, amount, pair, currency1AccountId, currency2AccountId) => {
    console.log(type, price, amount, pair, currency1AccountId, currency2AccountId);
    try {
        const result = await fetch(
            `https://api.tatum.io/v3/trade`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': conf.API_KEY
                },
                body: JSON.stringify({
                    type: type,
                    price: price,
                    amount: amount,
                    pair: pair,
                    currency1AccountId: currency1AccountId,
                    currency2AccountId: currency2AccountId,
                })
            }
        );

        if (!result.ok) {
            throw new Error(`Request failed with status ${result.status}`);
        }

        return result

    } catch(err) {
        logger.error(err);
        return err
    }
};

export {
    _getPriceConversion,
    _trade,
};