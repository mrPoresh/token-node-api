import query from 'faunadb';
const q = query;

import { client, ACCOUNTS_C, WALLET_I_XPUB } from '../../db/db.js';
import { authUser } from '../usermanagment/index.js';
import { generateAcc } from '../../tatum-sdk/index.js';
import { getWallet } from './index.js';

import FaunaError from '../../errors/fauna-errors.js';
import logger from '../../utils/logger.js';

const createAcc = async (req, res) => {
    logger.info('Start Acc Creation');

    const { currency, xpub } = req.body.params;
    const ref = req.body.ref;

    try {
		const cli = client();
		const account = await generateAcc(xpub, currency);

        const result = await cli.query(
            q.Let({
                wallet_ref: q.Select(['ref'], 
                    q.Get(q.Match(q.Index(WALLET_I_XPUB), xpub),
                ))
            },
            q.Create(q.Collection(ACCOUNTS_C), {
				data: {...account, ...{ owner: q.Var('wallet_ref') }},
			})),
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