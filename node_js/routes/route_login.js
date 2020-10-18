var express = require("express")
var router = express.Router()
const objects = require('../modules')
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
        res.json({'success': true, 'user': result.vals.id_user})
    } else {
        res.json({'success': false})
    }
})

module.exports = router