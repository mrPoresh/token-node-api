import query from 'faunadb';

import { client_users, USERS_C, WALLET_C, client } from '../../db/db.js'
import { authUser } from './index.js';

import FaunaError from '../../errors/fauna-errors.js';
import logger from '../../utils/logger.js';

const getUser = async (req, res) => {
    logger.info('Start getting User');

    const ref = req.body.ref;

    const user = { }

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
                                        account: {
                                            currency: query.Select(['currency'], query.Var('account')),
                                            active: query.Select(['active'], query.Var('account')),
                                            balance: query.Select(['balance'], query.Var('account')),
                                            frozen: query.Select(['frozen'], query.Var('account')),
                                            xpub: query.Select(['xpub'], query.Var('account')),
                                            accountingCurrency: query.Select(['accountingCurrency'], query.Var('account')),
                                            id: query.Select(['id'], query.Var('account')),
                                            deposits: query.Var('deposits'),
                                        }
                                    })
                                )
                            )
                        },
                        {
                            wallet: {
                                name: query.Select(['name'], query.Var('wallet')),
                                xpub: query.Select(['xpub'], query.Var('wallet')),
                                /* mnemonic: query.Select(['mnemonic'], query.Var('wallet')), */
                                accounts: query.Var('accounts'),
                            }
                        }),
                    ),
                ),
            },
            {
                user: {
                    username: query.Select(['username'], query.Var('user')),
                    surname: query.Select(['surname'], query.Var('user')),
                    firstname: query.Select(['firstname'], query.Var('user')),
                    wallets: query.Var('wallets'),
                }
            }),
        );

        console.log('\n*--------------------------------*\n');
        console.log(result)
        console.log('\n*--------------------------------*\n');
        console.log(result.user.wallets)
        console.log('\n*--------------------------------*\n');
        console.log(result.user.wallets[0].wallet.accounts)
        console.log('\n*--------------------------------*\n');
        console.log(result.user.wallets[0].wallet.accounts[0].account.deposits)
        console.log('\n*--------------------------------*\n');


        res.status(200).send(result);

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