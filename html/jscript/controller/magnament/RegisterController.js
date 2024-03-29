/**
 * @author mauro
 */
Ext.define('MasterSol.controller.magnament.RegisterController', {
    extend: 'Ext.app.Controller',
    isEdit: false,
    showFieldRequired: false,
    init: function () {

    },

    edit: function (editor, obj, e) {
        var record = obj.record;
        if ((obj.value === null) && record.previousValues) {
            record.set('valor', record.previousValues.valor);
        }
        if (record.data[obj.field] == obj.originalValue)
            return;
    },

    new: function (window) {
        var tabMagnament = Ext.ComponentQuery.query('tabmagnament')[0];
        if(tabMagnament.collapsed)
            return;
        Ext.ComponentQuery.query('#btn_insert_register')[0].show();
        Ext.ComponentQuery.query('#btn_save_register')[0].hide();
        tabMagnament.idmenumag = window.idmenu;
        var gridsection = MasterApp.globals.getGridSection();
        if (!gridsection || gridsection.idmenu != window.idmenu) {
            gridsection = MasterApp.globals.getSectionPrincipalByWindow(window);
            MasterApp.globals.setGridSection(gridsection);
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
                dec_count: columns[i].dec_count,
                required: columns[i].required,
                auditable: columns[i].audit,
                real_name_in: columns[i].real_name_in,
                link_parent: columns[i].link_parent,
                tipo: columns[i].type,
                valor: this.getValue(rec, dataIndex),
                padre: 'Generales',
                fk: columns[i].fk
            });
        }
        store.loadData(data);
    },

    //editar registros
    editRegister: function (columnIndex) {
        var gridsection = MasterApp.globals.getGridSection();
        if (gridsection == null)
            return;
        var isRecordSelected = gridsection.getSelectionModel().hasSelection();
        var rec = MasterApp.globals.getRecordSection();
        var columns = gridsection.config.columns;
        this.addRegister(rec, columns);
        if (!isRecordSelected) {
            this.isEdit = false;
            Ext.ComponentQuery.query('#btn_insert_register')[0].show();
            Ext.ComponentQuery.query('#btn_save_register')[0].hide();
        } else {
            this.isEdit = true;
            Ext.ComponentQuery.query('#btn_insert_register')[0].hide();
            Ext.ComponentQuery.query('#btn_save_register')[0].show();
        }
        var grid = Ext.ComponentQuery.query('#register-view')[0];
        grid.focus();
        var edit = grid.plugins[0];
        edit.startEditByPosition({
            row: columnIndex,
            column: 1
        });
        var title = MasterApp.util.getTitleSectionSelected();
        Ext.ComponentQuery.query('#tbtext_magnament_register')[0].setText('Register: ' + title);

    },

    isValid: function () {
        var grid = Ext.ComponentQuery.query('#register-view')[0];
        var store = grid.getStore();
        var idx = store.findBy(function (rec) {
            return (!rec.data.link_parent && rec.data.required && rec.data.valor == '')
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
                    if (this.isEdit)
                        this.update(json, store);
                    else {
                        this.insert(json, store);
                        gridsection.max_line++;
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

    insert: function (json, storeRegister) {
        var idcreated = json.datos.id,
            data = json.datos,
            fields = Object.keys(data),
            obj = {},
            array = [];
        for (var i = 0; i < fields.length; i++) {
            var key = fields[i];
            var idx = storeRegister.findExact('field', key);
            if (idx > -1) {
                var rec = storeRegister.getAt(idx);
                obj[key] = data[key];
                if (rec.data.fk === 1) {
                    var nField = 'n_' + key;
                    obj[nField] = rec.data.valor;
                }
            }
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

    update: function (json, storeRegister) {
        var data = json.datos,
            fields = Object.keys(data),
            obj = {};
        var record = MasterApp.globals.getRecordSection();
        for (var i = 0; i < fields.length; i++) {
            var key = fields[i];
            var idx = storeRegister.findExact('field', key);
            if (idx > -1) {
                var rec = storeRegister.getAt(idx);
                obj[key] = data[key];
                record.set(key, data[key]);
                if (rec.data.fk === 1) {
                    var nField = 'n_' + key;
                    record.set(nField, rec.data.valor);
                }
            }
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
            });
        }
        this.aggregateFieldOfLinkParent(store, data);
        return data;
    },

    beforeedit: function (editor, e, eOpts) {
        var record = e.record;
        var gridsection = MasterApp.globals.getGridSection();
        if (gridsection.read_only || record.data.link_parent) {
            e.cancel = true;
            return;
        }
        var column = Ext.ComponentQuery.query('#register-view')[0].columns[1];
        if (record.data.fk == '1') {
            this.setComboFk(record, column);
            return;
        }
        ;
        if (record.data.tipo == 'number') {
            this.setNumberField(record, column);
        }
        if (record.data.tipo == 'string' || record.data.tipo == 'array') {
            this.setTextField(column, record);
        }
        if (record.data.tipo == 'boolean') {
            this.setCheckbox(column);
        }
        if (record.data.tipo == 'date') {
            this.setDateField(record, column);
        }
        if (record.data.tipo == 'datetime') {
            this.setDateTimeField(record, column);
        }
        if (record.data.tipo == 'bytea') {
            e.cancel = true;
            this.setFileButton(record, column);
        }

    },
    //resetea los valores de los registros al insertar
    cleanValues: function () {
        Ext.ComponentQuery.query('#btn_insert_register')[0].show();
        Ext.ComponentQuery.query('#btn_save_register')[0].hide();
        var grid = Ext.ComponentQuery.query('#register-view')[0];
        var store = grid.getStore();
        store.each(function (rec) {
            rec.set('valor', '');
            rec.commit();
        });
        this.isEdit = false;
        var edit = grid.plugins[0];
        edit.startEditByPosition({
            row: 0,
            column: 1
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

    setTextField: function (column, rec) {
        var field = Ext.create('Ext.form.field.Text', {
            selectOnFocus: true,
            name: 'fieldRegister',
            listeners: {
                specialkey: this.specialKey
            }
        });
        if (rec.data.dec_count !== null) {
            field.maxLength = rec.data.dec_count;
            field.maxLengthText = 'No debe exceder debe exceder de ' + rec.data.dec_count + ' carácteres.';
        }
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
                focus: function (f) {
                    var value = f.getValue();
                    value = (value == null || value == '') ? new Date(rec.data.valor) : value;
                    value = (value == 'Invalid Date') ? null : value;
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

    setDateTimeField: function (rec, column) {
        var edit = Ext.create('MasterSol.view.plugins.DateTime', {
            className: 'MasterSol.controller.magnament.RegisterController'
        });
        var value = new Date(rec.data.valor);
        edit.setValue(value);
        column.setEditor(edit);
        Ext.defer(() => {
            edit.dateField.focus('', false);
        }, 1);

    },

    setFileButton: function (rec, column) {
        var grid = Ext.ComponentQuery.query('register-view')[0];
        var select = grid.getSelectionModel().getSelection()[0];
        var idx = grid.getStore().indexOf(select);
        var cell = grid.getView().getCell(idx, 1);
        var pos = Ext.fly(cell).getXY();
        //    Ext.create('MasterSol.view.magnament.WindowFileButton'
        if (Ext.ComponentQuery.query('filefield[name=file_editor]')[0]) {
            Ext.ComponentQuery.query('filefield[name=file_editor]')[0].show();
            return;
        }
        var edit = Ext.create('Ext.form.field.File', {
            buttonOnly: true,
            hideLabel: true,
            allowBlank: true,
            floating: true,
            hasFocus: true,
            name: 'file_editor',
            //    width: 30,
            x: pos[0] + 100,
            y: pos[1],
            buttonConfig: {
                text: 'Seleccione una imagen',
                iconCls: 'fa fa-image',
                tooltip: 'Subir archivo',
            },
            listeners: {
                scope: this,
                change: function (view) {
                    this.selectImageBytea(view, edit);
                },
                blur: function () {
                    edit.hide();
                }
            }
        });
        edit.show();
        edit.focus();
    },

    specialKey: function (field, e) {
        var grid = Ext.ComponentQuery.query('#register-view')[0];
        var filas = grid.getStore().getCount();
        if (e.getKey() == e.ENTER) {
            var edit = grid.plugins[0];
            var row = edit.context.rowIdx;
            row = (row + 1 < filas) ? row + 1 : 0;
            edit.completeEdit();
            edit.startEditByPosition({
                row: row,
                column: 1
            });
            grid.getSelectionModel().select(row);
        }
    },

    renderName: function (value, metaData, record) {
        if (!record.data.link_parent && record.data.required) {
            var table = '<table width="100%" border="0">' +
                '<tr><td class="left-cell">' + value + '</td>' +
                '<td style="text-align: left; color: red">*</td></tr>' +
                '</table>';
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
                width: column.cellWidth
            },
            listeners: {
                scope: this,
                collapse: this.collapseFk,
                specialKey: this.specialKey,
                beforequery: function (record) {
                    record.query = new RegExp(record.query, 'ig');
                }
            }
        });
        combo.arrayId = [];
        combo.arrayText = [];
        var gridsection = MasterApp.globals.getGridSection();
        var idrecordparent = gridsection.up('panel').idrecordparent;
        var store = combo.getStore();
        store.proxy.url = 'app/foreignkey';
        store.proxy.extraParams = {
            idregistro: rec.data.idregistro,
            idpadreregistro: (idrecordparent) ? idrecordparent : 0,
            idsection: idsection
        };
        var values = rec.data.valor;
        store.load({
                callback: function () {
                    if (values) {
                        values = (values) ? values.split(',') : combo.getValue();
                        combo.setValue(values);
                    }
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
    },
    // cuando se edita la seccion pone como editable la columna seleccionada.
    setFocusCell: function (dataIndex) {
        var grid = Ext.ComponentQuery.query('#register-view')[0];
        var store = grid.getStore();
        var index = store.findBy(function (rec, ide) {
            return (rec.data.name.toLowerCase() == dataIndex.toLowerCase())
        });
        if (index == -1)
            return;
        var edit = grid.plugins[0];
        edit.startEditByPosition({
            row: index,
            column: 1
        });
    },

    onChangesReject: function () {
        var grid = Ext.ComponentQuery.query('#register-view')[0];
        var store = grid.getStore();
        store.rejectChanges();
    },

    getValue: function (rec, dataIndex) {
        if (dataIndex == 'active' && rec == null)
            return true;
        return (rec != null) ? rec.data[dataIndex] : '';
    },

    removeAll: function () {
        var grid = Ext.ComponentQuery.query('#register-view')[0];
        var store = grid.getStore();
        store.loadData([]);
    },

    aggregateFieldOfLinkParent: function (store, data) {
        var gridsection = MasterApp.globals.getGridSection();
        var idrecordparent = gridsection.up('panel').idrecordparent;
        var idregisterparent = (idrecordparent) ? idrecordparent : 0;
        store.each(function (rec) {
            if (rec.data.link_parent) {
                data.push({
                    id: rec.data.id,
                    tipo: rec.data.tipo,
                    fk: rec.data.fk,
                    idregister: rec.data.idregistro,
                    id_datatype: rec.data.id_datatype,
                    real_name_in: rec.data.real_name_in,
                    auditable: rec.data.auditable,
                    field: rec.data.field,
                    idvalor: idregisterparent,
                    valor: idregisterparent
                });
            }
        });
    },

    selectImageBytea: function (view, comp) {
        var file = view.fileInputEl.el.dom.files[0];
        if (!MasterApp.util.isFileImage(file)) {
            Ext.MessageBox.show({
                title: 'Información',
                msg: 'La extensión de la imagen no es correcta.',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.INFO
            });
            return;
        }
        var reader = new FileReader();
        reader.readAsDataURL(file);
        var grid = Ext.ComponentQuery.query('#register-view')[0];
        var record = grid.getSelectionModel().getSelection()[0];
        reader.onload = function (evt) {
            var result = evt.target.result;
            record.set('valor', result);
            comp.hide();
        };
    }
})
