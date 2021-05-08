const pool = require('../connection/server-db')
const objAlerts = {}

const getUser = async (req) => {
    const param_user = ['security.users',req.session.id_user]
    const resultUser = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', param_user)
    if(resultUser.success === false){
        return {'success': false, 'datos':resultUser.message}
    }
    let alerts = resultUser.rows[0].fn_get_register[0].alerts
    return {'success': true, 'datos': alerts != null ? alerts : 0}
}


objAlerts.getUser = getUser
module.exports = objAlerts