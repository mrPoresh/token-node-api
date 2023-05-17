import query from 'faunadb';

import { client, USERS_C, WALLET_C, ACCOUNTS_C, DEPOSITS_C, VC_CURRENCY_C, EMAIL_I } from '../../db/db.js'
import { _createWallet, _createAccount, _createDeposit, _createVcAccount, _supplyVcAccount, _getAccountBalance } from '../../tatum-sdk/index.js'

import FaunaError from '../../errors/fauna-errors.js';
import logger from '../../utils/logger.js';

const createUser = async (req, res) => {
    logger.info('Start adding in db');
    
    const { username, password, firstname, surname, currency, chain, walletname, vc_currency, amount } = req.body;   /* chain: ethereum, bsc, polygon */
    const q = query;                                                                                                /* currency: ETH, BSC, MATIC     */
    //const vc_currency = ['VC_USD', 'VC_EUR'];

    try {
        const cli = client();

        const wallet  = await ( await _createWallet(chain)).json();
        const account = await ( await _createAccount(currency, wallet.xpub)).json();
        const vc_account = await ( await _createVcAccount(vc_currency)).json(); //  <---
        const deposit = await ( await _createDeposit(account.id)).json();

        await _supplyVcAccount(vc_account.id, amount);
        vc_account.balance = await ( await _getAccountBalance(vc_account.id)).json();

        const result = await cli.query(
            q.Let({
                user_ref: q.Select("ref", 
                    q.Create(q.Collection(USERS_C), {
                        data: { 
                            username: username,
                            surname: surname,
                            firstname: firstname,
                        },
                        credentials: { 
                            password 
                        },
                    }),
                ),
                wallet_ref: q.Select("ref", 
                    q.Create(q.Collection(WALLET_C), {
                        data: {...wallet, ...{ owner: q.Var('user_ref'), walletname: walletname }},
                    }),
                ),
                vc_account_ref: q.Select("ref", 
                    q.Create(q.Collection(ACCOUNTS_C), {
                        data: {...vc_account, ...{ owner: q.Var('wallet_ref') }},
                    }),
                ),
                account_ref: q.Select("ref", 
                    q.Create(q.Collection(ACCOUNTS_C), {
                        data: {...account, ...{ owner: q.Var('wallet_ref') }},
                    }),
                ),
                deposit_ref: q.Select("ref", 
                    q.Create(q.Collection(DEPOSITS_C), {
                        data: {...deposit, ...{ owner: q.Var('account_ref') }},
                    }),
                ),
            },
                q.Login(
                    q.Match(q.Index(EMAIL_I), username),
                    { password: password },
                ),
            ),
        );

        res.status(200).send({ data: { token: result.secret, mnemonic: wallet.mnemonic } });

    } catch (error) {
        logger.error(error);
        let err = new FaunaError(error);
        res.status(err.statusCode).send({ status: err.statusCode, msg: err.message})
    }
};

export default createUser;