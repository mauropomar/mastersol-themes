const pool = require('../connection/server-db')
objShorcut = {}
const getShortcut = async () => {
    const query = "SELECT cfgapl.fn_get_shortcuts()"
    const result = await pool.executeQuery(query)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_get_shortcuts == null) {
        return []
    }
    return result.rows[0].fn_get_shortcuts
}

const deleteShortcut = async (req) => {
    const params = [
        req.body.idsection !== '' && req.body.idsection ? req.body.idsection : null,
        req.body.id !== '' ? "{" + req.body.id + "}" : null,
        req.session.id_user
    ]
    const query = "SELECT cfgapl.fn_delete_register($1,$2,$3)"
    const result = await pool.executeQuery(query, params)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_delete_register == null) {
        return []
    }
    return result.rows[0].fn_delete_register
}

objShorcut.getShortcut = getShortcut
objShorcut.deleteShortcut = deleteShortcut
module.exports = objShorcut