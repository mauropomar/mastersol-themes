const pool = require('../connection/server-db')

const getMenuOption = async (req) => {
    const params = [req.session.id_rol, req.session.id_capsules, req.session.id_organizations, req.body.idparent ? req.body.idparent : null]
    const query = "SELECT cfgapl.fn_get_menu($1,$2,$3,$4)"
    const result = await pool.executeQuery(query, params)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_get_menu == null) {
        return []
    }
    return result.rows[0].fn_get_menu
}

const getFilterMenus = async (req) => {
    const params = ['%' + req.query.query.replace(/\s/g, '%') + '%']
    const query = "SELECT security.fn_filter_menus($1)"
    const result = await pool.executeQuery(query, params)
    if (result.rows[0].fn_filter_menus == null) {
        return []
    }
    return result.rows[0].fn_filter_menus
}

module.exports.getMenuOption = getMenuOption
module.exports.getFilterMenus = getFilterMenus