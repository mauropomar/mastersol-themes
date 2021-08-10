const pool = require('../connection/server-db')
const fs = require('fs')
var stream = require('stream');
const util = require('util');

const objAdj = {}
const getAdjuntos = async (req) => {
    const params = [req.query.idsection, req.query.idregister, req.session.id_user]
    const query = "SELECT cfgapl.fn_get_adjuntos($1,$2,$3)"
    const result = await pool.executeQuery(query, params)

    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_get_adjuntos == null) {
        return []
    }

    return result.rows[0].fn_get_adjuntos
}

const insertAdjunto = async (req) => {
    var success = true
    var msg = ''
    var idreg = ''
    var path = ''
    var Readable = stream.Readable;
    var fileBuffer = Buffer.from(req.body.file, 'base64');
    var readStream = new Readable();
    readStream.push(fileBuffer);
    readStream.push(null)
    //Validar antes de iniciar proceso de guardado usando una locacion temporal para el fichero que despues será eliminada
    const paramsSize = ['cfgapl.general',null,"WHERE variable = 'max_file_size' "]
    const resultMaxFileSize = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2,$3)', paramsSize)

    let id_organizations, id_capsules, id_tables, id_section;
    
    //Obtener seccion
    const paramsSection = ['cfgapl.sections',req.body.idsection];
    const resultSection = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', paramsSection);
    if(resultSection){
        id_tables = resultSection.rows[0].fn_get_register[0].id_tables
        id_capsules = resultSection.rows[0].fn_get_register[0].id_capsules
        const params = ['cfgapl.tables',id_tables]
        const resultTable = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', params)
        if(resultTable){
            const params = [resultTable.rows[0].fn_get_register[0].n_schema + '.' + resultTable.rows[0].fn_get_register[0].n_table,req.body.idregister]
            const resultRegister = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', params)
            if(resultRegister)
                id_organizations = resultRegister.rows[0].fn_get_register[0].id_organizations
        }
    }
    if(!id_organizations || id_organizations == 'undefined')
        id_organizations = 'b37ac1cb-93db-435a-bb2a-76f6b2fef10e'
        

    const paramsSectionAttach = ['cfgapl.sections',null,"WHERE namex = 'Sec_attach' "];
    const resultSectionAttach = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2,$3)', paramsSectionAttach);
    if(resultSectionAttach)
        id_section = resultSectionAttach.rows[0].fn_get_register[0].id

    let dirTemp = './' + Math.random()
    await fs.mkdirSync(dirTemp, {recursive: true}, (err) => {
        if (err) {
            success = false;
            msg = 'Ha ocurrido un error, ' + err
        }
    });
    await fs.exists(dirTemp, (exists) => {
        if(!exists){
            success = false;
            msg = 'Ha ocurrido un error'
        }
    });
    if(success) {        
        var writeStream = await fs.createWriteStream(dirTemp + '/' + req.body.filename);
        readStream.pipe(writeStream);
        await uploadFile(req,dirTemp,writeStream,id_organizations, id_capsules, id_tables, id_section,resultMaxFileSize)
            .then((value) => {
                msg = value[0]
                idreg = value[1]
                path = value[2]               
            })
            .catch((value) => {
                success = false
                msg = value
            });
    }
    else{
        msg = 'Ha ocurrido un error'
    }

    return {'success': success, 'message': msg, 'id': idreg, 'ruta': path}
}

const uploadFile = (req,dirTemp,writeStream,id_organizations, id_capsules, id_tables, id_section,resultMaxFileSize) => new Promise((resolve, reject) => {
    let success = true
    let msg = ''
    let idreg = ''
    let path = ''
    writeStream.on('finish', function () {
        //Al terminar la escritura, continuar proceso
        fs.stat(dirTemp + '/' + req.body.filename, async(err, stat) => {
            if (!err) {
                //Buscar requisito de tamanno
                let file_size = stat.size
                //el size viene en bytes, lo divido por 1048576 para convertirlo a MB
                file_size = file_size / 1048576

                if (resultMaxFileSize && resultMaxFileSize.rows[0].fn_get_register) {
                    let max_size = resultMaxFileSize.rows[0].fn_get_register[0].value
                    if (file_size > max_size) {
                        success = false;
                        msg = 'El tamaño del fichero sobrepasa el máximo permitido que es de ' + max_size + ' MB';
                        reject(msg)
                    }
                }

                if (success) {   //Si todas las comprobaciones fueron exitosas, proceder a crear el registro y subir el fichero

                    var paramsInsert = [], columnasInsertAux = [], valuesInsertAux = [];
                    //guardar en path extension del fichero
                    let extension = ''
                    let arrFileName = req.body.filename.split('.')
                    if (arrFileName) {
                        let lastPos = arrFileName.length - 1
                        extension = arrFileName[lastPos]
                    }

                    //columnas a insertar
                    columnasInsertAux.push('id_capsules')
                    columnasInsertAux.push('id_organizations')
                    columnasInsertAux.push('id_tables')
                    columnasInsertAux.push('id_register')
                    columnasInsertAux.push('path')
                    columnasInsertAux.push('creator')
                    columnasInsertAux.push('name')
                    //valores a insertar
                    valuesInsertAux.push(" '" + id_capsules + "'")
                    valuesInsertAux.push(" '" + id_organizations + "'")
                    valuesInsertAux.push(" '" + id_tables + "'")
                    valuesInsertAux.push(" '" + req.body.idregister + "'")
                    valuesInsertAux.push(" '" + extension + "'")
                    valuesInsertAux.push("'" + req.session.id_user + "'")
                    valuesInsertAux.push(" '" + req.body.filename + "'")

                    paramsInsert.push(id_section)
                    paramsInsert.push(columnasInsertAux.join(','))
                    paramsInsert.push(valuesInsertAux.join(','))
                    paramsInsert.push(req.body.idpadreregistro && req.body.idpadreregistro !== '0' ? req.body.idpadreregistro : null)
                    paramsInsert.push(req.body.idseccionpadre && req.body.idseccionpadre !== '0' ? req.body.idseccionpadre : null)
                    paramsInsert.push(req.session.id_user)

                    const resultInsert = await insertRegister(paramsInsert);
                    if (resultInsert && resultInsert.path) {
                        //Subir fichero final
                        let address = resultInsert.path
                        let filename = resultInsert.id + '.' + extension
                        address = address.replace(filename, '')
                        address = address.replace('..', '')
                        address = address.replace('/', '\\')
                        address = global.appRootApp + address
                        await fs.mkdir(address, {recursive: true}, (err) => {
                            if (!err) {
                                fs.rename(dirTemp + '/' + req.body.filename, address + filename, (err) => {
                                    if (!err) {
                                        console.log("Archivo subido!")
                                        msg = resultInsert.name
                                        idreg = resultInsert.id
                                        path = resultInsert.path
                                        let arrresolve = []
                                        arrresolve.push(msg)
                                        arrresolve.push(idreg)
                                        arrresolve.push(path)
                                        resolve(arrresolve)
                                        const delDir = deleteDir(dirTemp, req.body.filename)
                                    }
                                    else {
                                        success = false
                                        msg = 'Ha ocurrido un error, ' + err
                                    }
                                });
                            }
                        });
                    }
                    else {
                        success = false
                        msg = 'Ha ocurrido un error'
                        reject(msg)
                        const delDir = deleteDir(dirTemp, req.body.filename)
                    }

                }
                else {
                    success = false
                    msg = 'Ha ocurrido un error'
                    reject(msg)
                    const delDir = deleteDir(dirTemp, req.body.filename)
                }

            }
            else {
                success = false
                msg = 'Ha ocurrido un error, ' + err
                reject(msg)
                const delDir = deleteDir(dirTemp, req.body.filename)
            }
        });

    });

})

const deleteAdjunto = async (req) => {
    let success = true
    let msg = ''
    let address = ''

    const paramsAttach = ['cfgapl.attach',req.body.idadjunto];
    const resultAttach = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', paramsAttach);
    if(resultAttach)
        address = resultAttach.rows[0].fn_get_register[0].path

    const resultDelete = await deleteRegister(req, req.body.idadjunto);
    if(resultDelete.includes('ERROR')) {
        success = false
        msg = resultDelete
    }

    if(success){
        //Eliminar fichero
        fs.unlink(address, (err => {
            if (err) {
                success = false
                msg = 'No se pudo eliminar el fichero, ' + err;
            }
            else {
                console.log("Archivo borrado");
            }
        }));

    }

    return {'success': success, 'message': msg, 'ruta': ''}
}

const downloadAdjunto = async (req) => {
    let success = true
    let address = ''
    const paramsAttach = ['cfgapl.attach',req.body.idadjunto];
    const resultAttach = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2)', paramsAttach);
    if(resultAttach)
        address = resultAttach.rows[0].fn_get_register[0].path
    else
        success = false

    return {'success': success, 'message': address, 'ruta': ''}
}

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

const deleteRegister = async (req, idregister) => {
    let idsection
    const paramsSectionAttach = ['cfgapl.sections',null,"WHERE namex = 'Sec_attach' "];
    const resultSectionAttach = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2,$3)', paramsSectionAttach);
    if(resultSectionAttach)
        id_section = resultSectionAttach.rows[0].fn_get_register[0].id

    const ids = "{" + idregister + "}"
    const params_delete = [id_section, ids, req.session.id_user]

    //-----Eliminar despues de actualizar modifier
    const query = "SELECT cfgapl.fn_delete_register($1,$2,$3)"
    const result = await pool.executeQuery(query, params_delete)
    if (result.success === false) {
        return result
    } else if (result.rows[0].fn_delete_register == null) {
        return []
    }

    return result.rows[0].fn_delete_register
}

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


objAdj.getAdjuntos = getAdjuntos
objAdj.insertAdjunto = insertAdjunto
objAdj.deleteAdjunto = deleteAdjunto
objAdj.downloadAdjunto = downloadAdjunto
objAdj.insertRegister = insertRegister
module.exports = objAdj