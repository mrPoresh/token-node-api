import { generateWallet, generateAcc, generateDeposit } from './wallets.js';
import { getNFTsFromCollection, getNFTMetadata, getOwnersOfToken, getBalancesOfAddress, checkOwnerOfanNFT, getTransactionsOfWallet, getTokenData } from './data-api.js';
import { conf } from '../config.js';

import { TatumSDK } from "@tatumio/sdk";

const sdk = TatumSDK({ apiKey: conf.API_KEY });

export {
    sdk,
    generateWallet,
    generateAcc,
    generateDeposit,
    getNFTMetadata,
    getNFTsFromCollection,
    getOwnersOfToken,
    getBalancesOfAddress,
    checkOwnerOfanNFT,
    getTransactionsOfWallet,
    getTokenData
};