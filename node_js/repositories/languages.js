const pool = require('../connection/server-db')

const getLanguages = async (req) => {
    var params = [req.body.start, req.body.limit, req.session.id_capsules]
    const query = "SELECT cfgapl.fn_get_languages($1,$2,$3)"
    const result = await pool.executeQuery(query, params)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_get_languages == null) {
        return []
    }
    return result.rows[0].fn_get_languages
}

module.exports.getLanguages = getLanguages