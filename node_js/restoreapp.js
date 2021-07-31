var express = require("express");
const fs = require('fs')
const objects = require('./modules');
var path = require("path")

let globalDir = path.resolve(__dirname).replace('\\node_js', '\\');
globalDir.replace('\\repositories', '\\');

module.exports.restoreapp = async function () {
    let msg = ''
    let success = true
    var dirFolderRestoreGlobal = globalDir + '\\resources\\save_restore\\salva'

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
        if(success) {
            await objects.functions.importBackup(dirFolderRestoreGlobal,globalDir)
                .then((value) => {
                    success = value[0]
                    msg = value[1]
                    console.log(value)
                }).catch((value) => {
                    success = false
                    console.log(value)
                });
        }
    }
};

this.restoreapp();