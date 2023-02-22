import query from 'faunadb';

import { client, update, getByIndex_id, ACCOUNTS_C, ACCOUNT_I, USERS_C, WALLET_I, WALLET_C } from '../../db/db.js';
import { authUser } from '../usermanagment/index.js';
import { generateAcc } from '../../wallets/wallets.js';
import { getWallet } from './index.js';

import FaunaError from '../../errors/fauna-errors.js';
import logger from '../../utils/logger.js';

const createAcc = async (req, res) => {
    const { token, currency, xpub } = req.body;
    logger.info('Start Acc Creation');

    try {
		const cli = client();
        const user_auth = await authUser(token);
		const acc = await generateAcc(xpub, currency);

        const result = await cli.query(
            query.Let({
                wallet_ref: query.Select('data', query.Paginate(query.Match(query.Index(WALLET_I), xpub))),
                wallet_doc: query.Get(query.Match(query.Index(WALLET_I), xpub)),
                accounts:  query.Select(['data', 'accounts'], query.Var('wallet_doc'), []),
            },
            query.Map(
                query.Var('wallet_ref'),
                query.Lambda('wallet', 
                    query.Select('data',                     
                        query.Update(query.Var('wallet'), {
                            data: {
                                accounts: query.Append([acc], query.Var('accounts'))
                            }
                        }
                    )
                ))
            ))
        );

        console.log(result)

		res.status(200).send({ data: result });
        

    } catch (error) {
        logger.error(error);
        let err = new FaunaError(error);
        res.status(err.statusCode).send({ status: err.statusCode, msg: err.message})
    }
};

export {
    createAcc,
};