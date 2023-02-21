import 'dotenv/config';
import express from 'express';

import cors from 'cors';

import logger from './utils/logger.js'
import loggerHttp from './middlewares/logger-http.js';

import { createUser, loginUser, checkToken, logoutUser, getUser } from './routes/usermanagment/index.js';
import { createWallet, getWallet, createAcc, createDeposit, getFullWalletInfo } from './routes/wallets/index.js';

const PORT = 4000;

function run() {
    
  const server = app();

  server.get('/', (req, res) => {
    logger.info('Hello World!');
    res.status(200).send({ data: 'Hello world!' });
  });

  server.post('/umg/add', createUser);        //  writes in db    //|
  server.post('/umg/login', loginUser);       //  returns token   //|
  server.post('/umg/auth', checkToken);       //  get by token    //| -->  user menagment
  server.post('/umg/logout', logoutUser);     //  exit            //|
  server.get('/umg/info', getUser);           //  get boy         //|

  server.post('/wallet/addwallet', createWallet);
  server.get('/wallet/getwallet', getWallet);
  server.post('/wallet/addacc', createAcc);
  server.post('/wallet/adddeposit', createDeposit);

  server.get('/wallet/fullinfo', getFullWalletInfo);
  
}

function app() {
    const server = express();

    server.use(loggerHttp);
    server.use(express.json());
    server.use(cors());

    server.listen(PORT, () => {
        logger.info(`Server listening on port ${PORT}`);
        logger.info('My secret: ' + process.env.FAUNA_SERVER_KEY)
    });

    return server

}

run();