Ext.define('MasterSol.controller.database.DatabaseRestoreController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    showWindow: function () {
        Ext.create('MasterSol.view.database.WindowRestoreDatabase', {
            id: 'window_restore_database'
        });
    },

    import: function () {
        var window = Ext.ComponentQuery.query('#window_restore_database')[0];
        var mask = new Ext.LoadMask(window, {
            msg: 'Restaurando. Espere unos minutos por favor...'
        });
        mask.show();
        var fileField = Ext.ComponentQuery.query('#file_database')[0];
        var file = fileField.fileInputEl.dom.files[0],
            data = new FormData();
        if (file === undefined || !(file instanceof File)) {
            mask.hide();
            Ext.MessageBox.show({
                title: 'Información',
                msg: 'Debe seleccionar un fichero.',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.INFO
            });
            return;
        }
        var nameFile = this.getName(fileField.value);
        if (!this.isValidFile(nameFile)) {
            mask.hide();
            fileField.reset();
            Ext.MessageBox.show({
                title: 'Información',
                msg: 'La extensión del fichero no es correcta.',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.INFO
            });
            return;
        }
        data.append('file', file);
        Ext.Ajax.request({
            url: 'app/restoredatabase',
            rawData: data,
            headers: {'Content-Type':null}, //to use content type of FormData
            success: function(response){
                mask.hide();
                Ext.ComponentQuery.query('#btn_cancel_restore_database')[0].setDisabled(false);
                var json = Ext.JSON.decode(response.responseText);
                if (json.success == true) {
                    Ext.toast('La base de datos fue restaurada con éxito.');
                } else {
                    Ext.MessageBox.show({
                        title: 'Información',
                        msg: json.datos,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.INFO
                    });
                }
            }
        });
    },

    cancel: function () {
        Ext.ComponentQuery.query('#window_restore_database')[0].close();
    },

    getName: function (path) {
        var index = path.lastIndexOf('\\');
        if (index > -1) {
            var name = path.substring(index + 1, path.lengh);
            return name;
        }
        return path;
    },

    isValidFile: function (name) {
        var index = name.lastIndexOf('.zip');
        var valid = (index === -1) ? false : true;
        return valid;
    }

});