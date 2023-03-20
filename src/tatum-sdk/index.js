import { generateWallet, generateAcc, generateDeposit } from './wallets.js';
import { getNFTsFromCollection, getNFTMetadata, getOwnersOfToken, getBalancesOfAddress, checkOwnerOfanNFT, getTransactionsOfWallet } from './data-api.js';

import { TatumSDK } from "@tatumio/sdk";

const sdk = TatumSDK({ apiKey: process.env.API_KEY_MAINNET });

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
    getTransactionsOfWallet
};