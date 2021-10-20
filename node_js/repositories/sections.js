const pool = require('../connection/server-db')
const fs = require('fs')
objSections = {}
const getSections = async (req) => {
    const params = [
        req.body.sectionId,
        req.session.id_rol,
        req.body.start ? req.body.start : 0,
        req.body.limit ? req.body.limit : 50,
        req.session.id_user
    ]
    const query = "SELECT cfgapl.fn_get_sections($1,$2,$3,$4,$5)"
    const result = await pool.executeQuery(query, params)

    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_get_sections == null) {
        return []
    }
    return result.rows[0].fn_get_sections
}

const generateFilesBySection = (req, result) => {
    var params = {}
    var datos_inserted = result.rows[0].fn_insert_register
    params.is_capsule = datos_inserted.name_table == 'capsules' ? true : false;
    params.id_section = datos_inserted.id_section;
    params.id = datos_inserted.id;
    params.name_section = datos_inserted.name_section;
    params.id_capsules = datos_inserted.id_capsules;
    params.js_name = datos_inserted.js_name;
    params.dirRaizCapsule = global.appRootApp + '\\capsules\\';
    //Estructura de directorios
    //1er nivel
    if(params.is_capsule)
        params.dirCapsule = params.dirRaizCapsule + 'c_' + params.id;
    else
        params.dirCapsule = params.dirRaizCapsule + 'c_' + params.id_capsules;
    //2do nivel
    params.dirHtml = params.dirCapsule + '\\html\\';
    params.dirNodeJs = params.dirCapsule + '\\node_js\\';
    params.dirSql = params.dirCapsule + '\\sql\\';
    params.dirScriptsDb = params.dirCapsule + '\\scripts_db\\';
    //3er nivel
    params.dirAssets = params.dirHtml + '\\assets\\';
    params.dirScript = params.dirHtml + '\\script\\';
    params.dirButtons = params.dirNodeJs + '\\buttons\\';
    params.dirFunctions = params.dirNodeJs + '\\functions\\';
    params.dirFunctionsSql = params.dirSql + '\\functions\\';
    params.dirViews= params.dirSql + '\\views\\';
    params.dirTables= params.dirSql + '\\tables\\';
    //4to nivel
    params.dirCss = params.dirAssets + '\\css\\';
    params.dirIcon = params.dirAssets + '\\icon\\';
    params.dirController = params.dirScript + '\\controller\\';
    params.dirStore = params.dirScript + '\\store\\';
    params.dirModel = params.dirScript + '\\model\\';
    params.dirViewScript = params.dirScript + '\\view\\';


    params.nameFileJS = params.is_capsule === false ? params.js_name + '.js' : 'te_' + params.identifier + '.js'
    params.nameFunc = params.is_capsule === false ? params.js_name : 'te_' + params.identifier
    params.dirFileJS = params.dirButtons + params.nameFileJS

    params.dirFileFirstSql = params.dirScriptsDb + 'first.sql'
    params.dirFileLastSql = params.dirScriptsDb + 'last.sql'

    createDirectory(req, params);
}

const createDirectory = (req, params) => {
    //Creando directorios
    fs.mkdir(params.dirCapsule, {recursive: true}, (err) => {
        if (!err) {
            //Creando directorios
            fs.mkdir(params.dirHtml, {recursive: true}, (err) => {
                if (err) {
                    return err;
                }
            });
            fs.mkdir(params.dirNodeJs, {recursive: true}, (err) => {
                if (err) {
                    return err;
                }
            });
            fs.mkdir(params.dirSql, {recursive: true}, (err) => {
                if (err) {
                    return err;
                }
            });
            fs.mkdir(params.dirScriptsDb, {recursive: true}, (err) => {
                if (!err) {
                    if(params.is_capsule === true)
                        createFileSql(req, params)
                }
            });
            fs.mkdir(params.dirAssets, {recursive: true}, (err) => {
                if (err) {
                    return err;
                }
            });
            fs.mkdir(params.dirScript, {recursive: true}, (err) => {
                if (err) {
                    return err;
                }
            });
            fs.mkdir(params.dirButtons, {recursive: true}, (err) => {
                if (!err) {
                    if(params.is_capsule === false)
                        createFileJs(req, params)
                }
            });
            fs.mkdir(params.dirFunctions, {recursive: true}, (err) => {
                if (err) {
                    return err;
                }
            });
            fs.mkdir(params.dirFunctionsSql, {recursive: true}, (err) => {
                if (err) {
                    return err;
                }
            });
            fs.mkdir(params.dirViews, {recursive: true}, (err) => {
                if (err) {
                    return err;
                }
            });
            fs.mkdir(params.dirTables, {recursive: true}, (err) => {
                if (err) {
                    return err;
                }
            });
            fs.mkdir(params.dirCss, {recursive: true}, (err) => {
                if (err) {
                    return err;
                }
            });
            fs.mkdir(params.dirIcon, {recursive: true}, (err) => {
                if (err) {
                    return err;
                }
            });
            fs.mkdir(params.dirController, {recursive: true}, (err) => {
                if (err) {
                    return err;
                }
            });
            fs.mkdir(params.dirStore, {recursive: true}, (err) => {
                if (err) {
                    return err;
                }
            });
            fs.mkdir(params.dirModel, {recursive: true}, (err) => {
                if (err) {
                    return err;
                }
            });
            fs.mkdir(params.dirViewScript, {recursive: true}, (err) => {
                if (err) {
                    return err;
                }
            });

        }
    });
}

const createFileJs = (req, params) => {
    const salto_linea = "\n\n"
    var fileJs = "",
        comentario_file = "",
        function_file = ""
    const body_function = " const params = [] \n const query = \"\" \n const result = await pool.executeQuery(query, params)"
    if (params.is_capsule === false) {
        comentario_file = salto_linea + "/*Start " + params.nameFunc + "\n * Debe retornarse: \n* type:0 - Sin acción \n* type:1 - value es una cadena de caracteres \n* type:2 - value es 0 (Refrescar Sección) \n* type:3 value devuelve un json de un registro de la sección activa \n* type:4 value devuelve un json de todos los registros de la sección \n* type:5 print report \n*/" + salto_linea;
        function_file = comentario_file + "const " + params.nameFunc + " = async (id_section,id_register,id_button,id_user,id_rol,report_name='') => { " + salto_linea + body_function + salto_linea + " return {'btn':id_button, type: 0, value: '', msg: ''};" + salto_linea + "} " + salto_linea
    } else {
        comentario_file = salto_linea + "/*Start " + params.nameFunc + "\n * Debe retornarse: \n* type:0 - Sin acción */" + salto_linea;
        function_file = comentario_file + "function " + params.nameFunc + "() { " + salto_linea + body_function + salto_linea + " return {'btn':id_button, type: 0, value: '', msg: ''};" + salto_linea + "} " + salto_linea
    }

    const export_func_file = " module.exports.function = " + params.nameFunc
    if (!fs.existsSync(params.dirFileJS)) {
        const require_file = " const pool = require('../../../../node_js/connection/server-db') "
        fileJs = fs.createWriteStream(params.dirFileJS, {
            flags: 'a' // conservar los archivos antiguos
        })
        fileJs.write(require_file)
        fileJs.write(function_file + export_func_file)
    } else {
        fileJs = fs.createWriteStream(params.dirFileJS, {
            flags: 'a' // conservar los archivos antiguos
        })
        fileJs.write(function_file + export_func_file)
    }
}

const createFileSql = (req, params) => {
    var fileFirstSql,fileLastSql
    let comentario_first = "--Escriba aqui los scripts necesarios para ejecutar antes de importar la cápsula"
    let comentario_last = "--Escriba aqui los scripts necesarios para ejecutar después de importar la cápsula"
    if (!fs.existsSync(params.dirFileFirstSql)) {
        fileFirstSql = fs.createWriteStream(params.dirFileFirstSql, {
            flags: 'a' // conservar los archivos antiguos
        })
        fileFirstSql.write(comentario_first)
    }
    if (!fs.existsSync(params.dirFileFirstSql)) {
        fileLastSql = fs.createWriteStream(params.dirFileLastSql, {
            flags: 'a' // conservar los archivos antiguos
        })
        fileLastSql.write(comentario_last)
    }
}

const getCapsuleSection = async (req) => {
    var capsule_name = req.query.url.split('/')[1] + '-'
    const params = [
        capsule_name,
        req.query.idsection
    ]

    const query = "SELECT cfgapl.fn_get_capsule_section($1,$2)"
    const result = await pool.executeQuery(query, params)

    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_get_capsule_section == null) {
        return []
    }
    return result.rows[0].fn_get_capsule_section
}

objSections.getSections = getSections
objSections.generateFilesBySection = generateFilesBySection
objSections.getCapsuleSection = getCapsuleSection
module.exports = objSections