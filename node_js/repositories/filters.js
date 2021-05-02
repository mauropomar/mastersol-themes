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
    //Si hay totales, invocar a getTotalsFilterFunction para traerlos
    const parse_totales = JSON.parse(req.body.totales);
    var result_totals = [];
    var result_datos = [];
    const params_filter = getParamsResultFilter(req, objects)
    const query = "SELECT cfgapl.fn_get_result_filter_operators($1,$2,$3,$4)"
    const result_filter = await pool.executeQuery(query, params_filter)
    if (result_filter.rows[0].fn_get_result_filter_operators != null) {
        result_datos  = result_filter.rows[0].fn_get_result_filter_operators
    }

    if (parse_totales.length !== 0) {
        result_totals = await getTotalsFilterFunction(req.body.data, req.body.totales, objects, req)
    }

    return {'success': true, 'datos': result_datos, 'totales': result_totals}
}

const getResultFiltersFunctions = async (req, objects) => {
    const params_parse_data = JSON.parse(req.body.data);
    const params_parse_filtros = JSON.parse(req.body.filtros);
    var resultF = [], valor;
    const result = [];
    if(params_parse_data.length > 0) {
        const params_filter_fn = getParamsResultFunctions(req, objects, params_parse_data, params_parse_filtros)
        const query = "SELECT cfgapl.fn_get_result_filter_functions($1,$2,$3,$4,$5)"
        const result = await pool.executeQuery(query, params_filter_fn)

        if (result.success === false) {
            return result
        } else if (result.rows[0].fn_get_result_filter_functions == null) {
            return []
        }
        const resultAux = result.rows[0].fn_get_result_filter_functions

        params_parse_data.forEach(function (item, index, arr) {
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
    }

    return {'success': true, 'datos': resultF}
}

const getTotalsFilterFunction = async (filtros, totales, objects, req) => {
    const params_parse_data = JSON.parse(totales);
    const params_parse_filtros = JSON.parse(filtros);

    const params_filter_fn = getParamsResultFunctions(req, objects, params_parse_data, params_parse_filtros)
    const query = "SELECT cfgapl.fn_get_result_filter_functions($1,$2,$3,$4,$5)"
    const result = await pool.executeQuery(query, params_filter_fn);

    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_get_result_filter_functions == null) {
        return []
    }

    const resultAux = result.rows[0].fn_get_result_filter_functions
    var resultF = [], valor;
    params_parse_data.forEach(function (item, index, arr) {
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
                //Formatear el where para cuando se seleccione más de un valor tipo uuid
                let arrvalores = item.idvalor.split(',');
                if(arrvalores.length === 1)
                    where.push(' dat.' + item.nombrecampo + " = " + "'" + item.idvalor + "'");
                else{
                    let cadenaWhere = '(';
                    let largo = arrvalores.length;
                    for (i=0;i<largo;i++) {
                        cadenaWhere += ' dat.' + item.nombrecampo + " = " + "'" + arrvalores[i] + "'";
                        if(i < largo - 1)
                            cadenaWhere += ' OR ';
                    }
                    cadenaWhere += ')';
                    where.push(cadenaWhere);
                }
            } else if (item.tipo === 'string' && operador.nombre === 'contiene') {
                where.push(' dat.' + item.nombrecampo + " ILIKE '%" + item.idvalor.replace(/\s/g, "%") + "%'");
            }
            else if (item.tipo === 'string' && operador.nombre === 'no contiene') {
                where.push(' dat.' + item.nombrecampo + " NOT ILIKE '%" + item.idvalor.replace(/\s/g, "%") + "%'");
            }
        } else {
            if (item.cantparam === 2) {
                if ((item.tipo === 'date' || item.tipo === 'datetime' || item.tipo === 'timestamp'
                        || item.tipo === 'timestamp without time zone' || item.tipo === 'timestamp with time zone') 
                    && operador.nombre === 'entre' && item.valor1 && item.valor2) {
                    date_start = moment(item.valor1, "DD/MM/YYYY H:m:s").format('YYYY-MM-DD') + ' 00:00:00'
                    date_end = moment(item.valor2, "DD/MM/YYYY H:m:s").format('YYYY-MM-DD') + ' 23:59:59'
                    where.push(' dat.' + item.nombrecampo + " BETWEEN '" + date_start + "' AND " + "'" + date_end + "'");
                }
                else if ((item.tipo === 'date' || item.tipo === 'datetime' || item.tipo === 'timestamp'
                    || item.tipo === 'timestamp without time zone' || item.tipo === 'timestamp with time zone')
                    && operador.nombre === 'no entre' && item.valor1 && item.valor2) {
                    date_start = moment(item.valor1, "DD/MM/YYYY H:m:s").format('YYYY-MM-DD') + ' 00:00:00'
                    date_end = moment(item.valor2, "DD/MM/YYYY H:m:s").format('YYYY-MM-DD') + ' 23:59:59'
                    where.push(' dat.' + item.nombrecampo + " NOT BETWEEN '" + date_start + "' AND " + "'" + date_end + "'");
                }
                else if (item.tipo === 'number' && operador.nombre === 'entre' && item.valor1 && item.valor2) {
                    where.push(' dat.' + item.nombrecampo + " BETWEEN " + item.valor1 + " AND " + item.valor2);
                }
                else if (item.tipo === 'number' && operador.nombre === 'no entre' && item.valor1 && item.valor2) {
                    where.push(' dat.' + item.nombrecampo + " NOT BETWEEN " + item.valor1 + " AND " + item.valor2);
                }
            } else {
                if (operador.nombre === 'contiene' && item.real_name_in.lastIndexOf('uuid') !== -1) {
                    where.push(' dat.' + item.nombrecampo + " = '" + item.idvalor + "'");
                } else if (item.tipo === 'string' && operador.nombre === 'contiene') {
                    where.push(' dat.' + item.nombrecampo + " ILIKE '%" + item.valor1.replace(/\s/g, "%") + "%'");
                } else if (item.tipo === 'string' && operador.nombre === 'no contiene') {
                    where.push(' dat.' + item.nombrecampo + " NOT ILIKE '%" + item.valor1.replace(/\s/g, "%") + "%'");
                } else if (item.tipo === 'boolean' && operador.nombre === '=') {
                    valor = item.valor1 ? 'true' : 'false';
                    where.push(' dat.' + item.nombrecampo + " = " + valor);
                } else if (item.tipo === 'number' && operador.nombre === '=' && item.valor1) {
                    where.push(' dat.' + item.nombrecampo + " = " + item.valor1);
                } else if (item.tipo === 'number' && operador.nombre === '>' && item.valor1) {
                    where.push(' dat.' + item.nombrecampo + " > " + item.valor1);
                } else if (item.tipo === 'number' && operador.nombre === '<' && item.valor1) {
                    where.push(' dat.' + item.nombrecampo + " < " + item.valor1);
                } else if (item.tipo === 'number' && operador.nombre === '<>' && item.valor1) {
                    where.push(' dat.' + item.nombrecampo + " <> " + item.valor1);
                } else if (item.tipo === 'number' && operador.nombre === '>=' && item.valor1) {
                    where.push(' dat.' + item.nombrecampo + " >= " + item.valor1);
                } else if (item.tipo === 'number' && operador.nombre === '<=' && item.valor1) {
                    where.push(' dat.' + item.nombrecampo + " <= " + item.valor1);
                } else if ((item.tipo === 'date' || item.tipo === 'datetime' || item.tipo === 'timestamp'
                    || item.tipo === 'timestamp without time zone' || item.tipo === 'timestamp with time zone') 
                    && operador.nombre === '=') {
                    date_start = moment(item.valor1, "DD/MM/YYYY H:m:s").format('YYYY-MM-DD')
                    where.push(item.nombrecampo + " ='" + date_start + "'");
                } else if ((item.tipo === 'date' || item.tipo === 'datetime' || item.tipo === 'timestamp'
                    || item.tipo === 'timestamp without time zone' || item.tipo === 'timestamp with time zone') 
                    && operador.nombre === '>') {
                    date_start = moment(item.valor1, "DD/MM/YYYY H:m:s").format('YYYY-MM-DD')
                    where.push(' dat.' + item.nombrecampo + " > '" + date_start + "'");
                } else if ((item.tipo === 'date' || item.tipo === 'datetime' || item.tipo === 'timestamp'
                    || item.tipo === 'timestamp without time zone' || item.tipo === 'timestamp with time zone') 
                    && operador.nombre === '<') {
                    date_start = moment(item.valor1, "DD/MM/YYYY H:m:s").format('YYYY-MM-DD')
                    where.push(' dat.' + item.nombrecampo + " < '" + date_start + "'");
                }
                else if ((item.tipo === 'date' || item.tipo === 'datetime' || item.tipo === 'timestamp'
                    || item.tipo === 'timestamp without time zone' || item.tipo === 'timestamp with time zone')
                    && operador.nombre === '<>') {
                    date_start = moment(item.valor1, "DD/MM/YYYY H:m:s").format('YYYY-MM-DD')
                    where.push(' dat.' + item.nombrecampo + " <> '" + date_start + "'");
                }
                else if ((item.tipo === 'date' || item.tipo === 'datetime' || item.tipo === 'timestamp'
                    || item.tipo === 'timestamp without time zone' || item.tipo === 'timestamp with time zone')
                    && operador.nombre === '>=') {
                    date_start = moment(item.valor1, "DD/MM/YYYY H:m:s").format('YYYY-MM-DD')
                    where.push(' dat.' + item.nombrecampo + " >= '" + date_start + "'");
                }
                else if ((item.tipo === 'date' || item.tipo === 'datetime' || item.tipo === 'timestamp'
                    || item.tipo === 'timestamp without time zone' || item.tipo === 'timestamp with time zone')
                    && operador.nombre === '<=') {
                    date_start = moment(item.valor1, "DD/MM/YYYY H:m:s").format('YYYY-MM-DD')
                    where.push(' dat.' + item.nombrecampo + " <= '" + date_start + "'");
                }
            }
        }
    })

    result.push(req.body.idsection)
    result.push(req.session.id_rol)
    if(where.length !== 0)
        where = " WHERE " + where.join(" AND ")
    else
        where = "";
    result.push(where)
    result.push(req.session.id_user)
    return result
}

function getParamsResultFunctions(req, objects, params_parse_data, params_parse_filtros) {
    var result = [], fields = [], functions = [],
    where = [], operador = "", date_start = "", date_end = "", valor = false;
    params_parse_data.forEach(function (item, index, arr) {
        fields.push(item.nombrecampo);
        functions.push(item.nombrefuncion);
    })

    params_parse_filtros.forEach(function (item, index, arr) {
        operador = "";
        date_start = "";
        date_end = "";
        valor = false;
        operador = objects.utiles.findByElementInArray(item.operadores, item.idoperador)
        if (item.fk) {
            if (operador.nombre === 'contiene' && item.real_name_in.lastIndexOf('uuid') !== -1) {
                //Formatear el where para cuando se seleccione más de un valor tipo uuid
                let arrvalores = item.idvalor.split(',');
                if(arrvalores.length === 1)
                    where.push(' dat.' + item.nombrecampo + " = " + "'" + item.idvalor + "'");
                else{
                    let cadenaWhere = '(';
                    let largo = arrvalores.length;
                    for (i=0;i<largo;i++) {
                        cadenaWhere += ' dat.' + item.nombrecampo + " = " + "'" + arrvalores[i] + "'";
                        if(i < largo - 1)
                            cadenaWhere += ' OR ';
                    }
                    cadenaWhere += ')';
                    where.push(cadenaWhere);
                }
            } else if (item.tipo === 'string' && operador.nombre === 'contiene') {
                where.push(' dat.' + item.nombrecampo + " ILIKE '%" + item.idvalor.replace(/\s/g, "%") + "%'");
            }
            else if (item.tipo === 'string' && operador.nombre === 'no contiene') {
                where.push(' dat.' + item.nombrecampo + " NOT ILIKE '%" + item.idvalor.replace(/\s/g, "%") + "%'");
            }
        } else {
            if (item.cantparam === 2) {
                if ((item.tipo === 'date' || item.tipo === 'datetime' || item.tipo === 'timestamp'
                    || item.tipo === 'timestamp without time zone' || item.tipo === 'timestamp with time zone') 
                    && operador.nombre === 'entre' && item.valor1 && item.valor2) {
                    date_start = moment(item.valor1, "DD/MM/YYYY H:m:s").format('YYYY-MM-DD') + ' 00:00:00'
                    date_end = moment(item.valor2, "DD/MM/YYYY H:m:s").format('YYYY-MM-DD') + ' 23:59:59'
                    where.push(' dat.' + item.nombrecampo + " BETWEEN '" + date_start + "' AND " + "'" + date_end + "'");
                }
                else if ((item.tipo === 'date' || item.tipo === 'datetime' || item.tipo === 'timestamp'
                    || item.tipo === 'timestamp without time zone' || item.tipo === 'timestamp with time zone')
                    && operador.nombre === 'no entre' && item.valor1 && item.valor2) {
                    date_start = moment(item.valor1, "DD/MM/YYYY H:m:s").format('YYYY-MM-DD') + ' 00:00:00'
                    date_end = moment(item.valor2, "DD/MM/YYYY H:m:s").format('YYYY-MM-DD') + ' 23:59:59'
                    where.push(' dat.' + item.nombrecampo + " NOT BETWEEN '" + date_start + "' AND " + "'" + date_end + "'");
                }
                else if (item.tipo === 'number' && operador.nombre === 'entre' && item.valor1 && item.valor2) {
                    where.push(' dat.' + item.nombrecampo + " BETWEEN " + item.valor1 + " AND " + item.valor2);
                }
                else if (item.tipo === 'number' && operador.nombre === 'no entre' && item.valor1 && item.valor2) {
                    where.push(' dat.' + item.nombrecampo + " NOT BETWEEN " + item.valor1 + " AND " + item.valor2);
                }
            } else {
                if (operador.nombre === 'contiene' && item.real_name_in.lastIndexOf('uuid') !== -1) {
                    where.push(' dat.' + item.nombrecampo + " = '" + item.idvalor + "'");
                } else if (item.tipo === 'string' && operador.nombre === 'contiene') {
                    where.push(' dat.' + item.nombrecampo + " ILIKE '%" + item.valor1.replace(/\s/g, "%") + "%'");
                } else if (item.tipo === 'string' && operador.nombre === 'no contiene') {
                    where.push(' dat.' + item.nombrecampo + " NOT ILIKE '%" + item.valor1.replace(/\s/g, "%") + "%'");
                } else if (item.tipo === 'boolean' && operador.nombre === '=') {
                    valor = item.valor1 ? 'true' : 'false';
                    where.push(' dat.' + item.nombrecampo + " = " + valor);
                } else if (item.tipo === 'number' && operador.nombre === '=' && item.valor1) {
                    where.push(' dat.' + item.nombrecampo + " = " + item.valor1);
                } else if (item.tipo === 'number' && operador.nombre === '>' && item.valor1) {
                    where.push(' dat.' + item.nombrecampo + " > " + item.valor1);
                } else if (item.tipo === 'number' && operador.nombre === '<' && item.valor1) {
                    where.push(' dat.' + item.nombrecampo + " < " + item.valor1);
                } else if (item.tipo === 'number' && operador.nombre === '<>' && item.valor1) {
                    where.push(' dat.' + item.nombrecampo + " <> " + item.valor1);
                } else if (item.tipo === 'number' && operador.nombre === '>=' && item.valor1) {
                    where.push(' dat.' + item.nombrecampo + " >= " + item.valor1);
                } else if (item.tipo === 'number' && operador.nombre === '<=' && item.valor1) {
                    where.push(' dat.' + item.nombrecampo + " <= " + item.valor1);
                } else if ((item.tipo === 'date' || item.tipo === 'datetime' || item.tipo === 'timestamp'
                    || item.tipo === 'timestamp without time zone' || item.tipo === 'timestamp with time zone')
                    && operador.nombre === '=') {
                    date_start = moment(item.valor1, "DD/MM/YYYY H:m:s").format('YYYY-MM-DD')
                    where.push(item.nombrecampo + " ='" + date_start + "'");
                } else if ((item.tipo === 'date' || item.tipo === 'datetime' || item.tipo === 'timestamp'
                    || item.tipo === 'timestamp without time zone' || item.tipo === 'timestamp with time zone')
                    && operador.nombre === '>') {
                    date_start = moment(item.valor1, "DD/MM/YYYY H:m:s").format('YYYY-MM-DD')
                    where.push(' dat.' + item.nombrecampo + " > '" + date_start + "'");
                } else if ((item.tipo === 'date' || item.tipo === 'datetime' || item.tipo === 'timestamp'
                    || item.tipo === 'timestamp without time zone' || item.tipo === 'timestamp with time zone')
                    && operador.nombre === '<') {
                    date_start = moment(item.valor1, "DD/MM/YYYY H:m:s").format('YYYY-MM-DD')
                    where.push(' dat.' + item.nombrecampo + " < '" + date_start + "'");
                }
                else if ((item.tipo === 'date' || item.tipo === 'datetime' || item.tipo === 'timestamp'
                    || item.tipo === 'timestamp without time zone' || item.tipo === 'timestamp with time zone')
                    && operador.nombre === '<>') {
                    date_start = moment(item.valor1, "DD/MM/YYYY H:m:s").format('YYYY-MM-DD')
                    where.push(' dat.' + item.nombrecampo + " <> '" + date_start + "'");
                }
                else if ((item.tipo === 'date' || item.tipo === 'datetime' || item.tipo === 'timestamp'
                    || item.tipo === 'timestamp without time zone' || item.tipo === 'timestamp with time zone')
                    && operador.nombre === '>=') {
                    date_start = moment(item.valor1, "DD/MM/YYYY H:m:s").format('YYYY-MM-DD')
                    where.push(' dat.' + item.nombrecampo + " >= '" + date_start + "'");
                }
                else if ((item.tipo === 'date' || item.tipo === 'datetime' || item.tipo === 'timestamp'
                    || item.tipo === 'timestamp without time zone' || item.tipo === 'timestamp with time zone')
                    && operador.nombre === '<=') {
                    date_start = moment(item.valor1, "DD/MM/YYYY H:m:s").format('YYYY-MM-DD')
                    where.push(' dat.' + item.nombrecampo + " <= '" + date_start + "'");
                }
            }
        }
    })

    result.push(req.body.idsection)
    result.push(req.session.id_rol)
    result.push("{" + fields.join(',') + "}")
    result.push("{" + functions.join(',') + "}")
    if(where.length !== 0)
        where = " WHERE " + where.join(" AND ")
    else
        where = "";
    result.push(where)
    return result
}


objFilter.getFunctionsResume = getFunctionsResume
objFilter.getFiltersOperators = getFiltersOperators
objFilter.getResultFiltersOperators = getResultFiltersOperators
objFilter.getResultFiltersFunctions = getResultFiltersFunctions
module.exports = objFilter