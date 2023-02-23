import query from 'faunadb';

import { client, update, getByIndex_id, DEPOSITS_C, DEPOSIT_I, WALLET_I } from '../../db/db.js';
import { authUser } from '../usermanagment/index.js';
import { generateDeposit } from '../../wallets/wallets.js';

import FaunaError from '../../errors/fauna-errors.js';
import logger from '../../utils/logger.js';

const createDeposit = async (req, res) => {
    const { ref, id, xpub } = req.body;
    logger.info('Start Deposit Creation');

    try {
        const cli = client();
        const deposit = await generateDeposit(id);  //

        const result = await cli.query(
            query.Let({
                wallet_ref: query.Select('data', query.Paginate(query.Match(query.Index(WALLET_I), xpub))),
                wallet_doc: query.Get(query.Match(query.Index(WALLET_I), xpub)),
                deposits:  query.Select(['data', 'deposits'], query.Var('wallet_doc'), []),
            },
            query.Map(
                query.Var('wallet_ref'),
                query.Lambda('wallet', 
                    query.Select('data',                     
                        query.Update(query.Var('wallet'), {
                            data: {
                                deposits: query.Append([deposit], query.Var('deposits'))
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
    createDeposit,
};