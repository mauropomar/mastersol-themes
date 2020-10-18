const pool = require('../connection/server-db')

const getMenuConfiguration = async (req) => {
    const params = [req.session.id_rol, req.session.id_capsules, req.session.id_organizations, req.body.node ? req.body.node : null]
    const query = "SELECT cfgapl.fn_get_menu_cfg($1,$2,$3,$4)"
    const result = await pool.executeQuery(query, params)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_get_menu_cfg == null) {
        return []
    }
    return result.rows[0].fn_get_menu_cfg
}

module.exports.getMenuConfiguration = getMenuConfiguration