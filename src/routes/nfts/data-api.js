import FaunaError from '../../errors/fauna-errors.js';
import logger from '../../utils/logger.js';

import { getNFTsFromCollection, getNFTMetadata, getBalancesOfAddress, getOwnersOfToken, checkOwnerOfanNFT, getTransactionsOfWallet } from '../../tatum-sdk/index.js';

/* ?create getCollections? probably i can send an array of addresses */
const getCollectionNFTs = async (req, res) => {
	logger.info('Start Getting NFT');
	const { chain, collectionAddresses, pageSize } = req.body.params;

	try {

		const result = await getNFTsFromCollection(chain, collectionAddresses, pageSize);
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
	const { chain, tokenAddress, tokenIds } = req.body.params;

	try {

		const result = await getNFTMetadata(chain, tokenAddress, tokenIds);
		const data = await result.json();

		console.log(data);

		res.status(200).send({ data: data });

	} catch (error) {
		logger.error(error);
		res.status(err.statusCode).send({ status: err.statusCode })
	}

};

const getAddressBalances = async (req, res) => {
	logger.info('Start Getting Balances');
	const { chain, addresses } = req.body.params;

	try {

		const result = await getBalancesOfAddress(chain, addresses);
		const data = await result.json();

		console.log(data);

		res.status(200).send({ data: data });

	} catch (error) {
		logger.error(error);
		res.status(err.statusCode).send({ status: err.statusCode })
	}

};

const getTokenOwners = async (req, res) => {
	logger.info('Start Getting Token Owners');
	const { chain, tokenAddress } = req.body.params;

	try {

		const result = await getOwnersOfToken(chain, tokenAddress);
		const data = await result.json();

		console.log(data);

		res.status(200).send({ data: data });

	} catch (error) {
		logger.error(error);
		res.status(err.statusCode).send({ status: err.statusCode })
	}

};

const checkIsOwner = async (req, res) => {
	logger.info('Start checking is Owner');
	const { chain, tokenAddress, address } = req.body.params;	//	address is a user wallet adr

	try {

		const result = await checkOwnerOfanNFT(chain, tokenAddress, address);
		const data = await result.json();

		console.log(data);

		res.status(200).send({ data: data });

	} catch (error) {
		logger.error(error);
		res.status(err.statusCode).send({ status: err.statusCode })
	}

};

const getTransactions = async (req, res) => {
	logger.info('Start checking Transactions');
	const { chain, addresses } = req.body.params;	//	address is a user wallet adr

	try {

		const result = await getTransactionsOfWallet(chain, addresses);
		const data = await result.json();

		console.log(data);

		res.status(200).send({ data: data });

	} catch (error) {
		logger.error(error);
		res.status(err.statusCode).send({ status: err.statusCode })
	}

};
/* 
	input: 
		addresses: [
			{ topAll: ['some collection adr', ... , 'some collection adr'] },
			...
			{ topArt: ['some collection adr', ... , 'some collection adr'] },
		],
		chain: 'eth | bsc | ... ',
		pageSize: 'count of nfts from adr'

	output: [
		data: [
			{ topAll: [
				[{ item }, ... , { item }]	// for example 10
			]},
			{ ... },
			{ topArt: [
				[{ item }, ... , { item }] // with metadata
			]},
		]
	]
*/

const getFrontPageLists = async (req, res) => {
	logger.info('Start getting Front Page Data');
	const { chain, addresses, pageSize } = req.body.params;
	const data = [];

	try {

		for (let i = 0; i < addresses.length; i++) {
			for (const [key, value] of Object.entries(addresses[i])) {
				let result = [];
				
				for (let k = 0; k < value.length; k++) {
					let nfts = await getNFTsFromCollection(chain, value[k], pageSize);
					let _nfts = await nfts.json();	

					result.push(_nfts);
				}

				data.push({[key]: result})
			}
		}

		console.log(data);

		res.status(200).send({ data: data });

	} catch (error) {
		logger.error(error);
		res.status(err.statusCode).send({ status: err.statusCode })
	}

};

export {
	getCollectionNFTs,
	getMetadataForNFT,
	getAddressBalances,
	getTokenOwners,
	checkIsOwner,
	getTransactions,
	getFrontPageLists,
}