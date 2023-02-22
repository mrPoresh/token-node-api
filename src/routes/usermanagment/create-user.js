import query from 'faunadb';

import { client, USERS_C, WALLET_C } from '../../db/db.js'
import { generateWallet, generateAcc, generateDeposit } from '../../wallets/wallets.js';

import FaunaError from '../../errors/fauna-errors.js';
import logger from '../../utils/logger.js';

const createUser = async (req, res) => {
    const { username, currency, password } = req.body;
    logger.info('Start adding in db');

    try {
        const cli = client();

        const wallet = await generateWallet(currency);
        const acc = await generateAcc(wallet.xpub);
        const deposit = await generateDeposit(acc.id);

        const wallet_ref = await cli.query(
            query.Select(
                "ref",
                query.Create(
                    query.Collection(WALLET_C), {
                        data: { 
                            xpub: wallet.xpub,
                            accounts: [acc],
                            deposits: [deposit], 
                        },
                    },
                ),
            )
		);

        const result = await cli.query(
            query.Create(
                query.Collection(USERS_C), {
                    data: { 
                        username: username,
                        wallets: [wallet_ref.id]
                    },
                    credentials: { password }
                }
            )
        );

        res.status(200).send({ data: result.data });

    } catch (error) {
        logger.error(error);
        let err = new FaunaError(error);
        res.status(err.statusCode).send({ status: err.statusCode, msg: err.message})
    }
};

export default createUser;