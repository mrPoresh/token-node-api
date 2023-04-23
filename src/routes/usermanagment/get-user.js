import query from 'faunadb';
const q = query;

import { client_users, client, WALLET_I_R, ACCOUNT_I_R, DEPOSIT_I_R } from '../../db/db.js'
import { authUser } from './index.js';

import FaunaError from '../../errors/fauna-errors.js';
import logger from '../../utils/logger.js';

const getUser = async (req, res) => {
    logger.info('Start getting User');
    const ref = req.body.ref;

    try {
        const cli = client();

        const result = await cli.query(
            q.Let({
                user: q.Select(['data'], q.Get(q.Ref(ref))),
                wallets: q.Map(
                    q.Select(['data'], q.Paginate(q.Match(q.Index(WALLET_I_R), ref))),
                    q.Lambda('wallet_ref',
                        q.Let({
                            wallet: q.Select(['data'], q.Get(q.Var('wallet_ref'))),
                            accounts: q.Map(
                                q.Select(['data'], q.Paginate(q.Match(q.Index(ACCOUNT_I_R), q.Var('wallet_ref')))),
                                q.Lambda('account_ref',
                                    q.Let({
                                        account: q.Select(['data'], q.Get(q.Var('account_ref'))),
                                        deposits: q.Map(
                                            q.Select(['data'], q.Paginate(q.Match(q.Index(DEPOSIT_I_R), q.Var('account_ref')))),
                                            q.Lambda('deposit_ref',
                                                q.Let({
                                                    deposit: q.Select(['data'], q.Get(q.Var('deposit_ref')))
                                                },
                                                q.Var('deposit')
                                                )
                                            )
                                        )  
                                    },
                                    q.Merge(
                                        q.Var('account'),
                                        { deposits: q.Var('deposits') }
                                    ))
                                )
                            )
                        },
                        q.Merge(
                            q.Var('wallet'),
                            { accounts: q.Var('accounts') },
                        ))
                    )
                )
            },
            q.Merge(
                q.Var('user'),
                { wallets: q.Var('wallets') },
            ))
        );

        res.status(200).send(result);

    } catch (error) {

        logger.error(error);
        let err = new FaunaError(error);
        res.status(401).send('A token is required for authentication')
    }
}

export default getUser;