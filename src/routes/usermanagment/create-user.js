import query from 'faunadb';

import { client, USERS_C, WALLET_C, ACCOUNTS_C, DEPOSITS_C, EMAIL_I } from '../../db/db.js'
import { generateWallet, generateAcc, generateDeposit } from '../../wallets/wallets.js';

import FaunaError from '../../errors/fauna-errors.js';
import logger from '../../utils/logger.js';

const createUser = async (req, res) => {
    logger.info('Start adding in db');
    
    const { username, password, firstname, surname, currency, walletname } = req.body;

    try {
        const cli = client();

        const wallet = await generateWallet(currency);
        const account = await generateAcc(wallet.xpub, currency);
        const deposit = await generateDeposit(account.id);

        const result = await cli.query(
            query.Let({
                    deposit_ref: query.Select("ref", 
                        query.Create(query.Collection(DEPOSITS_C), {
                            data: deposit
                        })
                    ),
                    account_ref: query.Select("ref", 
                        query.Create(query.Collection(ACCOUNTS_C), {
                            data: {...account, ...{ deposits: [query.Var('deposit_ref')] }}
                        })
                    ),
                    wallet_ref: query.Select("ref", 
                        query.Create(query.Collection(WALLET_C), {
                            data: {
                                name: walletname, 
                                xpub: wallet.xpub,
                                mnemonic: wallet.mnemonic,
                                accounts: [query.Var('account_ref')]
                            }
                        })
                    ),
                    user_ref: query.Select("ref",
                        query.Create(query.Collection(USERS_C), {
                            data: { 
                                username: username,
                                surname: surname,
                                firstname: firstname,
                                wallets: [query.Var('wallet_ref')],
                            },
                            credentials: { 
                                password 
                            }}
                        )       
                    )
                },
                query.Login(
                    query.Match(query.Index(EMAIL_I), username),
                    { password: password },
                )
            )
        );

        res.status(200).send({ data: { token: result.secret, mnemonic: wallet.mnemonic } });

    } catch (error) {
        logger.error(error);
        let err = new FaunaError(error);
        res.status(err.statusCode).send({ status: err.statusCode, msg: err.message})
    }
};

export default createUser;