Ext.define('MasterSol.controller.capsule.CapsuleImportController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    showWindow: function () {
        Ext.create('MasterSol.view.capsule.WindowImportCapsule', {
            id: 'window_import_capsule'
        });
    },

    import: function () {
        var window = Ext.ComponentQuery.query('#window_import_capsule')[0];
        var mask = new Ext.LoadMask(window, {
            msg: 'Importando. Espere unos minutos por favor...'
        });
        mask.show();
        var fileField = Ext.ComponentQuery.query('#file_capsule')[0];
        var file = fileField.fileInputEl.dom.files[0],
            reader;
        reader = new FileReader();
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
        if (!MasterApp.util.isValidFileZip(nameFile)) {
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
        reader.onloadend = function (event) {
            var binaryString = '',
                bytes = new Uint8Array(event.target.result),
                length = bytes.byteLength,
                i,
                base64String;

            // convert to binary string
            for (i = 0; i < length; i++) {
                binaryString += String.fromCharCode(bytes[i]);
            }

            // convert to base64
            base64String = btoa(binaryString);
            var save = {
                url: 'app/importcapsule',
                method: 'POST',
                scope: this,
                timeout: 1000000,
                params: {
                    file: base64String,
                    name: nameFile
                },
                success: function (response) {
                    mask.hide();
                    Ext.ComponentQuery.query('#btn_cancelar_import_capsule')[0].setDisabled(false);
                    var json = Ext.JSON.decode(response.responseText);
                    if (json.success == true) {
                        Ext.toast('La capsula fue importado con éxito.');
                         location.href = 'index.html';
                        this.restarSystem();
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
        };

        reader.readAsArrayBuffer(file);
    },

    restarSystem: function () {
        var panel = Ext.ComponentQuery.query('#panel-center')[0];
        var mask = new Ext.LoadMask(panel, {
            msg: 'Reiniciando sistema. Espere unos minutos por favor...'
        });
        mask.show();
        var restart = {
            url: 'app/restartsystem',
            method: 'GET',
            scope: this,
            success: function (response) {
                Mask.hide();
            }
        };
        Ext.Ajax.request(restart);
    },

    cancel: function () {
        Ext.ComponentQuery.query('#window_import_capsule')[0].close();
    }
});