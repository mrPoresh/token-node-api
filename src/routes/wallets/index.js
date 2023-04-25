import { createWallet, getWallet, getWallets } from './wallet.js';
import { createAccount, getAccountById, getAccountByWallet, getUserAccounts, getAccountBalance, updateAccount, } from './account.js';
import { createDeposit, getAllUserDeposits, assignDeposit, removeDeposit, } from './deposit.js';

export {
    createWallet,
    getWallet,
    getWallets,
    createDeposit,

    createAccount,
    getAccountById,
    getAccountByWallet,
    getUserAccounts,
    getAccountBalance,
    updateAccount,

    createDeposit,
    getAllUserDeposits,
    assignDeposit,
    removeDeposit,
};