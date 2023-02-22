import query from 'faunadb';

import { client_users, USERS_C, WALLET_C, client } from '../../db/db.js'
import { authUser } from './index.js';

import FaunaError from '../../errors/fauna-errors.js';
import logger from '../../utils/logger.js';


const getUser = async (req, res) => {
    const { token } = req.body;
    const wallets = [];
    logger.info('Start getting User');
    console.log(req.body)
    logger.info(token);

    try {
        //const cli = client_users(token);
        const cli = client();
        const user_auth = await authUser(token);

        const user = await cli.query(
            query.Get(
                query.Ref(
                    query.Collection(USERS_C),
                    user_auth.id
                )
            )
        );

        for (let i = 0; i < user.data.wallets.length; i++) {
            const wallet = await cli.query(
                query.Get(
                    query.Ref(
                        query.Collection(WALLET_C),
                        user.data.wallets[i]
                    )
                )
            )

            wallets.push(wallet.data)
        }

        res.status(200).send({ data: { user: user.data.username, wallets: wallets }});

    } catch (error) {
        logger.error(error);
        let err = new FaunaError(error);
        res.status(err.statusCode).send({ status: err.statusCode, msg: err.message})
    }
};

export default getUser;