import { generateWallet, generateAcc, generateDeposit } from './wallets.js';
import { getNFTsOwnedByAddress, getNFTsFromCollection, getNFTMetadata } from './nfts.js';

import { TatumSDK } from "@tatumio/sdk";

const sdk = TatumSDK({ apiKey: process.env.API_KEY_MAINNET });

export {
    sdk,
    generateWallet,
    generateAcc,
    generateDeposit,
    getNFTsOwnedByAddress,
    getNFTMetadata,
    getNFTsFromCollection,
};