import query from 'faunadb';

import { client, update, getByIndex_id, ACCOUNTS_C, ACCOUNT_I, USERS_C, WALLET_I, WALLET_C } from '../../db/db.js';
import { authUser } from '../usermanagment/index.js';
import { generateAcc } from '../../wallets/wallets.js';
import { getWallet } from './index.js';

import FaunaError from '../../errors/fauna-errors.js';
import logger from '../../utils/logger.js';

const createAcc = async (req, res) => {
    logger.info('Start Acc Creation');

    const { ref, currency, xpub } = req.body;

    try {
		const cli = client();
		const account = await generateAcc(xpub, currency);

        const result = await cli.query(
            query.Map(
                query.Paginate(
                    query.Match(query.Index(WALLET_I), xpub)
                ),
                query.Lambda('wallet_ref',
                    query.Update(query.Var('wallet_ref'), {
                        data: {
                            accounts: query.Append([
                                query.Select('ref', query.Create(query.Collection(ACCOUNTS_C), 
                                    { data: { ...account, ...{ deposits: [] }}}
                                ))
                            ], query.Select(['data', 'accounts'], query.Get(query.Var('wallet_ref'))))
                        }
                    })
                )
            )
        );

        console.log(result)

		res.status(200).send({ message: "OK" });
        

    } catch (error) {
        logger.error(error);
        let err = new FaunaError(error);
        res.status(err.statusCode).send({ status: err.statusCode, msg: err.message})
    }
};

export {
    createAcc,
};