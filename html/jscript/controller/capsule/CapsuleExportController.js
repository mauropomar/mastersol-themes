Ext.define('MasterSol.controller.capsule.CapsuleExportController', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            '#grid_list_capsules': { // matches the view itself
                itemclick: 'clickCapsule'
            }
        });
    },

    showWindow: function () {
        Ext.create('MasterSol.view.capsule.WindowExportCapsule', {
            id: 'window_export_capsule'
        });
    },

    setNameFile: function (nameCapsule) {
        var date = Ext.Date.format(new Date(), 'Ymdhis');
        var name = nameCapsule + '_' + date;
        Ext.ComponentQuery.query('#field_name_export')[0].setValue(name);
    },

    clickCapsule: function (grid, record) {
        Ext.ComponentQuery.query('#btn_exportar_capsule')[0].setDisabled(false);
    },

    export: function () {
        var grid = Ext.ComponentQuery.query('#grid_list_capsules')[0];
        var record = grid.getSelectionModel().getSelection()[0];
        var mask = new Ext.LoadMask(grid, {
            msg: 'Exportando. Espere unos minutos por favor...'
        });
        mask.show();
        Ext.ComponentQuery.query('#btn_cancelar_capsule')[0].setDisabled(true);
        var save = {
            url: 'app/savecapsule',
            method: 'POST',
            scope: this,
            timeout: 150000,
            params: {
                idcapsule: record.data.id
            },
            success: function (response) {
                mask.hide();
                Ext.ComponentQuery.query('#btn_cancelar_capsule')[0].setDisabled(false);
                var json = Ext.JSON.decode(response.responseText);
                if (json.success == true) {
                    var url = this.getPath(json.datos);
                    var name = this.getName(url);
                    var link = document.createElement('a');
                    link.href = url;
                    link.download = name;
                    link.click();
                    Ext.toast('La capsula fue exportada con éxito.');
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

    cancel: function () {
        Ext.ComponentQuery.query('window-export-capsule')[0].close();
    },

    getPath:function(path){
        var index = path.indexOf('resources');
        return path.substring(index, path.length);
    },

    getName:function(path){
        var index = path.lastIndexOf('\\');
        return path.substring(index + 1, path.length);
    }
});