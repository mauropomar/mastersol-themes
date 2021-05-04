const {Pool} = require('pg');
const ConPgSQL = {};
var utf8 = require('utf8');

var config_bd = {
    user: 'postgres',
    password: 'root',
    host: 'localhost',
    database: 'mastersol',
    port: 5433
}
const pool = new Pool(config_bd)

const executeQuery = async (query, params = []) => {
    var result;
    try {
        const client = await pool.connect()
        result = await client.query(query, params)
        client.release()
    } catch (err) {
        result = {'success': false, 'message': utf8.encode(err.message)}
    }
    return result
}

const executeQuery2 = async (query, params = []) => {
    pool.connect()
        .then(client => {
            return client.query(query, params) // your query string here
                .then(res => {
                    client.release()
                })
                .catch(e => {
                    client.release()
                })
        })
        .catch(e => {
            console.log('connect err!') // your callback here
        })
}

ConPgSQL.executeQuery = executeQuery
ConPgSQL.executeQuery2 = executeQuery2
module.exports = ConPgSQL