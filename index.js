import './src/app.js';


/* import { TatumSDK } from "@tatumio/sdk";
import { Currency } from "@tatumio/api-client";
import { TatumEthSDK } from "@tatumio/eth";

const sdk = TatumSDK({ apiKey: 'b1eea3fc-277f-4f81-8463-a1ce707791a3' });
const ethSdk = TatumEthSDK({ apiKey: 'b1eea3fc-277f-4f81-8463-a1ce707791a3' })

const currency = Currency.LTC;
const TESTNET = false;


async function main() {
    const userCred = await createUserCred(currency);
    console.log('\n *** User Deposit ***\n\n', userCred);
}

async function createUserCred(currency) {
    return genWallet(currency)
        .then((wallet) => {console.log(wallet); return createAcc(currency, wallet.xpub)})
        .then((acc) => {console.log(acc); return createDepositAddress(acc.id)})
}

function genWallet(currency) {
    const options = {
        testnet: TESTNET
    }

    if (currency === Currency.BTC || currency === Currency.LTC) {
        return sdk.wallet.generateBlockchainWallet(currency, undefined, options);
    }  else {
        return ethSdk.wallet.generateWallet(undefined, options)
    }
}

function createAcc(currency, xpub) {
    const options = {
        currency: currency,
        xpub: xpub,
    };

    return sdk.ledger.account.create(options)
}

function createDepositAddress(id) {
    return sdk.virtualAccount.depositAddress.create(id)
}

main(); */