const {Pool} = require('pg')
const ConPgSQL = {}
var utf8 = require('utf8')

var config_bd = {
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    database: 'mastersol',
    port: 5432
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

module.exports.executeQuery = executeQuery;