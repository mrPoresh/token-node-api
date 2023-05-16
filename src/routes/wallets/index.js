import { createWallet, getWallet, getWallets, getPriceConversion } from './wallet.js';
import { createAccount, createVcAccount, getAccountById, getAccountByWallet, getUserAccounts, getAccountBalance, updateAccount, supplyVcAccount } from './account.js';
import { createDeposit, getAllUserDeposits, assignDeposit, removeDeposit, } from './deposit.js';

export {
    createWallet,
    getWallet,
    getWallets,

    createAccount,
    createVcAccount,
    getAccountById,
    getAccountByWallet,
    getUserAccounts,
    getAccountBalance,
    updateAccount,
    supplyVcAccount,

    createDeposit,
    getAllUserDeposits,
    assignDeposit,
    removeDeposit,
};