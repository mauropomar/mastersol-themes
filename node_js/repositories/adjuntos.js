const pool = require('../connection/server-db')
const fs = require('fs')
var stream = require('stream');
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
    var max_size = ''
    var msg = ''
    var Readable = stream.Readable;
    var imgBuffer = Buffer.from(req.body.file, 'base64');
    var readStream = new Readable();
    readStream.push(imgBuffer);
    readStream.push(null)
    //Validar antes de iniciar proceso de guardado usando una locacion temporal para el fichero que despues será eliminada
    const paramsSize = ['cfgapl.general',null,"WHERE variable = 'max_file_size' "]
    const resultMaxFileSize = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2,$3)', paramsSize)
    
    let dirAlmacenar = '../resources/files';
    const paramsDirAttach = ['cfgapl.general',null,"WHERE variable = 'dir_attach' "];
    const resultDirAttach = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2,$3)', paramsDirAttach);
    if(resultDirAttach && resultDirAttach.rows[0].fn_get_register)
        dirAlmacenar = resultDirAttach.rows[0].fn_get_register[0].value;

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
    const paramsSectionAttach = ['cfgapl.sections',null,"WHERE namex = 'Sec_attach' "];
    const resultSectionAttach = await pool.executeQuery('SELECT cfgapl.fn_get_register($1,$2,$3)', paramsSectionAttach);
    if(resultSectionAttach)
        id_section = resultSectionAttach.rows[0].fn_get_register[0].id

    let dirTemp = './' + Math.random()
    fs.mkdir(dirTemp, {recursive: true}, (err) => {
        if (!err) {
            var writeStream = fs.createWriteStream(dirTemp + '/' + req.body.filename);
            readStream.pipe(writeStream);
            writeStream.on('finish', function () {
                //Al terminar la escritura, continuar proceso                
                 fs.stat(dirTemp + '/' + req.body.filename, (err, stat) => {
                    if (!err){
                        //Buscar requisito de tamanno
                        let file_size = stat.size
                        //el size viene en bytes, lo divido por 1048576 para convertirlo a MB
                        file_size = file_size / 1048576

                        if(resultMaxFileSize && resultMaxFileSize.rows[0].fn_get_register) {
                            max_size = resultMaxFileSize.rows[0].fn_get_register[0].value
                            if (file_size > max_size) {
                                success = false;
                                msg = 'El tamaño del fichero sobrepasa el máximo permitido que es de ' + max_size + ' MB';
                            }
                        }

                        if(success){   //Si todas las comprobaciones fueron exitosas, proceder a crear el registro y subir el fichero
                            
                            var paramsInsert = [], columnasInsertAux = [], valuesInsertAux = [];
                            console.log('capsula '+id_capsules)
                            console.log('organizacion '+id_organizations)
                            console.log('tabla '+id_tables)

                            //columnas a insertar
                            columnasInsertAux.push('id_capsules')
                            columnasInsertAux.push('id_organizations')
                            columnasInsertAux.push('id_tables')
                            columnasInsertAux.push('id_register')
                            columnasInsertAux.push('name')
                            columnasInsertAux.push('creator')
                            //valores a insertar
                            valuesInsertAux.push(" '" + id_capsules + "'")
                            valuesInsertAux.push(" '" + id_organizations + "'")
                            valuesInsertAux.push(" '" + id_tables + "'")
                            valuesInsertAux.push(" '" + req.body.idregister + "'")
                            valuesInsertAux.push("'test'")
                            valuesInsertAux.push("'" + req.session.id_user + "'")

                            paramsInsert.push(id_section)
                            paramsInsert.push(columnasInsertAux.join(','))
                            paramsInsert.push(valuesInsertAux.join(','))
                            paramsInsert.push(req.body.idpadreregistro && req.body.idpadreregistro !== '0' ? req.body.idpadreregistro : null)
                            paramsInsert.push(req.body.idseccionpadre && req.body.idseccionpadre !== '0' ? req.body.idseccionpadre : null)
                            paramsInsert.push(req.session.id_user)

                           const resultInsert = insertRegister(req, paramsInsert);

                        }

                        //Al terminar procesamiento eliminar archivo temporal
                        fs.unlink(dirTemp + '/' + req.body.filename, (err => {
                            if (!err) {
                                fs.rmdir(dirTemp, function(err) {
                                    if(!err) console.log('Eliminada carpeta temporal')
                                })
                            }
                        }));
                    }
                });


            });
        }
    });

    return {'success': success, 'message': msg}
}

const deleteAdjunto = async (req) => {

    return 1
}

const downloadAdjunto = async (req) => {

    return 1
}

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


objAdj.getAdjuntos = getAdjuntos
objAdj.insertAdjunto = insertAdjunto
objAdj.deleteAdjunto = deleteAdjunto
objAdj.downloadAdjunto = downloadAdjunto
module.exports = objAdj