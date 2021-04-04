const pool = require('../connection/server-db')
const moment = require('moment')
const objFilter = {}
const getFiltersOperators = async (req) => {
    const params = [req.query.idsection]
    const query = "SELECT cfgapl.fn_get_filters_operators($1)"
    const result = await pool.executeQuery(query, params)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_get_filters_operators == null) {
        return []
    }
    return result.rows[0].fn_get_filters_operators
}

const getFunctionsResume = async (req) => {
    const params = [req.query.idsection]
    const query = "SELECT cfgapl.fn_get_functions_resume($1)"
    const result = await pool.executeQuery(query, params)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_get_functions_resume == null) {
        return []
    }
    return result.rows[0].fn_get_functions_resume
}

const getResultFiltersOperators = async (req, objects) => {
    const params_filter = getParamsResultFilter(req, objects)
    const query = "SELECT cfgapl.fn_get_result_filter_operators($1,$2,$3,$4)"
    const result = await pool.executeQuery(query, params_filter)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_get_result_filter_operators == null) {
        return []
    }
    return result.rows[0].fn_get_result_filter_operators
}

const getResultFiltersFunctions = async (req, objects) => {
    const params_parse = JSON.parse(req.body.data);
    const params_filter_fn = getParamsResultFunctions(req, objects, params_parse)
    const query = "SELECT cfgapl.fn_get_result_filter_functions($1,$2,$3,$4)"
    const result = await pool.executeQuery(query, params_filter_fn)

    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_get_result_filter_functions == null) {
        return []
    }

    const resultAux = result.rows[0].fn_get_result_filter_functions
    var resultF = [], valor;
    params_parse.forEach(function (item, index, arr) {
        valor = resultAux[index]
        if (resultAux[index].indexOf('-') !== -1) { //if date
            valor = moment(resultAux[index], "YYYY-MM-DD' H:m:s").format('DD/MM/YYYY H:m:s')
        }
        resultF.push({
            'dataIndex': item.nombrecampo,
            'funcion': item.nombrefuncion,
            'valor': valor
        })
    })
    return {'success': true, 'datos': resultF}
}

function getParamsResultFilter(req, objects) {
    const params_parse = JSON.parse(req.body.data);
    var where = [], result = [], operador = "", date_start = "", date_end = "", valor = false;

    params_parse.forEach(function (item, index, arr) {
        operador = "";
        date_start = "";
        date_end = "";
        valor = false;
        operador = objects.utiles.findByElementInArray(item.operadores, item.idoperador)
        if (item.fk) {
            if (operador.nombre === 'contiene' && item.real_name_in.lastIndexOf('uuid') !== -1) {
                where.push(' dat.' + item.nombrecampo + " = " + "'" + item.idvalor + "'");
            } else if (item.tipo === 'string' && operador.nombre === 'contiene') {
                where.push(' dat.' + item.nombrecampo + " ILIKE '%" + item.idvalor.replace(/\s/g, "%") + "%'");
            }
        } else {
            if (item.cantparam === 2) {
                if (item.tipo === 'date' && operador.nombre === 'entre' && item.valor1 && item.valor2) {
                    date_start = moment(item.valor1, "DD/MM/YYYY H:m:s").format('YYYY-MM-DD') + ' 00:00:00'
                    date_end = moment(item.valor2, "DD/MM/YYYY H:m:s").format('YYYY-MM-DD') + ' 23:59:59'
                    where.push(' dat.' + item.nombrecampo + " BETWEEN '" + date_start + "' AND " + "'" + date_end + "'");
                }
            } else {
                if (operador.nombre === 'contiene' && item.real_name_in.lastIndexOf('uuid') !== -1) {
                    where.push(' dat.' + item.nombrecampo + " = '" + item.idvalor + "'");
                } else if (item.tipo === 'string' && operador.nombre === 'contiene') {
                    where.push(' dat.' + item.nombrecampo + " ILIKE '%" + item.valor1.replace(/\s/g, "%") + "%'");
                } else if (item.tipo === 'boolean' && operador.nombre === '=') {
                    valor = item.valor1 ? 'true' : 'false';
                    where.push(' dat.' + item.nombrecampo + " = " + valor);
                } else if (item.tipo === 'number' && operador.nombre === '=') {
                    where.push(' dat.' + item.nombrecampo + " = " + item.valor1);
                } else if (item.tipo === 'number' && operador.nombre === '>') {
                    where.push(' dat.' + item.nombrecampo + " > " + item.valor1);
                } else if (item.tipo === 'number' && operador.nombre === '<') {
                    where.push(' dat.' + item.nombrecampo + " < " + item.valor1);
                } else if (item.tipo === 'date' && operador.nombre === '=') {
                    date_start = moment(item.valor1, "DD/MM/YYYY H:m:s").format('YYYY-MM-DD')
                    where.push(item.nombrecampo + " ='" + date_start + "'");
                } else if (item.tipo === 'date' && operador.nombre === '>') {
                    date_start = moment(item.valor1, "DD/MM/YYYY H:m:s").format('YYYY-MM-DD')
                    where.push(' dat.' + item.nombrecampo + " > '" + date_start + "'");
                } else if (item.tipo === 'date' && operador.nombre === '<') {
                    date_start = moment(item.valor1, "DD/MM/YYYY H:m:s").format('YYYY-MM-DD')
                    where.push(' dat.' + item.nombrecampo + " < '" + date_start + "'");
                }
            }
        }
    })
    result.push(req.body.idsection)
    result.push(req.session.id_rol)
    result.push(" WHERE " + where.join(" AND "))
    result.push(req.session.id_user)
    return result
}

function getParamsResultFunctions(req, objects, params_parse) {
    var result = [], fields = [], functions = []
    params_parse.forEach(function (item, index, arr) {
        fields.push(item.nombrecampo);
        functions.push(item.nombrefuncion);
    })

    result.push(req.body.idsection)
    result.push(req.session.id_rol)
    result.push("{" + fields.join(',') + "}")
    result.push("{" + functions.join(',') + "}")
    return result
}


objFilter.getFunctionsResume = getFunctionsResume
objFilter.getFiltersOperators = getFiltersOperators
objFilter.getResultFiltersOperators = getResultFiltersOperators
objFilter.getResultFiltersFunctions = getResultFiltersFunctions
module.exports = objFilter