import query from 'faunadb';

import { client_users } from '../../db/db.js'
import logger from '../../utils/logger.js';


const logoutUser = async (req, res) => {
    const { token } = req.body;
    logger.info('Start logout');
    logger.info(token);

    try {
        const cli = client_users(token);

        const result = await cli.query(
            query.Logout(true)
        );
  
        res.status(200).send({ data: "OK" });
  
    } catch (error) {
        logger.error(error);
    }
};
  
export default logoutUser;