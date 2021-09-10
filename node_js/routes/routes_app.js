var express = require("express");
const pool = require('../connection/server-db')
var router = express.Router();
var fs = require('fs');
const rimraf = require("rimraf");
const multer = require("multer")
var path = require("path")
const objects = require('../modules');
const dirTree = require("directory-tree");
var dirFolderRestoreGlobal = '';
var dirFolderImageDesktopGlobal = '';
var dirFolderImportTableGlobal = '';
var originalFileName = '';
var originalImportFileName = '';

/*Obtener lenguajes*/
router.get('/languages', async function (req, res) {
    const result = await objects.languages.getLanguages(req)
    res.json(result)
})

/*Obtener lenguajes por usuario*/
router.get('/languagesbyuser', async function (req, res) {
    const result = await objects.languages.getLanguagesByUser(req)
    res.json(result)
})

/*Obtener accesos directos*/
router.get('/shortcut', async function (req, res) {
    const result = await objects.shortcut.getShortcut()
    res.json(result)
})

router.post('/delshortcut', async function (req, res) {
    const result = await objects.shortcut.deleteShortcut(req)
    if (result.success === false) {
        return res.json(result)
    } else {
        res.json(result)
    }
})

router.post('/addshortcut', async function (req, res) {
    const result = await objects.shortcut.addShortcut(req)
    if (result.success === false) {
        return res.json(result)
    }else {
        return res.json({'success': true, 'datos': result, 'message': ''})
    }
})

/*Obtener menu configuración*/
router.get('/menuconfiguration', async function (req, res) {
    const result = await objects.menuconfiguration.getMenuConfiguration(req)
    res.json(result)
})

/*Obtener menu opciones*/
router.get('/menusoption', async function (req, res) {
    const result = await objects.menusoption.getMenuOption(req)
    res.json(result)
})

/*Obtener roles*/
router.get('/roles', async function (req, res) {
    const result = await objects.roles.getRoles(req)
    res.json(result)
})

/*Obtener roles por usuario*/
router.get('/rolesbyuser', async function (req, res) {
    const result = await objects.roles.getRolesByUser(req)
    res.json(result)
})

/*Obtener propiedades tablas*/
router.get('/getproperties', async function (req, res) {
    const result = await objects.tables.getProperties(req)
    res.json(result)
})

/*Obtener sections*/
router.post('/sections', async function (req, res) {
    const result = await objects.sections.getSections(req)
    if (result.success === false) {
        return res.json(result)
    } else {
        res.json(result)
    }
})

/*Obtener actions*/
router.get('/actions', async function (req, res) {
    const result = await objects.tables.getActions()
    res.json(result)
})

/*Obtener filter menus*/
router.get('/filtermenus', async function (req, res) {
    const result = await objects.menusoption.getFilterMenus(req)
    res.json(result)
})

/*Obtener foreignkey*/
router.get('/foreignkey', async function (req, res) {
    const result = await objects.register.getForeignkey(req)
    res.json(result)
})

/*Obtener filtros operadores*/
router.get('/filtersoperators', async function (req, res) {
    const result = await objects.filters.getFiltersOperators(req)
    res.json(result)
})

/*Obtener funciones resumen*/
router.get('/functionsresume', async function (req, res) {
    const result = await objects.filters.getFunctionsResume(req)
    res.json(result)
})

/*CRUD*/
/*Obtener adjuntos*/
router.get('/adjuntos', async function (req, res) {
    const result = await objects.adjuntos.getAdjuntos(req)
    return res.json({'success': result ? true : false, 'datos': result})
})

/*CRUD adjuntos*/
router.post('/crudadjunto', async function (req, res) {
    let id = ''
    if (req.body.accion === '13') { //Insert
        result = await objects.adjuntos.insertAdjunto(req)
        id = result.id
    } else if (req.body.accion === '7') { //Delete
        result = await objects.adjuntos.deleteAdjunto(req)
    } else if (req.body.accion === '15') { //Descargar adjunto
        result = await objects.adjuntos.downloadAdjunto(req)
    }
    return res.json({'id': id, 'success': result.success ? true : false, 'datos': result.message, 'ruta': result.ruta})

})

/*CRUD*/
/*Obtener notas*/
router.get('/notes', async function (req, res) {
    const result = await objects.notes.getNotes(req)
    res.json(result)
})
/*CRUD notes*/
router.post('/crudnotes', async function (req, res) {
    var result;

    if (req.body.accion === '13') { //Insert
        result = await objects.notes.insertNote(req)
    } else if (req.body.accion === '14') { //Update
        result = await objects.notes.updateNote(req)
    } else if (req.body.accion === '7') { //Delete
        result = await objects.notes.deleteNote(req)
    }

    if (result.success === false) {
        return res.json(result)
    } else {
        return res.json({'success': true, 'datos': result})
    }
})

/*Obtener auditorias*/
router.get('/auditorias', async function (req, res) {
    const result = await objects.auditorias.getAuditorias(req)
    res.json(result)
})

/*Filtrar auditorias*/
router.get('/filterauditorias', async function (req, res) {
    const result = await objects.auditorias.getFilterAuditorias(req)
    if (result.success === false) {
        res.json(result)
    } else {
        res.json({'datos': result})
    }
})

/*Obtener registros secciones hijas*/
router.get('/getregisters', async function (req, res) {
    const result = await objects.register.getRegister(req)
    res.json(result)
})

/*CRUD registros*/
router.post('/crudregister', async function (req, res) {
    var result;

    if (req.body.accion === '13') { //Insert
        result = await objects.register.insertRegister(req, objects)
    } else if (req.body.accion === '14') { //Update
        result = await objects.register.updateRegister(req, objects)
    } else if (req.body.accion === '7') { //Delete
        result = await objects.register.deleteRegister(req)
    }

    if (result.success === false) {
        return res.json(result)
    }
    else if (req.body.accion === '7' && result.includes('ERROR')){
        return res.json({'success': false, 'datos': result, 'message': result})
    }
    else {
        return res.json({'success': true, 'datos': result, 'message': ''})
    }

})

router.post('/resultfilteroperators', async function (req, res) {
    var result = await objects.filters.getResultFiltersOperators(req, objects)
    if (result.success === false) {
        return res.json(result)
    } else {
        return res.json({'success': true, 'datos': result.datos, 'totales': result.totales})
    }
})

router.post('/resultfilterfunctions', async function (req, res) {
    var result = await objects.filters.getResultFiltersFunctions(req, objects)
    if (result.success === false) {
        return res.json(result)
    } else {
        return res.json({'success': true, 'datos': result.datos})
    }
})

router.get('/getusers', async function (req, res) {
    var result = await objects.users.getUsers(req)
    res.json(result)
})

router.post('/insoptionuser', async function (req, res) {
    var result = await objects.users.insertOptionuser(req)
    let success = true
    if(result.includes('ERROR: '))
        success = false

    return res.json({'success': success, 'message': result})
})

router.get('/managerfunctions', async function (req, res) {
    var result = await objects.functions.generateFunctions(req, objects)
    res.json({'data': result})
})

router.get('/managerfunctionsevent', async function (req, res) {
    /*var result = await objects.functions.generateFunctionsTimeEvents(req, objects)
    res.json({'data': result})*/
})

router.get('/executebuttons', async function (req, res) {
    var result = await objects.functions.executeFunctionsButtons(req, objects)
    if (result.success === false) {
        return res.json(result)
    }
    else if(result.type == 5){
        let resultado = {'success': true, 'btn': result.btn, 'type': result.type, 'value': result.value, 'msg': result.msg, 'name': result.name}
        let jasper = result.value
        let time = 500
        let flag = false
        for(let i=0;i<12;i++){
            if(!flag) {
                try {
                    await sleep(time)
                    resultado = await processJasper(jasper, result, req, result.name)
                    if(resultado.msg != 'No se pudo procesar el reporte')
                        flag = true
                }
                catch (e) {
                    console.log(e)
                }
            }

            if(flag) break;
            time += 500
        }
        return res.json(resultado)
    }
    else if(result.type == 7)
        return res.json({'success': true, 'btn': result.btn, 'type': result.type, 'value': result.value, 'msg': result.msg, 'name': result.name, 'title': result.title, 'label_x': result.label_x, 'label_y': result.label_y, 'legend': result.legend, 'legend_pos': result.legend_pos, 'sql_label': result.sql_label})
    else
        return res.json({'success': true, 'btn': result.btn, 'type': result.type, 'value': result.value, 'msg': result.msg, 'name': result.name})

})

const processJasper = async (jasper, result, req, nameReport) => {
    let print = null
    let currentDate = new Date()
    let randomName = nameReport+'_'+currentDate.getFullYear()+currentDate.getMonth()+currentDate.getDate()+currentDate.getMinutes()+currentDate.getSeconds()+currentDate.getMilliseconds()
    let tmpFile = global.appRootApp + '\\resources\\reports\\tmp\\' + randomName
    let dirFile = '../resources/reports/tmp/'+randomName
    if(jasper) {
        let objParams = {}
        let jsonParams = req.query.extra_params != "" ? JSON.parse(req.query.extra_params) : "";
        //Tratar report params
        let sql_filters = ''
        if(jsonParams != "") {
            let where = false
            for (let i = 0; i < jsonParams.length; i++) {
                let elem = jsonParams[i]
                //Concatenar a la consulta los filtros en dependencia de las sentencias q tenga
                //Transformar operadores si es necesario
                if (elem.operador == 'contiene') {
                    elem.operador = 'ilike'
                    elem.value = '%' + elem.value + '%'
                }
                sql_filters += (!where ? " where " : " and ") + " " + elem.name + " " + elem.operador + " '" + elem.value + "'";
                where = true
            }
        }

        objParams['filtros'] = sql_filters
        let report = {
            report: 'hw',
            data: objParams
        };
        //console.log(objParams)
        if(req.query.report_format === 'html') {
            tmpFile = tmpFile + '.html'
            dirFile = dirFile + '.html'
            print = await jasper.export(report, 'html');
        }
        else if(req.query.report_format === 'pdf') {
            tmpFile = tmpFile + '.pdf'
            dirFile = dirFile + '.pdf'
            print = await jasper.export(report, 'pdf');
        }
        else if(req.query.report_format === 'xlsx') {
            tmpFile = tmpFile + '.xlsx'
            dirFile = dirFile + '.xlsx'
            print = await jasper.export(report, 'xlsx');
        }
        else if(req.query.report_format === 'xls') {
            tmpFile = tmpFile + '.xls'
            dirFile = dirFile + '.xls'
            print = await jasper.export(report, 'xls');
        }
        else if(req.query.report_format === 'docx') {
            tmpFile = tmpFile + '.docx'
            dirFile = dirFile + '.docx'
            print = await jasper.export(report, 'docx');
        }
        else if(req.query.report_format === 'doc') {
            tmpFile = tmpFile + '.doc'
            dirFile = dirFile + '.doc'
            print = await jasper.export(report, 'doc');
        }
        else if(req.query.report_format === 'odt') {
            tmpFile = tmpFile + '.odt'
            dirFile = dirFile + '.odt'
            print = await jasper.export(report, 'odt');
        }
        if(print === 'No se pudo procesar el reporte') {
            return {'success': false, 'btn': result.btn, 'type': 5, 'value': '', 'msg': print, 'name': result.name}
        }
        else {
            let resultSaveFile = await objects.reports.saveReportFile(tmpFile, print)
            return {
                'success': resultSaveFile.success,
                'btn': result.btn,
                'type': 5,
                'value': dirFile,
                'msg': resultSaveFile.msg,
                'name': result.name
            }
        }
    }
    else
        return {'success': false, 'btn':  result.btn, 'type': 5, 'value': '', 'msg': 'Ha ocurrido un error al imprimir el reporte', 'name': result.name}

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

router.get('/newalerts', async function (req, res) {
    var result = await objects.alerts.getUser(req)
    res.json({'data': result})
})

router.post('/savecapsule', async function (req, res) {
    const idcapsule = req.body.idcapsule
    let msg = ''
    let successFull = true
    let currentDate = new Date()
    const subcapsule = idcapsule.substring(0,6)
    const dirFullFolder = global.appRootApp + '\\resources\\backups\\full_'+subcapsule+'[n]'+currentDate.getSeconds()+currentDate.getMilliseconds()
    await fs.mkdirSync(dirFullFolder, {recursive: true}, (err) => {
        if (err) {
            successFull = false;
            msg = 'Error creando la carpeta, ' + err
        }
    });
    await fs.exists(dirFullFolder, (exists) => {
        if(!exists){
            successFull = false;
            msg = 'Ha ocurrido un error'
        }
    });
    if(successFull) {
        //Buscar y exportar todas las dependencias, luego la principal
        const paramsDependencies = ['cfgapl.capsules_dependency', null, "WHERE id_capsules = '" + idcapsule + "' "]
        const resultDependencies = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2,$3)', paramsDependencies)
        if (resultDependencies && resultDependencies.rows && resultDependencies.rows[0].fn_get_register) {
            if (resultDependencies.rows[0].fn_get_register.length > 0) {
                for (let i = 0; i < resultDependencies.rows[0].fn_get_register.length; i++) {
                    const elem = resultDependencies.rows[0].fn_get_register[i]
                    let idcapsule_dep = elem.id_capsules_dependency
                    let resultBD = await objects.functions.saveCapsuleBD(idcapsule_dep, dirFullFolder)
                    let resultFile = await objects.functions.saveCapsuleFiles(idcapsule_dep, dirFullFolder)
                    let resultFolder = await objects.functions.generateFileCapsule(idcapsule_dep, dirFullFolder, resultBD.datos, resultFile.datos, true)

                    let successFolder = resultFolder.success
                    let successBD = resultBD.success
                    let successFile = resultFile.success
                    if (!successBD || !successFile || !successFolder) {
                        msg = 'Ha ocurrido un error exportando una dependencia'
                        break;
                    }
                }
            }
        }
        if (msg === '') {
            var resultBD = await objects.functions.saveCapsuleBD(idcapsule, dirFullFolder)
            var resultFile = await objects.functions.saveCapsuleFiles(idcapsule, dirFullFolder)
            let resultFolder = await objects.functions.generateFileCapsule(idcapsule, dirFullFolder, resultBD.datos, resultFile.datos)

            let successFolder = resultFolder.success
            let successBD = resultBD.success
            let successFile = resultFile.success
            if (!successBD || !successFile || !resultFolder) {
                msg = 'Ha ocurrido un error exportando la cápsula'
                successFull = false
            }
        }
        if (msg === '') {
            let cleaned = false
            //Eliminar carpetas innecesarias antes de comprimir
            const tree = await dirTree(dirFullFolder);
            await objects.functions.cleanCapsuleFolder(tree,dirFullFolder)
                .then((value) => {
                    cleaned = true
                    console.log('Limpiada carpeta a comprimir!')
                })
                .catch((value) => {
                    msg = value
                    console.log('Error al limpiar carpeta a comprimir!')
                    cleaned = true
                });
            while (!cleaned) {
                await sleep(10)
            }
            if(cleaned && msg === '') {
                const result = await objects.functions.generateZipCapsule(dirFullFolder)
                if (!result.success) {
                    successFull = false
                }
                msg = result.datos
            }
        }
    }

    return res.json({'success': successFull, 'datos': msg})
})

router.get('/capsules', async function (req, res) {
    var result = await objects.functions.getCapsules(req)
    return res.json({'success': result.success, 'datos': result.datos})
})

router.post('/importcapsule', async function (req, res, next) {
    let result = ''
    let success = false
    await objects.functions.importCapsule(req)
        .then((value) => {
            success = value[0]
            result = value[1]
            console.log(value)
        }).catch(next);

    return res.json({'success': success, 'datos': result})

})

router.post('/savedatabase', async function (req, res) {
    let success = true
    let msg = ''
    let resultBD = await objects.functions.saveDatabase()
    let resultApp = ''
    success = resultBD.success
    msg = resultBD.datos
    if(resultBD.success) {
        resultApp = await objects.functions.saveAplication()
        success = resultApp.success
        msg = resultApp.datos
    }

    return res.json({'success': success, 'datos': msg})
})

router.post('/restoredatabase', async function (req, res) {
    let msg = ''
    let success = true
    let subido = false
    dirFolderRestoreGlobal = global.appRootApp + '\\resources\\save_restore\\'+ Math.random()

    fs.mkdirSync(dirFolderRestoreGlobal, {recursive: true}, (err) => {
        if (err) {
            success = false;
            msg = 'Ha ocurrido un error, ' + err
        }
    });
    fs.exists(dirFolderRestoreGlobal, (exists) => {
        if(!exists){
            success = false;
            msg = 'Ha ocurrido un error'
        }
    });
    if(success) {
        let upload = multer({storage: storage, fileFilter: zipFilter}).single('file');
        upload(req, res, async function (err) {
            // req.file contains information of uploaded file
            // req.body contains information of text fields, if there were any
            if (req.fileValidationError) {
                success = false
                msg = req.fileValidationError
                subido = true
            }
            else if (!req.file) {
                success = false
                msg = 'Por favor seleccione un fichero .zip a subir';
                subido = true
            }
            else if (err instanceof multer.MulterError) {
                success = false
                msg = err
                subido = true
            }
            else if (err) {
                success = false
                msg = err
                subido = true
            }
            else{
                subido = true

            }

        });
        while (!subido) {
            await sleep(20)
        }
        if(success) {
            await objects.functions.importBackup(dirFolderRestoreGlobal)
                .then((value) => {
                    success = value[0]
                    result = value[1]
                    console.log(value)
                }).catch((value) => {
                    success = false
                    console.log(value)
                });
        }
    }

    return res.json({'success': success, 'datos': msg})
})

router.get('/restartsystem', async function (req, res) {
    process.exit(1);
})

router.post('/imagedesktop', async function (req, res) {
    let msg = ''
    let success = true
    let subido = false
    dirFolderImageDesktopGlobal = '../resources/desktop'

    if(req.query.rol && req.query.rol != "") {
        let upload = multer({storage: storageDesktop, fileFilter: imageFilter}).single('file');
        upload(req, res, async function (err) {
            // req.file contains information of uploaded file
            // req.body contains information of text fields, if there were any
            if (req.fileValidationError) {
                success = false
                msg = req.fileValidationError
                subido = true
            }
            else if (!req.file) {
                success = false
                msg = 'Por favor seleccione un fichero .png, .jpg o .svg a subir';
                subido = true
            }
            else if (err instanceof multer.MulterError) {
                success = false
                msg = err
                subido = true
            }
            else if (err) {
                success = false
                msg = err
                subido = true
            }
            else {
                subido = true

            }

        });
        while (!subido) {
            await sleep(20)
        }
        if (success) {
            // Si existe un registro para este rol y usuario, actualizo, sino, inserto
            const paramsImage = ['cfgapl.imagedesktop', null, "WHERE id_users = '" + req.session.id_user + "' AND id_rol = '" + req.query.rol + "' "]
            const resultImage = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2,$3)', paramsImage)
            //-------Valores necesarios a insertar o actualizar
            let path = ''
            let id_section = ''
            const paramsSectionImages = ['cfgapl.sections', null, "WHERE namex = 'Sec_imagedesktop' "];
            const resultSectionImages = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2,$3)', paramsSectionImages);
            if (resultSectionImages && resultSectionImages.rows)
                id_section = resultSectionImages.rows[0].fn_get_register[0].id
            // Establecer path
            let extension = ''
            let nameFinal = originalFileName
            let arrFileName = nameFinal.split('.')
            if (arrFileName) {
                let lastPos = arrFileName.length - 1
                extension = arrFileName[lastPos]
            }
            nameFinal = nameFinal.replace('.' + extension, "")
            let currentDate = new Date()
            nameFinal += currentDate.getSeconds() + currentDate.getMilliseconds() + '.' + extension
            path = dirFolderImageDesktopGlobal + '/' + nameFinal
            await fs.rename(dirFolderImageDesktopGlobal + '/' + originalFileName, dirFolderImageDesktopGlobal + '/' + nameFinal, (err) => {
                if (!err) {
                    console.log("Archivo desktop renombrado!")
                }
                else {
                    success = false
                    msg = 'Ha ocurrido un error, ' + err
                }
            });
            if (resultImage && resultImage.rows && resultImage.rows[0].fn_get_register) {
                let id_registro = resultImage.rows[0].fn_get_register[0].id
                var paramsInsert = [], valuesInsertAux = [];
                valuesInsertAux.push("id_users = '" + req.session.id_user + "'")
                valuesInsertAux.push("id_rol = '" + req.query.rol + "'")
                valuesInsertAux.push("namex = '" + req.query.name + "'")
                valuesInsertAux.push("path = '" + path + "'")
                valuesInsertAux.push("modifier = '" + req.session.id_user + "'")

                paramsInsert.push(id_section)
                paramsInsert.push(valuesInsertAux.join(','))
                paramsInsert.push(id_registro)
                paramsInsert.push(req.session.id_user)
                let result = await objects.functions.updateRegister(paramsInsert)
                if (result.success === false) {
                    success = false
                    msg = result.message
                    fs.unlink(path, (err => {
                        if (err) console.log(err);
                    }));
                }
                else
                    msg = path
            }
            else {
                var paramsInsert = [], columnasInsertAux = [], valuesInsertAux = [];

                if (success) {
                    //columnas a insertar
                    columnasInsertAux.push('id_users')
                    columnasInsertAux.push('id_rol')
                    columnasInsertAux.push('namex')
                    columnasInsertAux.push('path')
                    columnasInsertAux.push('creator')
                    //valores a insertar
                    valuesInsertAux.push("'" + req.session.id_user + "'")
                    valuesInsertAux.push("'" + req.query.rol + "'")
                    valuesInsertAux.push("'" + req.query.name + "'")
                    valuesInsertAux.push("'" + path + "'")
                    valuesInsertAux.push("'" + req.session.id_user + "'")

                    paramsInsert.push(id_section)
                    paramsInsert.push(columnasInsertAux.join(','))
                    paramsInsert.push(valuesInsertAux.join(','))
                    paramsInsert.push(null)
                    paramsInsert.push(null)
                    paramsInsert.push(req.session.id_user)

                    let result = await objects.functions.insertRegister(paramsInsert)
                    if (result.success === false) {
                        success = false
                        msg = result.message
                        fs.unlink(path, (err => {
                            if (err) console.log(err);
                        }));
                    }
                    else
                        msg = path
                }
            }
        }
    }
    else{
        success = false
        msg = "Este usuario no tiene rol"
    }

    return res.json({'success': success, 'datos': msg})
})

router.post('/restoreimagedesktop', async function (req, res) {
    let msg = ''
    let success = true

    if(req.body.rol && req.body.rol != "") {
        const paramsImage = ['cfgapl.imagedesktop', null, "WHERE id_users = '" + req.session.id_user + "' AND id_rol = '" + req.body.rol + "' "]
        const resultImage = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2,$3)', paramsImage)
        if (resultImage && resultImage.rows && resultImage.rows[0].fn_get_register){
            const path =  resultImage.rows[0].fn_get_register[0].path
            await fs.unlink(path, (err => {
                if (err) {
                    success = false
                    msg = err
                }
            }));
            try {
                const resultDelete = await pool.executeQuery("DELETE FROM cfgapl.imagedesktop " +
                    "WHERE id_users = '" + req.session.id_user + "' AND id_rol = '" + req.body.rol + "'")
            }
            catch(err){
                success = false
                msg = err
            }
        }
    }
    else{
        success = false
        msg = "Este usuario no tiene rol"
    }

    return res.json({'success': success, 'datos': msg})
})

router.post('/importtable', async function (req, res) {
    let msg = ''
    let success = true
    let subido = false
    dirFolderImportTableGlobal = '../resources/backups'

    let upload = multer({storage: storageImportTable, fileFilter: csvOrXlsFilter}).single('file');
    upload(req, res, async function (err) {
        if (req.fileValidationError) {
            success = false
            msg = req.fileValidationError
            subido = true
        }
        else if (!req.file) {
            success = false
            msg = 'Por favor seleccione un fichero .csv, .xls o .xlsx a subir';
            subido = true
        }
        else if (err instanceof multer.MulterError) {
            success = false
            msg = err
            subido = true
        }
        else if (err) {
            success = false
            msg = err
            subido = true
        }
        else {
            subido = true
        }

    });
    while (!subido) {
        await sleep(20)
    }
    if (success) {
        const fileDir = dirFolderImportTableGlobal+'/'+originalImportFileName
        await objects.functions.importTable(req,fileDir)
            .then((value) => {
                msg = value
            }).catch((value) => {
                success = false
                msg = value
            });
    }

    return res.json({'success': success, 'datos': msg})
})

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Uploads is the Upload_folder_name
        cb(null, dirFolderRestoreGlobal)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

var storageDesktop = multer.diskStorage({
    destination: function (req, file, cb) {
        // Uploads is the Upload_folder_name
        cb(null, dirFolderImageDesktopGlobal)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

var storageImportTable = multer.diskStorage({
    destination: function (req, file, cb) {
        // Uploads is the Upload_folder_name
        cb(null, dirFolderImportTableGlobal)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const zipFilter = function(req, file, cb) {
    // Accept zip only
    if (!file.originalname.match(/\.(zip|ZIP)$/)) {
        req.fileValidationError = 'Solo se permiten ficheros .zip!';
        return cb(new Error('Solo se permiten ficheros .zip!'), false);
    }
    cb(null, true);
};

const imageFilter = function(req, file, cb) {
    // Accept image files only
    if (!file.originalname.match(/\.(png|PNG|jpg|JPG|svg|SVG)$/)) {
        req.fileValidationError = 'Solo se permiten ficheros .png, .jpg o .svg!';
        return cb(new Error('Solo se permiten ficheros .png, .jpg o .svg!'), false);
    }
    else
        originalFileName = file.originalname
    cb(null, true);
};

const csvOrXlsFilter = function(req, file, cb) {
    // Accept image files only
    if (!file.originalname.match(/\.(csv|CSV|xls|XLS|xlsx|XLSX)$/)) {
        req.fileValidationError = 'Solo se permiten ficheros .csv, .xls o .xlsx!';
        return cb(new Error('Solo se permiten ficheros .csv, .xls o .xlsx!'), false);
    }
    else
        originalImportFileName = file.originalname
    cb(null, true);
};


module.exports = router