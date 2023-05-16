import { 
    createWallet, 
    getWallet, 
    getWallets 
} from './wallet.js';

import { 
    createAccount, 
    createVcAccount, 
    getAccountById, 
    getAccountByWallet, 
    getUserAccounts, 
    getAccountBalance, 
    updateAccount, 
    supplyVcAccount, 
    updateBalance 
} from './account.js';

import { 
    createDeposit, 
    getAllUserDeposits, 
    assignDeposit, 
    removeDeposit, 
} from './deposit.js';

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
    updateBalance,

    createDeposit,
    getAllUserDeposits,
    assignDeposit,
    removeDeposit,
};