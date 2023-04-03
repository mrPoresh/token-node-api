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

/* server key? */
const getFrontPageData = async (req, res) => {
	logger.info('Start Getting Front Page Data');
	//const {  } = req.body.params;

	try {

		const cli = client();
		const result = {};

		const address = await cli.query(
			q.Select(['data', 'data'], q.Get(q.Match(q.Index(APP_DATA_I_TAG), TAG_FRONT_PAGE)))
		);

		/* //await sleep(100); ? to many req */
		/* Object.keys(address).forEach(async (category_key) => {
			if (address.hasOwnProperty(category_key)) {
				result[category_key] = {};
				address[category_key].forEach(async (item) => {
					
					if (result[category_key][item.type]?.hasOwnProperty(item.chain)) {
						result[category_key][item.type][item.chain].push(item);
					} else {
						if (!(result[category_key].hasOwnProperty(item.type))) {
							result[category_key][item.type] = {};
							result[category_key][item.type][item.chain] = [];
						} else {
							result[category_key][item.type][item.chain] = [];
						}

						result[category_key][item.type][item.chain].push(item);
					}

				});
			}
		}); */

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

		/* console.log('*****************************************');
		console.log(result);
		console.log('*****************************************');
		console.log(result.tabs);
		console.log('*****************************************');
		console.log(result.tabs.Trending); */

		res.status(200).send({ data: result });

	} catch (error) {
		logger.error(error);
		res.status(error.statusCode).send({ status: error.statusCode })
	}

};

const upFrontPageData = async (req, res) => {
	logger.info('Start up front doc');
	const { chain, tokenAddress, tokenId, type, section } = req.body.params;

	console.log(req.body.params)

	try {

		const cli = client();

		const result = await cli.query(
			q.Update(q.Match(q.Index(APP_DATA_I_TAG), TAG_FRONT_PAGE),
				{
					data: {
						data: {
							[section]: [{
								tokenAddress: tokenAddress,
								tokenId: tokenId,
								chain: chain,
								type: type,
							}]
						}
					}
				}
			)
		);

		res.status(200).send({ data: "ok" });

	} catch (error) {
		logger.error(error);
		res.status(err.statusCode).send({ status: err.statusCode })
	}

};

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

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
	upFrontPageData,
}


export const back = {
	tag: "frontPage",
	data: {
	  tabs: [
		{
		  tokenAddress: "0xed5af388653567af2f388e6224dc7c4b3241c544",
		  tokenId: "7726",
		  chain: "ethereum",
		  type: "Trending"
		},
		{
		  tokenAddress: "0x1a92f7381b9f03921564a437210bb9396471050c",
		  tokenId: "1090",
		  chain: "ethereum",
		  type: "Trending"
		},
		{
		  tokenAddress: "0xed5af388653567af2f388e6224dc7c4b3241c544",
		  tokenId: "2471",
		  chain: "ethereum",
		  type: "Trending"
		},
		{
		  tokenAddress: "0x1a92f7381b9f03921564a437210bb9396471050c",
		  tokenId: "4638",
		  chain: "ethereum",
		  type: "Trending"
		},
		{
		  tokenAddress: "0xed5af388653567af2f388e6224dc7c4b3241c544",
		  tokenId: "2883",
		  chain: "ethereum",
		  type: "Top"
		},
		{
		  tokenAddress: "0x1a92f7381b9f03921564a437210bb9396471050c",
		  tokenId: "2158",
		  chain: "ethereum",
		  type: "Top"
		},
		{
		  tokenAddress: "0xed5af388653567af2f388e6224dc7c4b3241c544",
		  tokenId: "5739",
		  chain: "ethereum",
		  type: "Top"
		},
		{
		  tokenAddress: "0x1a92f7381b9f03921564a437210bb9396471050c",
		  tokenId: "7475",
		  chain: "ethereum",
		  type: "Top"
		},
		{
		  tokenAddress: "0x69988cd7d86151244e9b2a2a80d0925195055f48",
		  tokenId: "1568",
		  chain: "bsc",
		  type: "Top"
		},
		{
		  tokenAddress: "0x69988cd7d86151244e9b2a2a80d0925195055f48",
		  tokenId: "1568",
		  chain: "bsc",
		  type: "Top"
		},
		{
		  tokenAddress: "0x69988cd7d86151244e9b2a2a80d0925195055f48",
		  tokenId: "1568",
		  chain: "bsc",
		  type: "Trending"
		},
		{
		  tokenAddress: "0x69988cd7d86151244e9b2a2a80d0925195055f48",
		  tokenId: "1568",
		  chain: "bsc",
		  type: "Trending"
		}
	  ],
	  lists: [
		{
		  tokenAddress: "0xed5af388653567af2f388e6224dc7c4b3241c544",
		  tokenId: "7726",
		  chain: "ethereum",
		  type: "Trending"
		},
		{
		  tokenAddress: "0x1a92f7381b9f03921564a437210bb9396471050c",
		  tokenId: "1090",
		  chain: "ethereum",
		  type: "Trending"
		},
		{
		  tokenAddress: "0xed5af388653567af2f388e6224dc7c4b3241c544",
		  tokenId: "2471",
		  chain: "ethereum",
		  type: "Trending"
		},
		{
		  tokenAddress: "0x1a92f7381b9f03921564a437210bb9396471050c",
		  tokenId: "4638",
		  chain: "ethereum",
		  type: "Trending"
		},
		{
		  tokenAddress: "0xed5af388653567af2f388e6224dc7c4b3241c544",
		  tokenId: "2883",
		  chain: "ethereum",
		  type: "Trending"
		},
		{
		  tokenAddress: "0x1a92f7381b9f03921564a437210bb9396471050c",
		  tokenId: "2158",
		  chain: "ethereum",
		  type: "Trending"
		},
		{
		  tokenAddress: "0xed5af388653567af2f388e6224dc7c4b3241c544",
		  tokenId: "5739",
		  chain: "ethereum",
		  type: "Trending"
		},
		{
		  tokenAddress: "0x1a92f7381b9f03921564a437210bb9396471050c",
		  tokenId: "7475",
		  chain: "ethereum",
		  type: "Trending"
		},
		{
		  tokenAddress: "0xed5af388653567af2f388e6224dc7c4b3241c544",
		  tokenId: "2883",
		  chain: "ethereum",
		  type: "Top"
		},
		{
		  tokenAddress: "0x1a92f7381b9f03921564a437210bb9396471050c",
		  tokenId: "2158",
		  chain: "ethereum",
		  type: "Top"
		},
		{
		  tokenAddress: "0xed5af388653567af2f388e6224dc7c4b3241c544",
		  tokenId: "5739",
		  chain: "ethereum",
		  type: "Top"
		},
		{
		  tokenAddress: "0x1a92f7381b9f03921564a437210bb9396471050c",
		  tokenId: "7475",
		  chain: "ethereum",
		  type: "Top"
		},
		{
		  tokenAddress: "0xed5af388653567af2f388e6224dc7c4b3241c544",
		  tokenId: "7726",
		  chain: "ethereum",
		  type: "Top"
		},
		{
		  tokenAddress: "0x1a92f7381b9f03921564a437210bb9396471050c",
		  tokenId: "1090",
		  chain: "ethereum",
		  type: "Top"
		},
		{
		  tokenAddress: "0xed5af388653567af2f388e6224dc7c4b3241c544",
		  tokenId: "2471",
		  chain: "ethereum",
		  type: "Top"
		},
		{
		  tokenAddress: "0x1a92f7381b9f03921564a437210bb9396471050c",
		  tokenId: "4638",
		  chain: "ethereum",
		  type: "Top"
		}
	  ]
	}
  }