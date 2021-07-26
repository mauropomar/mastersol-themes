Ext.define('MasterSol.controller.database.DatabaseSaveController', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({});
    },

    setNameFile: function (nameCapsule) {
        var date = Ext.Date.format(new Date(), 'Ymdhis');
        var name = 'basedatos_' + date;
        Ext.ComponentQuery.query('#field_name_save_database')[0].setValue(name);
    },

    showWindow: function () {
        Ext.create('MasterSol.view.database.WindowSaveDatabase', {
            id: 'window_save_database'
        });
        this.setNameFile();
    },

    save: function () {
        var window = Ext.ComponentQuery.query('#window_save_database')[0];
        var mask = new Ext.LoadMask(window, {
            msg: 'Guardando. Espere unos minutos por favor...'
        });
        var nameDB = Ext.ComponentQuery.query('#field_name_save_database')[0].getValue();
        if (nameDB === '') {
            Ext.ComponentQuery.query('#field_name_save_database')[0].markInvalid('Este campo es obligatorio.');
            return;
        }
        mask.show();
        Ext.ComponentQuery.query('#btn_cancelar_save_database')[0].setDisabled(true);
        var save = {
            url: 'app/savedatabase',
            method: 'POST',
            scope: this,
            timeout: 800000,
            params: {
                name: nameDB
            },
            success: function (response) {
                mask.hide();
                Ext.ComponentQuery.query('#btn_cancelar_save_database')[0].setDisabled(false);
                var json = Ext.JSON.decode(response.responseText);
                if (json.success == true) {
                    var url = this.getPath(json.datos);
                    var name = this.getName(url);
                    var link = document.createElement('a');
                    link.href = url;
                    link.download = name;
                    link.click();
                    Ext.toast('El sistema y la base de datos fue guardada con éxito.');
                } else {
                    Ext.MessageBox.show({
                        title: 'Información',
                        msg: json.datos,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.INFO
                    });
                }

            },
            failure: function (response) {
                mask.hide();
            }
        };
        Ext.Ajax.request(save);
    },

    getPath: function (path) {
        var index = path.indexOf('resources');
        return path.substring(index, path.length);
    },

    getName: function (path) {
        var index = path.lastIndexOf('\\');
        return path.substring(index + 1, path.length);
    },

    cancel: function () {
        Ext.ComponentQuery.query('#window_save_database')[0].close();
    }
});