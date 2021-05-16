var express = require("express");
var router = express.Router();
var fs = require('fs');
const objects = require('../modules');

/*jasper = require('node-jasper')({
    path: '../../resources/reports/lib/jasperreports-6.2.0',
    reports: {
        hw: {
            jasper: '../../resources/reports/Tablex.jasper'
        }
    },
    drivers: {
        pg: {
            path: '../../resources/reports/lib/postgresql-9.2-1004-jdbc41.jar',
            class: 'org.postgresql.Driver', //odbc driver//sun.jdbc.odbc.JdbcOdbcDriver //mysqlDriver// com.mysql.jdbc.Driver
            type: 'postgresql'
        }
    },
    conns: {
        dbserver: {
            host: 'localhost',
            port: 5432,
            dbname: 'mastersol',
            user: 'postgres',
            pass: 'postgres',
            driver: 'pg'
        }
    },
    defaultConn: 'dbserver'
});*/

router.get('/report', async function(req, res) {
   const result = await objects.reports.getJasper(req)
   let jasper = result.jasper
   let msg = result.msg
   setTimeout(function(){
       if(jasper) {
           let report = {
               report: 'hw',
               data: {
                   nombre: req.query.nombre
               }
           };
           let print = null
           if(req.query.report_format === 'pdf') {
               print = jasper.export(report, 'pdf');
               res.set({
                   'Content-type': 'application/pdf',
                   'Content-Length': print.length
               });
           }
           else if(req.query.report_format === 'html') {
               print = jasper.export(report, 'html');
               res.set({
                   'Content-type': 'text/html',
                   'Content-Length': print.length
               });
           }
           else if(req.query.report_format === 'xlsx') {
               print = jasper.export(report, 'xlsx');
               res.set({
                   'Content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                   'Content-Length': print.length
               });
           }
           else if(req.query.report_format === 'xls') {
               print = jasper.export(report, 'xls');
               res.set({
                   'Content-type': 'application/vnd.ms-excel',
                   'Content-Length': print.length
               });
           }
           else if(req.query.report_format === 'docx') {
               print = jasper.export(report, 'docx');
               res.set({
                   'Content-type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                   'Content-Length': print.length
               });
           }
           else if(req.query.report_format === 'doc') {
               print = jasper.export(report, 'doc');
               res.set({
                   'Content-type': 'application/msword',
                   'Content-Length': print.length
               });
           }
           res.send(print);
       }
       else
           res.json({'success': false, 'error': msg})
   }, 1000);

});

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

router.post('/executebuttons', async function (req, res) {
    var result = await objects.functions.executeFunctionsButtons(req, objects)
    res.json({'data': result})
})

router.get('/executebuttons', async function (req, res) {
    var result = await objects.functions.executeFunctionsButtons(req, objects)
    if (result.success === false) {
        return res.json(result)
    } else {
        return res.json({'success': true, 'btn': result.btn, 'type': result.type, 'value': result.value})
    }
})

router.get('/newalerts', async function (req, res) {
    var result = await objects.alerts.getUser(req)
    res.json({'data': result})
})

module.exports = router