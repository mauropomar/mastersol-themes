const pool = require('../connection/server-db')
const objUser = {}

const authentication = async (params) => {
    const query = "SELECT security.fn_security_login($1, $2)"
    const result = await pool.executeQuery(query, params)

    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_security_login != null) {
        return {'rowCount': result.rows.length, 'vals': result.rows[0].fn_security_login[0]}
    } else {
        return {'rowCount': 0}
    }
}

const getUsers = async (req) => {
    const params = [req.session.id_organizations]
    const query = "SELECT security.fn_get_users($1)"
    const result = await pool.executeQuery(query, params)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_get_users == null) {
        return []
    }
    return result.rows[0].fn_get_users
}

const insertOptionuser = async (req) => {
    const params = [
        req.session.id_capsules,
        req.session.id_organizations,
        req.session.id_user,
        req.body.idlanguajes,
        req.body.idrol
    ]
    const query = "SELECT security.fn_insert_user_options($1,$2,$3,$4,$5)"
    const result = await pool.executeQuery(query, params)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_insert_user_options == null) {
        return []
    }
    return result.rows[0].fn_insert_user_options
}

const changePass = async (req) => {
    const params = [
        req.body.pass,
        req.session.id_user
    ]
    console.log(params)
    const query = "SELECT security.fn_change_pass($1,$2)"
    const result = await pool.executeQuery(query, params)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_change_pass == null) {
        return []
    }
    return result.rows[0].fn_change_pass
}

objUser.authentication = authentication
objUser.getUsers = getUsers
objUser.insertOptionuser = insertOptionuser
objUser.changePass = changePass
module.exports = objUser