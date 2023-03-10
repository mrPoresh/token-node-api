import query from 'faunadb';

import { client, update, WALLET_C, WALLET_I, USERS_C, getByIndex_id, client_users } from '../../db/db.js';
import { authUser } from '../usermanagment/index.js';
import { generateWallet } from '../../wallets/wallets.js';

import FaunaError from '../../errors/fauna-errors.js';
import logger from '../../utils/logger.js';

const createWallet = async (req, res) => {
	logger.info('Start Wallet Creation');

	const { ref, currency, walletname } = req.body;

	console.log(req.body)

	try {
		const cli = client();
		const wallet = await generateWallet(currency);

        const result = await cli.query(
			query.Let({
				wallet_ref: query.Select('ref', query.Create(query.Collection(WALLET_C), { data: { name: walletname, xpub: wallet.xpub, accounts: []}})),
				user_ref: query.Ref(ref),
				user_doc: query.Get(query.Var('user_ref')),
				user_wallets: query.Select(['data', 'wallets'], query.Var('user_doc'), []),
			},
			query.Update(query.Var('user_ref'), {
					data: {
						wallets: query.Append([query.Var('wallet_ref')], query.Var('user_wallets'))
					}
				}
			))
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
            query.Get(
                query.Match(query.Index(WALLET_I), xpub),
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
			query.Let({
					user_doc: query.Get(query.Ref(ref)),
					wallets:  query.Select(['data', 'wallets'], query.Var('user_doc'), []),
				},
				query.Map(
					query.Var('wallets'), 
					query.Lambda('id',
						query.Select('data', query.Get(query.Ref(query.Collection(WALLET_C), query.Var('id'))))
					)
				)
			)
		);

        res.status(200).send({ data: result});

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