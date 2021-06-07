var express = require("express");
var router = express.Router();
var fs = require('fs');
const objects = require('../modules');

/*Obtener lenguajes*/
router.get('/languages', async function (req, res) {
    const result = await objects.languages.getLanguages(req)
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
        result = await objects.register.updateRegister(req)
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
    if (result.success === false) {
        return res.json(result)
    } else {
        return res.json({'success': true, 'message': result.datos})
    }
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
        let jasper = result.value
        let print = null
        let randomName = Math.random()
        let tmpFile = global.appRootApp + '\\resources\\reports\\tmp\\' + randomName
        let dirFile = '../resources/reports/tmp/'+randomName
        setTimeout(async function(){
            if(jasper) {
                let report_params = req.query.extra_params ? req.query.extra_params : ""
                //Tratar cadena report params
                let objParams = {}
                let arr = report_params.split(',');
                for(let i=0;i<arr.length;i++){
                    let elem = arr[i]
                    let arrElem = elem.split('=>')
                    if(arrElem) {
                        objParams[''+arrElem[0]+''] = arrElem[1]
                    }
                }
                let report = {
                    report: 'hw',
                    data: objParams
                };

                if(req.query.report_format === 'html') {
                    tmpFile = tmpFile + '.html'
                    dirFile = dirFile + '.html'
                    print = jasper.export(report, 'html');
                }
                else if(req.query.report_format === 'pdf') {
                    tmpFile = tmpFile + '.pdf'
                    dirFile = dirFile + '.pdf'
                    print = jasper.export(report, 'pdf');
                }
                else if(req.query.report_format === 'xlsx') {
                    tmpFile = tmpFile + '.xlsx'
                    dirFile = dirFile + '.xlsx'
                    print = jasper.export(report, 'xlsx');
                }
                else if(req.query.report_format === 'xls') {
                    tmpFile = tmpFile + '.xls'
                    dirFile = dirFile + '.xls'
                    print = jasper.export(report, 'xls');
                }
                else if(req.query.report_format === 'docx') {
                    tmpFile = tmpFile + '.docx'
                    dirFile = dirFile + '.docx'
                    print = jasper.export(report, 'docx');
                }
                else if(req.query.report_format === 'doc') {
                    tmpFile = tmpFile + '.doc'
                    dirFile = dirFile + '.doc'
                    print = jasper.export(report, 'doc');
                }
                else if(req.query.report_format === 'odt') {
                    tmpFile = tmpFile + '.odt'
                    dirFile = dirFile + '.odt'
                    print = jasper.export(report, 'odt');
                }
                let resultSaveFile = await objects.reports.saveReportFile(tmpFile, print)
                res.json({
                    'success': resultSaveFile.success,
                    'btn': result.btn,
                    'type': 5,
                    'value': dirFile,
                    'msg': resultSaveFile.msg,
                    'name': result.name
                })
            }
            else
                res.json({'success': false, 'btn':  result.btn, 'type': 5, 'value': '', 'msg': 'Ha ocurrido un error al imprimir el reporte', 'name': result.name})
        }, 3500);
    }    
    else {
        return res.json({'success': true, 'btn': result.btn, 'type': result.type, 'value': result.value, 'msg': result.msg, 'name': result.name})
    }
})

router.get('/newalerts', async function (req, res) {
    var result = await objects.alerts.getUser(req)
    res.json({'data': result})
})

module.exports = router