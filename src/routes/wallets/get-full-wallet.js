import query from 'faunadb';

import { client, WALLET_C, WALLET_I, USERS_C } from '../../db/db.js';
import { authUser, getUser } from '../usermanagment/index.js';
import { getAcc, getWallet, getDeposit } from './index.js';

import FaunaError from '../../errors/fauna-errors.js';
import logger from '../../utils/logger.js';

const getFullWalletInfo = async (req, res) => {
	const { token } = req.body;
	logger.info('Start Getting Wallet info');

	try {
		const cli = client();

        const getArr = [ getWallet, getAcc, getDeposit ];
        const data = [['wallet'], ['account'], ['deposit']];

		const user_auth = await authUser(token);
		const user = await cli.query(
            query.Get(
                query.Ref(
                    query.Collection(USERS_C),
                    user_auth.id
                )
            )
        );

        const iter1 = getArr.entries();
        const iter2 = data.entries();
        for (const [key, value] of Object.entries(user.data.wallet_info)) {
            if (value === true) {
                iter2.next().value[1].push((await iter1.next().value[1](user_auth.id)).data);
            } else {
                iter1.next();
                iter2.next().value[1].push(undefined);
            }

        }

		res.status(200).send({ data: Object.fromEntries(new Map(data))});

	} catch (error) {
		logger.error(error);
		let err = new FaunaError(error);
		res.status(err.statusCode).send({ status: err.statusCode, msg: err.message})
	}

};

export {
    getFullWalletInfo
};