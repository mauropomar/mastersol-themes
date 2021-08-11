Ext.define('MasterSol.controller.import.ImportExcelController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    showWindow: function () {
        Ext.create('MasterSol.view.import.WindowImportExcel', {
            id: 'window_import_excel'
        });
    },

    import: function () {
        var window = Ext.ComponentQuery.query('#window_import_excel')[0];
        var mask = new Ext.LoadMask(window, {
            msg: 'Importando. Espere unos minutos por favor...'
        });
        mask.show();
        var fileField = Ext.ComponentQuery.query('#file_excel')[0];
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
        var nameFile = MasterApp.util.getName(fileField.value);
        if (!MasterApp.util.isValidFileExcel(nameFile)) {
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
            url: 'app/importtable',
            rawData: data,
            scope: this,
            timeout: 5000,
            params: {
                name: nameFile
            },
            headers: {'Content-Type': null}, //to use content type of FormData
            success: function (response) {
                mask.hide();
                Ext.ComponentQuery.query('#btn_cancel_import_excel')[0].setDisabled(false);
                var json = Ext.JSON.decode(response.responseText);
                if (json.success == true) {
                    Ext.toast('El fichero fue importado con éxito.');
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
        Ext.ComponentQuery.query('#window_import_excel')[0].close();
    }

});