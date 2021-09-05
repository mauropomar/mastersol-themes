const pool = require('../connection/server-db')
const cron = require('node-cron')
const fs = require('fs')
const fse = require('fs-extra')
const objects = require('../modules');
const spawn = require('child_process').spawn;
const copyTo = require('pg-copy-streams').to;
const copyFrom = require('pg-copy-streams').from;
var stream = require('stream');
var archiver = require('archiver');
const rimraf = require("rimraf");
const fileType = require('file-type');
const extract = require('extract-zip')
const dirTree = require("directory-tree");
var lineReader = require('line-reader');
var ncp = require('ncp').ncp;
var path = require("path")
const xlsxFile = require('read-excel-file/node');
const objGenFunc = {}
var arrCheck = [];
var arrCheckJasperFiles = [];
var arrCheckJrxmlFiles = [];
var arrCheckAttachs = [];
var arrCheckCopiedFolders = [];
var arrCheckImport = [];
var nameBackupBD = '';

//schedule para recorrer todos los procesos activos y ejecutar las funciones que tengan asociadas según sus calendarios
cron.schedule('* * * * *', async () => {
    const procesos = await getProcess()

    for (const pro of procesos) {
        let queryFunction = ''
        const paramsFunction = ['cfgapl.functions', pro.id_function];
        const resultFunction = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', paramsFunction);
        if (resultFunction && resultFunction.rows)
            queryFunction = 'SELECT ' + resultFunction.rows[0].fn_get_register[0].namex + '()'

        let fechaActual = new Date();
        let horaActual = new Date();
        let fechaStart = pro.date_to_execute;
        let horaStart = pro.time_to_execute;
        horaStart = horaStart.substring(horaStart.length-8,horaStart.length-3)
        let mesActual = fechaActual.getMonth() + 1;
        if(mesActual < 10)
            mesActual = '0'+mesActual
        fechaActual = fechaActual.getFullYear() + '-' + mesActual + '-' + fechaActual.getDate();
        horaActual = horaActual.getHours() + ':' + horaActual.getMinutes();
        let eachMinutes = '*'
        let eachDays = '*'
        if(pro.repeat_each_minutes != null && pro.repeat_each_minutes > 0 && pro.repeat_each_minutes < 60)
            eachMinutes = pro.repeat_each_minutes
        if(pro.repeat_each_day != null && pro.repeat_each_day > 0 && pro.repeat_each_day <= 31)
            eachDays = pro.repeat_each_day
        //Obtener minutos y dias de ejecucion para el calendario
        let stringMinutes = '*'
        let stringDays = '*'
        let lastMinute = 1
        let lastDay = 1
        if(eachMinutes != '*') {
            stringMinutes = '1'
            for (let i = 1; i < 60; i++) {
                lastMinute += eachMinutes
                if (lastMinute < 60)
                    stringMinutes = stringMinutes +','+lastMinute
                else break;
            }
        }
        if(eachDays != '*') {
            stringDays = '1'
            for (let i = 1; i <= 31; i++) {
                lastDay += eachDays
                if (lastDay <= 31)
                    stringDays = stringDays +','+lastDay
                else break;
            }
        }

        if(fechaStart == fechaActual && horaStart == horaActual) {
            executeProcessFunction(pro, queryFunction)
                .then((value) => {
                    console.log(value+pro.namex)
                })
                .catch((value) => {
                    console.log(value+pro.namex)
                });
        }
        else if(fechaStart < fechaActual || (fechaStart == fechaActual && horaStart < horaActual)){
            if((pro.repeat_each_minutes != null && pro.repeat_each_minutes != 0) ||
                (pro.repeat_each_day != null && pro.repeat_each_day != 0)){
                //si el minuto y dia actual se encuentran en su respectiva cadena, ejecutar
                if(
                    (await existElemInString(stringMinutes, new Date().getMinutes()) && await existElemInString(stringDays, new Date().getDate())) ||
                    (await existElemInString(stringMinutes, new Date().getMinutes()) && stringDays == '*') ||
                    (stringMinutes == '*' && await existElemInString(stringDays, new Date().getDate()))
                )
                executeProcessFunction(pro, queryFunction)
                    .then((value) => {
                        console.log(value+pro.namex)
                    })
                    .catch((value) => {
                        console.log(value+pro.namex)
                    });
            }
        }
    }

});

cron.schedule('1 23 * * *', async () => {
    const dirFolderReports = global.appRootApp + '\\resources\\reports\\tmp'
    const dirFolderBackups = global.appRootApp + '\\resources\\backups'
    const dirFolderSaveRestore = global.appRootApp + '\\resources\\save_restore'

    await rimraf(dirFolderReports, () => console.log('Borrado reports tmp!'));
    await rimraf(dirFolderBackups, () => console.log('Borrado backups!'));
    await rimraf(dirFolderSaveRestore, () => console.log('Borrado save_restore!'));
    await sleep(2000)
    fs.mkdir(dirFolderReports, (err) => {
        if (err) {
            throw err;
        }
        console.log("Reports tmp creado.");
    });
    fs.mkdir(dirFolderBackups, (err) => {
        if (err) {
            throw err;
        }
        console.log("Backups creado.");
    });
    fs.mkdir(dirFolderSaveRestore, (err) => {
        if (err) {
            throw err;
        }
        console.log("save_restore creado.");
    });

});


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const executeProcessFunction = (pro, query) => new Promise(async (resolve, reject) => {
    if (query != '') {
        try {
            const result = pool.executeQuery2(query)
            if (result.success != false)
                resolve('Funcion ejecutada con exito en process ')
            else
                resolve('Funcion no ejecutada en process ')
        }
        catch(error){
            reject('No se pudo ejecutar la funcion ' + error+ ' ')
        }
    }
})

const existElemInString = async (cadena, elem) => {
    let arr = cadena.split(',')
    for(let i=0;i<arr.length;i++){
        if(elem == arr[i])
            return true
    }
    return false
}

const getProcess = async () => {
    const params_process = ['cfgapl.process',null,"WHERE active = true "]
    const resultProcess = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2,$3)', params_process)
    if(!resultProcess){
        return []
    }
    return resultProcess.rows[0].fn_get_register
}

const generateFunctions = async (req, objects) => {
    const js_name = req.query.url.split('/')[3]
    const js_name_sinext = js_name.replace('.js', '')
    const result = await objects.sections.getCapsuleSection(req)
    var objModule = require("../../Capsules/" + result.id_capsule.replace(/-/g, '') + "/JS/" + js_name_sinext)
    var resultFn = "";
    if (req.query.idregistro !== '') {
        resultFn = await objModule["btn_" + req.query.name](req.query.idsection, req.query.idregistro)
    } else {
        resultFn = await objModule["btn_" + req.query.name](req.query.idsection, null)
    }
    return resultFn
}

const generateFunctionsTimeEvents = async (req, objects) => {
    const time_events = await getTimeEvent()
    var objModule = ""

    for (const time of time_events) {
        cron.schedule('*' + time.each_any_minutes + ' * *' + time.each_any_days + ',1 * *', () => {
            //console.log('tarea ejecutada')
            //objModule = require("../../capsules/" + time.capsule_name + "/JS/" + "te_" + time.identifier)
            //objModule["te_" + time.identifier]()
        })
    }    
}

const getTimeEvent = async () => {
    const query = "SELECT cfgapl.fn_get_time_events()"
    const result = await pool.executeQuery(query)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_get_time_events == null) {
        return []
    }
    return result.rows[0].fn_get_time_events
}

const executeFunctionsButtons = async (req, objects) => {
    let idbutton = req.query.idbutton != '' ? req.query.idbutton : null
    let idsection = req.query.idsection
    let idregister = req.query.idregister
    let iduser = req.session.id_user
    let idrol = req.session.id_rol
    let extra_params = req.query.extra_params;

    var success = false;
    var result = {'btn': '', 'type': '', 'value': '', 'msg': '', 'name':''}
    let flagResult = false
    if(idbutton) {
        const param_button = ['cfgapl.sections_buttons',idbutton]
        const resultButton = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', param_button)

        if (resultButton && resultButton.rows) {
            let requireDir = '../../capsules/' + 'c_' + resultButton.rows[0].fn_get_register[0].id_capsules + '/node_js/buttons/' + resultButton.rows[0].fn_get_register[0].js_name
            let dirFile = global.appRootApp + '\\capsules\\' + 'c_' + resultButton.rows[0].fn_get_register[0].id_capsules + '\\node_js\\buttons\\' + resultButton.rows[0].fn_get_register[0].js_name +'.js'
            const operacion = require(requireDir)
            if(fs.existsSync(dirFile)) {
                let report_name = ''
                //Si tiene reporte asociado hacer la gestion correspondiente
                if(resultButton.rows[0].fn_get_register[0].id_inform != null){
                    const param_inform = ['reports.informs',resultButton.rows[0].fn_get_register[0].id_inform]
                    const resultInform = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', param_inform)
                    if(resultInform && resultInform.rows) {
                        report_name = resultInform.rows[0].fn_get_register[0].name                        
                        //Si los parametros vienen vacíos buscar los params del reporte y devolverlos
                        if(!extra_params || extra_params == '') {                            
                            const paramsParamsReport = ['reports.inf_params', null, "WHERE id_inform = '" + resultInform.rows[0].fn_get_register[0].id + "' "];
                            const resultParamsReport = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2,$3)', paramsParamsReport);
                            //Si el reporte lleva parametros buscarlos para devolverlos, sino imprimir directamente
                            if (resultParamsReport && resultParamsReport.rows[0].fn_get_register != null
                                && resultParamsReport.rows[0].fn_get_register.length > 0) {
                                //Devolver arreglo de parametros a la vista para el panel de filtro del reporte
                                for(let i=0;i<resultParamsReport.rows[0].fn_get_register.length;i++){
                                    const param_datatype = ['cfgapl.datatypes',resultParamsReport.rows[0].fn_get_register[i].datatype]
                                    const resultDatatype = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', param_datatype)
                                    if(resultDatatype)
                                        resultParamsReport.rows[0].fn_get_register[i].datatype = resultDatatype.rows[0].fn_get_register[0].real_name_ext
                                }
                                success = true;
                                result = {'btn': idbutton, 'type': 4, 'value': resultParamsReport.rows[0].fn_get_register, 'msg': 'filter_params'}
                                flagResult = true
                            }
                            else{
                                success = true;
                                let resultReport = await objects.reports.getJasper(report_name)
                                result = {'btn': idbutton, 'type': 5, 'value': resultReport.jasper, 'msg': resultReport.msg, 'name': resultInform.rows[0].fn_get_register[0].name}
                                flagResult = true
                            }
                        }
                        else{ //generar y devolver el reporte
                            success = true;                            
                            let resultReport = await objects.reports.getJasper(report_name)
                            result = {'btn': idbutton, 'type': 5, 'value': resultReport.jasper, 'msg': resultReport.msg, 'name': resultInform.rows[0].fn_get_register[0].name}
                            flagResult = true
                        }
                    }
                }
                else if(resultButton.rows[0].fn_get_register[0].id_graphic != null){
                    const param_graphic = ['cfgapl.graphic',resultButton.rows[0].fn_get_register[0].id_graphic]
                    const resultGraphic = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', param_graphic)
                    if(resultGraphic && resultGraphic.rows){
                        const graphic_name = resultGraphic.rows[0].fn_get_register[0].namex
                        //Si los parametros vienen vacíos buscar los params del grafico y devolverlos
                        if(!extra_params || extra_params == ''){
                            const paramsParamsGraphic = ['cfgapl.graphic_params', null, "WHERE id_graphic = '" + resultGraphic.rows[0].fn_get_register[0].id + "' "];
                            const resultParamsGraphic = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2,$3)', paramsParamsGraphic);
                            //Buscar parámetros para devolverlos
                            if (resultParamsGraphic && resultParamsGraphic.rows[0].fn_get_register != null
                                && resultParamsGraphic.rows[0].fn_get_register.length > 0){
                                //Devolver arreglo de parametros a la vista para el panel de filtro del gráfico
                                for(let i=0;i<resultParamsGraphic.rows[0].fn_get_register.length;i++){
                                    const param_datatype = ['cfgapl.datatypes',resultParamsGraphic.rows[0].fn_get_register[i].datatype]
                                    const resultDatatype = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', param_datatype)
                                    if(resultDatatype && resultDatatype.rows)
                                        resultParamsGraphic.rows[0].fn_get_register[i].datatype = resultDatatype.rows[0].fn_get_register[0].real_name_ext
                                }
                                success = true;
                                result = {'btn': idbutton, 'type': 4, 'value': resultParamsGraphic.rows[0].fn_get_register, 'msg': 'filter_params'}
                                flagResult = true
                            }
                            else{
                                const sql_graphic = resultGraphic.rows[0].fn_get_register[0].sql_values
                                let msg = ''
                                let resultSql = ''
                                success = true;
                                try {
                                    resultSql = await pool.executeQuery(sql_graphic)
                                }
                                catch(err){
                                    msg = err
                                }
                                const name = resultGraphic.rows[0].fn_get_register[0].namex
                                const title = resultGraphic.rows[0].fn_get_register[0].title
                                const label_x = resultGraphic.rows[0].fn_get_register[0].label_x
                                const label_y = resultGraphic.rows[0].fn_get_register[0].label_y
                                const legend = resultGraphic.rows[0].fn_get_register[0].show_legend
                                const pos_legend = resultGraphic.rows[0].fn_get_register[0].legend_pos
                                const sql_label = resultGraphic.rows[0].fn_get_register[0].sql_label
                                result = {'btn': idbutton, 'type': 6, 'value': resultSql.rows, 'msg': msg, 'name': name, 'title': title, 'label_x': label_x, 'label_y': label_y, 'legend': legend, 'legend_pos': pos_legend, 'sql_label': sql_label}
                                flagResult = true
                            }
                        }
                        else{
                            //devolver consulta del gráfico
                            const sql_graphic = resultGraphic.rows[0].fn_get_register[0].sql_values
                            let msg = ''
                            let resultSql = ''
                            success = true;
                            try {
                                resultSql = await pool.executeQuery(sql_graphic)
                            }
                            catch(err){
                                msg = err
                            }
                            const name = resultGraphic.rows[0].fn_get_register[0].namex
                            const title = resultGraphic.rows[0].fn_get_register[0].title
                            const label_x = resultGraphic.rows[0].fn_get_register[0].label_x
                            const label_y = resultGraphic.rows[0].fn_get_register[0].label_y
                            const legend = resultGraphic.rows[0].fn_get_register[0].show_legend
                            const pos_legend = resultGraphic.rows[0].fn_get_register[0].legend_pos
							const sql_label = resultGraphic.rows[0].fn_get_register[0].sql_label
                            result = {'btn': idbutton, 'type': 6, 'value': resultSql.rows, 'msg': msg, 'name': name, 'title': title, 'label_x': label_x, 'label_y': label_y, 'legend': legend, 'legend_pos': pos_legend, 'sql_label': sql_label}
                            flagResult = true
                        }
                    }
                }
                if(!flagResult) {
                    result = await operacion.function(idsection, idregister, idbutton, iduser, idrol, report_name)
                    if (result)
                        success = true;
                }
            }
        }
    }
    if(result.type != 6)
        return {'success': success, 'btn': result.btn, 'type': result.type, 'value': result.value, 'msg': result.msg, 'name': result.name}
    else
        return {'success': success, 'btn': result.btn, 'type': result.type, 'value': result.value, 'msg': result.msg, 'name': result.name, 'title': result.title, 'label_x': result.label_x, 'label_y': result.label_y, 'legend': result.legend, 'legend_pos': result.legend_pos, 'sql_label': result.sql_label}
}

const saveCapsuleBD = async (idcapsule,dirFullFolder) => {
    let success = true
    let finalResult = ''
    let noSchema = false
    let noData = false

    const query = "SELECT cfgapl.fn_save_capsule($1)"
    const param_capsule = [idcapsule]
    const result = await pool.executeQuery(query, param_capsule)
    if (result.success === false)
        success = false
    let resultSaveStructure = result.rows[0].fn_save_capsule
    if(!resultSaveStructure)
        noSchema = true
    if (resultSaveStructure && resultSaveStructure.includes('ERROR: ')) {  //Si hubo error, capturar y terminar la funcion
        success = false
        finalResult = resultSaveStructure
    }
    else{
        //Crear carpeta para contener los ficheros generados
        const param_cap = ['cfgapl.capsules',idcapsule]
        const resultCap = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', param_cap)
        let name_capsule = ''
        if(resultCap){
            name_capsule =  resultCap.rows[0].fn_get_register[0].namex
        }
        let currentDate = new Date()
        let subcapsule = idcapsule.substring(0,6)
        const dirFolder = dirFullFolder + '\\'+subcapsule+'[n]'+currentDate.getSeconds()+currentDate.getMilliseconds()
        await generateExportFilesBD(idcapsule,dirFolder,resultSaveStructure)
            .then((value) => {
                if(value == 'noData') {
                    noData = true
                    finalResult = 'No hay datos para exportar'
                }
                else finalResult = value
            })
            .catch((value) => {
                success = false
                finalResult = value
            });
        if(noSchema || noData) {
            success = false
            finalResult = 'No hay estructura o datos para exportar'
        }
    }

    return {'success': success, 'datos': finalResult}
}

const saveCapsuleFiles = async (idcapsule,dirFullFolder) => {
    let success = true
    let resultStructure = true
    let resultReports = true
    let resultAttach = true

    let currentDate = new Date()
    const subcapsule = idcapsule.substring(0,6)
    const dirFolder = dirFullFolder + '\\'+subcapsule+'[n]'+currentDate.getSeconds()+currentDate.getMilliseconds()
    const dirFolderStructure = dirFolder + '\\structure\\' + 'c_' + idcapsule
    const dirFolderReports = dirFolder + '\\reports'
    const dirFolderAttach = dirFolder + '\\attach'
    //Exportar estructura de la capsula
    await generateExportFilesStructure(idcapsule,dirFolderStructure)
        .then((value) => {
           console.log(value)
        })
        .catch((value) => {
            resultStructure = false
            console.log(value)
        });
    //Exportar reportes de la capsula
    await generateExportFilesReports(idcapsule,dirFolderReports)
        .then((value) => {
            console.log(value)
        })
        .catch((value) => {
            resultReports = false
            console.log(value)
        });
    //Exportar adjuntos de la capsula
    await generateExportFilesAttach(idcapsule,dirFolderAttach)
        .then((value) => {
            console.log(value)
        })
        .catch((value) => {
            resultAttach = false
            console.log(value)
        });
    if(!resultStructure || !resultReports || !resultAttach)
        success = false

    return {'success': success, 'datos': dirFolder}
}

const generateExportFilesStructure = async (idcapsule, dirFolderStructure) => new Promise(async (resolve, reject) => {
    await fs.mkdir(dirFolderStructure, {recursive: true}, async (err) => {
        if(!err){
            fs.exists(global.appRootApp + '\\capsules\\' + 'c_'+idcapsule, (exists) => {
                if(!exists){
                    reject('La estructura de la cápsula no existe')
                }
                ncp.limit = 16;

                ncp(global.appRootApp + '\\capsules\\' + 'c_'+idcapsule, dirFolderStructure, function (err) {
                    if (err) {
                        reject(err)
                    }
                    resolve('Estructura exportada!')
                });
            });
        }
        else
            reject(err)
    });
})

const generateExportFilesReports = async (idcapsule, dirFolderReports) => new Promise(async (resolve, reject) => {
    await fs.mkdir(dirFolderReports, {recursive: true}, async (err) => {
        if(!err){
            //Buscar ficheros de reportes asociados a esta capsula
            const paramsReport = ['reports.informs',null,"WHERE id_capsules = '"+idcapsule+"' "]
            const resultReport = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2,$3)', paramsReport)
            if(resultReport && resultReport.rows && resultReport.rows[0].fn_get_register){
                if(resultReport.rows[0].fn_get_register.length > 0) {
                    for (let i = 0; i < resultReport.rows[0].fn_get_register.length; i++) {
                        arrCheckJasperFiles.push(false)
                        arrCheckJrxmlFiles.push(false)
                    }
                    for (let i = 0; i < resultReport.rows[0].fn_get_register.length; i++) {
                        const elem = resultReport.rows[0].fn_get_register[i]
                        //Copiar .jasper
                        await fs.copyFile(global.appRootApp + '\\resources\\reports\\informs\\' + elem.name + '.jasper', dirFolderReports + '\\' + elem.name + '.jasper', (err) => {
                            if (err) {
                                reject(err)
                            }
                            else {
                                console.log(elem.name + '.jasper copiado!');
                            }
                            arrCheckJasperFiles[i] = true;
                            let stopJasper = true;
                            let stopJrxml = true;
                            for (let j = 0; j < arrCheckJasperFiles.length; j++) {
                                if (arrCheckJasperFiles[j] == false) {
                                    stopJasper = false;
                                    break;
                                }
                            }
                            for (let j = 0; j < arrCheckJrxmlFiles.length; j++) {
                                if (arrCheckJrxmlFiles[j] == false) {
                                    stopJrxml = false;
                                    break;
                                }
                            }
                            if (stopJasper && stopJrxml)
                                resolve('Reportes exportados')
                        });
                        //Copiar .jrxml
                        await fs.copyFile(global.appRootApp + '\\resources\\reports\\informs\\' + elem.name + '.jrxml', dirFolderReports + '\\' + elem.name + '.jrxml', (err) => {
                            if (err) {
                                reject(err)
                            }
                            else {
                                console.log(elem.name + '.jrxml copiado!');
                            }
                            arrCheckJrxmlFiles[i] = true;
                            let stopJasper = true;
                            let stopJrxml = true;
                            for (let j = 0; j < arrCheckJasperFiles.length; j++) {
                                if (arrCheckJasperFiles[j] == false) {
                                    stopJasper = false;
                                    break;
                                }
                            }
                            for (let j = 0; j < arrCheckJrxmlFiles.length; j++) {
                                if (arrCheckJrxmlFiles[j] == false) {
                                    stopJrxml = false;
                                    break;
                                }
                            }
                            if (stopJasper && stopJrxml)
                                resolve('Reportes exportados')
                        });
                    }
                }
                else resolve('No existen reportes para esta capsula')
            }
            else resolve('No existen reportes para esta capsula')
        }
        else
            reject(err)
    });
})

const generateExportFilesAttach = async (idcapsule, dirFolderAttach) => new Promise(async (resolve, reject) => {
    await fs.mkdir(dirFolderAttach, {recursive: true}, async (err) => {
        if(!err){
            //Buscar adjuntos asociados a esta capsula
            const paramsAdjunto = ['cfgapl.attach',null,"WHERE id_capsules = '"+idcapsule+"' "]
            const resultAdjunto = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2,$3)', paramsAdjunto)
            if(resultAdjunto && resultAdjunto.rows && resultAdjunto.rows[0].fn_get_register){
                if(resultAdjunto.rows[0].fn_get_register.length > 0) {
                    for (let i = 0; i < resultAdjunto.rows[0].fn_get_register.length; i++) {
                        arrCheckAttachs.push(false)
                    }
                    for (let i = 0; i < resultAdjunto.rows[0].fn_get_register.length; i++) {
                        const elem = resultAdjunto.rows[0].fn_get_register[i]
                        let arrPath = elem.path.split('/')
                        const nameFolder = arrPath[3]
                        //Obtener direccion de los adjuntos de parametros general
                        const paramsAttach = ['cfgapl.general', null, "WHERE variable = 'dir_attach' "]
                        const resultAttach = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2,$3)', paramsAttach)
                        let paramDirAttach = ''
                        if (resultAttach && resultAttach.rows && resultAttach.rows[0].fn_get_register) {
                            paramDirAttach = resultAttach.rows[0].fn_get_register[0].value
                            paramDirAttach = paramDirAttach.replace('..', '')
                            paramDirAttach = paramDirAttach.replace('/', '\\')
                        }
                        ncp.limit = 16;
                        ncp(global.appRootApp + paramDirAttach + '\\' + nameFolder, dirFolderAttach + '\\' + nameFolder, function (err) {
                            if (err) {
                                reject(err)
                            }
                            arrCheckAttachs[i] = true;
                            let stop = true;
                            for (let j = 0; j < arrCheckAttachs.length; j++) {
                                if (arrCheckAttachs[j] == false) {
                                    stop = false;
                                    break;
                                }
                            }
                            if (stop)
                                resolve('Adjuntos exportados')
                        });
                    }
                }
                else resolve('No existen adjuntos para exportar en esta capsula')
            }
            else resolve('No existen adjuntos para exportar en esta capsula')
        }
        else
            reject(err)
    });
})

const generateExportFilesBD = async (idcapsule, dirFolder, resultSaveStructure) => new Promise(async (resolve, reject) => {
    let success = true
    await fs.mkdir(dirFolder, {recursive: true}, async (err) => {
        if (!err) {
            console.log('directorio salva creado')
            //Salvar fichero con estructura si existe
            if(resultSaveStructure) {
                let fileStructure = await fs.createWriteStream(dirFolder + '\\e_' + Math.random() + '.sql')
                fileStructure.write(resultSaveStructure)
                fileStructure.on('finish', function() {
                    console.log('Terminado stream estructura')
                });
                fileStructure.end()
            }
            const client = await pool.obj_pool.connect()
            //Obtener aparte datos de la capsula
            let writeStream = await fs.createWriteStream(dirFolder + '\\cap_' + Math.random() + '.txt');
            var readStream = await client.query(copyTo("COPY (SELECT * FROM cfgapl.capsules WHERE id = '" + idcapsule + "') " +
                "TO STDOUT WITH NULL as 'NULL' DELIMITER ',' "));
            await copyStreamToFile(readStream, writeStream, 'Capsula')
                .then((value) => {
                    writeStream = value
                })
                .catch((value) => {
                    success = false
                    writeStream = value
                    reject('Error exportando Capsula')
                });

            //Obtener datos tablas a exportar
            const query = "SELECT cfgapl.fn_get_ordered_tables_by_fk($1)"
            const param_capsule = [idcapsule]
            const result = await pool.executeQuery(query, param_capsule)
            if (result.success === false)
                success = false
            let resultOrdredTables = result.rows[0].fn_get_ordered_tables_by_fk
            //ciclar por las tablas dependientes de la capsula, ordenadas, para exportar los datos
            if(resultOrdredTables) {
                let arrTablas = resultOrdredTables.split(',');
                let largo_arr = arrTablas.length
                try {
                    for(let i = 0; i < largo_arr; i++){
                        let tabla = arrTablas[i]
                        let arrTable = tabla.split('.');
                        //Si la tabla es padre no exportar
                        let queryParent = "SELECT count(*) as conteo FROM pg_inherits JOIN pg_class AS c ON (inhrelid=c.oid) " +
                            "JOIN pg_class as p ON (inhparent=p.oid) JOIN pg_namespace pn ON pn.oid = p.relnamespace " +
                            "JOIN pg_namespace cn ON cn.oid = c.relnamespace " +
                            "WHERE p.relname = '"+arrTable[1]+"' and pn.nspname = '"+arrTable[0]+"'";
                        const resultHijos = await pool.executeQuery(queryParent)
                        if(resultHijos && resultHijos.rows[0].conteo == 0) {
                            let writeStream = await fs.createWriteStream(dirFolder + '\\' + i + '_' + tabla + '[n]' + Math.random() + '.csv');
                            writeStream.setMaxListeners(0);
                            var readStream = await client.query(copyTo("COPY (SELECT * FROM " + tabla + " WHERE id_capsules = '" + idcapsule + "') " +
                                "TO STDOUT WITH NULL as 'NULL' DELIMITER ';' "));
                            await copyStreamToFile(readStream, writeStream, tabla)
                                .then((value) => {
                                    writeStream = value
                                })
                                .catch((value) => {
                                    success = false
                                    writeStream = value
                                    reject('Error exportando ' + tabla)
                                });
                            writeStream.removeAllListeners()
                        }
                    }
                }
                catch(err){
                    console.log(err)
                }
                resolve(dirFolder)
            }
            else resolve('noData')
        }
        else
            reject(err)
    });

})

const generateFileCapsule = async (idcapsule,dirFullFolder, dirFolderBD, dirFolderFiles, es_dep = false) => {
    let success = true
    let currentDate = new Date()
    let dirFolder = ''
    const subcapsule = idcapsule.substring(0,6)
    if(!es_dep)
        dirFolder = dirFullFolder + '\\main_'+subcapsule+'[n]'+currentDate.getSeconds()+currentDate.getMilliseconds()
    else
        dirFolder = dirFullFolder + '\\dep_'+subcapsule+'[n]'+currentDate.getSeconds()+currentDate.getMilliseconds()
    await copyFoldersForDirectory(dirFolder, dirFolderBD, dirFolderFiles)
        .then((value) => {
            console.log(value)
        })
        .catch((value) => {
            success = false
            console.log(value)
        });

    return {'success': success, 'datos': dirFolder}
}

const generateZipCapsule = async (dirFolder) => {
    let success = true
    let msg = ''

    await archiveDirectory(dirFolder)
        .then((value) => {
            console.log(value)
            msg = value
        })
        .catch((value) => {
            success = false
            msg = value
            console.log(value)
        });

    return {'success': success, 'datos': msg}
}

const copyFoldersForDirectory = async (dirFolder, dirFolderBD, dirFolderFiles) => new Promise(async (resolve, reject) => {
    await fs.mkdir(dirFolder, {recursive: true}, async (err) => {
        if(!err){
            ncp.limit = 16;
            arrCheckCopiedFolders.push(false)
            arrCheckCopiedFolders.push(false)

            await ncp(dirFolderBD, dirFolder + '\\bd', function (err) {
                if (err) {
                    reject(err)
                }
                arrCheckCopiedFolders[0] = true;
                let stop = true;
                if(arrCheckCopiedFolders[1] == false) {
                    stop = false;
                }
                if(stop)
                    resolve('Ficheros para comprimir copiados')
            });

            await ncp(dirFolderFiles, dirFolder + '\\files', function (err) {
                if (err) {
                    reject(err)
                }
                arrCheckCopiedFolders[1] = true;
                let stop = true;
                if(arrCheckCopiedFolders[0] == false) {
                    stop = false;
                }
                if(stop)
                    resolve('Ficheros para comprimir copiados')
            });
        }
        else
            reject(err)
    });
})

const copyStreamToFile = async (readStream,writeStream,tabla) => new Promise(async (resolve, reject) => {
    readStream.pipe(writeStream)
    writeStream.addListener('finish', function(){
        console.log(tabla, 'exportada')
        resolve(writeStream)
    });
    writeStream.addListener('error', function(){
        reject(writeStream)
    })
})

const archiveDirectory = async (dirFolder) => new Promise(async (resolve, reject) => {
    let output = await fs.createWriteStream(dirFolder+'.zip');
    let archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });
    archive.on('error', function(err) {
        reject(err)
    });
    output.on('close', () => {
        resolve(dirFolder+'.zip')
    });

    archive.pipe(output);
    archive.directory(dirFolder, '');
    archive.finalize();
})

const getCapsules = async () => {
    const params_capsules = ['cfgapl.capsules',null,"WHERE active = true "]
    const resultCapsules = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2,$3)', params_capsules)
    if(!resultCapsules){
        return {'success': false, 'datos': []}
    }
   return {'success': true, 'datos': resultCapsules.rows[0].fn_get_register}
}

const importCapsule = (req) => new Promise(async (resolve, reject) => {
    let success = true
    let msg = ''

    var Readable = stream.Readable;
    var fileBuffer = Buffer.from(req.body.file, 'base64');
    var readStream = new Readable();
    readStream.push(fileBuffer);
    readStream.push(null)
    const dirTemp = global.appRootApp + '\\resources\\backups\\'+Math.random()
    fs.mkdirSync(dirTemp, {recursive: true}, (err) => {
        if (err) {
            success = false;
            msg = 'Ha ocurrido un error, ' + err
        }
    });
    fs.exists(dirTemp, (exists) => {
        if(!exists){
            success = false;
            msg = 'Ha ocurrido un error'
        }
    });
    if(success){
        var writeStream = await fs.createWriteStream(dirTemp + '\\' + req.body.name);
        readStream.pipe(writeStream);
        try {
            await uploadFile(req, dirTemp, writeStream)
                .then((value) => {
                    msg = value
                    console.log('Concluída importación satisfactoriamente')
                })
                .catch((value) => {
                    success = false
                    msg = value
                    console.log('Concluída importación con errores')
                });
        }
        catch(err){
            msg = 'Ha ocurrido un error '+err
            reject(msg)
        }
        let arrresolve = []
        arrresolve.push(success)
        arrresolve.push(msg)
        resolve(arrresolve)
    }
    else{
        msg = 'Ha ocurrido un error'
        reject(msg)
    }

})

const uploadFile = (req,dirTemp,writeStream) => new Promise((resolve, reject) => {

    writeStream.on('finish', async function () {
        const dirFile = dirTemp + '/' + req.body.name
        const tipo = await fileType.fromFile(dirFile)
        //Comprobar fichero antes de iniciar el proceso
        if(tipo['ext'] == 'zip' && tipo['mime'] == 'application/zip'){
            let breakImport = false
            let msgBreakImport = ''
            let arrCapsules = [];
            await extract(dirFile, { dir: dirTemp+'\\tmp' })
            //Procesar primero capsulas dependencias si existen
            await checkCapsulesVersion(dirTemp)
                .then((value) => {
                    console.log(value)
                })
                .catch((value) => {
                    breakImport = true
                    msgBreakImport = value
                    console.log(value)
                });
            if(!breakImport) {
                //Ciclar por todas las capsulas para su importacion
                const treeTmp = await dirTree(dirTemp + '\\tmp');
                for (let i = 0; i < treeTmp.children.length; i++) {
                    if (treeTmp.children[i].name.indexOf("dep_") !== -1) {
                        arrCapsules.push(treeTmp.children[i].name)
                    }
                }
                for (let i = 0; i < treeTmp.children.length; i++) {
                    if (treeTmp.children[i].name.indexOf("main_") !== -1) {
                        arrCapsules.push(treeTmp.children[i].name)
                    }
                }
                for(let i=0;i<arrCapsules.length;i++) {
                    let temp = []
                    temp.push(false)
                    temp.push(false)
                    temp.push(false)
                    arrCheckImport.push(temp)
                }
                let temp = []
                temp.push(false)
                temp.push(false)
                temp.push(false)
                arrCheckImport.push(temp)
                if (treeTmp.children) {
                    for (let i = 0; i < arrCapsules.length; i++) {
                        let elem = arrCapsules[i]

                        let id_section = ''
                        let id_language = ''
                        //Comprobar si la capsula existe, sino, crearla
                        //Checkear version de la capsula
                        let version = '1.0';
                        let description = ' ';
                        let licencetext = ' ';
                        let nameCapsule = ''
                        let idCapsule = ''
                        //Obtener valores de la capsula del fichero .txt
                        const tree = await dirTree(dirTemp + '\\tmp\\' + elem + '\\bd', {extensions: /\.txt/});
                        if (tree.children) {
                            await lineReader.eachLine(dirTemp + '\\tmp\\' + elem + '\\bd\\' + tree.children[0].name, async function (line, last) {
                                try {
                                    if (line) {
                                        let arrLine = line.split(',')
                                        idCapsule = arrLine[0]
                                        nameCapsule = arrLine[1]
                                        description = arrLine[2]
                                        version = arrLine[4]
                                        licencetext = arrLine[6]
                                        id_language = arrLine[12]
                                    }
                                }
                                catch (err) {
                                    console.log('Error leyendo el fichero')
                                }

                            });
                        }
                        await sleep(50)
                        let existeNameCap = false
                        //Buscar si existe una capsula con el mismo nombre y distinto ID
                        const paramsName = ['cfgapl.capsules', null, "WHERE namex = '" + nameCapsule + "' "]
                        const resultName = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2,$3)', paramsName)
                        if (resultName && resultName.rows[0].fn_get_register) {
                            let idCap = resultName.rows[0].fn_get_register[0].id
                            if (idCap !== idCapsule)
                                existeNameCap = true
                        }

                        const paramsCapsule = ['cfgapl.capsules', idCapsule]
                        const resultCapsule = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', paramsCapsule)
                        //Obtencion de section capsule
                        const paramsSectionCapsule = ['cfgapl.sections', null, "WHERE namex = 'Sec_capsules' "];
                        const resultSectionCapsule = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2,$3)', paramsSectionCapsule);
                        if (resultSectionCapsule)
                            id_section = resultSectionCapsule.rows[0].fn_get_register[0].id

                        if (resultCapsule && !resultCapsule.rows[0].fn_get_register) {
                            var paramsInsert = [], columnasInsertAux = [], valuesInsertAux = [];
                            //Obtencion de lenguaje spanish
                            if (!id_language) {
                                const paramsLanguage = ['cfgapl.languages', null, "WHERE namex = 'Spanish from Spain' "];
                                const resultLanguage = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2,$3)', paramsLanguage);
                                if (resultLanguage)
                                    id_language = resultLanguage.rows[0].fn_get_register[0].id
                            }

                            //columnas a insertar
                            columnasInsertAux.push('id')
                            columnasInsertAux.push('namex')
                            columnasInsertAux.push('description')
                            columnasInsertAux.push('version')
                            columnasInsertAux.push('licencetext')
                            columnasInsertAux.push('idlanguage')
                            columnasInsertAux.push('creator')
                            //valores a insertar
                            if (existeNameCap)
                                nameCapsule += ' '
                            valuesInsertAux.push(" '" + idCapsule + "'")
                            valuesInsertAux.push(" '" + nameCapsule + "'")
                            valuesInsertAux.push(" '" + description + "'")
                            valuesInsertAux.push(" '" + version + "'")
                            valuesInsertAux.push(" '" + licencetext + "'")
                            valuesInsertAux.push(" '" + id_language + "'")
                            valuesInsertAux.push("'" + req.session.id_user + "'")

                            paramsInsert.push(id_section)
                            paramsInsert.push(columnasInsertAux.join(','))
                            paramsInsert.push(valuesInsertAux.join(','))
                            paramsInsert.push(null)
                            paramsInsert.push(null)
                            paramsInsert.push(req.session.id_user)

                            await insertRegister(paramsInsert);
                            console.log('Insertada capsula!')
                        }
                        else if (resultCapsule && resultCapsule.rows[0].fn_get_register) {
                            var paramsInsert = [], valuesInsertAux = [];
                            valuesInsertAux.push("namex = '" + nameCapsule + "'")
                            valuesInsertAux.push("description = '" + description + "'")
                            valuesInsertAux.push("version = '" + version + "'")
                            valuesInsertAux.push("licencetext = '" + licencetext + "'")
                            valuesInsertAux.push("idlanguage = '" + id_language + "'")
                            valuesInsertAux.push("modifier = '" + req.session.id_user + "'")

                            paramsInsert.push(id_section)
                            paramsInsert.push(valuesInsertAux.join(','))
                            paramsInsert.push(idCapsule)
                            paramsInsert.push(req.session.id_user)
                            await updateRegister(paramsInsert);
                            console.log('Actualizada capsula!')
                        }
                        //Chequear término de importación para hacer resolve
                        await copyFromFilesStructure(req, dirTemp, elem)
                            .then((value) => {
                                arrCheckImport[i][0] = true;
                                let stop = true;
                                for(let j=0;j<arrCapsules.length;j++){
                                    if(arrCheckImport[j][0] === false || arrCheckImport[j][1] === false || arrCheckImport[j][2] === false){
                                        stop = false
                                        break;
                                    }
                                }
                                if (stop)
                                    resolve(value)
                            })
                            .catch((value) => {
                                reject(value)
                            });
                        //Buscar si existen scripts en first.sql para ejecutarlos antes de insertar o actualizar la capsula
                        let existeFirts = true
                        let existeLast = true
                        await fs.exists(dirTemp + '\\tmp\\' + elem + '\\files\\structure\\c_' + idCapsule + '\\scripts_db\\first.sql', (exists) => {
                            if(!exists){
                                existeFirts = false;
                            }
                        });
                        if(existeFirts) {
                            await fs.readFile(dirTemp + '\\tmp\\' + elem + '\\files\\structure\\c_' + idCapsule + '\\scripts_db\\first.sql', 'utf-8', async(err, data) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    await pool.executeQuery(data)
                                    console.log('Ejecutado script first.sql')
                                }
                            });
                        }
                        await copyFromFilesBD(req, dirTemp, elem)
                            .then((value) => {
                                arrCheckImport[i][1] = true;
                                let stop = true;
                                for(let j=0;j<arrCapsules.length;j++){
                                    if(arrCheckImport[j][0] === false || arrCheckImport[j][1] === false || arrCheckImport[j][2] === false){
                                        stop = false
                                        break;
                                    }
                                }
                                arrCheck = []
                                if (stop)
                                    resolve(value)
                            })
                            .catch((value) => {
                                reject(value)
                            });
                        //Buscar si existen scripts en last.sql para ejecutarlos después de insertar o actualizar la capsula
                        await fs.exists(dirTemp + '\\tmp\\' + elem + '\\files\\structure\\c_' + idCapsule + '\\scripts_db\\last.sql', (exists) => {
                            if(!exists){
                                existeLast = false;
                            }
                        });
                        if(existeLast) {
                            await fs.readFile(dirTemp + '\\tmp\\' + elem + '\\files\\structure\\c_' + idCapsule + '\\scripts_db\\last.sql', 'utf-8', async(err, data) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    await pool.executeQuery(data)
                                    console.log('Ejecutado script last.sql')
                                    arrCheckImport[i][2] = true;
                                    let stop = true;
                                    for(let j=0;j<arrCapsules.length;j++){
                                        if(arrCheckImport[j][0] === false || arrCheckImport[j][1] === false || arrCheckImport[j][2] === false){
                                            stop = false
                                            break;
                                        }
                                    }
                                    arrCheck = []
                                    if (stop)
                                        resolve('Terminada importacion')
                                }
                            });
                        }
                    }
                }
            }
            else
                reject(msgBreakImport)
        }
        else{
            reject('El archivo es incorrecto')
        }

    });

})

const checkCapsulesVersion = async (dirTemp) => new Promise(async (resolve, reject) => {
    const treeTmp = await dirTree(dirTemp+'\\tmp');
    let arrCapsules = [];
    //Crear arreglo con las capsulas ordenadas, dejando la principal al final
    if(treeTmp.children){
        for(let i=0;i<treeTmp.children.length;i++){
            if(treeTmp.children[i].name.indexOf("dep_") !== -1){
                arrCapsules.push(treeTmp.children[i].name)
            }
        }
        for(let i=0;i<treeTmp.children.length;i++){
            if(treeTmp.children[i].name.indexOf("main_") !== -1){
                arrCapsules.push(treeTmp.children[i].name)
            }
        }

        for (let i = 0; i < arrCapsules.length; i++){
            elem = arrCapsules[i]

            let id_section = ''
            let id_language = ''
            //Comprobar si la capsula existe, sino, crearla
            //Checkear version de la capsula
            let version = '1.0';
            let description = ' ';
            let licencetext = ' ';
            let nameCapsule = ''
            let idCapsule = ''
            //Obtener valores de la capsula del fichero .txt
            const tree = await dirTree(dirTemp + '\\tmp\\' + elem + '\\bd', {extensions: /\.txt/});
            if (tree.children) {
                await lineReader.eachLine(dirTemp + '\\tmp\\' + elem + '\\bd\\' + tree.children[0].name, async function (line, last) {
                    try {
                        if (line) {
                            let arrLine = line.split(',')
                            idCapsule = arrLine[0]
                            nameCapsule = arrLine[1]
                            description = arrLine[2]
                            version = arrLine[4]
                            licencetext = arrLine[6]
                            id_language = arrLine[12]
                        }
                    }
                    catch (err) {
                        console.log('Error leyendo el fichero')
                    }

                });
            }
            await sleep(50)
            let existeNameCap = false
            //Buscar si existe una capsula con el mismo nombre y distinto ID
            const paramsName = ['cfgapl.capsules', null, "WHERE namex = '" + nameCapsule + "' "]
            const resultName = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2,$3)', paramsName)
            if (resultName && resultName.rows[0].fn_get_register) {
                let idCap = resultName.rows[0].fn_get_register[0].id
                if (idCap !== idCapsule)
                    existeNameCap = true
                //Comparar version actual contra version importada
                let posCurrVersion = null
                let posImportVersion = null
                let currentVersion = resultName.rows[0].fn_get_register[0].version
                let arrCurrentVersion = currentVersion.split('.')
                let arrImportVersion = version.split('.')
                //1er nivel
                if (arrImportVersion)
                    posImportVersion = arrImportVersion[0]
                if (arrCurrentVersion)
                    posCurrVersion = arrCurrentVersion[0]
                if (posImportVersion && posCurrVersion) {
                    if (parseInt(posImportVersion) < parseInt(posCurrVersion)) {
                        console.log('La versión de ' + nameCapsule + ' es menor que la actual')
                        reject('La versión de ' + nameCapsule + ' es menor que la actual')
                    }
                }
                //2do nivel
                if (arrImportVersion && arrImportVersion[1])
                    posImportVersion = arrImportVersion[1]
                if (arrCurrentVersion && arrCurrentVersion[1])
                    posCurrVersion = arrCurrentVersion[1]
                if (posImportVersion && posCurrVersion) {
                    if (parseInt(posImportVersion) < parseInt(posCurrVersion)) {
                        console.log('La versión de ' + nameCapsule + ' es menor que la actual')
                        reject('La versión de ' + nameCapsule + ' es menor que la actual')
                    }
                }
                //3er nivel
                if (arrImportVersion && arrImportVersion[2])
                    posImportVersion = arrImportVersion[2]
                if (arrCurrentVersion && arrCurrentVersion[2])
                    posCurrVersion = arrCurrentVersion[2]
                if (posImportVersion && posCurrVersion) {
                    if (parseInt(posImportVersion) < parseInt(posCurrVersion)) {
                        console.log('La versión de ' + nameCapsule + ' es menor que la actual')
                        reject('La versión de ' + nameCapsule + ' es menor que la actual')
                    }
                }

            }
        }
        resolve('Verificacion de capsulas correcta')
    }
})

const copyFromFilesBD = async (req, dirTemp, nameFolder) => new Promise(async (resolve, reject) => {

    let nameFileStructure = ''
    //Después de extraer, procesar ficheros a importar
    const tree = await dirTree(dirTemp+'\\tmp\\'+nameFolder+'\\bd', { extensions: /\.sql/ });
    if(tree.children) {
        nameFileStructure = tree.children[0].name
        await fs.readFile(dirTemp + '\\tmp\\'+nameFolder+'\\bd\\' + nameFileStructure, 'utf-8', async (err, data) => {
            if (err) {
                reject(err)
            } else {
                await pool.executeQuery(data)
                console.log('Importada estructura!')
                //Proceder a importar datos
                const tree = await dirTree(dirTemp+'\\tmp\\'+nameFolder+'\\bd', { extensions: /\.csv/ });
                const client = await pool.obj_pool.connect()
                let orderedArr = await quickSort(tree.children)
                if(orderedArr){
                    let largoChildren = orderedArr.length
                    try {
                        //Array de flags para lanzar resolve
                        for (let i = 0; i < largoChildren; i++)
                            arrCheck.push(false)

                        for (let i = 0; i < largoChildren; i++) {
                            let nameFile = orderedArr[i].name
                            //Obtener nombre de la tabla
                            let index = nameFile.indexOf("[n]")
                            let first_part = nameFile.substring(0, index)
                            let index_first_part = first_part.indexOf("_")
                            let nameTable = nameFile.substring(index_first_part + 1, index)
                            //await client.query("ALTER TABLE " + nameTable + " DISABLE TRIGGER ALL;")
                            let campoLlave = ''
                            let arrTable = nameTable.split('.');
                            let nombreTabla = arrTable[1]
                            let nombreEsquema = arrTable[0]
                            let queryKey = "SELECT col.column_name AS columna FROM information_schema.key_column_usage " +
                                "AS col LEFT JOIN information_schema.table_constraints AS t ON t.constraint_name = col.constraint_name " +
                                "WHERE t.table_name = '"+nombreTabla+"' AND t.table_schema = '"+nombreEsquema+"' " +
                                "AND t.constraint_type = 'PRIMARY KEY'; "
                            const resultKey = await pool.executeQuery(queryKey)
                            if(resultKey && resultKey.rows[0])
                                campoLlave = resultKey.rows[0].columna
                            //Importar de este fichero
                            await fs.readFile(dirTemp + '\\tmp\\'+nameFolder+'\\bd\\' + nameFile, 'utf-8', async (err, data) => {
                                if (err) {
                                    reject(err)
                                } else {
                                    //Importar de este fichero
                                    var d = new Date();
                                    var nameTempTable = nameTable + '_' + d.getSeconds() + '' + d.getMilliseconds();
                                    let queryCopy = "CREATE TABLE " + nameTempTable + " AS (SELECT * FROM " + nameTable + "); " +
                                        "DELETE FROM " + nameTempTable + "; " +
                                        "COPY " + nameTempTable + " FROM STDIN WITH NULL as 'NULL' DELIMITER ';';";
                                    var stream = await client.query(copyFrom(queryCopy))
                                    var fileStream = await fs.createReadStream(dirTemp + '\\tmp\\'+nameFolder+'\\bd\\' + nameFile)
                                    fileStream.on('error', async function (err) {
                                        console.log(nameTable + ': ', err)
                                        //await pool.executeQuery("ALTER TABLE "+nameTable+" ENABLE TRIGGER ALL;")
                                    })
                                    stream.on('error', async function (err) {
                                        reject(err)
                                        console.log(nameTable + ': ', err)
                                    })
                                    stream.on('finish', async() => {
                                        //Procesar tabla
                                        let paramsCopy = [nameTable, nameTempTable, campoLlave]
                                        const query = "SELECT cfgapl.fn_import_table_from_copy($1,$2,$3)"
                                        const resultCopy = await pool.executeQuery(query, paramsCopy)
                                        console.log(nameTable + ': ', resultCopy.rows[0].fn_import_table_from_copy)
                                        arrCheck[i] = true;
                                        let stop = true;
                                        for(let j=0;j<arrCheck.length;j++) {
                                            if(arrCheck[j] == false) {
                                                stop = false;
                                                break;
                                            }
                                        }
                                        if(stop)
                                            resolve('Terminada importacion')
                                    })
                                    fileStream.pipe(stream)

                                }
                            });
                        }

                    }
                    catch(err){
                        console.log(err)
                        reject(err)
                    }

                }
                else reject('Error de importación')
            }
        });

    }
    else {
        reject('Error de importación')
    }
})

const copyFromFilesStructure = async (req, dirTemp, nameFolder) => new Promise(async (resolve, reject) => {
    let resultStructure = true
    let resultReports = true
    let resultAttach = true
    let msg = ''


    const dirFolderStructure = dirTemp + '\\tmp\\'+nameFolder+'\\files\\structure'
    const dirFolderReports = dirTemp + '\\tmp\\'+nameFolder+'\\files\\reports'
    const dirFolderAttach = dirTemp + '\\tmp\\'+nameFolder+'\\files\\attach'
    //Importar estructura de la capsula
    await generateImportFilesStructure(dirFolderStructure)
        .then((value) => {
            console.log(value)
        })
        .catch((value) => {
            resultStructure = false
            console.log(value)
            msg = value
        });
    //Importar reportes de la capsula
    await generateImportFilesReports(dirFolderReports)
        .then((value) => {
            console.log(value)
        })
        .catch((value) => {
            resultReports = false
            console.log(value)
            msg = value
        });
    //Importar adjuntos de la capsula
    await generateImportFilesAttach(dirFolderAttach)
        .then((value) => {
            console.log(value)
        })
        .catch((value) => {
            resultAttach = false
            console.log(value)
            msg = value
        });
    if(resultStructure && resultReports && resultAttach)
        resolve('Estructura importada correctamente')
    else
        reject(msg)
})

const generateImportFilesStructure = async (dirFolderStructure) => new Promise(async (resolve, reject) => {
    ncp.limit = 16;

    ncp(dirFolderStructure, global.appRootApp + '\\capsules\\', function (err) {
        if (err) {
            reject(err)
        }
        resolve('Estructura capsula importada!')
    });
})

const generateImportFilesReports = async (dirFolderReports) => new Promise(async (resolve, reject) => {
    ncp.limit = 16;

    ncp(dirFolderReports, global.appRootApp + '\\resources\\reports\\informs\\', function (err) {
        if (err) {
            reject(err)
        }
        resolve('Reportes importados!')
    });
})

const generateImportFilesAttach = async (dirFolderAttach) => new Promise(async (resolve, reject) => {
    ncp.limit = 16;

    ncp(dirFolderAttach, global.appRootApp + '\\resources\\files\\', function (err) {
        if (err) {
            reject(err)
        }
        resolve('Adjuntos importados!')
    });
})

const saveDatabase = async () => {
    let success = true
    let msg = ''
    let currentDate = new Date()
    const rutaFichero = global.appRootApp + 'resources\\salva_bd.bat'
    const rutaSalida = global.appRootApp + 'resources\\save_restore'
    //Generar o sobrescribir el fichero .bat
    //Obtener parametros ruta al pg dump
    let pg_dump = ''
    let nameFile = pool.config_bd.database+'_'+currentDate.getSeconds()+currentDate.getMilliseconds()+'.backup'
    nameBackupBD = nameFile
    const paramPgDump = ['cfgapl.general',null,"WHERE variable = 'dir_pg_dump' "]
    const resultPgDump = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2,$3)', paramPgDump)
    if(resultPgDump && resultPgDump.rows && resultPgDump.rows[0] && resultPgDump.rows[0].fn_get_register)
        pg_dump = resultPgDump.rows[0].fn_get_register[0].value
    let content = '@echo off\nset pgpassword='+pool.config_bd.password+'\n' +
        'CD "'+rutaSalida+'"\n"'+pg_dump+'" -h '+pool.config_bd.host+' -p '+pool.config_bd.port+' -U '+pool.config_bd.user+' ' +
        '-F c -b -v -f "'+nameFile+'" '+pool.config_bd.database

    if(pg_dump !== '') {
        try{
            fs.writeFileSync(rutaFichero, content, 'utf8');
        }catch (e){
            msg = 'No se puede escribir el fichero '+e;
        }
        await generateDatabaseBackup(rutaFichero)
            .then((value) => {
                msg = rutaSalida+'\\'+nameFile
                console.log(value)
            })
            .catch((value) => {
                success = false
                console.log(value)
                msg = value
            });
    }
    else{
        success = false
        msg = 'No está registrado el parámetro: dir_pg_dump';
    }

    return {'success': success, 'datos': msg}
}

const generateDatabaseBackup = async (ruta) => new Promise(async (resolve, reject) => {
    if(fs.existsSync(ruta)){
        const ls = spawn(ruta);
        ls.stdout.on('data', function (data) {
            console.log('stdout: ' + data);
        });

        ls.stderr.on('data', function (data) {
            //console.log('stderr: ' + data);
        });

        ls.on('exit', function (code) {
            if(code === 0)
               resolve('Backup de la BD generado satisfactoriamente')
            else
               reject('Error generando el backup con código '+code)
        });
    }
    else
        reject('El fichero no existe!')
})

const saveAplication = async () => {
    let success = true
    let msg = ''

    //Exportar estructura de la capsula
    let currentDate = new Date()
    let dirApp = pool.config_bd.database+'_'+currentDate.getSeconds()+currentDate.getMilliseconds()

    await generateBackupApplication(dirApp)
        .then((value) => {
           msg = value
           console.log('Backup de la aplicación generado satisfactoriamente')
            fs.mkdirSync(global.appRootApp + '\\resources\\save_restore\\'+dirApp+'\\resources\\save_restore', {recursive: true}, (err) => {
                if (err) {
                    success = false;
                    msg = 'Ha ocurrido un error, ' + err
                }
            });
        })
        .catch((value) => {
            success = false
            msg = value
        });
    if(success) {
        const tree = await dirTree(global.appRootApp + '\\resources\\save_restore', {extensions: /\.backup/});
        let nameFile = ''
        if (tree.children) {
            for (let i = 0; i < tree.children.length; i++) {
                if (tree.children[i].name === nameBackupBD) {
                    nameFile = tree.children[i].name
                    break;
                }
            }
        }

        fs.copyFileSync(global.appRootApp + 'resources\\save_restore\\' + nameFile, global.appRootApp + '\\resources\\save_restore\\' + dirApp + '\\' + nameFile);
        //Comprimir toda la salva para descargar
        if (success) {
            await archiveDirectory(global.appRootApp + 'resources\\save_restore\\' + dirApp)
                .then((value) => {
                    console.log(value)
                    msg = value
                })
                .catch((value) => {
                    success = false
                    console.log(value)
                });
        }
    }

    return {'success': success, 'datos': msg}
}

const generateBackupApplication = async (dirApp) => new Promise(async (resolve, reject) => {
    ncp.limit = 30;
    let options = {
        filter: function (file) {
            let res = (file.toString().indexOf("\\save_restore") !== -1 || file.toString().indexOf("\\node_modules") !== -1
            || file.toString().indexOf("\\html") !== -1);
            return !res;
        },
    };
    let dirDestination = global.appRootApp + '\\resources\\save_restore\\'+dirApp
    ncp(global.appRootApp, dirDestination, options, function (err) {
        if (err) {
            reject(err)
        }
        resolve(dirDestination)
    });

})

const importBackup = (dirFolderRestoreGlobal,globalDir) => new Promise(async (resolve, reject) => {
    let success = true
    let msg = ''
    const tree = await dirTree(dirFolderRestoreGlobal, { extensions: /\.zip/ });
    if(tree.children) {
        try {
            await uploadBackup(dirFolderRestoreGlobal, tree.children[0].name,globalDir)
                .then((value) => {
                    msg = value
                    console.log('Concluída restaura satisfactoriamente')
                })
                .catch((value) => {
                    success = false
                    msg = value
                    console.log('Concluída restaura con errores')
                });
        }
        catch (err) {
            msg = 'Ha ocurrido un error ' + err
            reject(msg)
        }
    }
    else{
        success = false
        msg = 'Ha ocurrido un error con el fichero subido'
    }
    let arrresolve = []
    arrresolve.push(success)
    arrresolve.push(msg)
    resolve(arrresolve)

})


const uploadBackup = (dirTemp,nameFile,globalDir) => new Promise(async (resolve, reject) => {
    const tipo = await fileType.fromFile(dirTemp + '/' + nameFile)
    //Comprobar fichero antes de iniciar el proceso
    if(tipo['ext'] == 'zip' && tipo['mime'] == 'application/zip'){
        try {
            await extract(dirTemp + '/' + nameFile, {dir: dirTemp + '\\tmp'})
            //Chequear término de importación para hacer resolve
            arrCheckImport.push(false)
            arrCheckImport.push(false)
            await restoreBD(dirTemp,globalDir)
                .then((value) => {
                    arrCheckImport[0] = true;
                    let stop = true;
                    if(arrCheckImport[1] == false) {
                        stop = false;
                    }
                    if(stop)
                        resolve('Backup de la aplicacion y base de datos restaurado')
                })
                .catch((value) => {
                    reject(value)
                });

            await restoreApp(dirTemp,globalDir)
                .then((value) => {
                    arrCheckImport[1] = true;
                    let stop = true;
                    if(arrCheckImport[0] == false) {
                        stop = false;
                    }
                    if(stop)
                        resolve('Backup de la aplicacion y base de datos restaurado')
                })
                .catch((value) => {
                    reject(value)
                });
        }
        catch(err){
            reject(err)
        }
    }
    else{
        reject('El archivo es incorrecto')
    }

})

const restoreBD = (dirTemp,globalDir) => new Promise(async (resolve, reject) => {
    const rutaFicheroRestaura = globalDir + 'resources\\restaura_bd.bat'
    let rutaBackup = ''
    const tree = await dirTree(dirTemp+'\\tmp', { extensions: /\.backup/ });
    if(tree && tree.children){
        const largo = tree.children.length
        for(let i=0;i<largo;i++){
           if(tree.children[i].name.includes('.backup')){
               rutaBackup = dirTemp+'\\tmp\\' + tree.children[i].name
               break;
           }
        }
    }
    //Obtener parametros ruta al pg restore, dropdb y createdb
    let pg_restore = ''
    let dropdb = ''
    let createdb = ''
    let psql = ''
    const paramPgRestore = ['cfgapl.general',null,"WHERE variable = 'dir_pg_restore' "]
    const resultPgRestore = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2,$3)', paramPgRestore)
    const paramDropdb = ['cfgapl.general',null,"WHERE variable = 'dir_dropdb' "]
    const resultDropdb = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2,$3)', paramDropdb)
    const paramCreatedb = ['cfgapl.general',null,"WHERE variable = 'dir_createdb' "]
    const resultCreatedb = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2,$3)', paramCreatedb)
    const paramPsql = ['cfgapl.general',null,"WHERE variable = 'dir_psql' "]
    const resultPsql = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2,$3)', paramPsql)
    if(resultDropdb && resultDropdb.rows && resultDropdb.rows[0] && resultDropdb.rows[0].fn_get_register)
        dropdb = resultDropdb.rows[0].fn_get_register[0].value
    if(resultCreatedb && resultCreatedb.rows && resultCreatedb.rows[0] && resultCreatedb.rows[0].fn_get_register)
        createdb = resultCreatedb.rows[0].fn_get_register[0].value
    if(resultPgRestore && resultPgRestore.rows && resultPgRestore.rows[0] && resultPgRestore.rows[0].fn_get_register)
        pg_restore = resultPgRestore.rows[0].fn_get_register[0].value
    if(resultPsql && resultPsql.rows && resultPsql.rows[0] && resultPsql.rows[0].fn_get_register)
        psql = resultPsql.rows[0].fn_get_register[0].value

    if(pg_restore !== '' && dropdb !== '' && createdb !== '' && psql !== ''){
        let dbName = "'"+pool.config_bd.database+"'"
        let content = '@echo off\nset pgpassword='+pool.config_bd.password+'\n"'+psql+'" -d postgres -U '+pool.config_bd.user+' -p ' +
            ''+pool.config_bd.port+' -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '+dbName+' "\n"'+dropdb+'" -h '+pool.config_bd.host+' ' +
            '-U '+pool.config_bd.user+' '+pool.config_bd.database+'\n"'+createdb+'" -h '+pool.config_bd.host+' -p '+pool.config_bd.port+' ' +
            '-U '+pool.config_bd.user+' '+pool.config_bd.database+'\n"'+pg_restore+'" -U '+pool.config_bd.user+' -d ' +
            ''+pool.config_bd.database+' '+rutaBackup+''
        content.replace("\\resources", "\resources");

        try{
            fs.writeFileSync(rutaFicheroRestaura, content, 'utf8');
        }catch (e){
            reject('No se puede escribir el fichero '+e);
        }

        if(fs.existsSync(rutaFicheroRestaura)){
            const ls = spawn(rutaFicheroRestaura);
            ls.stdout.on('data', function (data) {
                console.log('stdout: ' + data);
            });

            ls.stderr.on('data', function (data) {
                //console.log('stderr: ' + data);
            });

            ls.on('exit', function (code) {
                if(code === 0){
                    //Eliminar fichero .backup
                    rutaBackup.replace("\\resources", "\resources");
                    fs.unlinkSync(rutaBackup, (err => {
                        if (err) {
                            console.log('No hay fichero .backup para borrar')
                            resolve('Backup de la BD importado satisfactoriamente')
                        }
                        else {
                            resolve('Backup de la BD importado satisfactoriamente')
                        }
                    }));
                    resolve('Backup de la BD importado satisfactoriamente')
                }
                else
                    reject('Error importando el backup de la BD con código '+code)
            });
        }
        else
            reject('El fichero no existe!')
    }
    else{
        reject('No están registrados todos los parámetros necesarios: dir_pg_restore, dropdb, createdb y psql')
    }
})

const restoreApp = (dirTemp,globalDir) => new Promise(async (resolve, reject) => {
    ncp.limit = 30;

    ncp(dirTemp + '\\tmp', globalDir, function (err) {
        if (err) {
            reject(err)
        }
        resolve('Backup de la aplicacion importado satisfactoriamente')
    });
})

const insertRegister = async (params_insert) => {
    const query = "SELECT cfgapl.fn_insert_register($1,$2,$3,$4,$5,$6)"
    const result = await pool.executeQuery(query, params_insert)

    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_insert_register == null) {
        return []
    }

    return result.rows[0].fn_insert_register
}

const updateRegister = async (params_insert) => {
    const query = "SELECT cfgapl.fn_update_register($1,$2,$3,$4)"
    const result = await pool.executeQuery(query, params_insert)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_update_register == null) {
        return []
    }
    return result.rows[0].fn_update_register
}

const cleanCapsuleFolder = async (tree,dirFullFolder) => new Promise(async (resolve, reject) => {
    if(tree.children){
        const largo = tree.children.length
        let eliminados = []
        for(let i=0;i<largo;i++)
            eliminados.push(false)

        for(let i=0;i<largo;i++){
            const elem = tree.children[i]
            if(elem.name.indexOf("dep_") !== -1 || elem.name.indexOf("main_") !== -1)
                eliminados[i] = true
            if(elem.name.indexOf("dep_") === -1 && elem.name.indexOf("main_") === -1){
                await rimraf(dirFullFolder+'\\'+elem.name, () => {
                    eliminados[i] = true;
                    let stop = true;
                    for(let j=0;j<largo;j++){
                        if(eliminados[j] == false){
                            stop = false
                            break;
                        }
                    }
                    if(stop)
                        resolve('Limpiada carpeta capsula')
                });
            }
        }

    }
    else reject('No existen carpetas a limpiar')
})

const importTable = (req,fileDir) => new Promise(async (resolve, reject) => {
    let success = true
    let msg = ''
    //Buscar la tabla dado el id section
    const params = ['cfgapl.sections',req.query.idsection]
    const resultSection = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', params)
    if (resultSection && resultSection.rows && resultSection.rows[0].fn_get_register){
        const idtable = resultSection.rows[0].fn_get_register[0].id_tables
        const params = ['cfgapl.tables',idtable]
        const resultTable = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', params)
        try {
            if (resultTable && resultTable.rows && resultTable.rows[0].fn_get_register) {
                //Si es excel leer con read-excel, si no leer con linereader
                let extension = ''
                let arrFileName = req.query.name.split('.')
                if (arrFileName) {
                    let lastPos = arrFileName.length - 1
                    extension = arrFileName[lastPos]
                }
                //Obtener encabezado del fichero para buscar campos únicos, con esto se comprueba la inserción o actualización
                let encabezado = ''
                let arrHeader = []
                let n_table = resultTable.rows[0].fn_get_register[0].n_table
                let n_schema = resultTable.rows[0].fn_get_register[0].n_schema
                const nameTable = n_schema+'.'+n_table
                const main_index = n_schema+'_'+n_table+'_idx'
                let resultIndex = await pool.executeQuery("select indexdef from pg_indexes where  tablename = '"+n_table+"' " +
                    "AND schemaname = '"+n_schema+"' AND indexname = '"+main_index+"'")
                let camposIndice = ''
                let arrCamposMainIndex = []
                let valoresIndice = ''
                if(resultIndex && resultIndex.rows) {
                    let indexdef = resultIndex.rows[0].indexdef
                    //De la definicion del index quedarme solo con los campos
                    const index1 = indexdef.indexOf("(")
                    const index2 = indexdef.indexOf(")")
                    camposIndice = indexdef.substring(index1+1,index2)
                    arrCamposMainIndex = camposIndice.split(',')
                }
                let importable = true
                if(extension === 'xls' || extension === 'xlsx') {
                    xlsxFile(fileDir).then(async (rows) => {
                        for (let i in rows){
                            if(i == 0) {
                                //console.log(rows[i])
                                arrHeader = rows[i]
                                for(let j in rows[i]){
                                    encabezado += rows[i][j]+","
                                }
                                encabezado = encabezado.substring(0,encabezado.length - 1)
                                //Chequear que los campos del main index existan en el encabezado
                                for (let j in arrCamposMainIndex){
                                    //console.log(rows[i][j]);
                                    let field = arrCamposMainIndex[j]
                                    field = field.trim()
                                    let coincide = false
                                    for(let k in rows[i]){
                                        const elem = rows[i][k]
                                        if(elem === field) {
                                            coincide = true
                                            break;
                                        }
                                    }
                                    if(!coincide){
                                        importable = false
                                        break;
                                    }
                                }
                                if(!importable)
                                    reject('El fichero debe contener todos los campos únicos de la tabla: '+camposIndice)
                            }
                            else{
                                if(!importable)
                                    break;
                                else{
                                    let fila = ''
                                    for(let k in rows[i]){
                                        let elem = rows[i][k]
                                        if(elem !== null) {
                                            elem = "'" + elem + "'"
                                            elem = elem.replace(',','.')
                                        }
                                        fila += elem+","
                                    }
                                    fila = fila.substring(0,fila.length - 1)
                                    //Buscar valores de los campos indice
                                    for(let j in arrCamposMainIndex){
                                       let field = arrCamposMainIndex[j]
                                       field = field.trim()
                                       for(let k in rows[i]){
                                            const elem = rows[0][k]
                                            if(elem === field) {
                                                let valor = null
                                                if(rows[i][k] !== "" && rows[i][k] !== null) {
                                                    valor = "'" + rows[i][k] + "'"
                                                    valor = valor.replace(',', '.')
                                                    valoresIndice += valor+","
                                                }
                                                break;
                                            }
                                       }
                                    }
                                    valoresIndice = valoresIndice.substring(0,valoresIndice.length - 1)
                                    const params = [nameTable,encabezado,fila,camposIndice,valoresIndice]
                                    const result = await pool.executeQuery("select cfgapl.fn_import_to_table_from_file($1,$2,$3,$4,$5)",params)
                                    valoresIndice = ''
                                }
                            }

                        }
                        resolve('Importación terminada')
                    })
                }
                else{
                    let counter = 1;
                    let firstLine = []
                    await lineReader.eachLine(fileDir, async function (line, last) {
                        try {
                            if (line) {
                                line = line.replace(/,/g, '.');
                                let arrLine = line.split(';')
                                if(counter == 1) {
                                    firstLine = arrLine
                                    encabezado = line
                                    encabezado = encabezado.replace(/;/g, ',');
                                    //Chequear que los campos del main index existan en el encabezado
                                    for (let i in arrCamposMainIndex){
                                        let field = arrCamposMainIndex[i]
                                        field = field.trim()
                                        let coincide = false
                                        for(let j in arrLine){
                                            const elem = arrLine[j]
                                            if(elem === field) {
                                                coincide = true
                                                break;
                                            }
                                        }
                                        if(!coincide){
                                            importable = false
                                            break;
                                        }
                                    }
                                    if(!importable)
                                        reject('El fichero debe contener todos los campos únicos de la tabla: '+camposIndice)
                                }
                                else {
                                    if(importable) {
                                        let fila = ''
                                        valoresIndice = ''
                                        for (let i in arrLine) {
                                            let elem = arrLine[i]
                                            if(elem !== "") {
                                                elem = "'" + elem + "'"
                                                elem = elem.replace(',','.')
                                            }
                                            else
                                                elem = "null"
                                            fila += elem+","
                                        }
                                        fila = fila.substring(0, fila.length - 1)
                                        //Buscar valores de los campos indice
                                        for(let i in arrCamposMainIndex){
                                            let field = arrCamposMainIndex[i]
                                            field = field.trim()
                                            for(let j in arrLine){
                                                const elem = firstLine[j]
                                                if(elem === field) {
                                                    let valor = ''
                                                    if(arrLine[j] !== "" && arrLine[j] !== null) {
                                                        valor = "'" + arrLine[j] + "'"
                                                        valor = valor.replace(',', '.')
                                                        valoresIndice += valor+","
                                                    }
                                                    break;
                                                }
                                            }
                                        }
                                        valoresIndice = valoresIndice.substring(0,valoresIndice.length - 1)
                                        const params = [nameTable,encabezado,fila,camposIndice,valoresIndice]
                                        //console.log(params)
                                        //console.log(line)
                                        const result = await pool.executeQuery("select cfgapl.fn_import_to_table_from_file($1,$2,$3,$4,$5)",params)
                                        //console.log(result.rows[0])
                                    }
                                    else
                                        reject('El fichero debe contener todos los campos únicos de la tabla: '+camposIndice)
                                }
                                counter += 1
                                if(last)
                                    resolve('Importación terminada')
                            }
                        }
                        catch (err) {
                            reject('Error leyendo el fichero ',err)
                        }

                    });
                }
            }
        }
        catch(err){
            reject(err)
        }

    }
})

/*const deleteDir = (dirFile, filename) => {
    let result = ''
    fs.unlink(dirFile + '/' + filename, (err => {
        if (err) console.log('No hay fichero');
        else {
            console.log("Archivo temporal borrado");
            fs.rmdir(dirFile, (err) => {
                if(!err) result = 'Eliminada carpeta temporal'
                else result = err
            })
        }
    }));
    fs.rmdir(dirFile, (err) => {
        if(!err) result = 'Eliminada carpeta temporal'
        else result = err
    })

    return result
}*/

const SortingAlgorithm = (a, b) => {
    let prop_a = a['name']
    let prop_b = b['name']
    let index_a = prop_a.indexOf("_")
    let index_b = prop_b.indexOf("_")
    let num_a = prop_a.substring(0, index_a)
    let num_b = prop_b.substring(0, index_b)

    if (Number(num_a) < Number(num_b)) {
        return -1;
    }
    if (Number(num_a) > Number(num_b)) {
        return 1;
    }
    return 0;
};

const quickSort = (
    unsortedArray,
    sortingAlgorithm = SortingAlgorithm
) => {
    // immutable version
    const sortedArray = [...unsortedArray];

    const swapArrayElements = (arrayToSwap, i, j) => {
        const a = arrayToSwap[i];
        arrayToSwap[i] = arrayToSwap[j];
        arrayToSwap[j] = a;
    };

    const partition = (arrayToDivide, start, end) => {
        const pivot = arrayToDivide[end];
        let splitIndex = start;
        for (let j = start; j <= end - 1; j++) {
            const sortValue = sortingAlgorithm(arrayToDivide[j], pivot);
            if (sortValue === -1) {
                swapArrayElements(arrayToDivide, splitIndex, j);
                splitIndex++;
            }
        }
        swapArrayElements(arrayToDivide, splitIndex, end);
        return splitIndex;
    };

    // Recursively sort sub-arrays.
    const recursiveSort = (arraytoSort, start, end) => {
        // stop condition
        if (start < end) {
            const pivotPosition = partition(arraytoSort, start, end);
            recursiveSort(arraytoSort, start, pivotPosition - 1);
            recursiveSort(arraytoSort, pivotPosition + 1, end);
        }
    };

    // Sort the entire array.
    recursiveSort(sortedArray, 0, unsortedArray.length - 1);
    return sortedArray;
};


objGenFunc.generateFunctions = generateFunctions
objGenFunc.generateFunctionsTimeEvents = generateFunctionsTimeEvents
objGenFunc.executeFunctionsButtons = executeFunctionsButtons
objGenFunc.saveCapsuleBD = saveCapsuleBD
objGenFunc.saveCapsuleFiles = saveCapsuleFiles
objGenFunc.generateFileCapsule = generateFileCapsule
objGenFunc.getCapsules = getCapsules
objGenFunc.importCapsule = importCapsule
objGenFunc.saveDatabase = saveDatabase
objGenFunc.saveAplication = saveAplication
objGenFunc.importBackup = importBackup
objGenFunc.generateZipCapsule = generateZipCapsule
objGenFunc.cleanCapsuleFolder = cleanCapsuleFolder
objGenFunc.insertRegister = insertRegister
objGenFunc.updateRegister = updateRegister
objGenFunc.importTable = importTable
module.exports = objGenFunc