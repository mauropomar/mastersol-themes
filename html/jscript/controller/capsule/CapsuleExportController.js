Ext.define('MasterSol.controller.capsule.CapsuleExportController', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            '#grid_list_capsules': { // matches the view itself
                itemclick:'clickCapsule'
            }
        });
    },

    showWindow: function () {
        Ext.create('MasterSol.view.capsule.WindowExportCapsule', {
            id: 'window_export_capsule'
        });
        Ext.ComponentQuery.query('#field_name_export')[0].focus('');
    },

    setNameFile: function (nameCapsule) {
        var date = Ext.Date.format(new Date(), 'Ymdhis');
        var name = nameCapsule + '_' + date;
        Ext.ComponentQuery.query('#field_name_export')[0].setValue(name);
    },

    clickCapsule:function(grid, record){
        var name = record.data.namex;
        this.setNameFile(name);
        Ext.ComponentQuery.query('#btn_exportar_capsule')[0].setDisabled(false);
    },

    export:function(){
        var grid = Ext.ComponentQuery.query('#grid_list_capsules')[0];
        var record = grid.getSelectionModel().getSelection()[0];
        var mask = new Ext.LoadMask(grid, {
            msg: 'Exportando. Espere unos minutos por favor...'
        });
        mask.show();
        var nameFile = Ext.ComponentQuery.query('#field_name_export')[0].getValue();
        var save = {
            url: 'app/savecapsule',
            method: 'POST',
            scope: this,
            timeout: 50000,
            params: {
                idcapsule: record.data.id
            },
            success: function (response) {
                mask.hide();
                var json = Ext.JSON.decode(response.responseText);
                if(json.success == true) {
                    var url = json.datos;
                    var index = url.indexOf('resources');
                    url = url.substring(index, url.length);
                     var link = document.createElement('a');
                    link.href = url;
                    link.download = nameFile;
                    link.click();
                    Ext.toast('La capsula fue exportada con éxito.');
                }

            },
            failure: function (response) {
                mask.hide();
            }
        };
        Ext.Ajax.request(save);
    },

    cancel:function(){
        Ext.ComponentQuery.query('window-export-capsule')[0].close();
    }
});