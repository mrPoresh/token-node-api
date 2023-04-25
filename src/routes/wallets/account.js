import query from 'faunadb';
const q = query;

import { client, ACCOUNTS_C, WALLET_I_XPUB, ACCOUNT_I_R } from '../../db/db.js';
import { _createAccount, _getAccountById, _getUserAccounts, _getAccountBalance, _updateUserAccount } from '../../tatum-sdk/index.js';

import FaunaError from '../../errors/fauna-errors.js';
import logger from '../../utils/logger.js';

const createAccount = async (req, res) => {
    logger.info('Start Acc Creation');

    const { currency, xpub } = req.body;

    try {
		const cli = client();
		const account = await ( await _createAccount(currency, xpub)).json();

        const result = await cli.query(
            q.Let({
                wallet_ref: q.Select(['ref'], 
                    q.Get(q.Match(q.Index(WALLET_I_XPUB), xpub),
                ))
            },
            q.Create(q.Collection(ACCOUNTS_C), {
				data: {...account, ...{ owner: q.Var('wallet_ref') }},
			})),
        );

		res.status(200).send({ message: "OK" });

    } catch (error) {
        logger.error(error);
        let err = new FaunaError(error);
        res.status(err.statusCode).send({ status: err.statusCode, msg: err.message})
    }
};

const getAccountById = async (req, res) => {
    logger.info('Start Getting Account');

    const { id } = req.body;

    try {
		const result = await ( await _getAccountById(id)).json();

		res.status(200).send({ data: result });

    } catch (error) {
        logger.error(error);
        let err = new FaunaError(error);
        res.status(err.statusCode).send({ status: err.statusCode, msg: err.message})
    }
};

const getAccountByWallet = async (req, res) => {};

const getUserAccounts = async (req, res) => {
    logger.info('Start Getting All User Accounts');

    const { id, pageSize } = req.body;  /* idk which id */

    try {
		const result = await ( await _getUserAccounts(id, pageSize)).json();

		res.status(200).send({ data: result });

    } catch (error) {
        logger.error(error);
        let err = new FaunaError(error);
        res.status(err.statusCode).send({ status: err.statusCode, msg: err.message})
    }
};

const getAccountBalance = async (req, res) => {
    logger.info('Start Getting Account Balance');

    const { id } = req.body;

    try {
		const result = await ( await _getAccountBalance(id)).json();

		res.status(200).send({ data: result });

    } catch (error) {
        logger.error(error);
        let err = new FaunaError(error);
        res.status(err.statusCode).send({ status: err.statusCode, msg: err.message})
    }
};

const updateAccount = async (req, res) => {
    logger.info('Start Updating Account');

    const { id } = req.body;    // here must be params for updating

    try {
		const result = await ( await _updateUserAccount(id)).json();

		res.status(200).send({ data: result });

    } catch (error) {
        logger.error(error);
        let err = new FaunaError(error);
        res.status(err.statusCode).send({ status: err.statusCode, msg: err.message})
    }
};

export {
    createAccount,
    getAccountById,
    getAccountByWallet,
    getUserAccounts,
    getAccountBalance,
    updateAccount,
};