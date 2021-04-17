const pool = require('../connection/server-db')
const moment = require('moment')
const fs = require('fs')
const objCrudRegister = {}
const getForeignkey = async (req) => {
    const params = [req.query.idsection, req.query.idregistro, req.session.id_rol]
    const query = "SELECT cfgapl.fn_get_values_fk($1,$2,$3)"
    const result = await pool.executeQuery(query, params)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_get_values_fk == null) {
        return []
    }
    return result.rows[0].fn_get_values_fk
}

const insertRegister = async (req, objects) => {
    const params_insert = getParamsInsert(req)
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

const updateRegister = async (req) => {
    const params_insert = getParamsUpdate(req)
    const query = "SELECT cfgapl.fn_update_register($1,$2,$3,$4)"
    const result = await pool.executeQuery(query, params_insert)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_update_register == null) {
        return []
    }
    return result.rows[0].fn_update_register
}

const deleteRegister = async (req) => {
    const params_parse = JSON.parse(req.body.id);
    const ids = "{" + params_parse.join(',') + "}"
    const params_delete = [req.body.idsection, ids, req.session.id_user]
    //Si se elimina un botón, borrar el .js asociado
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
    const query = "SELECT cfgapl.fn_delete_register($1,$2,$3)"
    const result = await pool.executeQuery(query, params_delete)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_delete_register == null) {
        return []
    }

    return result.rows[0].fn_delete_register
}

const getParamsInsert = (req) => {
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
            } else if (item.tipo === 'date') {
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

    result.push(req.body.idsection)
    result.push(columnasInsertAux.join(','))
    result.push(valuesInsertAux.join(','))
    result.push(req.body.idpadreregistro && req.body.idpadreregistro !== '0' ? req.body.idpadreregistro : null)
    result.push(req.body.idseccionpadre && req.body.idseccionpadre !== '0' ? req.body.idseccionpadre : null)
    result.push(req.session.id_user)
    return result
}

const getParamsUpdate = (req) => {
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
            } else if (item.tipo === 'string') {
                valuesInsertAux.push(item.field + " = '" + item.valor + "'")
            } else if (item.tipo === 'boolean') {
                valor = item.valor ? 'true' : 'false';
                valuesInsertAux.push(item.field + " = " + valor)
            } else if (item.tipo === 'date' || item.tipo === 'timestamp'
                    || item.tipo === 'timestamp without time zone' || item.tipo === 'timestamp with time zone') {
                valuesInsertAux.push(item.field + " = '" + item.valor + "'")
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
    return result
}

const getRegister = async (req) => {
    const params = [req.query.idseccion, req.query.idproducto, req.query.idseccionpadre, req.session.id_rol]
    const query = "SELECT cfgapl.fn_get_registers($1,$2,$3,$4)"
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
objCrudRegister.getRegister = getRegister
module.exports = objCrudRegister