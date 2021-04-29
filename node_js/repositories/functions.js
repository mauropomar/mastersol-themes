const pool = require('../connection/server-db')
const cron = require('node-cron')
const fs = require('fs')
const objGenFunc = {}
var taskArray = []
var taskEliminateArray = []

//schedule para recorrer todos los procesos activos y ejecutar las funciones que tengan asociadas según sus calendarios
cron.schedule('* * * * *', async () => {
    const procesos = await getProcess()

    for (const pro of procesos) {
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
        var task = taskArray[pro.id]
        if(task) {
            task.destroy();
        }
        task = cron.schedule('' + stringMinutes + ' * ' + stringDays + ' * *', async() => {
            //Buscar funcion asociada al proceso y ejecutar su sqlx
            const paramsFunction = ['cfgapl.functions', pro.id_function];
            const resultFunction = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', paramsFunction);
            if (resultFunction) {
                let nombreFuncion = resultFunction.rows[0].fn_get_register[0].namex
                const query = 'SELECT ' + nombreFuncion + '()'
                const result = await pool.executeQuery(query)
                if (result)
                    console.log('Funcion ejecutada con exito en process '+pro.namex)
            }

        },{scheduled: false});
        taskArray[pro.id] = task
        if(fechaStart == fechaActual && horaStart == horaActual) {
            task.start();
        }
        else if(fechaStart < fechaActual || (fechaStart == fechaActual && horaStart < horaActual)){
            if((pro.repeat_each_minutes != null && pro.repeat_each_minutes != 0) ||
                (pro.repeat_each_day != null && pro.repeat_each_day != 0))
                task.start();
        }

        if((pro.repeat_each_minutes == null || pro.repeat_each_minutes == 0)
            && (pro.repeat_each_day == null || pro.repeat_each_day == 0))
            taskEliminateArray.push(task);
    }
    //Eliminar tareas de una sola ejecucion
    setTimeout(function(){
        for(let i=0;i<taskEliminateArray.length;i++){
            let job = taskEliminateArray[i];
            job.destroy();
        }
        taskEliminateArray = []
    }, 30000)
    
});

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
        cron.schedule('*/' + time.each_any_minutes + ' * */' + time.each_any_days + ',1 * *', () => {
            //console.log('tarea ejecutada')
            //objModule = require("../../capsules/" + time.capsule_name + "/JS/" + "te_" + time.identifier)
            //objModule["te_" + time.identifier]()
        })
    }
    //console.log(time_events)
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
    var success = false;
    var result = []
    if(idbutton) {
        const param_button = ['cfgapl.sections_buttons',idbutton]
        const resultButton = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', param_button)

        if (resultButton) {
            let requireDir = '../../capsules/' + 'c_' + resultButton.rows[0].fn_get_register[0].id_capsules + '/node_js/buttons/' + resultButton.rows[0].fn_get_register[0].js_name
            const operacion = require(requireDir)
            result = await operacion.function(idsection, idregister, idbutton, iduser, idrol)
            if (result)
                success = true;

        }
    }
    return {'success': success, 'btn': result.btn, 'type': result.type, 'value': result.value}
}

objGenFunc.generateFunctions = generateFunctions
objGenFunc.generateFunctionsTimeEvents = generateFunctionsTimeEvents
objGenFunc.executeFunctionsButtons = executeFunctionsButtons
module.exports = objGenFunc