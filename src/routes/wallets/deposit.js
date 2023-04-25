import query from 'faunadb';
const q = query;

import { client, ACCOUNT_I_ID } from '../../db/db.js';
import { _createDeposit, _getAllUserDeposits, _assignDeposit, _removeDeposit } from '../../tatum-sdk/index.js';

import FaunaError from '../../errors/fauna-errors.js';
import logger from '../../utils/logger.js';

const createDeposit = async (req, res) => {
    const { id } = req.body.params;
    const ref = req.body.ref;
    
    logger.info('Start Deposit Creation');

    try {
        const cli = client();
        const deposit = await ( await _createDeposit(id)).json();


        const result = await cli.query(
            q.Let({
                account_ref: q.Select(['ref'], 
                    q.Get(q.Match(q.Index(ACCOUNT_I_ID), id),
                ))
            },
            q.Create(q.Collection(ACCOUNTS_C), {
				data: {...deposit, ...{ owner: q.Var('account_ref') }},
			})),
        );

        console.log(result)

		res.status(200).send({ message: "OK" });

    } catch (error) {
        logger.error(error);
        let err = new FaunaError(error);
        res.status(err.statusCode).send({ status: err.statusCode, msg: err.message})
    }

};

const getAllUserDeposits = async (req, res) => {
    logger.info('Start Getting All Deposits');

    const { id } = req.body;    // acc id

    try {
		const result = await ( await _getAllUserDeposits(id)).json();

		res.status(200).send({ data: result });

    } catch (error) {
        logger.error(error);
        let err = new FaunaError(error);
        res.status(err.statusCode).send({ status: err.statusCode, msg: err.message})
    }
};

const assignDeposit = async (req, res) => {
    logger.info('Start adding Deposit');

    const { id, address } = req.body;   // id -> acc id

    try {
		const result = await ( await _assignDeposit(id, address)).json();

		res.status(200).send({ data: result });

    } catch (error) {
        logger.error(error);
        let err = new FaunaError(error);
        res.status(err.statusCode).send({ status: err.statusCode, msg: err.message})
    }
};

const removeDeposit = async (req, res) => {
    logger.info('Start Reamowing Deposit');

    const { id, address } = req.body;

    try {
		const result = await ( await _removeDeposit(id, address)).json();

		res.status(200).send({ data: result });

    } catch (error) {
        logger.error(error);
        let err = new FaunaError(error);
        res.status(err.statusCode).send({ status: err.statusCode, msg: err.message})
    }
};

export {
    createDeposit,
    getAllUserDeposits,
    assignDeposit,
    removeDeposit,
};