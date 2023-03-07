import query from 'faunadb';

import { client, update, getByIndex_id, DEPOSITS_C, DEPOSIT_I, WALLET_I, ACCOUNT_I } from '../../db/db.js';
import { authUser } from '../usermanagment/index.js';
import { generateDeposit } from '../../wallets/wallets.js';

import FaunaError from '../../errors/fauna-errors.js';
import logger from '../../utils/logger.js';

const createDeposit = async (req, res) => {
    const { ref, id } = req.body;
    logger.info('Start Deposit Creation');

    try {
        const cli = client();
        const deposit = await generateDeposit(id);

        const result = await cli.query(
            query.Map(
                query.Paginate(
                    query.Match(query.Index(ACCOUNT_I), id)
                ),
                query.Lambda('account_ref',
                    query.Update(query.Var('account_ref'), {
                        data: {
                            deposits: query.Append([
                                query.Select('ref', query.Create(query.Collection(DEPOSITS_C), 
                                    { data: deposit }
                                ))
                            ], query.Select(['data', 'deposits'], query.Get(query.Var('account_ref'))))
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
    createDeposit,
};