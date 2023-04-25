import { sdk } from "./index.js";
import { conf } from "../config.js";

const TESTNET = conf.TESTNET;

const generateWallet = async (currency) => {
    const options = {
        testnet: TESTNET
    };

    return sdk.wallet.generateBlockchainWallet(currency, undefined, options);
};

const generateAcc = async (xpub, currency) => {
    const options = {
        currency: currency,
        xpub: xpub,
    };

    return sdk.ledger.account.create(options);
}

const generateDeposit = async (id) => {
    return sdk.virtualAccount.depositAddress.create(id)
}

export {
    generateWallet,
    generateAcc,
    generateDeposit,
};