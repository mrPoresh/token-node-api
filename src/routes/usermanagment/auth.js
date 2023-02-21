import query from 'faunadb';

import FaunaError from '../../errors/fauna-errors.js';
import { client_users } from '../../db/db.js';
import logger from '../../utils/logger.js';

const checkToken = async (req, res) => {
    const { token } = req.body;
    logger.info('Start auth');
    logger.info(token);

    try {
        const result = await authUser(token);
        res.status(200).send({ data: { user_id: result.id }});
  
    } catch (error) {
        logger.error(error);
        let err = new FaunaError(error);
        res.status(err.statusCode).send({ status: err.statusCode, msg: err.message})
    }
};

const authUser = async (token) => {
    try {
        const cli = client_users(token);

        const result = await cli.query(
            query.CurrentIdentity()
        );
  
        return result
  
    } catch (error) {
        logger.error(error);
        return error
    }
}
  
export {
    checkToken,
    authUser,
}