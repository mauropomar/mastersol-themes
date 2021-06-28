const pool = require('../connection/server-db')
const objLanguages = {}

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

const getLanguagesByUser = async (req) => {
    const params = [req.session.id_user]
    const query = "SELECT cfgapl.fn_get_languages_by_user($1)"
    const result = await pool.executeQuery(query, params)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_get_languages_by_user == null) {
        return []
    }
    return result.rows[0].fn_get_languages_by_user
}

objLanguages.getLanguages = getLanguages
objLanguages.getLanguagesByUser = getLanguagesByUser
module.exports = objLanguages