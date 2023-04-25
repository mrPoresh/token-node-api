import query from 'faunadb';
const q = query;

import { client, update, WALLET_C, WALLET_I_R, USERS_C, getByIndex_id, client_users } from '../../db/db.js';
import { authUser } from '../usermanagment/index.js';
import { generateWallet } from '../../tatum-sdk/index.js';

import FaunaError from '../../errors/fauna-errors.js';
import logger from '../../utils/logger.js';

const createWallet = async (req, res) => {
	logger.info('Start Wallet Creation');

	const { currency, walletname } = req.body.params;
	const ref = req.body.ref;

	console.log(req.body)

	try {
		const cli = client();
		const wallet = await generateWallet(currency);

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
	const { ref, xpub } = req.body;z
	logger.info('Start Get Wallet');

    try {
		//const cli = client_users(token);
		const cli = client();

        const result = await cli.query(
            query.Get(
                query.Match(query.Index(WALLET_I_R), xpub),
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