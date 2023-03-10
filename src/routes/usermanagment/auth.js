import query from 'faunadb';

import FaunaError from '../../errors/fauna-errors.js';
import { client_users } from '../../db/db.js';
import logger from '../../utils/logger.js';

const checkToken = async (req, res, next) => {
    logger.info('Start auth');

    console.log(req.headers)

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    try {
        req.body.ref = await authUser(token);
        return next();
    } catch (error) {
        logger.error(error);
        res.status(403).send('A token is required for authentication')
    }
};

const authUser = async (token) => { /* returns user ref */
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