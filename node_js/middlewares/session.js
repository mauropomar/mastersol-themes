//Por estos middlewares siempre pasan todas las peticiones
module.exports = function (req, res, next) {
    if (!req.session.id_user) {
        res.redirect("/");
    } else {
        next();
    }
}