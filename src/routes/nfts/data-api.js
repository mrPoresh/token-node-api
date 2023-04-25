import query from 'faunadb';
const q = query;

import logger from '../../utils/logger.js';
import { APP_DATA_I_TAG, client, TAG_FRONT_PAGE } from '../../db/db.js'

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
			collection.meta.content = collection.meta.content[0];
			Object.assign(result[i], collection);
		}

		return result

	} catch (error) {
		logger.error(error);
		return error
	}

};

const getFrontTabsByVolume = async (req, res) => {
	logger.info('Start Getting CollectionRankingByVolume');

	const { limit, source, blockchain, period, sort } = req.body;

	try {

		const result = await collectionsRankingByVolume(limit, source, blockchain, period, sort);

		res.status(200).send({ data: result });

	} catch (error) {
		logger.error(error);
		res.status(err.statusCode).send({ status: err.statusCode })
	}

};

const collectionsRankingByMints = async (limit, blockchain, period, sort) => {

	try {
		const result = (await (await getCollectionRankingByMints(limit, blockchain, period, sort)).json()).result;

		console.log(result)

		for (let i = 0; i < result.length; i++) {
			const collection = await (await getCollectionById(result[i].id)).json();
			collection.meta.content = collection.meta.content[0];
			Object.assign(result[i], collection);
		}

		return result

	} catch (error) {
		logger.error(error);
		return error
	}

};

const getFrontTabsByMints = async (req, res) => {
	logger.info('Start Getting getCollectionsRankingByMints');

	const { limit, blockchain, period, sort } = req.body;

	try {

		const result = await collectionsRankingByMints(limit, blockchain, period, sort);

		console.log(result)

		res.status(200).send({ data: result });

	} catch (error) {
		logger.error(error);
		res.status(err.statusCode).send({ status: err.statusCode })
	}

};

const frontListsData = async (blockchain) => {
	try {
		const cli = client();
		const result = {};
		const size = 1;

		const { lists } = await cli.query(
			q.Select(['data', 'data'], q.Get(q.Match(q.Index(APP_DATA_I_TAG), TAG_FRONT_PAGE)))
		);

		for (const item of lists) {
			if (blockchain == item.chain) {
				const nft = (await (await getItemsByCollectionId(item.id, size)).json()).items[0];
				nft.meta.content = nft.meta.content[0];

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

	const { blockchain } = req.body;

	try {

		const result = await frontListsData(blockchain);

		res.status(200).send({ data: result });

	} catch (error) {
		logger.error(error);
		res.status(err.statusCode).send({ status: err.statusCode })
	}

};

const getFrontPageData = async (req, res) => {
	try {
		const cli = client();
		const result = { tab: [], lists: {}};

		const { tab } = await cli.query(
			q.Select(['data', 'data'], q.Get(q.Match(q.Index(APP_DATA_I_TAG), TAG_FRONT_PAGE)))
		);

		[result.tab, result.lists] = await Promise.all([
			collectionsRankingByVolume(tab.limit, tab.source, tab.blockchain, tab.period, tab.sort), 
			frontListsData(tab.chain),
		]);

		res.status(200).send({ data: result });

	} catch (error) {
		logger.error(error);
		res.status(err.statusCode).send({ status: err.statusCode })
	}

};

export {
	getFrontPageData,
	getFrontListsData,
	getFrontTabsByVolume,
	getFrontTabsByMints,
}