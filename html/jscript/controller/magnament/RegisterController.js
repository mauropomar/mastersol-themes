/**
 * @author mauro
 */
Ext.define('MasterSol.controller.magnament.RegisterController', {
    extend: 'Ext.app.Controller',
    isEdit: false,
    showFieldRequired: false,
    init: function () {

    },

    edit: function (editor, obj) {
        var record = obj.record;
        if (obj.value === null || obj.value === '') {
            record.set('valor', record.previousValues.valor);
        }
        if (record.data[obj.field] == obj.originalValue)
            return;
    },

    new: function (window) {
        Ext.ComponentQuery.query('#btn_insert_register')[0].show();
        Ext.ComponentQuery.query('#btn_save_register')[0].hide();
        var gridsection = MasterApp.globals.getGridSection();
        if(gridsection.idmenu != window.idmenu){
            gridsection = MasterApp.globals.getSectionPrincipalByWindow(window)
        }
        var columns = gridsection.config.columns;
        this.addRegister(null, columns);
        this.isEdit = false;
        var grid = Ext.ComponentQuery.query('#register-view')[0];
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
        var grid = Ext.ComponentQuery.query('#register-view')[0];
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
    editRegister: function () {
        var gridsection = MasterApp.globals.getGridSection();
        var rec = MasterApp.globals.getRecordSection();
        var columns = gridsection.config.columns;
        this.addRegister(rec, columns);
        this.isEdit = true;
        Ext.ComponentQuery.query('#btn_insert_register')[0].hide();
        Ext.ComponentQuery.query('#btn_save_register')[0].show();
    },

    isValid: function () {
        var grid = Ext.ComponentQuery.query('#register-view')[0];
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
        var grid = Ext.ComponentQuery.query('#register-view')[0];
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
        var data = this.getData(store);
        var idrecordsection = null;
        var idsection = MasterApp.util.getIdSectionActive();
        var idmenu = MasterApp.util.getIdMenuActive();
        var idrecordparent = gridsection.up('panel').idrecordparent;
        var idregisterparent = (idrecordparent) ? idrecordparent : 0;
        var idparentsection = MasterApp.util.getIdParentSectionActive();
        var action = '13';
        if (this.isEdit) { //si estas editando
            var record = MasterApp.globals.getRecordSection();
            idrecordsection = record.data.id;
            action = '14';
        }
        var save = {
            url: 'php/manager/manageregister.php',
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
                    if (this.isEdit)
                        this.update(data);
                    else {
                        var idcreated = json.datos.id;
                        this.insert(data, idcreated);
                    }
                    this.showFieldRequired = false;
                    grid.getView().refresh();
                } else {
                    MasterApp.util.showMessageInfo(json.message);
                }
            }
        };
        Ext.Ajax.request(save);
    },

    insert: function (data, idcreated) {
        var obj = {};
        var array = [];
        for (var i = 0; i < data.length; i++) {
            var fk = data[i]['fk'];
            var field = (fk == 1) ? 'n_' + data[i]['field'] : data[i]['field'];
            obj[field] = data[i]['valor'];
        }
        array.push(obj);
        var grid = MasterApp.globals.getGridSection();
        var store = grid.getStore();
        store.insert(store.getCount(), array);
        var total = store.getCount();
        var index = total - 1;
        grid.getSelectionModel().deselectAll();
        grid.getSelectionModel().select(index, true);
        var record = grid.getSelectionModel().getSelection()[0];
        record.set('id', idcreated);
        MasterApp.globals.setRecordSection(record);
        Ext.ComponentQuery.query('#btn_insert_register')[0].hide();
        Ext.ComponentQuery.query('#btn_save_register')[0].show();
        store.commitChanges();
        this.isEdit = true;
        this.showFieldRequired = false;
    },

    update: function (data) {
        var record = MasterApp.globals.getRecordSection();
        for (var i = 0; i < data.length; i++) {
            var field = data[i]['field'];
            var valor = data[i]['valor'];
            record.set(field, valor);
        }
        record.commit();
    },

    getData: function (store) {
        var data = [];
        var records = store.getModifiedRecords();
        for (var j = 0; j < records.length; j++) {
            data.push({
                id: records[j].data.id,
                tipo: records[j].data.tipo,
                fk: records[j].data.fk,
                idregister: records[j].data.idregistro,
                id_datatype: records[j].data.id_datatype,
                real_name_in: records[j].data.real_name_in,
                auditable: records[j].data.auditable,
                field: records[j].data.field,
                idvalor: records[j].data.idvalor,
                valor: MasterApp.util.getVal(records[j], records[j].data['valor'])
            })
        }
        return data
    },

    beforeedit: function (editor, e, eOpts) {
        var record = e.record;
        var column = Ext.ComponentQuery.query('#register-view')[0].columns[1];
        if (record.data.fk == '1') {
            this.setComboFk(record, column);
            return;
        }
        ;
        if (record.data.tipo == 'number') {
            this.setNumberField(record, column);
        }
        if (record.data.tipo == 'string') {
            this.setTextField(column);
        }
        if (record.data.tipo == 'boolean') {
            this.setCheckbox(column);
        }
        if (record.data.tipo == 'date') {
            this.setDateField(record, column);
        }
    },
    //resetea los valores de los registros al insertar
    cleanValues: function () {
        var grid = Ext.ComponentQuery.query('#register-view')[0];
        var store = grid.getStore();
        store.each(function (rec) {
            rec.set('valor', '');
            rec.commit();
        });
    },

    setNumberField: function (rec, column) {
        var field = Ext.create('Ext.form.field.Number', {
            decimalPrecision: 2,
            name: 'fieldRegister',
            selectOnFocus: true,
            decimalSeparator: '.',
            listeners: {
                specialkey: this.specialKey
            }
        });
        if (rec.data.min) {
            field.setMinValue(rec.data.min);
            field.minText = "Debe ser mayor que " + rec.data.min + "."
        }
        ;
        if (rec.data.max) {
            field.setMaxValue(rec.data.max);
            field.maxText = "No debe exceder de " + rec.data.max + "."
        }
        ;
        column.setEditor(field);
    },

    setTextField: function (column) {
        var field = Ext.create('Ext.form.field.Text', {
            selectOnFocus: true,
            name: 'fieldRegister',
            listeners: {
                specialkey: this.specialKey
            }
        });
        column.setEditor(field);
    },

    setCheckbox: function (column) {
        var field = Ext.create('Ext.form.field.Checkbox', {
            listeners: {
                specialkey: this.specialKey
            }
        });
        column.setEditor(field);
    },

    setDateField: function (rec, column) {
        var field = Ext.create('Ext.form.field.Date', {
            format: 'd/m/Y',
            name: 'fieldRegister',
            listeners: {
                specialkey: this.specialKey,
                focus:function(f){
                    var value = f.getValue();
                    value = (value == null)?new Date(rec.data.valor):value;
                    f.setValue(value);
                }
            }
        });
        if (rec.data.min) {
            field.setMinValue(rec.data.min);
        }
        ;
        if (rec.data.max) {
            field.setMaxValue(rec.data.max);
        }
        ;
        column.setEditor(field);
    },

    specialKey: function (field, e) {
        var grid = Ext.ComponentQuery.query('#register-view')[0];
        var filas = grid.getStore().getCount()
        if (e.getKey() == e.ENTER) {
            var edit = grid.plugins[0];
            var row = edit.context.rowIdx;
            var row = (row + 1 < filas) ? row + 1 : 0;
            edit.startEditByPosition({
                row: row,
                column: 1
            })
        }
    },

    renderName: function (value, metaData, record) {
        if (record.data.required == true) {
            var table = '<table width="100%" border="0">' +
                '<tr><td class="left-cell">' + value + '</td>' +
                '<td style="text-align: left; color: red">*</td></tr>' +
                '</table>'
            return table;
        }
        return value;
    },

    clean: function () {
        var grid = Ext.ComponentQuery.query('#register-view')[0];
        grid.getStore().removeAll();
    },

    setComboFk: function (rec, column) {
        var idsection = MasterApp.util.getIdSectionActive();
        var combo = Ext.create('MasterSol.view.magnament.ComboFk', {
            multiSelect: (rec.data.tipo == 'array') ? true : false,
            listConfig: {
                loadingText: 'Buscando...',
                emptyText: 'No existen opciones....',
                itemSelector: '.search-item',
                width: 150
            },
            listeners: {
                scope: this,
                collapse: this.collapseFk
            }
        });
        combo.arrayId = [];
        combo.arrayText = [];
        var store = combo.getStore();
        store.proxy.url = 'php/manager/getforeignkey.php';
        store.proxy.extraParams = {
            idregistro: rec.data.idregistro,
            idsection: idsection
        };
        var values = rec.data.valor;
        store.load({
                callback: function (store, records) {
                    var values = (values) ? values.split(',') : combo.getValue();
                    combo.setValue(values);
                }
            }
        );
        column.setEditor(combo);
    },

    collapseFk: function (combo, rec) {
        var grid = Ext.ComponentQuery.query('#register-view')[0];
        var recGrid = grid.getSelectionModel().getSelection()[0];
        var arrayId = [];
        var arrayText = [];
        if (combo.lastSelection) {
            var selects = combo.lastSelection;
            for (var i = 0; i < selects.length; i++) {
                var textFk = selects[i].data['nombre'];
                var idFk = selects[i].data['id'];
                if (idFk.indexOf('MasterSol') == -1) {
                    var stringArray = arrayId.join(',');
                    var idx = stringArray.indexOf(idFk);
                    if (idx == -1) {
                        arrayId.push(idFk);
                        arrayText.push(textFk);
                    }
                }
            }
        }
        combo.setValue(arrayText.join(','));
        recGrid.set('valor', arrayText.join(','));
        recGrid.set('idvalor', arrayId.join(','));
    }
})