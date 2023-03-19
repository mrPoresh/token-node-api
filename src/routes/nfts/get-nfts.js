import FaunaError from '../../errors/fauna-errors.js';
import logger from '../../utils/logger.js';

import { getNFTsOwnedByAddress, getNFTsFromCollection, getNFTMetadata } from '../../tatum-sdk/index.js';

/* its work like: which nft's this address hold? */
const getOwnedByAddressNFTs = async (req, res) => {
	logger.info('Start Getting NFT');
	const { chain, address } = req.body.params;

	try {

		const result = await getNFTsOwnedByAddress(chain, address);
		console.log(result);

		res.status(200).send({ data: result });

	} catch (error) {
		logger.error(error);
		res.status(err.statusCode).send({ status: err.statusCode })
	}

};
/* ?create getCollections? probably i can send an array of addresses */
const getCollectionNFTs = async (req, res) => {
	logger.info('Start Getting NFT');
	const { chain, address } = req.body.params;

	try {

		const result = await getNFTsFromCollection(chain, address);
		const data = await result.json();

		console.log(data);

		res.status(200).send({ data: data });

	} catch (error) {
		logger.error(error);
		res.status(err.statusCode).send({ status: err.statusCode })
	}

};

const getMetadataForNFT = async (req, res) => {
	logger.info('Start Getting NFT');
	const { chain, address, id } = req.body.params;

	try {

		const result = await getNFTMetadata(chain, address, id);
		const data = await result.json();

		console.log(data);

		res.status(200).send({ data: data });

	} catch (error) {
		logger.error(error);
		res.status(err.statusCode).send({ status: err.statusCode })
	}

};

export {
	getOwnedByAddressNFTs,
	getCollectionNFTs,
	getMetadataForNFT,
}