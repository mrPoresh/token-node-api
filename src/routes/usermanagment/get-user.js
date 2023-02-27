import query from 'faunadb';

import { client_users, USERS_C, WALLET_C, client } from '../../db/db.js'
import { authUser } from './index.js';

import FaunaError from '../../errors/fauna-errors.js';
import logger from '../../utils/logger.js';


const getUser = async (req, res) => {
    logger.info('Start getting User');

    const ref = req.body.ref;

    try {
        //const cli = client_users(token);
        const cli = client();

        const user = await cli.query(       // unite this qu
            query.Get(query.Ref(ref))
        );

        const wallets = await cli.query(
			query.Let({
					user_doc: query.Get(query.Ref(ref)),
                    username: query.Select(['data', 'username'], query.Var('user_doc'), []),
					wallets:  query.Select(['data', 'wallets'], query.Var('user_doc'), []),
				},
                query.Map(
                    query.Var('wallets'), 
                    query.Lambda('ref',
                        query.Select(['data'], query.Get(query.Var('ref')), [])  
                    )
                )
			)
		);

        res.status(200).send({ 
            username: user.data.username, 
            surname: user.data.surname, 
            firstname: user.data.firstname, 
            wallets: wallets 
        });

    } catch (error) {
        logger.error(error);
        let err = new FaunaError(error);
        res.status(err.statusCode).send({ status: err.statusCode, msg: err.message})
    }
};

export default getUser;