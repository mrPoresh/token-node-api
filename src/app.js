import express from 'express';
import cors from 'cors';
import logger from './utils/logger.js'
import loggerHttp from './middlewares/logger-http.js';
import { conf } from './config.js';

import { 
    createUser, 
    loginUser, 
    checkToken, 
    logoutUser, 
    getUser 
} from './routes/usermanagment/index.js';

import { 
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
} from './routes/wallets/index.js';

import {
    getPriceConversion
} from './routes/trade/index.js';

import { 
    getFrontPageData, 
    getFrontListsData,
    getFrontTabsByVolume,
    getFrontTabsByMints,
} from './routes/nfts/index.js';

const PORT = 4000;

function run() {
    
    const server = app();

    server.get('/', (req, res) => {
        logger.info('Hello World!');
        res.status(200).send({ data: 'Hello world!' });
    });

    server.post('/umg/signup', createUser);
    server.post('/umg/signin', loginUser);
    server.get('/umg/info', checkToken, getUser);
    server.post('/umg/logout', logoutUser);

    server.post('/wallet/addWallet', checkToken, createWallet); 
    server.post('/wallet/getWallet', checkToken, getWallet);    // change it to get
    server.post('/wallet/getWallets', checkToken, getWallets);  //

    server.post('/wallet/addAccount', checkToken, createAccount);
    server.post('/wallet/addVcAccount', checkToken, createVcAccount);
    server.post('/wallet/getAccountById', checkToken, getAccountById);
    server.post('/wallet/getAccountByWallet', checkToken, getAccountByWallet);
    server.post('/wallet/getUserAccounts', checkToken, getUserAccounts);
    server.post('/wallet/getAccountBalance', checkToken, getAccountBalance);
    server.post('/wallet/updateAccount', checkToken, updateAccount);
    server.post('/wallet/supplyVcAccount', checkToken, supplyVcAccount);        // TODO: check server key

    server.post('/wallet/createDeposit', checkToken, createDeposit);
    server.post('/wallet/getAllUserDeposits', checkToken, getAllUserDeposits);
    server.post('/wallet/assignDeposit', checkToken, assignDeposit);
    server.post('/wallet/removeDeposit', checkToken, removeDeposit);    

    server.get('/trade/getPriceConversion', getPriceConversion);

    /* Front Page methods */
    server.get('/nfts/getFrontPageData', getFrontPageData);
    server.post('/nfts/getFrontListsData', getFrontListsData);
    server.post('/nfts/getFrontTabsByVolume', getFrontTabsByVolume);
    server.post('/nfts/getFrontTabsByMints', getFrontTabsByMints);

}

function app() {
    const server = express();

    server.use(loggerHttp);
    server.use(express.json());
    server.use(cors());

    server.listen(PORT, () => {
        logger.info(`Server listening on port ${PORT}`);
        logger.info('ENV: ' + conf.NODE_ENV);
        logger.info('Testnet: ' + conf.TESTNET);
        logger.info('My Fauna secret: ' + conf.FAUNA_SERVER_KEY);
        logger.info('My SDK secret: ' + conf.API_KEY);
        logger.info('My Conv secret: ' + conf.COIN_MARKET);
    });

    return server

}

run();