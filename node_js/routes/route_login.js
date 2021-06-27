var express = require("express")
var router = express.Router()
const objects = require('../modules')
const pool = require('../connection/server-db')
var app = express()

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
        //Buscar lenguaje y rol por defecto de este user
        const paramsUser = ['security.users', req.session.id_user];
        const resultUser= await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', paramsUser);
        if(resultUser && resultUser.rows[0].fn_get_register != null) {
            req.session.id_rol = resultUser.rows[0].fn_get_register[0].default_rol
            req.session.language = resultUser.rows[0].fn_get_register[0].default_language
        }

        res.json({'success': true, 'user': result.vals.id_user, 'rol': req.session.id_rol, 'language': req.session.language})
    } else {
        res.json({'success': false})
    }
})

module.exports = router