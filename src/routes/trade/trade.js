import FaunaError from '../../errors/fauna-errors.js';
import logger from '../../utils/logger.js';


const getPriceConversion = async (req, res) => {
	const { amount, symbol, convert } = req.body;
	logger.info('Start PriceConversion');

    try {
		const result = await (await _getPriceConversion(amount, symbol, convert)).json();

		console.log(result);
		console.log(result.data)

        res.status(200).send({ data: result.data});

    } catch (error) {
		logger.error(error);
		let err = new FaunaError(error);
		res.status(err.statusCode).send({ status: err.statusCode, msg: err.message})
    }
};

export {
    getPriceConversion,
};