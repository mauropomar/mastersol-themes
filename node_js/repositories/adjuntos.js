const pool = require('../connection/server-db')
const objAdj = {}
const getAdjuntos = async (req) => {
    const params = [req.query.idsection, req.query.idregister, req.session.id_user]
    const query = "SELECT cfgapl.fn_get_adjuntos($1,$2,$3)"
    const result = await pool.executeQuery(query, params)

    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_get_adjuntos == null) {
        return []
    }

    return result.rows[0].fn_get_adjuntos
}

const insertAdjunto = async (req) => {
    console.log(req.body)
    return 1
}

const deleteAdjunto = async (req) => {

    return 1
}

const downloadAdjunto = async (req) => {

    return 1
}

objAdj.getAdjuntos = getAdjuntos
objAdj.insertAdjunto = insertAdjunto
objAdj.deleteAdjunto = deleteAdjunto
objAdj.downloadAdjunto = downloadAdjunto
module.exports = objAdj