import { conf } from "../config.js";

import logger from '../utils/logger.js';
import fetch from "node-fetch";


/* ----- Wallet Api -------------------------------------------------------- */

const _createWallet = async (chain) => {   // chain: ethereum, bsc, polygon
    try {
        return await fetch(
            `https://api.tatum.io/v3/${chain}/wallet`,
            {
                method: 'GET',
                headers: {
                    'x-api-key': conf.API_KEY
                } 
            }
        );
    } catch(err) {
        logger.error(err);
        return err
    }
};

/* ----- Account Api ------------------------------------------------------- */

/* 
    Ability to Froze, Deactivate but can't delete 
*/

const _createAccount = async (currency, xpub) => {   // currency: ETH, BSC, MATIC, (LTC --- easy to get test coins)
    try {
        return await fetch(
            `https://api.tatum.io/v3/ledger/account`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': conf.API_KEY
                },
                body: JSON.stringify({
                    currency: currency,
                    xpub: xpub,
                })
            }
        );
    } catch(err) {
        logger.error(err);
        return err
    }
};

const _createVcAccount = async (currency) => {   // currency: ETH, BSC, MATIC
    try {
        return await fetch(
            `https://api.tatum.io/v3/ledger/account`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': conf.API_KEY
                },
                body: JSON.stringify({
                    currency: currency,
                })
            }
        );
    } catch(err) {
        logger.error(err);
        return err
    }
};

const _getAccountById = async (id) => {
    try {
        return await fetch(
            `https://api.tatum.io/v3/ledger/account/${id}`,
            {
                method: 'GET',
                headers: {
                    'x-api-key': conf.API_KEY
                }
            }
          );
    } catch(err) {
        logger.error(err);
        return err
    }
};

const _getAccountBalance = async (id) => {
    try {
        return await fetch(
            `https://api.tatum.io/v3/ledger/account/${id}/balance`,
            {
                method: 'GET',
                headers: {
                    'x-api-key': conf.API_KEY
                }
            }
        );
    } catch(err) {
        logger.error(err);
        return err
    }
};

const _getUserAccounts = async (id, pageSize) => {
    try {
        const query = new URLSearchParams({pageSize: pageSize}).toString();

        return await fetch(
            `https://api.tatum.io/v3/ledger/account/customer/${id}?${query}`,
            {
                method: 'GET',
                headers: {
                    'x-api-key': conf.API_KEY
                }
            }
          );
    } catch(err) {
        logger.error(err);
        return err
    }
};

const _updateUserAccount = async (id) => {
    try {
        return await fetch(
            `https://api.tatum.io/v3/ledger/account/${id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': conf.API_KEY
                },
                body: JSON.stringify({})
            }
          );
    } catch(err) {
        logger.error(err);
        return err
    }
};

/* ----- Deposit Api ------------------------------------------------------- */

/* 
    Virtual account tokens supplies
*/

const _createDeposit = async (id) => {
    try {
        return await fetch(
            `https://api.tatum.io/v3/offchain/account/${id}/address`,
            {
                method: 'POST',
                headers: {
                    'x-api-key': conf.API_KEY
                }
            }
        );
    } catch(err) {
        logger.error(err);
        return err
    }
};

const _getAllUserDeposits = async (id) => {
    try {
        return await fetch(
            `https://api.tatum.io/v3/offchain/account/${id}/address`,
            {
              method: 'GET',
              headers: {
                'x-api-key': conf.API_KEY
              }
            }
        );
    } catch(err) {
        logger.error(err);
        return err
    }
};

const _assignDeposit = async (id, address) => { // assign an existing blockchain address to a virtual account
    try {
        return await fetch(
            `https://api.tatum.io/v3/offchain/account/${id}/address/${address}`,
            {
                method: 'POST',
                headers: {
                    'x-api-key': conf.API_KEY
                }
            }
        );    
    } catch(err) {
        logger.error(err);
        return err
    }
};

const _removeDeposit = async (id, address) => { // Remove a deposit address from the virtual account
    try {
        return await fetch(
            `https://api.tatum.io/v3/offchain/account/${id}/address/${address}`,
            {
                method: 'DELETE',
                headers: {
                    'x-api-key': conf.API_KEY
                }
            }
        );
    } catch(err) {
        logger.error(err);
        return err
    }
};

/* ----- Virtual Currency -------------------------------------------------- */

const _supplyVcAccount = async (id, amount) => { // creare fiat curr
    try {
        return await fetch(
            `https://api.tatum.io/v3/ledger/virtualCurrency/mint`,
            {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'x-api-key': conf.API_KEY
                },
                body: JSON.stringify({
                  accountId: id,
                  amount: amount
                })
              }
        );
    } catch(err) {
        logger.error(err);
        return err
    }
};

/* ------------------------------------------------------------------------- */

export {
    _createWallet,
    _createAccount,
    _createVcAccount,
    _getAccountById,
    _getAccountBalance,
    _getUserAccounts,
    _updateUserAccount,
    _createDeposit,
    _getAllUserDeposits,
    _assignDeposit,
    _removeDeposit,
    _supplyVcAccount,
};