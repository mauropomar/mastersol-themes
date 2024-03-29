Ext.define('MasterSol.controller.magnament.AttachedController', {
    extend: 'Ext.app.Controller',
    isEdit: false,
    init: function () {
        this.accept = ['pdf', 'jpg', 'png', 'gif', 'doc', 'docx', 'xls', 'xlsx', 'bmp', 'tif', 'zip'];
        this.fileslist = [];
    },

    change: function (view, eOpts, value) {
        this.saveChanges(view, value, eOpts);
    },

    onFileChange: function (view, value, eOpts) {
        var filename = this.getFileName(value);
        var IsValid = this.fileValidiation(view, filename);
        if (!IsValid) {
            return;
        }
        this.fileslist.push(filename);
        var addedFilePanel = Ext.create('Ext.form.Panel', {
            frame: false,
            border: 0,
            padding: 2,
            margin: '10',
            layout: {
                type: 'hbox'
            },
            items: [
                {
                    xtype: 'button',
                    text: null,
                    border: 0,
                    frame: false,
                    flex: 1,
                    iconCls: 'fa fa-trash',
                    tooltip: 'Remove',
                    cls: 'x-btn-form',
                    listeners: {
                        scope: this,
                        click: function (me, e, eOpts) {
                            MasterApp.attached.delete(me, e, eOpts);
                        }
                    }
                },
                {
                    xtype: 'label',
                    padding: '0 20 0 0',
                    flex: 4,
                    listeners: {
                        render: function (me, eOpts) {
                            me.setText(filename);
                        }
                    }
                }
            ]
        });

        var newUploadControl = Ext.create('Ext.form.field.FileButton', {
            buttonOnly: true,
            cls: 'x-btn-form',
            iconCls: 'fa fa-plus',
            style: {
                marginLeft: '10px',
                color: 'red'
            },
            listeners: {
                scope: this,
                change: function (view, eOpts, value) {
                    this.saveChanges(addedFilePanel, view, value, eOpts);
                }
            }
        });
        view.hide();
        addedFilePanel.add(view);
        Ext.ComponentQuery.query('attached-view')[0].insert(0, newUploadControl);
        Ext.ComponentQuery.query('attached-view')[0].add(addedFilePanel);
    },

    addButtonUploadControl: function () {
        var newUploadControl = Ext.create('Ext.form.field.FileButton', {
            buttonOnly: true,
            cls: 'x-btn-form',
            iconCls: 'fa fa-plus',
            style: {
                marginLeft: '10px',
                color: 'red'
            },
            listeners: {
                scope: this,
                change: function (view, eOpts, value) {
                    this.saveChanges(view, value, eOpts);
                }
            }
        });
        Ext.ComponentQuery.query('attached-view')[0].insert(0, newUploadControl);
    },

    fileValidiation: function (me, filename) {
        var isValid = true;
        var indexofPeriod = filename.lastIndexOf("."),
            uploadedExtension = filename.substr(indexofPeriod + 1, filename.length - indexofPeriod);
        if (!Ext.Array.contains(this.accept, uploadedExtension)) {
            isValid = false;
            Ext.MessageBox.show({
                title: 'Error',
                msg: 'Los ficheros que desea agregar deben tener las siguientes extensiones :  ' + this.accept.join() + '.',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.ERROR
            });
        }

        if (Ext.Array.contains(this.fileslist, filename)) {
            isValid = false;
            Ext.MessageBox.show({
                title: 'Error',
                msg: 'El ' + filename + ' already added!',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.ERROR
            });
        }
        return isValid;
    },

    getAll: function () {
        var title = MasterApp.util.getTitleSectionSelected();
        Ext.ComponentQuery.query('#tbtext_magnament_attached')[0].setText('Adjuntos: ' + title);
        var mask = new Ext.LoadMask(Ext.ComponentQuery.query('attached-view')[0], {
            msg: 'Cargando...'
        });
        mask.show();
        var record = MasterApp.globals.getRecordSection();
        idrecordsection = (record != null) ? record.data.id : null;
        if (idrecordsection == null || idrecordsection == '') {
            mask.hide();
            this.removeAll();
            return;
        }
        var idsection = MasterApp.util.getIdSectionActive();
        var idmenu = MasterApp.util.getIdMenuActive();
        var getdata = {
            url: 'app/adjuntos',
            method: 'GET',
            scope: this,
            params: {
                idsection: idsection,
                idmenu: idmenu,
                idregister: idrecordsection,
            },
            success: function (response) {
                mask.hide();
                var json = Ext.JSON.decode(response.responseText);
                var data = json.datos;
                if (data != null) {
                    this.removeAll();
                    this.fileslist = [];
                    this.addComponent(data);
                }
            },
            failure: function (response) {
                mask.hide();
            }
        };
        Ext.Ajax.request(getdata);
    },

    saveChanges: function (view, value, eOpts) {
        var filename = this.getFileName(value);
        var gridsection = MasterApp.globals.getGridSection();
        var idsection = MasterApp.util.getIdSectionActive();
        var form = Ext.ComponentQuery.query('attached-view')[0];
        var mask = new Ext.LoadMask(form, {
            msg: 'Guardando Cambios...'
        });
        mask.show();
        var idsection = MasterApp.util.getIdSectionActive();
        var idmenu = MasterApp.util.getIdMenuActive();
        var idrecordparent = gridsection.up('panel').idrecordparent;
        var idregisterparent = (idrecordparent) ? idrecordparent : 0;
        var idparentsection = MasterApp.util.getIdParentSectionActive();
        var record = MasterApp.globals.getRecordSection();
        idrecordsection = (record != null) ? record.data.id : null;
        if (idrecordsection == null) {
            mask.hide();
            MasterApp.util.showMessageInfo('Debe seleccionar un registro para esta sesión');
            return;
        }
        var action = '13';
        if (this.isEdit) { //si estas editando
            record = MasterApp.globales.getRecordSection();
            idrecordsection = record.data.id;
            action = '14';
        }
        var formData = new FormData();
        var file = view.fileInputEl.dom.files[0];
        var reader = new FileReader();
        reader.onloadend = function (event) {
            var binaryString = '',
                bytes = new Uint8Array(event.target.result),
                length = bytes.byteLength,
                i,
                base64String;
            for (var i = 0; i < length; i++) {
                binaryString += String.fromCharCode(bytes[i]);
            }
            base64String = btoa(binaryString);
            Ext.Ajax.request({
                url: 'app/crudadjunto',
                method: 'POST',
                scope: this,
                params: {
                    idsection: idsection,
                    idseccionpadre: idparentsection,
                    idpadreregistro: idregisterparent,
                    idregister: idrecordsection,
                    idmenu: idmenu,
                    accion: action,
                    filename: filename,
                    file: base64String
                },
                scope: this,
                success: function (response) {
                    mask.hide();
                    var json = Ext.JSON.decode(response.responseText);
                    if (json.success == true) {
                        MasterApp.attached.addOneFile(json);
                    }
                }
            })
        }
        reader.readAsArrayBuffer(file);
    },

    delete: function (me, e, eOpts) {
        Ext.Msg.show({
            title: 'Confirmaci&oacute;n',
            message: '&iquest;Est&aacute; seguro que desea eliminar el adjunto seleccionado?',
            buttons: Ext.Msg.YESNO,
            buttonText: {
                yes: 'Sí',
                no: 'No'
            },
            scope: this,
            fn: function (text, btn) {
                if (text == 'yes') {
                    var idsection = MasterApp.util.getIdSectionActive();
                    var currentform = me.up('form');
                    var mainform = currentform.up('form');
                    var lbl = currentform.down('label');
                    this.fileslist.pop(lbl.text);
                    var del = {
                        url: 'app/crudadjunto',
                        method: 'POST',
                        scope: this,
                        params: {
                            'idsection': idsection,
                            'accion': '7',
                            'idadjunto': me.idComp
                        },
                        callback: function (options, success, response) {
                            mainform.remove(currentform);
                            Ext.toast('El adjunto fue borrado con éxito.');
                        }
                    };
                    Ext.Ajax.request(del);
                }
            }
        });
    },

    download: function (btn) {
        var url = btn.dirFile;
        var link = document.createElement('a');
        link.href = url;
        link.download = btn.nameFile;
        link.click();
    },

    addComponent: function (datos) {
        for (var j = 0; j < datos.length; j++) {
            this.addFile(datos[j]);
        }
    },

    find: function (value) {
        var valid = true;
        for (var i = 0; i < this.fileslist.length; i++) {
            if (value.trim() == this.fileslist[i].trim()) {
                valid = false;
                break;
            }
        }
        return valid;
    },

    addOneFile: function (json) {
        var obj = {
            id: json.id,
            valor: json.ruta,
            nombre: json.datos

        };
        var valid = this.find(obj.nombre);
        if (valid) {
            this.addFile(obj);
            Ext.toast('El adjunto fue insertado con éxito.');
        } else {
            Ext.MessageBox.show({
                title: 'Error',
                msg: 'Existe ya un fichero con el nombre "' + obj.nombre + '".',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.INFO
            });
        }
    },

    addFile: function (file) {
        if (file.valor === null)
            return;
        var nombre = file.nombre;
        this.fileslist.push(nombre);
        var addedFilePanel = Ext.create('Ext.form.Panel', {
            frame: false,
            border: 0,
            padding: 2,
            idComp: file.id,
            dirFile: file.valor,
            nameFile: nombre,
            margin: '10',
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            items: [
                {
                    xtype: 'button',
                    text: null,
                    border: 0,
                    frame: false,
                    iconCls: 'fa fa-trash',
                    tooltip: 'Eliminar',
                    cls: 'x-btn-form',
                    idComp: file.id,
                    width: '7.5%',
                    listeners: {
                        scope: this,
                        click: function (me, e, eOpts) {
                            MasterApp.attached.delete(me, e, eOpts);
                        }
                    }
                },
                {
                    xtype: 'label',
                    width: '85%',
                    style: {
                        'margin-left': '5px'
                    },
                    listeners: {
                        render: function (me, eOpts) {
                            me.setText(nombre);
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: null,
                    border: 0,
                    frame: false,
                    idComp: file.id,
                    dirFile: file.valor,
                    nameFile:file.nombre,
                    iconCls: 'fa fa-download',
                    tooltip: 'Descargar',
                    cls: 'x-btn-form',
                    width: '7.5%',
                    listeners: {
                        scope: this,
                        click: function (me, e, eOpts) {
                            MasterApp.attached.download(me, e, eOpts);
                        }
                    }
                },
            ]
        });
        Ext.ComponentQuery.query('attached-view')[0].add(addedFilePanel);
    },

    removeAll: function () {
        var view = Ext.ComponentQuery.query('attached-view')[0];
        var items = view.items.items;
        for (var i = items.length; i > 0; i--) {
            view.remove(items[i]);
        }
    },

    clean: function () {
        var panel = Ext.ComponentQuery.query('attached-view')[0];
        panel.removeAll();
        this.addButtonUploadControl();
    },

    getFileName: function (value) {
        var fileNameIndex = value.lastIndexOf("/") + 1;
        if (fileNameIndex == 0) {
            fileNameIndex = value.lastIndexOf("\\") + 1;
        }
        var filename = value.substr(fileNameIndex);
        return filename;
    }
})
