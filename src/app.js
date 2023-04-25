/* import 'dotenv/config'; */
import express from 'express';

import cors from 'cors';

import logger from './utils/logger.js'
import loggerHttp from './middlewares/logger-http.js';

import { conf } from './config.js';
import { createUser, loginUser, checkToken, logoutUser, getUser } from './routes/usermanagment/index.js';
import { createWallet, getWallet, getWallets, createAcc, createDeposit } from './routes/wallets/index.js';
import { 
    getCollectionNFTs, 
    getMetadataForNFT, 
    getAddressBalances, 
    getTokenOwners, 
    checkIsOwner, 
    getTransactions, 

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

    server.post('/wallet/addwallet', checkToken, z);
    server.post('/wallet/addacc', checkToken, createAcc);
    server.post('/wallet/adddeposit', checkToken, createDeposit);
    server.get('/wallet/getwallet', checkToken, getWallet);
    server.get('/wallet/getwallets', checkToken, getWallets);

    server.get('/nfts/nftsfrom', getCollectionNFTs);
    server.get('/nfts/metadataof', getMetadataForNFT);
    server.get('/nfts/balancesof', getAddressBalances);
    server.get('/nfts/ownersof', getTokenOwners);
    server.get('/nfts/isowner', checkIsOwner);
    server.get('/nfts/transactions', getTransactions);
    //server.post('/nfts/getfrontpagelists', getFrontPageLists);  //

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
    });

    return server

}

run();