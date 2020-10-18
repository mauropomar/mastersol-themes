const pool = require('../connection/server-db')
const objTables = {}
const getProperties = async (req) => {
    const params = [req.query.idsection]
    const query = "SELECT cfgapl.fn_get_properties($1)"
    const result = await pool.executeQuery(query, params)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_get_properties == null) {
        return []
    }
    return result.rows[0].fn_get_properties
}

const getActions = async (params) => {
    const query = "SELECT cfgapl.fn_get_actions()"
    const result = await pool.executeQuery(query, params)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_get_actions == null) {
        return []
    }
    return result.rows[0].fn_get_actions
}

objTables.getActions = getActions
objTables.getProperties = getProperties
module.exports = objTables