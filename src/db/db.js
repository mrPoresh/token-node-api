import 'dotenv/config';
import faunadb from 'faunadb';
import query from 'faunadb';
import FaunaError from '../errors/fauna-errors.js';
import logger from '../utils/logger.js';

export const USERS_C = 'users';
export const WALLET_C = 'wallets';
export const ACCOUNTS_C = 'accounts';
export const DEPOSITS_C = 'deposits';

export const EMAIL_I = 'users_by_email';
export const WALLET_I = 'wallets_by_xpub';
export const ACCOUNT_I = 'accounts_by_id';
export const DEPOSIT_I = 'deposits_by_id';

const client = () => {
    return new faunadb.Client({
        secret: process.env.FAUNA_SERVER_KEY,
        domain: 'db.fauna.com',
        endpoint: 'https://db.fauna.com',
        scheme: 'https',
    });
}

const client_users = (token) => {
    return new faunadb.Client({
        secret: token,
        domain: 'db.fauna.com',
        endpoint: 'https://db.fauna.com',
        scheme: 'https',
    });
}

const getByIndex_id = async (id, index) => {
    try {
        const cli = client();

        const result = await cli.query(
            query.Get(
                query.Match(query.Index(index), id),
            )
        );

        return result

    } catch (error) {
        logger.error(error);
        let err = new FaunaError(error);
        return err
    }
}

const update = async (id, collection, data) => {    // data: {some: some, some1: some}
    try {
        const cli = client();

        return await cli.query(
            query.Update(
                query.Ref(query.Collection(collection), id),
                {
                    data
                }
            )
        );


    } catch (error) {
        logger.error(error);
        let err = new FaunaError(error);
        return err
    }

}

export {
    client,
    client_users,
    getByIndex_id,
    update,
}
