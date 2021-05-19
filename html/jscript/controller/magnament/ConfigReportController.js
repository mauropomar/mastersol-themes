Ext.define('MasterSol.controller.magnament.ConfigReportController', {
    extend: 'Ext.app.Controller',
    isEdit: false,
    init: function () {

    },

    beforeedit: function (editor, e, eOpts) {
        var gridsection = MasterApp.globals.getGridSection();
        if (gridsection.read_only) {
            e.cancel = true;
            return;
        }
        var record = e.record;
        var column = Ext.ComponentQuery.query('#config-report-view')[0].columns[1];
        if (record.data.fk == '1') {
            MasterApp.register.setComboFk(record, column);
            return;
        }
        ;
        if (record.data.tipo == 'number') {
            MasterApp.register.setNumberField(record, column);
        }
        if (record.data.tipo == 'string') {
            MasterApp.register.setTextField(column);
        }
        if (record.data.tipo == 'boolean') {
            MasterApp.register.setCheckbox(column);
        }
        if (record.data.tipo == 'date') {
            MasterApp.register.setDateField(record, column);
        }
        if (record.data.tipo == 'datetime') {
            MasterApp.register.setDateTimeField(record, column);
        }

    },

    edit: function (editor, obj) {
        var record = obj.record;
        if ((obj.value === null || obj.value === '') && record.previousValues) {
            record.set('valor', record.previousValues.valor);
        }
        if (record.data[obj.field] == obj.originalValue)
            return;
    },

    new: function (window) {
   //     Ext.ComponentQuery.query('#btn_insert_register')[0].show();
   //     Ext.ComponentQuery.query('#btn_save_register')[0].hide();
        var tabMagnament = Ext.ComponentQuery.query('tabmagnament')[0];
        tabMagnament.idmenumag = window.idmenu;
        var gridsection = MasterApp.globals.getGridSection();
        if (!gridsection || gridsection.idmenu != window.idmenu) {
            gridsection = MasterApp.globals.getSectionPrincipalByWindow(window);
            MasterApp.globals.setGridSection(gridsection);
        }
        var columns = gridsection.config.columns;
        this.addRegister(null, columns);
        this.isEdit = false;
        var grid = Ext.ComponentQuery.query('#config-report-view')[0];
        grid.focus();
        var edit = grid.plugins[0];
        edit.startEditByPosition({
            row: 0,
            column: 1
        });
    },

    //agrega filas dinamicamente a grid de registros
    addRegister: function (rec, columns) {
        this.showFieldRequired = false;
        var grid = Ext.ComponentQuery.query('#config-report-view')[0];
        var store = grid.getStore();
        store.removeAll();
        var data = [];
        columns = (columns.items) ? columns.items : columns;
        for (var i = 0; i < columns.length; i++) {
            var dataIndex = columns[i].dataIndex;
            var header = columns[i].text;
            data.push({
                id: i + 1,
                name: header,
                orden: i + 1,
                field: columns[i].n_column,
                idregistro: columns[i].idregister,
                id_datatype: columns[i].id_datatype,
                required: columns[i].required,
                auditable: columns[i].audit,
                real_name_in: columns[i].real_name_in,
                tipo: columns[i].type,
                valor: (rec != null) ? rec.data[dataIndex] : '',
                padre: 'Generales',
                fk: columns[i].fk
            })
        }
        store.loadData(data);
    },

    //editar registros
    loadValues: function (columnIndex) {
        var gridsection = MasterApp.globals.getGridSection();
        if (gridsection == null)
            return;
        var isRecordSelected = gridsection.getSelectionModel().hasSelection();
        var rec = MasterApp.globals.getRecordSection();
        var columns = gridsection.config.columns;
        this.addRegister(rec, columns);
        var grid = Ext.ComponentQuery.query('#config-report-view')[0];
        grid.focus();
        var title = MasterApp.util.getTitleSectionSelected();
        Ext.ComponentQuery.query('#tbtext_magnament_report')[0].setText('Reporte: ' + title);

    },

    isValid: function () {
        var grid = Ext.ComponentQuery.query('#config-report-view')[0];
        var store = grid.getStore();
        var idx = store.findBy(function (rec) {
            return (rec.data.required == true && rec.data.valor == '')
        });
        if (idx > -1) {
            this.showFieldRequired = true;
            grid.getSelectionModel().select(idx);
            var name = store.getAt(idx).get('name');
            MasterApp.util.showMessageInfo('El campo con el nombre "' + name + '" es obligatorio.');
            grid.getView().refresh();
        }
        return (idx > -1) ? false : true;
    },
    //guarda los cambios del registro seleccionado
    saveChanges: function () {
        var gridsection = MasterApp.globals.getGridSection();
        var grid = Ext.ComponentQuery.query('#config-report-view')[0];
        var mask = new Ext.LoadMask(grid, {
            msg: 'Guardando Cambios...'
        });
        var store = grid.getStore();
        mask.show();
        if (!this.isValid()) {
            mask.hide();
            return;
        }
        ;
        var data = MasterApp.register.getData(store);
        var idrecordsection = null;
        var idsection = MasterApp.util.getIdSectionActive();
        var idmenu = MasterApp.util.getIdMenuActive();
        var idrecordparent = gridsection.up('panel').idrecordparent;
        var idregisterparent = (idrecordparent) ? idrecordparent : 0;
        var idparentsection = MasterApp.util.getIdParentSectionActive();
        var action = '13';
        if (this.isEdit) { //si estas editando
            var record = MasterApp.globals.getRecordSection();
            if (record == null) {
                mask.hide();
                MasterApp.util.showMessageInfo('Debe seleccionar un registro para esta sesión');
                return;
            }
            ;
            idrecordsection = record.data.id;
            action = '14';
        }
        var save = {
            url: 'app/crudregister',
            method: 'POST',
            scope: this,
            params: {
                'idregistro': idrecordsection,
                'idsection': idsection,
                'idseccionpadre': idparentsection,
                'idpadreregistro': idregisterparent,
                'idmenu': idmenu,
                'accion': action,
                'data': Ext.encode(data),
                'section_checked': gridsection.section_checked
            },
            callback: function (options, success, response) {
                mask.hide();
                var json = Ext.JSON.decode(response.responseText);
                if (json.success == true) {
                    store.commitChanges();

                    grid.getView().refresh();
                } else {
                    MasterApp.util.showMessageInfo(json.message);
                }
            }
        };
        Ext.Ajax.request(save);
    },
});