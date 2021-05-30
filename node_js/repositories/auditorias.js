const pool = require('../connection/server-db')
const moment = require('moment')
const objAudit = {}
const getAuditorias = async (req) => {
    const params = [req.query.idsection, req.query.idregister, req.session.id_user]
    const query = "SELECT security.fn_get_auditorias($1,$2,$3)"
    const result = await pool.executeQuery(query, params)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_get_auditorias == null) {
        return []
    }
    return result.rows[0].fn_get_auditorias
}

const getFilterAuditorias = async (req) => {
    const dateDesde = req.query.desde !== '' ? moment(req.query.desde, "MM/DD/YYYY").format('YYYY-MM-DD') : null;
    const dateHasta = req.query.hasta !== '' ? moment(req.query.hasta, "MM/DD/YYYY").format('YYYY-MM-DD') : null;
    const params = [
        req.session.id_user,
        req.query.propiedad !== '' ? req.query.propiedad : null,
        req.query.accion !== '' ? req.query.accion : null,
        dateDesde, dateHasta, req.query.idsection, req.query.idregistro
    ]
    const query = "SELECT security.fn_get_filter_auditorias($1,$2,$3,$4,$5,$6,$7)"
    const result = await pool.executeQuery(query, params)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_get_filter_auditorias == null) {
        return []
    }
    return result.rows[0].fn_get_filter_auditorias
}

objAudit.getAuditorias = getAuditorias
objAudit.getFilterAuditorias = getFilterAuditorias
module.exports = objAudit