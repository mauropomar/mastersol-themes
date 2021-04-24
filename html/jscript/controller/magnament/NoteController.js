Ext.define('MasterSol.controller.magnament.NoteController', {
    extend: 'Ext.app.Controller',
    isLoading: false,
    control: {
        'textarea[name=textarea-note]': { // matches the view itself
            change: 'changeTextArea'
        }
    },
    addNote: function () {
        var form = this.getNote(null);
        Ext.ComponentQuery.query('note-view')[0].add(form);
        form.down('textarea').focus('', 10);
    },
    getNote: function (id) {
        return Ext.create('Ext.form.Panel', {
            frame: false,
            border: 1,
            padding: 2,
            resizable: true,
            idNota: id,
            tools: [{
                iconCls: 'fa fa-save',
                hidden: true,
                tooltip:'Guardar Cambios',
                listeners: {
                    click: this.saveChanges
                }
            }, {
                iconCls: 'fa fa-trash',
                tooltip:'Borrar',
                listeners: {
                    click: this.delete
                }
            }],
            layout: {
                type: 'fit'
            },
            items: [
                {
                    xtype: 'textarea',
                    name: 'textarea-note'
                }
            ]
        });
    },

    saveChanges(b) {
        b.setDisabled(true);
        var gridsection = MasterApp.globals.getGridSection();
        var form = b.up('form');
        document.getElementById(form.id).style.border = 'transparent';
        var textarea = form.down('textarea');
        var mask = new Ext.LoadMask(form, {
            msg: 'Guardando...'
        });
        mask.show();
        var idsection = MasterApp.util.getIdSectionActive();
        var idmenu = MasterApp.util.getIdMenuActive();
        var idrecordparent = gridsection.up('panel').idrecordparent;
        var idregisterparent = (idrecordparent) ? idrecordparent : 0;
        var idparentsection = MasterApp.util.getIdParentSectionActive();
        var record = MasterApp.globals.getRecordSection();
        idrecordsection = (record != null) ? record.data.id : null;
        if(idrecordsection == null){
            mask.hide();
            MasterApp.util.showMessageInfo('Debe seleccionar un registro para esta sesión');
            return;
        }
        var action = (form.idNota == null) ? '13' : '14';
        var save = {
            url: 'app/crudnotes',
            method: 'POST',
            scope: this,
            params: {
                'id': form.idNota,
                'idregistro': idrecordsection,
                'idsection': idsection,
                'idseccionpadre': idparentsection,
                'idpadreregistro': idregisterparent,
                'idmenu': idmenu,
                'accion': action,
                'texto': textarea.getValue()
            },
            success: function (response) {
                mask.hide();
                var json = Ext.JSON.decode(response.responseText);
                if (json.success == true) {
                    form.idNota = json.datos;
                    b.setDisabled(false);
                } else {
                    MasterApp.util.showMessageInfo(json.message);
                }
            }
            ,
            failure: function (response) {
                mask.hide();
            }
        };
        Ext.Ajax.request(save);
    },

    changeTextArea: function (field, newValue) {
        var form = field.up('form');
        var idbutton = field.up('form').tools[0].id;
        if (newValue !== '')
            Ext.ComponentQuery.query('#' + idbutton)[0].show();
        else
            Ext.ComponentQuery.query('#' + idbutton)[0].hide();
        if (!this.isLoading)
            document.getElementById(form.id).style.border = '2px solid red';
    },

    getAll: function () {
        var mask = new Ext.LoadMask(Ext.ComponentQuery.query('note-view')[0], {
            msg: 'Cargando...'
        });
        mask.show();
        var record = MasterApp.globals.getRecordSection();
        idrecordsection = (record != null) ? record.data.id : null;
        var idsection = MasterApp.util.getIdSectionActive();
        var idmenu = MasterApp.util.getIdMenuActive();
        var obtener = {
            url: 'app/notes',
            method: 'GET',
            scope: this,
            params: {
                idsection: idsection,
                idmenu: idmenu,
                idregistro: idrecordsection,
                accion: '5'
            },
            success: function (response) {
                mask.hide();
                var json = Ext.JSON.decode(response.responseText);
                this.setNotas(json);
                var title = MasterApp.util.getTitleSectionSelected();
                Ext.ComponentQuery.query('#tbtext_magnament_note')[0].setText('Notas: ' + title);
            },
            failure: function (response) {
                mask.hide();
            }
        };
        Ext.Ajax.request(obtener);
    },
    setNotas: function (datos) {
        this.isLoading = true;
        Ext.ComponentQuery.query('note-view')[0].removeAll();
        for (var i = 0; i < datos.length; i++) {
            var idnote = datos[i]['id'];
            var form = this.getNote(idnote);
            Ext.ComponentQuery.query('note-view')[0].add(form);
            form.down('textarea').focus('', 10);
            form.down('textarea').setValue(datos[i]['value']);
            var idbutton = form.down('textarea').up('form').tools[0].id;
            Ext.ComponentQuery.query('#' + idbutton)[0].hide();
        }
        this.isLoading = false;
    },

    delete: function (me, e, eOpts) {
        Ext.Msg.confirm('Confirmaci&oacute;n', '&iquest;Est&aacute; seguro que desea eliminar la nota seleccionada?', function (conf) {
            if (conf == 'yes') {
                var currentform = me.up('form');
                var mainform = currentform.up('form');
                var lbl = currentform.down('label')
                var idsection = MasterApp.util.getIdSectionActive();
                var remove = {
                    url: 'app/crudnotes',
                    method: 'POST',
                    scope: this,
                    params: {
                        'idsection': idsection,
                        'accion': '7',
                        'idnota': currentform.idNota
                    },
                    callback: function (options, success, response) {
                        mainform.remove(currentform);
                        currentform.destroy();
                        Ext.toast('La nota fue borrada con éxito.');
                    }
                };
                Ext.Ajax.request(remove);
            }
        }, this);
    },

    clean: function () {
        Ext.ComponentQuery.query('note-view')[0].removeAll();
    }
})