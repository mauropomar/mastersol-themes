const pool = require('../connection/server-db')
const cron = require('node-cron')
const objGenFunc = {}
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
        cron.schedule('*/' + time.each_any_minutes + ' * */' + time.each_any_days + ',1 * *', () => {
            console.log('tarea ejecutada')
            objModule = require("../../Capsules/" + time.capsule_name + "/JS/" + "te_" + time.identifier)
            objModule["te_" + time.identifier]()
        })
    }
    console.log(time_events)
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

objGenFunc.generateFunctions = generateFunctions
objGenFunc.generateFunctionsTimeEvents = generateFunctionsTimeEvents
module.exports = objGenFunc