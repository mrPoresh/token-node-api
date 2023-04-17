import query from 'faunadb';
const q = query;

import logger from '../../utils/logger.js';
import { APP_DATA_I_TAG, client, TAG_FRONT_PAGE } from '../../db/db.js'

import { 
	getNFTsFromCollection, 
	getNFTMetadata, 
	getBalancesOfAddress, 
	getOwnersOfToken, 
	checkOwnerOfanNFT, 
	getTransactionsOfWallet, 
	getTokenData 
} from '../../tatum-sdk/index.js';

import {
	getCollectionRankingByVolume,
	getCollectionRankingByMints,
	getCollectionById,
	getItemsByCollectionId,
} from '../../rarible-sdk/index.js';


/* ----- Rarible ----------------------------------- */ 

const collectionsRankingByVolume = async (limit, source, blockchain, period, sort) => {
	try {
		const result = (await (await getCollectionRankingByVolume(limit, source, blockchain, period, sort)).json()).result;

		for (let i = 0; i < result.length; i++) {
			const collection = await (await getCollectionById(result[i].id)).json();
			Object.assign(result[i], collection);
		}

		return result

	} catch (error) {
		logger.error(error);
		return error
	}

};

const getCollectionsRankingByVolume = async (req, res) => {
	logger.info('Start Getting CollectionRankingByVolume');

	const { limit, source, blockchain, period, sort } = req.body.params;

	try {

		const result = await collectionsRankingByVolume(limit, source, blockchain, period, sort)

		res.status(200).send({ data: result });

	} catch (error) {
		logger.error(error);
		res.status(err.statusCode).send({ status: err.statusCode })
	}

};

const getCollectionsRankingByMints = async (req, res) => {
	logger.info('Start Getting getCollectionsRankingByMints');

	const { limit, blockchain, period, sort } = req.body.params;

	try {

		const result = (await (await getCollectionRankingByMints(limit, blockchain, period, sort)).json()).result;

		for (let i = 0; i < result.length; i++) {
			const collection = await (await getCollectionById(result[i].id)).json();
			Object.assign(result[i], collection);
		}

		console.log(result)

		res.status(200).send({ data: result });

	} catch (error) {
		logger.error(error);
		res.status(err.statusCode).send({ status: err.statusCode })
	}

};

const frontListsData = async (chain) => {
	try {
		const cli = client();
		const result = {};
		const size = 1;

		const { lists } = await cli.query(
			q.Select(['data', 'data'], q.Get(q.Match(q.Index(APP_DATA_I_TAG), TAG_FRONT_PAGE)))
		);

		for (const item of lists) {
			if (chain == item.chain) {
				const nft = (await (await getItemsByCollectionId(item.id, size)).json()).items[0];

				if (result.hasOwnProperty(item.type)) {
					result[item.type].push(nft);
				} else {
					result[item.type] = [];
					result[item.type].push(nft);
				}
				
			}
		};

		return result

	} catch (error) {
		logger.error(error);
		return error
	}
};

const getFrontListsData = async (req, res) => {
	logger.info('Start Getting getFrontListsData');

	const { chain } = req.body.params;

	try {

		const result = await frontListsData(chain);

		res.status(200).send({ data: result });

	} catch (error) {
		logger.error(error);
		res.status(err.statusCode).send({ status: err.statusCode })
	}

};

const getFrontPageData = async (req, res) => {
	logger.info('Start Getting getFrontPageData');

	try {

		const cli = client();
		const result = { tab: [], lists: {}};

		const { tab } = await cli.query(
			q.Select(['data', 'data'], q.Get(q.Match(q.Index(APP_DATA_I_TAG), TAG_FRONT_PAGE)))
		);

		result.tab = await collectionsRankingByVolume(tab.limit, tab.source, tab.blockchain, tab.period, tab.sort);
		result.lists = await frontListsData(tab.chain);

		console.log(result)

		res.status(200).send({ data: result });

	} catch (error) {
		logger.error(error);
		res.status(err.statusCode).send({ status: err.statusCode })
	}

};

/* ------------------------------------------------- */

/* server key? */
const _getFrontPageData = async (req, res) => {
	logger.info('Start Getting Front Page Data');
	//const {  } = req.body.params;

	try {

		const cli = client();
		const result = {};

		const address = await cli.query(
			q.Select(['data', 'data'], q.Get(q.Match(q.Index(APP_DATA_I_TAG), TAG_FRONT_PAGE)))
		);

		for (const category_key of Object.keys(address)) {	// ~ 10-12 sec
			if (address.hasOwnProperty(category_key)) {
				result[category_key] = {};

				for (const item of address[category_key]) {
					const raw_data = await getTokenData(item.chain, item.tokenAddress, item.tokenId);
					const data = await raw_data.json();

					if (result[category_key][item.type]?.hasOwnProperty(item.chain)) {
						result[category_key][item.type][item.chain].push(data);
					} else {
						if (!(result[category_key].hasOwnProperty(item.type))) {
							result[category_key][item.type] = {};
							result[category_key][item.type][item.chain] = [];
						} else {
							result[category_key][item.type][item.chain] = [];
						}

						result[category_key][item.type][item.chain].push(data);
					}
				}
			}
		}

		res.status(200).send({ data: result });

	} catch (error) {
		logger.error(error);
		res.status(error.statusCode).send({ status: error.statusCode })
	}

};

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

	console.log(addresses)

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

	getFrontPageData,
	getFrontListsData,
	getCollectionsRankingByVolume,
	getCollectionsRankingByMints,
}