var express = require("express")
var router = express.Router()
const objects = require('../modules')
const pool = require('../connection/server-db')
var app = express()
var ip = require('ip');

/*Ruta principal*/
router.get("/", function (req, res) {
    res.sendFile(global.appRootApp + 'index.html');
})

/*Login*/
router.post("/login", async function (req, res) {
    var params = [req.body.user, req.body.password]
    const result = await objects.users.authentication(params)
    if (result.success === false) {
        return res.json(result)
    } else if (result.rowCount > 0) {
        req.session.user = req.body.user
        req.session.id_capsules = result.vals.id_capsules
        req.session.id_organizations = result.vals.id_organizations
        req.session.id_rol = result.vals.id_rol
        req.session.id_user = result.vals.id_user
        req.session.language = ''
        let default_rol = result.vals.id_rol
        //Buscar lenguaje y rol por defecto de este user
        const paramsUser = ['security.users', req.session.id_user];
        const resultUser= await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', paramsUser);
        if(resultUser && resultUser.rows[0].fn_get_register != null) {
            if(resultUser.rows[0].fn_get_register[0].default_rol)
                default_rol = resultUser.rows[0].fn_get_register[0].default_rol
            req.session.language = resultUser.rows[0].fn_get_register[0].default_language
        }
        //Buscar image desktop por usuario y rol
        let pathImage = ''
        let rol = default_rol != '' ? default_rol : req.session.id_rol
        const paramsImage = ['cfgapl.imagedesktop',null,"WHERE id_users = '"+req.session.id_user+"' AND id_rol = '"+rol+"' "]
        const resultImage = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2,$3)', paramsImage)
        if (resultImage && resultImage.rows && resultImage.rows[0].fn_get_register)
            pathImage = resultImage.rows[0].fn_get_register[0].path
        //Registrar traza de login
        var paramsInsert = [], columnasInsertAux = [], valuesInsertAux = [];
        //columnas a insertar
        columnasInsertAux.push('id_capsules')
        columnasInsertAux.push('id_organizations')
        columnasInsertAux.push('id_user')
        columnasInsertAux.push('ip')
        columnasInsertAux.push('creator')
        //valores a insertar
        valuesInsertAux.push(" '" + req.session.id_capsules + "'")
        valuesInsertAux.push(" '" + req.session.id_organizations + "'")
        valuesInsertAux.push("'" + req.session.id_user + "'")
        valuesInsertAux.push(" '" + ip.address() + "'")
        valuesInsertAux.push("'" + req.session.id_user + "'")
        //Buscar seccion access
        const paramsAccess = ['cfgapl.sections',null,"WHERE namex = 'Sec_access' "]
        const resultAccess = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2,$3)', paramsAccess)
        let id_section = ''
        if (resultAccess && resultAccess.rows && resultAccess.rows[0].fn_get_register)
            id_section = resultAccess.rows[0].fn_get_register[0].id
        paramsInsert.push(id_section)
        paramsInsert.push(columnasInsertAux.join(','))
        paramsInsert.push(valuesInsertAux.join(','))
        paramsInsert.push(req.body.idpadreregistro && req.body.idpadreregistro !== '0' ? req.body.idpadreregistro : null)
        paramsInsert.push(req.body.idseccionpadre && req.body.idseccionpadre !== '0' ? req.body.idseccionpadre : null)
        paramsInsert.push(req.session.id_user)
        const resultInsert = await insertRegister(paramsInsert);
        
        res.json({'success': true, 'user': result.vals.id_user, 'rol': default_rol, 'language': req.session.language, 'dektop': pathImage})
    } else {
        res.json({'success': false})
    }
})

const insertRegister = async (params_insert) => {
    const query = "SELECT cfgapl.fn_insert_register($1,$2,$3,$4,$5,$6)"
    const result = await pool.executeQuery(query, params_insert)

    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_insert_register == null) {
        return []
    }

    return result.rows[0].fn_insert_register
}

module.exports = router