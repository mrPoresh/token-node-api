import query from 'faunadb';

import { client, ACCOUNT_I_ID } from '../../db/db.js';
import { authUser } from '../usermanagment/index.js';
import { generateDeposit } from '../../tatum-sdk/index.js';

import FaunaError from '../../errors/fauna-errors.js';
import logger from '../../utils/logger.js';

const createDeposit = async (req, res) => {
    const { id } = req.body.params;
    const ref = req.body.ref;
    
    logger.info('Start Deposit Creation');

    try {
        const cli = client();
        const deposit = await generateDeposit(id);

        const result = await cli.query(
            q.Let({
                account_ref: q.Select(['ref'], 
                    q.Get(q.Match(q.Index(ACCOUNT_I_ID), id),
                ))
            },
            q.Create(q.Collection(ACCOUNTS_C), {
				data: {...deposit, ...{ owner: q.Var('account_ref') }},
			})),
        );

        console.log(result)

		res.status(200).send({ message: "OK" });

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