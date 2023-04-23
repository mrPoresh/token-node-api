import query from 'faunadb';

import { client, EMAIL_I } from '../../db/db.js'
import logger from '../../utils/logger.js';


const loginUser = async (req, res) => {
    const { username, password } = req.body;
    logger.info('Start login');

    console.log(req.body)

    try {
        const cli = client();

        const result = await cli.query(
            query.Login(
                query.Match(query.Index(EMAIL_I), username),
                { password: password },
            )
        );
  
        res.status(200).send({ data: { token: result.secret } });
  
    } catch (error) {
        logger.error(error);
        res.status(401).send('A token is required for authentication')
    }
};
  
export default loginUser;