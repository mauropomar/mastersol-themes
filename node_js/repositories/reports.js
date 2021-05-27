const pool = require('../connection/server-db')
var stream = require('stream');
const fs = require('fs')
const objReports = {}

const getJasper = async (req) => {
    let jasper = '' 
    let msg = ''
    await executeReport(req)
        .then((value) => {
            jasper = value
        })
        .catch((value) => {
            msg = value
        });
    return {'jasper': jasper, 'msg': msg}
}

const executeReport = (req) => new Promise(async (resolve, reject) => {
    try {
        let jasper = null
        let options = {
            path: '../../resources/reports/lib/jasperreports-6.2.0',
            reports: {
                hw: {
                    jasper: '../../resources/reports/informs/' + req.query.report_name + '.jasper',
                    jrxml: '../../resources/reports/informs/' + req.query.report_name + '.jrxml'
                }
            },
            drivers: {
                pg: {
                    path: '../../resources/reports/lib/postgresql-42.2.20.jar',
                    class: 'org.postgresql.Driver', //odbc driver//sun.jdbc.odbc.JdbcOdbcDriver //mysqlDriver// com.mysql.jdbc.Driver
                    type: 'postgresql'
                }
            },
            conns: {
                dbserver: {
                    host: pool.config_bd.host,
                    port: pool.config_bd.port,
                    dbname: pool.config_bd.database,
                    user: pool.config_bd.user,
                    pass: pool.config_bd.password,
                    driver: 'pg'
                }
            },
            defaultConn: 'dbserver'
        }

        jasper = require('node-jasper-report')(options)
        resolve(jasper)
    }
    catch(error){
        reject('No se pudo imprimir el reporte, ' + error+ ' ')
    }
})

const saveReportFile = async(dirFile, file) => {
    let success = true
    let msg = ''
    let Readable = stream.Readable;
    var fileBuffer = Buffer.from(file, 'base64');
    let readStream = new Readable();
    readStream.push(fileBuffer);
    readStream.push(null)
    let writeStream = await fs.createWriteStream(dirFile);
    readStream.pipe(writeStream);
    await save(dirFile,writeStream)
        .then((value) => {
            success = value
        })
        .catch((value) => {
            success = false
            msg = value
        });

    return {'success': success, 'error': msg}
}

const save = (dirFile,writeStream) => new Promise((resolve, reject) => {
    let success = true
    let msg = ''
    let path = ''
    writeStream.on('finish', function () {
        //Al terminar la escritura, continuar proceso
        fs.stat(dirFile, async(err, stat) => {
            if (!err) {
                if (success) {
                    resolve(true)
                }
                else {
                    success = false
                    msg = 'Ha ocurrido un error'
                    reject(msg)
                }
            }
            else {
                success = false
                msg = 'Ha ocurrido un error, ' + err
                reject(msg)
            }
        });

    });

})

objReports.getJasper = getJasper
objReports.saveReportFile = saveReportFile
module.exports = objReports