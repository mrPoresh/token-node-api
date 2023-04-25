import query from 'faunadb';
const q = query;

import { client, update, WALLET_C, WALLET_I_R, USERS_C, getByIndex_id, client_users, WALLET_I_XPUB } from '../../db/db.js';
import { authUser } from '../usermanagment/index.js';
import { _createWallet } from '../../tatum-sdk/index.js';

import FaunaError from '../../errors/fauna-errors.js';
import logger from '../../utils/logger.js';

const createWallet = async (req, res) => {
	logger.info('Start Wallet Creation');

	const { chain, walletname, ref } = req.body;

	try {
		const cli = client();
		const wallet = await ( await _createWallet(chain)).json();

		const result = await cli.query(
			q.Create(q.Collection(WALLET_C), {
				data: {...wallet, ...{ owner: ref, walletname:  walletname}},
			}),
		);

		res.status(200).send({ data: { mnemonic: wallet.mnemonic} });

	} catch (error) {
		logger.error(error);
		let err = new FaunaError(error);
		res.status(err.statusCode).send({ status: err.statusCode, msg: err.message})
	}

};

const getWallet = async (req, res) => {
	const { ref, xpub } = req.body;
	logger.info('Start Get Wallet');

    try {
		//const cli = client_users(token);
		const cli = client();

        const result = await cli.query(
            q.Get(
                q.Match(q.Index(WALLET_I_XPUB), xpub),
            )
        );

        res.status(200).send({ data: result });

    } catch (error) {
		logger.error(error);
		let err = new FaunaError(error);
		res.status(err.statusCode).send({ status: err.statusCode, msg: err.message})
    }
};

const getWallets = async (req, res) => {
	const { ref } = req.body;
	logger.info('Start Get Wallets');

    try {
		//const cli = client_users(token);
		const cli = client();

		const result = await cli.query(
			q.Map(
				q.Paginate(q.Match(q.Index(WALLET_I_R), ref)),
				q.Lambda('wallet_ref',
					q.Let({
						wallet: q.Select(['data'], q.Get(q.Var('wallet_ref')))
					},
						
						q.Var('wallet')	// todo: remove owner field
						
					)
				)
			)
			
		);

        res.status(200).send({ data: result.data});		// array of wallets

    } catch (error) {
		logger.error(error);
		let err = new FaunaError(error);
		res.status(err.statusCode).send({ status: err.statusCode, msg: err.message})
    }
};

export {
  	createWallet,
  	getWallet,
	getWallets,
};