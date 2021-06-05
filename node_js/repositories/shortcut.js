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

const addShortcut = async (req) => {
    var arrParams = []
    let sessionShortcut = '7ac80b1e-d9fa-4463-adb3-28816a98b419'
    let nameMenu = ''
    //Obtener datos del menu o menu cfg enviado enviado
    req.session.id_user = '7570c788-e3e8-4ffc-83d5-ac7996eb10ce'
    const param_menu = ['cfgapl.menu',req.body.id_menu]
    const resultMenu = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', param_menu)
    let columnsInsert = 'active,id_menu,namex,creator'
    if(resultMenu && resultMenu.rows && resultMenu.rows[0].fn_get_register)
        nameMenu = resultMenu.rows[0].fn_get_register[0].namex
    else{
        columnsInsert = 'active,id_menu_cfg,namex,creator'
        const param_menu_cfg = ['cfgapl.menu_cfg',req.body.id_menu]
        const resultMenuCfg = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', param_menu_cfg)
        if(resultMenuCfg && resultMenuCfg.rows && resultMenuCfg.rows[0].fn_get_register)
            nameMenu = resultMenuCfg.rows[0].fn_get_register[0].namex
    }
    arrParams.push('7ac80b1e-d9fa-4463-adb3-28816a98b419')
    arrParams.push(columnsInsert)
    arrParams.push("true,'"+req.body.id_menu+"','"+nameMenu+"','"+req.session.id_user+"'")
    arrParams.push(null)
    arrParams.push(null)
    arrParams.push(req.session.id_user)
    console.log(arrParams)

    const query = "SELECT cfgapl.fn_insert_register($1,$2,$3,$4,$5,$6)"
    const result = await pool.executeQuery(query, arrParams)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_insert_register == null) {
        return []
    }
    return result.rows[0].fn_insert_register
}

objShorcut.getShortcut = getShortcut
objShorcut.deleteShortcut = deleteShortcut
objShorcut.addShortcut = addShortcut
module.exports = objShorcut