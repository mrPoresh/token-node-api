import { sdk } from "./index.js";
import logger from '../utils/logger.js';

const getNFTsFromCollection = async (chain, address) => {
    try {
        const query = new URLSearchParams({chain: chain, collectionAddresses: address}).toString();

        return await fetch(
            `https://api.tatum.io/v3/data/collections?${query}`,
            {
                method: 'GET',
                headers: {
                    'x-api-key': process.env.API_KEY_MAINNET
                }
            }
        );
    } catch(err) {
        logger.error(err);
        return err
    }
};

const getNFTMetadata = async (chain, address, id) => {
    try {
        const query = new URLSearchParams({chain: chain, tokenAddress: address, tokenIds: id}).toString();

        return await fetch(
            `https://api.tatum.io/v3/data/metadata?${query}`,
            {
                method: 'GET',
                headers: {
                    'x-api-key': process.env.API_KEY_MAINNET
                }
            }
        );
    } catch(err) {
        logger.error(err);
        return err
    }
};

const getNFTsOwnedByAddress = async (chain, address) => {
    try {
        return sdk.nft.getNFTsByAddress(chain, address);
    } catch(err) {
        logger.error(err);
        return err
    }
};

export {
    getNFTsFromCollection,
    getNFTMetadata,
    getNFTsOwnedByAddress,
};