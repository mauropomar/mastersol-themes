const pool = require('../connection/server-db')
const moment = require('moment')
const fs = require('fs')
const objCrudRegister = {}
const getForeignkey = async (req) => {
    const params = [req.query.idsection, req.query.idregistro, req.session.id_rol, req.query.idpadreregistro && req.query.idpadreregistro !== '0' ? req.query.idpadreregistro : null]
    const query = "SELECT cfgapl.fn_get_values_fk($1,$2,$3,$4)"
    const result = await pool.executeQuery(query, params)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_get_values_fk == null) {
        return []
    }
    return result.rows[0].fn_get_values_fk
}

const getViews = async (req) => {
    const params = [req.query.idsection,req.session.id_user]
    const query = "SELECT cfgapl.fn_get_views($1,$2)"
    const result = await pool.executeQuery(query, params)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_get_views == null) {
        return []
    }
    return result.rows[0].fn_get_views
}

const insertRegister = async (req, objects) => {
    const params_insert = await getParamsInsert(req, objects)
    const query = "SELECT cfgapl.fn_insert_register($1,$2,$3,$4,$5,$6)"
    const result = await pool.executeQuery(query, params_insert)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_insert_register == null) {
        return []
    }

    if (req.body.section_checked === 'true' ||
        result.rows[0].fn_insert_register.name_table === 'capsules' ||
        result.rows[0].fn_insert_register.name_table === 'sections_buttons') {
        objects.sections.generateFilesBySection(req, result);
    }
    return result.rows[0].fn_insert_register
}

const updateRegister = async (req, objects) => {
    const params_insert = getParamsUpdate(req, objects)
    const query = "SELECT cfgapl.fn_update_register($1,$2,$3,$4,$5)"
    const result = await pool.executeQuery(query, params_insert)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_update_register == null) {
        return []
    }
    return result.rows[0].fn_update_register
}

const deleteRegister = async (req,idjson=true) => {
    let params_parse = ''
    let ids = ''
    if(idjson) {
        params_parse = JSON.parse(req.body.id);
        ids = "{" + params_parse.join(',') + "}"
    }
    else {
        ids = "{" + req.body.id + "}"
    }

    const params_delete = [req.body.idsection, ids, req.session.id_user, req.body.idpadreregistro && req.body.idpadreregistro !== '0' ? req.body.idpadreregistro : null]
    //Si se elimina un botón, borrar el .js asociado
    console.log(params_delete)
    const param_section = ['cfgapl.sections',req.body.idsection]
    const resultSeccion = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', param_section)
    if(resultSeccion && resultSeccion.rows[0].fn_get_register[0].namex == 'Sec_sections_buttons'){
        var idsEliminar = req.body.id
        idsEliminar = idsEliminar.replace('[', '')
        idsEliminar = idsEliminar.replace(']', '')
        idsEliminar = idsEliminar.replace('"', '')
        idsEliminar = idsEliminar.replace('"', '')
        arrEliminar = idsEliminar.split(',')
        for(i=0;i<arrEliminar.length;i++){
            const param_button = ['cfgapl.sections_buttons',arrEliminar[i]]
            const resultButton = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', param_button)
            if(resultButton) {
                let direccion = global.appRootApp + '\\capsules\\' + 'c_' + resultButton.rows[0].fn_get_register[0].id_capsules + '\\node_js\\buttons\\' + resultButton.rows[0].fn_get_register[0].js_name + '.js';
                fs.unlink(direccion, (err => {
                    if (err) console.log(err);
                    else {
                        console.log("Archivo borrado");
                    }
                }));
            }
        }
    }
    //-----Eliminar despues de actualizar modifier
    const query = "SELECT cfgapl.fn_delete_register($1,$2,$3,$4)"
    const result = await pool.executeQuery(query, params_delete)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_delete_register == null) {
        return []
    }

    return result.rows[0].fn_delete_register
}

const getParamsInsert = async (req, objects) => {
    var result = [], valor = "", columnasInsertAux = [], valuesInsertAux = [];
    const params_parse = JSON.parse(req.body.data);

    params_parse.forEach(function (item, index, arr) {
        if (item['field'] !== 'id') {
            columnasInsertAux.push(item['field'])
        }
        if (item.fk) {
            if (item.tipo === 'string') {
                valuesInsertAux.push(" '" + item.idvalor + "'")
            } else if (item.tipo === 'boolean') {
                valor = item.idvalor ? 'true' : 'false';
                valuesInsertAux.push(valor)
            } else if (item.tipo === 'array' && objects.enum_datatype.isTypeString(item.real_name_in)) {
                valuesInsertAux.push(" '{" + item.idvalor + "}'")
            } else if (item.tipo === 'array' && !objects.enum_datatype.isTypeString(item.real_name_in)) {
                valuesInsertAux.push(" {" + item.idvalor + "}")
            } else {
                valuesInsertAux.push(item.idvalor + ",")
            }
        } else if (!item.fk) {
            if (item.tipo === 'string') {
                valuesInsertAux.push(" '" + item.valor + "'")
            } else if (item.tipo === 'array' && objects.enum_datatype.isTypeString(item.real_name_in)) {
                valuesInsertAux.push(" '{" + item.valor + "}'")
            } else if (item.tipo === 'array' && !objects.enum_datatype.isTypeString(item.real_name_in)) {
                valuesInsertAux.push(" '{" + item.valor + "}'")
            } else if (item.tipo === 'string') {
                valuesInsertAux.push(" '" + item.valor + "'")
            } else if (item.tipo === 'boolean') {
                valor = item.valor ? 'true' : 'false';
                valuesInsertAux.push(valor)
            } else if (item.tipo === 'date' || item.tipo === 'datetime' || item.tipo === 'timestamp'
                || item.tipo === 'timestamp without time zone' || item.tipo === 'timestamp with time zone') {
                var date = moment(item.valor, "DD/MM/YYYY H:m:s").format('YYYY-MM-DD HH:mm:ss');
                valuesInsertAux.push("'" + date + "'")
            } else {
                valuesInsertAux.push("'" + item.valor + "'")
            }
        }
    })
    //Adjuntar a arreglos de columnas y valores el creator
    columnasInsertAux.push('creator')
    valuesInsertAux.push("'" + req.session.id_user + "'")
    //Si la tabla tiene id_capsules y hay registro padreo o seccion padre, insertar la capsula del padre
    let idpadre = ''
    let idcapsulepadre = ''
    let tablaPadre = ''
    let esquemaPadre = ''
    let flagPadre = false
    if(req.body.idpadreregistro && req.body.idpadreregistro !== '0') {
        idpadre = req.body.idpadreregistro
        //Buscar tabla correspondiente a este registro padre mediante la seccion padre, usando el campo namex
        const paramsSection = ['cfgapl.sections', req.body.idseccionpadre];
        const resultSection = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', paramsSection);
        if(resultSection && resultSection.rows && resultSection.rows.length > 0 && resultSection.rows[0].fn_get_register){
            let table = resultSection.rows[0].fn_get_register[0].namex
            tablaPadre = table.replace('Sec_','')
            //Buscar esquema mediante la tabla de la seccionpadre
            let idtablapadre = resultSection.rows[0].fn_get_register[0].id_tables
            const paramsTable = ['cfgapl.tables', idtablapadre];
            const resultTable = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', paramsTable);
            if (resultTable && resultTable.rows && resultTable.rows.length > 0 && resultTable.rows[0].fn_get_register)
                esquemaPadre = resultTable.rows[0].fn_get_register[0].n_schema
        }
    }
    else if(req.body.idseccionpadre && req.body.idseccionpadre !== '0') {
        flagPadre = true
        idpadre = req.body.idseccionpadre
    }
    if(idpadre !== "") {
        if(flagPadre) {
            const paramsPadre = ['cfgapl.sections', idpadre];
            const resultPadre = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', paramsPadre);
            if (resultPadre && resultPadre.rows && resultPadre.rows.length > 0 && resultPadre.rows[0].fn_get_register) {
                let id_table = resultPadre.rows[0].fn_get_register[0].id_tables
                const paramsTable = ['cfgapl.tables', id_table];
                const resultTable = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', paramsTable);
                if (resultTable && resultTable.rows && resultTable.rows.length > 0 && resultTable.rows[0].fn_get_register) {
                    const nameTable = resultTable.rows[0].fn_get_register[0].n_table
                    const nameSchema = resultTable.rows[0].fn_get_register[0].n_schema
                    const resultColumn = await pool.executeQuery("SELECT column_name FROM information_schema.columns " +
                        "WHERE table_schema = '" + nameSchema + "' AND table_name = '" + nameTable + "' AND column_name = 'id_capsules'");
                    if (resultColumn && resultColumn.rows && resultColumn.rows.length > 0) {
                        //La seccion tiene columna id_capsules y padre enviado, insertar la capsula del padre
                        idcapsulepadre = resultPadre.rows[0].fn_get_register[0].id_capsules
                    }
                }
            }
        }
        else{
            const paramsPadre = [esquemaPadre+'.'+tablaPadre, idpadre];
            const resultPadre = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', paramsPadre);
            if(resultPadre && resultPadre.rows && resultPadre.rows.length > 0 && resultPadre.rows[0].fn_get_register){
                if(resultPadre.rows[0].fn_get_register[0].id_capsules)
                    idcapsulepadre = resultPadre.rows[0].fn_get_register[0].id_capsules
            }
        }
        if(idcapsulepadre !== '' && !columnasInsertAux.includes('id_capsules')) {
            columnasInsertAux.push('id_capsules')
            valuesInsertAux.push("'" + idcapsulepadre + "'")
        }
    }

    result.push(req.body.idsection)
    result.push(columnasInsertAux.join(','))
    result.push(valuesInsertAux.join(','))
    result.push(req.body.idpadreregistro && req.body.idpadreregistro !== '0' ? req.body.idpadreregistro : null)
    result.push(req.body.idseccionpadre && req.body.idseccionpadre !== '0' ? req.body.idseccionpadre : null)
    result.push(req.session.id_user)
    return result
}

const getParamsUpdate = (req, objects) => {
    var result = [], valor = "", valuesInsertAux = [];
    const params_parse = JSON.parse(req.body.data);
    params_parse.forEach(function (item, index, arr) {
        if (item.fk) {
            if (item.tipo === 'string') {
                valuesInsertAux.push(item.field + " = '" + item.idvalor + "'")
            } else if (item.tipo === 'boolean') {
                valor = item.idvalor ? 'true' : 'false';
                valuesInsertAux.push(item.field + " = " + valor)
            } else if (item.tipo === 'array' && objects.enum_datatype.isTypeString(item.real_name_in)) {
                valuesInsertAux.push(item.field + " = '{" + item.idvalor + "}'")
            } else if (item.tipo === 'array' && !objects.enum_datatype.isTypeString(item.real_name_in)) {
                valuesInsertAux.push(item.field + " = {" + item.idvalor + "}")
            } else {
                valuesInsertAux.push(item.field + " = " + item.idvalor)
            }
        } else if (!item.fk) {
            if (item.tipo === 'string') {
                valuesInsertAux.push(item.field + " = '" + item.valor + "'")
            } else if (item.tipo === 'array' && objects.enum_datatype.isTypeString(item.real_name_in)) {
                valuesInsertAux.push(item.field + " = '{" + item.valor + "}'")
            } else if (item.tipo === 'array' && !objects.enum_datatype.isTypeString(item.real_name_in)) {
                valuesInsertAux.push(item.field + " = {" + item.valor + "}")
            } else if (item.tipo === 'string' || item.tipo === 'bytea') {
                valuesInsertAux.push(item.field + " = '" + item.valor + "'")
            } else if (item.tipo === 'boolean') {
                valor = item.valor ? 'true' : 'false';
                valuesInsertAux.push(item.field + " = " + valor)
            } else if (item.tipo === 'date' || item.tipo === 'datetime' || item.tipo === 'timestamp'
                    || item.tipo === 'timestamp without time zone' || item.tipo === 'timestamp with time zone') {
                var date = moment(item.valor, "DD/MM/YYYY H:m:s").format('YYYY-MM-DD HH:mm:ss');
                valuesInsertAux.push(item.field + " = '" + date + "'")
            } else {
                valuesInsertAux.push(item.field + " = " + item.valor)
            }
        }
    })
    //Adjuntar el mofifier
    valuesInsertAux.push("modifier = '" + req.session.id_user + "'" )

    result.push(req.body.idsection)
    result.push(valuesInsertAux.join(','))
    result.push(req.body.idregistro && req.body.idregistro !== '0' ? req.body.idregistro : null)
    result.push(req.session.id_user)
    result.push(req.body.idpadreregistro && req.body.idpadreregistro !== '0' ? req.body.idpadreregistro : null)
    return result
}

const getRegister = async (req) => {
    const params = [req.query.idseccion, req.query.idproducto, req.query.idseccionpadre,
         req.session.id_rol, req.query.start ? req.query.start : 0, req.query.limit ? req.query.limit : 50]
    const query = "SELECT cfgapl.fn_get_registers($1,$2,$3,$4,$5,$6)"
    const result = await pool.executeQuery(query, params)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_get_registers == null) {
        return []
    }
    return result.rows[0].fn_get_registers
}


objCrudRegister.insertRegister = insertRegister
objCrudRegister.updateRegister = updateRegister
objCrudRegister.deleteRegister = deleteRegister
objCrudRegister.getForeignkey = getForeignkey
objCrudRegister.getViews = getViews
objCrudRegister.getRegister = getRegister
module.exports = objCrudRegister