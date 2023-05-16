import { config } from 'dotenv';

if (process.env.NODE_ENV === 'prod') {
  config({ path: '/home/tony/Work/node-nft-api/prod.env' });
} else {
  config({ path: '/home/tony/Work/node-nft-api/dev.env' });
}

export const conf = {
  NODE_ENV: process.env.NODE_ENV,
  FAUNA_SERVER_KEY: process.env.FAUNA_SERVER_KEY,
  API_KEY: process.env.API_KEY,
  TESTNET: process.env.TESTNET,
  COIN_MARKET: process.env.COIN_MARKET,
};