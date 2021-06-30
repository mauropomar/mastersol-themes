const pool = require('../connection/server-db')
const cron = require('node-cron')
const fs = require('fs')
const objects = require('../modules');
const child_process = require('child_process');
const copyTo = require('pg-copy-streams').to
var stream = require('stream');
var archiver = require('archiver');
const rimraf = require("rimraf");
const fileType = require('file-type');
const zlib = require("zlib");
const extract = require('extract-zip')
const objGenFunc = {}

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

cron.schedule('1 * * * *', async () => {
    const dirFolder = global.appRootApp + '\\resources\\reports\\tmp'
    fs.readdir(dirFolder, (err, files) => {
        if (err) console.log(err)

        for (const file of files) {
            fs.unlink(dirFolder + '\\' + file, err => {
                if (err) console.log(err)
            });
        }
    });
});

cron.schedule('1 23 * * *', async () => {
    const dirFolder = global.appRootApp + '\\resources\\backups'
    rimraf(dirFolder, function () { console.log("Limpiada carpeta backups"); });
});

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
    console.log(extra_params)

    var success = false;
    var result = {'btn': '', 'type': '', 'value': '', 'msg': '', 'name':''}
    let flagResult = false
    if(idbutton) {
        const param_button = ['cfgapl.sections_buttons',idbutton]
        const resultButton = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', param_button)

        if (resultButton) {
            let requireDir = '../../capsules/' + 'c_' + resultButton.rows[0].fn_get_register[0].id_capsules + '/node_js/buttons/' + resultButton.rows[0].fn_get_register[0].js_name
            let dirFile = global.appRootApp + '\\capsules\\' + 'c_' + resultButton.rows[0].fn_get_register[0].id_capsules + '\\node_js\\buttons\\' + resultButton.rows[0].fn_get_register[0].js_name +'.js'
            const operacion = require(requireDir)
            if(fs.existsSync(dirFile)) {
                let report_name = ''
                //Si tiene reporte asociado hacer la gestion correspondiente
                if(resultButton.rows[0].fn_get_register[0].id_inform != null){
                    const param_inform = ['reports.informs',resultButton.rows[0].fn_get_register[0].id_inform]
                    const resultInform = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', param_inform)
                    if(resultInform) {
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
                if(!flagResult) {
                    result = await operacion.function(idsection, idregister, idbutton, iduser, idrol, report_name)
                    if (result)
                        success = true;
                }
            }
        }
    }
    return {'success': success, 'btn': result.btn, 'type': result.type, 'value': result.value, 'msg': result.msg, 'name': result.name}
}

const saveCapsule = async (req) => {
    let success = true
    let finalResult = ''
    let noSchema = false
    let noData = false

    const query = "SELECT cfgapl.fn_save_capsule($1)"
    const param_capsule = [req.body.idcapsule]
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
        const param_cap = ['cfgapl.capsules',req.body.idcapsule]
        const resultCap = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', param_cap)
        let name_capsule = ''
        if(resultCap){
            name_capsule =  resultCap.rows[0].fn_get_register[0].namex
        }
        const dirFolder = global.appRootApp + '\\resources\\backups\\'+name_capsule+'#'+Math.random()
        await generateExportFiles(req,dirFolder,resultSaveStructure)
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
        //Comprimir carpeta y devolver direccion de comprimido
        if(finalResult === dirFolder && !noSchema && !noData) {
            await archiveDirectory(dirFolder)
                .then((value) => {
                    finalResult = value
                    //Borrar carpeta con ficheros(me quedo solo con el comprimido)
                    rimraf(dirFolder, function () { console.log("Borrada carpeta exportacion"); });
                })
                .catch((value) => {
                    success = false
                    finalResult = value
                });
        }
        else if(!noSchema && !noData) {
            success = false
            finalResult = 'No hay estructura o datos para exportar'
        }
        else{
            success = false
        }
    }

    return {'success': success, 'datos': finalResult}
}

const generateExportFiles = async (req,dirFolder,resultSaveStructure) => new Promise(async (resolve, reject) => {
    let success = true
    await fs.mkdir(dirFolder, {recursive: true}, async (err) => {
        if (!err) {
            console.log('directorio salva creado')
            //Salvar fichero con estructura si existe
            if(resultSaveStructure) {
                let fileStructure = fs.createWriteStream(dirFolder + '\\e_' + Math.random() + '.sql')
                fileStructure.write(resultSaveStructure)
            }

            const query = "SELECT cfgapl.fn_get_ordered_tables_by_fk($1)"
            const param_capsule = [req.body.idcapsule]
            const result = await pool.executeQuery(query, param_capsule)
            if (result.success === false)
                success = false
            let resultOrdredTables = result.rows[0].fn_get_ordered_tables_by_fk
            //ciclar por las tablas dependientes de la capsula, ordenadas, para exportar los datos
            if(resultOrdredTables) {
                let arrTablas = resultOrdredTables.split(',');
                let largo_arr = arrTablas.length
                const client = await pool.obj_pool.connect()
                try {
                    for(let i = 0; i < largo_arr; i++){
                        let tabla = arrTablas[i]
                        let writeStream = await fs.createWriteStream(dirFolder + '\\' + i + '_' + tabla + Math.random() + '.csv');
                        writeStream.setMaxListeners(0);
                        var readStream = await client.query(copyTo("COPY (SELECT * FROM "+tabla+" WHERE id_capsules = '"+req.body.idcapsule+"') TO STDOUT with csv DELIMITER ';'"))
                        await copyStreamToFile(req,readStream,writeStream,tabla)
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


const copyStreamToFile = async (req,readStream,writeStream,tabla) => new Promise(async (resolve, reject) => {
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
    let output = await fs.createWriteStream(dirFolder+'.tar.gz');
    let archive = archiver('tar', {
        gzip: true,
        zlib: { level: 9 } // Sets the compression level.
    });
    archive.on('error', function(err) {
        reject(err)
    });
    output.on('close', () => {
        resolve(dirFolder+'.tar.gz')
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

const importCapsule = async (req) => {
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
        req.body.filename = 'Core#0.5388733270112278.tar.gz'  //para prueba
        var writeStream = await fs.createWriteStream(dirTemp + '\\' + req.body.filename);
        readStream.pipe(writeStream);
        await uploadFile(req,dirTemp,writeStream)
            .then((value) => {
                msg = value
            })
            .catch((value) => {
                success = false
                msg = value
            });
    }
    else{
        msg = 'Ha ocurrido un error'
    }

    return {'success': success, 'message': msg}
}

const uploadFile = (req,dirTemp,writeStream) => new Promise((resolve, reject) => {
    let success = true
    let msg = ''

    writeStream.on('finish', async function () {
        req.body.filename = 'Core#0.5388733270112278.tar.gz'
        const dirFile = dirTemp + '/' + req.body.filename
        const tipo = await fileType.fromFile(dirFile)
        //Comprobar fichero antes de iniciar el proceso
        if(tipo['ext'] == 'gz' && tipo['mime'] == 'application/gzip'){
            /*zlib.gzip(dirFile, (err, buffer) => {
                // Calling unzip method
                zlib.unzip(buffer, (err, buffer) => {
                    console.log('Dir Fichero: ',buffer.toString('utf8'));

                });
            });*/

            try {
                console.log('dir file ',dirFile)
                await extract(dirFile, { dir: dirTemp+'\\tmp' })
                console.log('Extraction complete')
            } catch (err) {
                // handle any errors
            }

            resolve('exito')
        }
        else{
            reject('El archivo es incorrecto')
        }

        //const delDir = deleteDir(dirTemp, req.body.filename)

    });

})

const deleteDir = (dirFile, filename) => {
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
}

objGenFunc.generateFunctions = generateFunctions
objGenFunc.generateFunctionsTimeEvents = generateFunctionsTimeEvents
objGenFunc.executeFunctionsButtons = executeFunctionsButtons
objGenFunc.saveCapsule = saveCapsule
objGenFunc.getCapsules = getCapsules
objGenFunc.importCapsule = importCapsule
module.exports = objGenFunc