const pool = require('../connection/server-db')
const cron = require('node-cron')
const fs = require('fs')
const objects = require('../modules');
const child_process = require('child_process');
const copyTo = require('pg-copy-streams').to;
const copyFrom = require('pg-copy-streams').from;
var stream = require('stream');
var archiver = require('archiver');
const rimraf = require("rimraf");
const fileType = require('file-type');
const extract = require('extract-zip')
const dirTree = require("directory-tree");
var lineReader = require('line-reader');
const invert = require('clean-directory');
const objGenFunc = {}
var arrCheck = [];

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
    await rimraf(dirFolder, () => console.log('Borrado reports tmp!'));
    await sleep(2000)
    fs.mkdir(dirFolder, (err) => {
        if (err) {
            throw err;
        }
        console.log("Reports tmp creado.");
    });
});

cron.schedule('1 23 * * *', async () => {
    const dirFolder = global.appRootApp + '\\resources\\backups'
    await rimraf(dirFolder, () => console.log('Borrado backups!'));
    await sleep(2000)
    fs.mkdir(dirFolder, (err) => {
        if (err) {
            throw err;
        }
        console.log("Backups creado.");
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
        let currentDate = new Date()
        const dirFolder = global.appRootApp + '\\resources\\backups\\'+name_capsule+'[n]'+req.body.idcapsule+'[n]'+currentDate.getSeconds()+currentDate.getMilliseconds()
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
                            var readStream = await client.query(copyTo("COPY (SELECT * FROM " + tabla + " WHERE id_capsules = '" + req.body.idcapsule + "') " +
                                "TO STDOUT WITH NULL as 'NULL' DELIMITER ';' "));
                            await copyStreamToFile(req, readStream, writeStream, tabla)
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
        await uploadFile(req,dirTemp,writeStream)
            .then((value) => {
                msg = value
                console.log('Concluída importación satisfactoriamente')
            })
            .catch((value) => {
                success = false
                msg = value
                console.log('Concluída importación con errores')
            });
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
            //Comprobar si la capsula existe, sino, crearla
            let arrName = req.body.name.split('[n]')
            let nameCapsule = arrName[0]
            let idCapsule = arrName[1]
            let existeNameCap = false
            //Buscar si existe una capsula con el mismo nombre
            const paramsName = ['cfgapl.capsules',null,"WHERE namex = '"+nameCapsule+"' "]
            const resultName = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2,$3)', paramsName)
            if(resultName && resultName.rows[0].fn_get_register){
                let idCap = resultName.rows[0].fn_get_register[0].id
                if(idCap !== idCapsule)
                    existeNameCap = true
            }
            const paramsCapsule = ['cfgapl.capsules',idCapsule]
            const resultCapsule = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', paramsCapsule)
            let id_section, id_language;
            //Obtencion de section capsule
            const paramsSectionCapsule = ['cfgapl.sections',null,"WHERE namex = 'Sec_capsules' "];
            const resultSectionCapsule = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2,$3)', paramsSectionCapsule);
            if(resultSectionCapsule)
                id_section = resultSectionCapsule.rows[0].fn_get_register[0].id
            if(resultCapsule && !resultCapsule.rows[0].fn_get_register) {
                 var paramsInsert = [], columnasInsertAux = [], valuesInsertAux = [];
                 //Obtencion de lenguaje spanish
                 const paramsLanguage = ['cfgapl.languages',null,"WHERE namex = 'Spanish from Spain' "];
                 const resultLanguage = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2,$3)', paramsLanguage);
                 if(resultLanguage)
                     id_language = resultLanguage.rows[0].fn_get_register[0].id
                //Obtencion de section
                 //columnas a insertar
                 columnasInsertAux.push('id')
                 columnasInsertAux.push('namex')
                 columnasInsertAux.push('description')
                 columnasInsertAux.push('version')
                 columnasInsertAux.push('licencetext')
                 columnasInsertAux.push('idlanguage')
                 columnasInsertAux.push('creator')
                 //valores a insertar
                 if(existeNameCap)
                     nameCapsule += ' '
                 valuesInsertAux.push(" '" + idCapsule + "'")
                 valuesInsertAux.push(" '" + nameCapsule + "'")
                 valuesInsertAux.push(" '" + nameCapsule + "'")
                 valuesInsertAux.push(" '1.0'")
                 valuesInsertAux.push(" ' '")
                 valuesInsertAux.push(" '" + id_language + "'")
                 valuesInsertAux.push("'" + req.session.id_user + "'")

                 paramsInsert.push(id_section)
                 paramsInsert.push(columnasInsertAux.join(','))
                 paramsInsert.push(valuesInsertAux.join(','))
                 paramsInsert.push(null)
                 paramsInsert.push(null)
                 paramsInsert.push(req.session.id_user)

                await insertRegister(req, paramsInsert);
                console.log('Insertada capsula!')
            }
            else if(resultCapsule && resultCapsule.rows[0].fn_get_register){
                var paramsInsert = [], valuesInsertAux = [];
                valuesInsertAux.push("namex = '" + nameCapsule + "'" )
                valuesInsertAux.push("modifier = '" + req.session.id_user + "'" )

                paramsInsert.push(id_section)
                paramsInsert.push(valuesInsertAux.join(','))
                paramsInsert.push(idCapsule)
                paramsInsert.push(req.session.id_user)
                await updateRegister(req, paramsInsert);
                console.log('Actualizada capsula!')
            }
            await copyFromFiles(req, dirTemp, dirFile)
                .then((value) => {
                    resolve(value)
                })
                .catch((value) => {
                    reject(value)
                });
        }
        else{
            reject('El archivo es incorrecto')
        }

    });

})

const copyFromFiles = async (req, dirTemp, dirFile) => new Promise(async (resolve, reject) => {
    let nameFileStructure = ''
    await extract(dirFile, { dir: dirTemp+'\\tmp' })
    //Después de extraer, procesar ficheros a importar
    const tree = await dirTree(dirTemp+'\\tmp', { extensions: /\.sql/ });
    if(tree.children) {
        nameFileStructure = tree.children[0].name
        await fs.readFile(dirTemp + '\\tmp\\' + nameFileStructure, 'utf-8', async (err, data) => {
            if (err) {
                reject(err)
            } else {
                await pool.executeQuery(data)
                console.log('Importada estructura!')
                //Proceder a importar datos
                const tree = await dirTree(dirTemp+'\\tmp', { extensions: /\.csv/ });
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
                            await fs.readFile(dirTemp + '\\tmp\\' + nameFile, 'utf-8', async (err, data) => {
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
                                    var fileStream = await fs.createReadStream(dirTemp + '\\tmp\\' + nameFile)
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


const insertRegister = async (req, params_insert) => {
    const query = "SELECT cfgapl.fn_insert_register($1,$2,$3,$4,$5,$6)"
    const result = await pool.executeQuery(query, params_insert)

    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_insert_register == null) {
        return []
    }

    return result.rows[0].fn_insert_register
}

const updateRegister = async (req, params_insert) => {
    const query = "SELECT cfgapl.fn_update_register($1,$2,$3,$4)"
    const result = await pool.executeQuery(query, params_insert)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_update_register == null) {
        return []
    }
    return result.rows[0].fn_update_register
}

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

Array.prototype.orderByNumberInString=function(property){
    // Primero se verifica que la propiedad sortOrder tenga un dato válido.
   // if (sortOrder!=-1 && sortOrder!=1) sortOrder=1;
    this.sort(function(a,b){
        // La función de ordenamiento devuelve la comparación entre property de a y b.
        // El resultado será afectado por sortOrder.
        let prop_a = a[property]
        let prop_b = b[property]
        let index_a = prop_a.indexOf("_")
        let index_b = prop_b.indexOf("_")
        let num_a = prop_a.substring(0, index_a)
        let num_b = prop_b.substring(0, index_b)
        return (num_a-num_b);
    })
}

objGenFunc.generateFunctions = generateFunctions
objGenFunc.generateFunctionsTimeEvents = generateFunctionsTimeEvents
objGenFunc.executeFunctionsButtons = executeFunctionsButtons
objGenFunc.saveCapsule = saveCapsule
objGenFunc.getCapsules = getCapsules
objGenFunc.importCapsule = importCapsule
module.exports = objGenFunc