import 'dotenv/config';
import express from 'express';

import cors from 'cors';

import logger from './utils/logger.js'
import loggerHttp from './middlewares/logger-http.js';

import { createUser, loginUser, checkToken, logoutUser, getUser } from './routes/usermanagment/index.js';
import { createWallet, getWallet, getWallets, createAcc, createDeposit } from './routes/wallets/index.js';

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

  server.post('/wallet/addwallet', createWallet);
  server.get('/wallet/getwallet', getWallet);
  server.get('/wallet/getwallets', getWallets);
  server.post('/wallet/addacc', createAcc);
  server.post('/wallet/adddeposit', createDeposit);
  
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