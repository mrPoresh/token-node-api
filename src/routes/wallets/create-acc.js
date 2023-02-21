import query from 'faunadb';

import { client, update, getByIndex_id, ACCOUNTS_C, ACCOUNT_I, USERS_C } from '../../db/db.js';
import { authUser } from '../usermanagment/index.js';
import { generateAcc } from '../../wallets/wallets.js';
import { getWallet } from './index.js';

import FaunaError from '../../errors/fauna-errors.js';
import logger from '../../utils/logger.js';

const getAcc = async (id) => {
    try {
        return await getByIndex_id(id, ACCOUNT_I);

    } catch (error) {
        return error
    }
    

};


const createAcc = async (req, res) => {
    const { token } = req.body;
    logger.info('Start Acc Creation');

    try {
        const cli = client();   // db key, change?
        const user_auth = await authUser(token);
        
        const wallet = await getWallet(user_auth.id);
        const acc = await generateAcc(wallet.data.xpub);

        const result = await cli.query(
            query.Create(
                query.Collection(ACCOUNTS_C), {
                    data: { 
                        currency: acc.currency, 
                        active: acc.active,
                        balance: {
                            accountBalance: acc.balance.accountBalance,
                            availableBalance: acc.balance.availableBalance,
                        },
                        frozen: acc.frozen,
                        xpub: acc.xpub,
                        accountingCurrency: acc.accountingCurrency,
                        id: acc.id,
                        owner_id: user_auth.id
                    },
                }
            )
        );

        update(user_auth.id, USERS_C, {wallet_info: { hasAcc: true }});

        res.status(200).send({ data: result.data });

    } catch (error) {
        logger.error(error);
        let err = new FaunaError(error);
        res.status(err.statusCode).send({ status: err.statusCode, msg: err.message})
    }
};

export {
    createAcc,
    getAcc,
};