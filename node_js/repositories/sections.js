const pool = require('../connection/server-db')
const fs = require('fs')
objSections = {}
const getSections = async (req) => {
    const params = [
        req.body.sectionId,
        req.session.id_rol,
        req.body.start ? req.body.start : 0,
        req.body.limit ? req.body.limit : 1000,
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
    params.time_event = datos_inserted.name_table == 'time_event_functions' ? true : false;
    params.id_section = datos_inserted.id_section;
    params.id = datos_inserted.id;
    params.name_section = datos_inserted.name_section;
    params.id_capsules = datos_inserted.id_capsules;
    params.name_button = datos_inserted.namex.toLowerCase();
    if (params.time_event !== false) {
        params.identifier = datos_inserted.identifier;
    }
    console.log(datos_inserted.id_capsules)
    console.log(datos_inserted.id_capsules.replace(/-/g, ''))
    params.dirRaizCapsule = global.appRootApp + '\\Capsules\\';
    params.dirCapsule = params.dirRaizCapsule + datos_inserted.id_capsules.replace(/-/g, '');
    params.dirJs = params.dirCapsule + '\\JS\\';
    params.dirImages = params.dirCapsule + '\\Images\\';
    params.nameFileJS = params.time_event === false ? 'btn_' + params.id_section.replace(/-/g, '_') + '.js' : 'te_' + params.identifier + '.js'
    params.nameFunc = params.time_event === false ? 'btn_' + params.name_button.toLowerCase() : 'te_' + params.identifier
    params.dirFileJS = params.dirJs + params.nameFileJS

    createDirectory(req, params);
}

const createDirectory = (req, params) => {
    //Creando directorios
    fs.mkdir(params.dirCapsule, {recursive: true}, (err) => {
        if (!err) {
            if (!err) {
                //Creando directorio de JS en la capsula y seccion correspondiente
                fs.mkdir(params.dirJs, {recursive: true}, (err) => {
                    if (!err) {
                        createFileJs(req, params)
                    }
                });

                //Creando directorio de Images en la capsula y seccion correspondiente
                fs.mkdir(params.dirImages, {recursive: true}, (err) => {
                    if (err) {
                        return err;
                    }
                });
            }
        }
    });
}

const createFileJs = (req, params) => {
    const salto_linea = "\n\n"
    var fileJs = "",
        comentario_file = "",
        function_file = ""
    const body_function = " const params = [] \n const query = \" \" \n const result = await pool.executeQuery(query, params)"
    if (params.time_event === false) {
        comentario_file = salto_linea + "/*Start " + params.nameFunc + "\n * Debe retornarse: \n* 0 - Sin acción \n* 1 - Refrescar Tupla \n* 2 - Refrescar Sección \n* Y un texto\n */" + salto_linea;
        function_file = comentario_file + "const " + params.nameFunc + " = async (id_section,id_register) => { " + salto_linea + body_function + salto_linea + " return 0;" + salto_linea + "} " + salto_linea
    } else {
        comentario_file = salto_linea + "/*Start " + params.nameFunc + "\n * Debe retornarse: \n* 0 - Sin acción */" + salto_linea;
        function_file = comentario_file + "function " + params.nameFunc + "() { " + salto_linea + body_function + salto_linea + " return 0;" + salto_linea + "} " + salto_linea
    }

    const export_func_file = " module.exports." + params.nameFunc + " = " + params.nameFunc
    if (!fs.existsSync(params.dirFileJS)) {
        const require_file = " const pool = require('../../../node_js/connection/server-db') "
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