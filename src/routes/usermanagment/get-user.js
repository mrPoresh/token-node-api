import query from 'faunadb';

import { client_users, USERS_C, WALLET_C, client } from '../../db/db.js'
import { authUser } from './index.js';

import FaunaError from '../../errors/fauna-errors.js';
import logger from '../../utils/logger.js';

const getUser = async (req, res) => {
    logger.info('Start getting User');

    const ref = req.body.ref;

    try {
        const cli = client();

        const result = await cli.query(
            query.Let({
                user: query.Select(['data'], query.Get(query.Ref(ref))),
                wallets: query.Map(
                    query.Select(['wallets'], query.Var('user')),
                    query.Lambda('wallet_ref',
                        query.Let({
                            wallet: query.Select(['data'], query.Get(query.Var('wallet_ref'))),
                            accounts: query.Map(
                                query.Select(['accounts'], query.Var('wallet')),
                                query.Lambda('account_ref',
                                    query.Let({
                                        account: query.Select(['data'], query.Get(query.Var('account_ref'))),
                                        deposits: query.Map(
                                            query.Select(['deposits'], query.Var('account')),
                                            query.Lambda('deposit_ref',
                                                query.Let({
                                                    deposit: query.Select(['data'], query.Get(query.Var('deposit_ref'))),
                                                },
                                                {
                                                    deposit: query.Var('deposit')    
                                                })
                                            )
                                        )
                                    },
                                    {    
                                        account: query.Var('account'),
                                        deposits: query.Var('deposits')
                                    })
                                )
                            )
                        },
                        {
                            wallet: query.Var('wallet'),
                            accounts: query.Var('accounts')
                        }),
                    ),
                ),
            },
            {
                user: query.Var('user'),
                wallets: query.Var('wallets')
            }),
        );

        console.log('*--------------------------------*');
        console.log(result)
        console.log('*--------------------------------*');
        console.log(result.wallets)
        console.log('*--------------------------------*');
        console.log(result.wallets[0].accounts)
        console.log('*--------------------------------*');


        res.status(200).send({ data: result });

    } catch (error) {

        logger.error(error);
        let err = new FaunaError(error);
        res.status(err.statusCode).send({ status: err.statusCode, msg: err.message})
    }

}


const getUser22 = async (req, res) => {
    logger.info('Start getting User');

    const ref = req.body.ref;

    try {
        //const cli = client_users(token);
        const cli = client();

        const result = await cli.query(
            query.Let({
                    user_doc: query.Get(query.Ref(ref)),

                    /* ----------------------------------------------------------------------------------------------- */

                    /* wallets: query.Map(
                        query.Select(['data', 'wallets'], query.Var('user_doc'), []),
                        query.Lambda('wallet_ref', 
                            query.Map(
                                query.Select(['data', 'accounts'], query.Get(query.Var('wallet_ref')), []),
                                query.Lambda('acc_ref', 
                                    query.Map(
                                        query.Select(['data', 'deposits'], query.Get(query.Var('acc_ref')), []),
                                        query.Lambda('deposit_ref', 
                                            query.Select(['data'], query.Get(query.Var('deposit_ref')), [])
                                        ),
                                    ),
                                ),
                            )
                        ),
                    ), */

                    /* ----------------------------------------------------------------------------------------------- */

/*                     accounts: query.Map(
                        query.Var('wallets'),
                        query.Lambda('wallet', 
                            query.Foreach(query.Select(['accounts'], query.Var('wallet'), []),
                                query.Lambda('account_ref', query.Select(['data'], query.Get(query.Var('account_ref')), [])) 
                            ),    
                        ),
                    ), */

                    /* accounts: query.Map(
                        query.Var('wallets'),
                        query.Lambda('wallet', query.Select(['accounts'], query.Get(), []))
                    ),
 */
                        

/*                     wallets: query.Map(
                        query.Select(['data', 'wallets'], query.Var('user_doc'), []),
                        query.Lambda('ref', query.Select(['data'], query.Get(query.Var('ref')), [])),
                        
                    ),

                    data: query.Append(query.Var('wallets'), []), */



/*                     wallets: query.Map(
                        query.Select(['data', 'wallets'], query.Var('user_doc'), []),
                        query.Lambda('ref', query.Select(['data'], query.Get(query.Var('ref')), []))
                    ),

                    accounts: query.Map(
                        query.Select(['data', 'accounts'], query.Var('wallets'), []),
                        query.Lambda('ref', query.Select(['data'], query.Get(query.Var('ref')), []))
                    ),
 */
/*                     accounts: query.Map(
                        query.Select(['data', 'accounts'], query.Var('user_doc'), []),
                        query.Lambda('ref', query.Select(['data'], query.Get(query.Var('ref')), []))
                    ),

                    deposits: query.Map(
                        query.Select(['data', 'deposits'], query.Var('user_doc'), []),
                        query.Lambda('ref', query.Select(['data'], query.Get(query.Var('ref')), []))
                    ), */

                },

                query.Do({
                    wallets: query.Var('wallets'), 
                    //accounts: query.Var('data'),
                })
                
            )
        );

        console.log(result)



        res.status(200).send({ data: result });

    } catch (error) {
        logger.error(error);
        let err = new FaunaError(error);
        res.status(err.statusCode).send({ status: err.statusCode, msg: err.message})
    }
};

export default getUser;