const {Pool} = require('pg');
const ConPgSQL = {};
var utf8 = require('utf8');
var config_bd = {
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    database: 'mastersol',
    port: 5432
}
const pool = new Pool(config_bd)
pool.on('error', (err) => {
    console.error('Un cliente inactivo ha experimentado un error', err.stack)
})

const executeQuery = async (query, params = []) => {
    var result;
    const client = await pool.connect()
    try {
        result = await client.query(query, params)
        client.release()
    } catch (err) {
        result = {'success': false, 'message': utf8.encode(err.message)}
        client.release()
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
            console.log('connect err! '+e) // your callback here
        })
}

ConPgSQL.executeQuery = executeQuery
ConPgSQL.executeQuery2 = executeQuery2
ConPgSQL.config_bd = config_bd
ConPgSQL.obj_pool = pool
module.exports = ConPgSQL
