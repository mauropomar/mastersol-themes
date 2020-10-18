const pool = require('../connection/server-db')

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

module.exports.getRoles = getRoles