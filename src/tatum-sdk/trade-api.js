import { conf } from "../config.js";

import logger from '../utils/logger.js';
import fetch from "node-fetch";



const _getPriceConversion = async (amount, symbol, convert) => { // sumbol: "ETH", convert: "USD"
    try {
        const query = new URLSearchParams({amount: amount, symbol: symbol, convert: convert}).toString();

        return await fetch(
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
    } catch(err) {
        logger.error(err);
        return err
    }
};

export {
    _getPriceConversion,
};