import logger from '../utils/logger.js';
import fetch from "node-fetch";

const getCollectionRankingByVolume = async (limit, source, blockchain, period, sort) => {
    try {
        const query = new URLSearchParams({ limit: limit, source: source, blockchain: blockchain, period: period, sort: sort }).toString();

        return await fetch(
            `https://api.rarible.org/v0.1/data/rankings/collections/volume?${query}`,
            {
                method: 'GET',
            }
        );

    } catch(err) {
        logger.error(err);
        return err
    }
};

const getCollectionRankingByMints = async (limit, blockchain, period, sort) => {
    try {
        const query = new URLSearchParams({ limit: limit, blockchain: blockchain, period: period, sort: sort }).toString();

        return await fetch(
            `https://api.rarible.org/v0.1/data/rankings/collections/mints?${query}`,
            {
                method: 'GET',
            }
        );

    } catch(err) {
        logger.error(err);
        return err
    }
};

const getCollectionById = async (tokenAddress) => {
    try {

        return await fetch(
            `https://api.rarible.org/v0.1/collections/${tokenAddress}`,
            {
                method: 'GET',
            }
        );

    } catch(err) {
        logger.error(err);
        return err
    }
};

const getItemsByCollectionId = async (tokenAddress, size) => {
    try {
        const query = new URLSearchParams({ collection: tokenAddress, size: size }).toString();

        return await fetch(
            `https://api.rarible.org/v0.1/items/byCollection?${query}`,
            {
                method: 'GET',
            }
        );

    } catch(err) {
        logger.error(err);
        return err
    }
};

export {
    getCollectionRankingByVolume,
    getCollectionRankingByMints,
    getCollectionById,
    getItemsByCollectionId,
}