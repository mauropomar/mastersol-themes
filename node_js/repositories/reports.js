const pool = require('../connection/server-db')
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

objReports.getJasper = getJasper
module.exports = objReports