import query from 'faunadb';

import { client, update, getByIndex_id, DEPOSITS_C, DEPOSIT_I, USERS_C } from '../../db/db.js';
import { authUser } from '../usermanagment/index.js';
import { generateDeposit } from '../../wallets/wallets.js';
import { getAcc } from './index.js';

import FaunaError from '../../errors/fauna-errors.js';
import logger from '../../utils/logger.js';

const getDeposit = async (id) => {
    try {
        return await getByIndex_id(id, DEPOSIT_I);

    } catch (error) {
        return error
    }
};

const createDeposit = async (req, res) => {
    const { token } = req.body;
    logger.info('Start Deposit Creation');

    try {
        const cli = client();

        const user_auth = await authUser(token);
        const acc = await getAcc(user_auth.id);
        const deposit = await generateDeposit(acc.data.id);  //

        const result = await cli.query(
            query.Create(
                query.Collection(DEPOSITS_C), {
                    data: { 
                        xpub: deposit.xpub,
                        derivationKey: deposit.derivationKey,
                        address: deposit.address,
                        currency: deposit.currency,
                        owner_id: user_auth.id,
                    },
                }
            )
        );

        update(user_auth.id, USERS_C, { wallet_info: { hasDeposit: true }});

        res.status(200).send({ data: result.data });

    } catch (error) {
        logger.error(error);
        let err = new FaunaError(error);
        res.status(err.statusCode).send({ status: err.statusCode, msg: err.message})
    }

};

export {
    getDeposit,
    createDeposit,
};