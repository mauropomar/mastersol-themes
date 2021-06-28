const pool = require('../connection/server-db')
const objRoles = {}

const getRoles = async (req) => {
    const params = [req.body.start, req.body.limit, req.session.id_capsules, req.session.id_organizations]
    const query = "SELECT security.fn_get_roles($1,$2,$3,$4)"
    const result = await pool.executeQuery(query, params)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_get_roles == null) {
        return []
    }
    return result.rows[0].fn_get_roles
}

const getRolesByUser = async (req) => {
    const params = [req.session.id_user]
    const query = "SELECT security.fn_get_roles_by_user($1)"
    const result = await pool.executeQuery(query, params)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_get_roles_by_user == null) {
        return []
    }
    return result.rows[0].fn_get_roles_by_user
}

objRoles.getRoles = getRoles
objRoles.getRolesByUser = getRolesByUser
module.exports = objRoles