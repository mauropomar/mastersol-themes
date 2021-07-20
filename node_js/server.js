var express = require("express"),
    app = express(),
    router_app = require('./routes/routes_app'),
    router_login = require('./routes/route_login'),
    path = require("path"),
    BodyParser = require("body-parser"),
    session = require("express-session"),
    session_middlewares = require("./middlewares/session"),
    timeout = require('connect-timeout')
global.appRootApp = path.resolve(__dirname).replace('\\node_js', '\\');
global.appRootNodeJS = path.resolve(__dirname);

app.use(timeout(1000000));

app.use(session({
    secret: 'keyboard secret mastersol',
    //true: Se guarda de nuevo la session halla sido modificada o no en la petición
    //false: No se guarda de nuevo la session halla sido modificada o no en la petición
    resave: false,
    saveUninitialized: false,
}))

// Agregando los directorios de los cuales va obtener los estilos y css
//En este caso tome toda la raiz ya que el archivo "bootstrap.js" esta en la raiz
app.use('/', express.static(appRootApp + "/"));

//add body parser
app.use( BodyParser.json({limit: '700mb', type: 'application/json'}));
app.use(BodyParser.urlencoded({
    limit: '700mb',
    extended: true,
    parameterLimit:700000
}));

//add the middlewares
// app.use('/app', session_middlewares)
//add the router
app.use('/session', router_login);
app.use('/app', router_app);
app.listen(8080, () => {
    console.log("Servidor corriendo por el puerto 8080")
})