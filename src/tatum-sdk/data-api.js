import logger from '../utils/logger.js';

// TODO: ADD a page size params //

const getNFTsFromCollection = async (chain, collectionAddresses, pageSize) => {   // address can be an array
    try {
        const query = new URLSearchParams({chain: chain, collectionAddresses: collectionAddresses, pageSize: pageSize}).toString();

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

const getNFTMetadata = async (chain, tokenAddress, tokenIds) => {  // address can be an array
    try {
        const query = new URLSearchParams({chain: chain, tokenAddress: tokenAddress, tokenIds: tokenIds}).toString();

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
/* can return an ERC20, ERC721, ERC1155 */
const getBalancesOfAddress = async (chain, addresses) => {    // address can be an array
    try {
        const query = new URLSearchParams({chain: chain, addresses: addresses}).toString();
          
        return await fetch(
            `https://api.tatum.io/v3/data/balances?${query}`,
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

const getOwnersOfToken = async (chain, tokenAddress) => {    // address can be an array
    try {
        return await fetch(
            `https://api.tatum.io/v3/data/owners/${chain}/${tokenAddress}`,
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

const checkOwnerOfanNFT = async (chain, tokenAddress, address) => {
    try {
        return await fetch(
            `https://api.tatum.io/v3/data/owners/${chain}/${tokenAddress}/${address}`,
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

const getTransactionsOfWallet = async (chain, addresses) => {    // address can be an array + not req
    try {
        const query = new URLSearchParams({chain: chain, addresses: addresses}).toString();

        return await fetch(
            `https://api.tatum.io/v3/data/transactions?${query}`,
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

export {
    getNFTsFromCollection,
    getNFTMetadata,
    getBalancesOfAddress,
    getOwnersOfToken,
    checkOwnerOfanNFT,
    getTransactionsOfWallet,
};