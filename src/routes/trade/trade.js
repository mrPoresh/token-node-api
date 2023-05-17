import { conf } from "../../config.js";

import FaunaError from '../../errors/fauna-errors.js';
import logger from '../../utils/logger.js';

import { _getPriceConversion, _trade, _updateUserAccount } from '../../tatum-sdk/index.js';
import { updateBalance } from "../wallets/index.js";


const getPriceConversion = async (req, res) => {
	const { amount, sell_curr, buy_curr } = req.body;
	logger.info('Start PriceConversion');

    try {
		const result = await (await _getPriceConversion(amount, sell_curr, buy_curr)).json();

		console.log(result);
		console.log(result.data[0].quote[buy_curr])

        res.status(200).send({ data: result.data});

    } catch (error) {
		logger.error(error);
		let err = new FaunaError(error);
		res.status(err.statusCode).send({ status: err.statusCode, msg: err.message})
    }
};

const tradeWithMaster = async (req, res) => {
	const { price, income_id, out_id, pair, buy_crypto } = req.body;
	logger.info('Start tradeWithMaster');
	console.log(req.body)

    try {
		const currencies = JSON.parse(conf.CURRENCIES);
		let [buy_curr, sell_curr] = pair.split('/');

		// check if curr exist like an option 
		if (currencies.includes(buy_curr) && currencies.includes(sell_curr)) {
			if (buy_crypto == true) {
				sell_curr = sell_curr.split('_')[1];
			} else {
				buy_curr = buy_curr.split('_')[1];
			};

			console.log(buy_curr, sell_curr)

			// get a Conversion prices 
			const conversion = await (await _getPriceConversion(price, sell_curr, buy_curr)).json();
			const amount = (conversion.data[0].quote[buy_curr].price).toString();
			console.log(amount)
			const master_addresses = JSON.parse(conf.MASTER_ADDRESSES);
			console.log(master_addresses[pair][0])

			if (master_addresses.hasOwnProperty(pair)) {
				await _trade("BUY", price, amount, pair, income_id, out_id);
				await _trade("SELL", price, amount, pair, master_addresses[pair][1], master_addresses[pair][0]);

				await updateBalance(income_id);
				await updateBalance(out_id);
				await updateBalance(master_addresses[pair][0]);
				await updateBalance(master_addresses[pair][1]);

			} else {
				throw new Error(`Key "${pair}" does not exist in the MASTER_ADDRESSES.`);
			};

		} else {
			throw new Error(`Currency does not exist in the CURRENCIES.`);
		};

		res.status(200).send({ msg: "OK"});

    } catch (error) {
		logger.error(error);
		res.status(500).send({ status: 500, msg: 'Internal Server Error' });
    }
};

export {
    getPriceConversion,
	tradeWithMaster,
};