Ext.define('MasterSol.controller.magnament.FilterController', {
    extend: 'Ext.app.Controller',
    isEdit: false,
    init: function () {

    },

    edit: function (editor, obj) {
        var record = obj.record;
        var field = obj.field;
        if (record.data.tipo == 'date' && obj.value == null) {
            record.set(field, record.previousValues[field]);
        }
        if (record.data[field] == obj.originalValue)
            return;
    },

    beforeedit: function (editor, e, eOpts) {
        var record = e.record;
        var col = e.colIdx;
        var column = Ext.ComponentQuery.query('#filter-view')[0].columns[col];
        if (column.dataIndex == 'operador') {
            this.loadOperators(e);
            return;
        }
        if (column.dataIndex == 'valor2' && record.data.cantparam == 1) {
            e.cancel = true;
        }
        if (column.dataIndex == 'valor2' && (record.data.tipo == 'string' || record.data.tipo == 'boolean')) {
            e.cancel = true;
        }
        if (column.dataIndex == 'valor1' && record.data.fk == '1') {
            this.setComboFk(record, column);
            return;
        }
        ;
        if (column.dataIndex == 'valor1' && record.data.tipo == 'array') {
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
        if (record.data.tipo == 'datetime') {
            this.setDateTimeField(record, column);
        }
    },

    // en dependencia del tipo de datos cargar los filtros correspondientes
    loadOperators: function (obj) {
        var record = obj.record;
        var column = obj.column;
        var edit = column.getEditor();
        var store = edit.getStore();
        var data = (record.data.operadores == null) ? [] : record.data.operadores;
        store.loadData(data);
    },

    getAll: function () {
        var idsection = MasterApp.util.getIdSectionActive();
        var idmenu = MasterApp.util.getIdMenuActive();
        if (this.checkData())
            return;
        this.configureButtons();
        var grid = Ext.ComponentQuery.query('#filter-view')[0];
        var store = grid.getStore();
        store.proxy.extraParams = {
            idmenu: idmenu,
            idsection: idsection
        };
        store.load({
            callback: function () {
                grid.focus();
                var edit = grid.getPlugin();
                var n_column = MasterApp.util.getNColumnSection();
                if (this.getCount() > 0 && n_column != null) {
                    var index = this.findExact('nombrecampo', n_column);
                    edit.startEditByPosition({
                        row: index,
                        column: 2
                    });
                }
                if (MasterApp.globals.actionKeyCrtlF)
                    MasterApp.filter.findIndexSetFocusField();
                var title = MasterApp.util.getTitleSectionSelected();
                Ext.ComponentQuery.query('#tbtext_magnament_filter')[0].setText('Filter: ' + title);
            }
        });
    },

    saveChanges: function () {
        var gridsection = MasterApp.globals.getGridSection();
        var grid = Ext.ComponentQuery.query('#filter-view')[0];
        var mask = new Ext.LoadMask(grid, {
            msg: 'Guardando Cambios...'
        });
        var store = grid.getStore();
        mask.show();
        var data = this.getData(store);
        var idsection = MasterApp.util.getIdSectionActive();
        var idmenu = MasterApp.util.getIdMenuActive();
        var idrecordparent = gridsection.up('panel').idrecordparent;
        var idregisterparent = (idrecordparent) ? idrecordparent : 0;
        var idparentsection = MasterApp.util.getIdParentSectionActive();
        var record = MasterApp.globals.getRecordSection();
        idrecordsection = (record != null) ? record.data.id : null;
        if (data.length == 0) {
            var idx = store.findBy(function (rec, id) {
                return (rec.data.operador == null && (rec.data.valor1 !== null && rec.data.valor1 !== ''))
            });
            grid.getSelectionModel().select(idx);
            Ext.Msg.show({
                title: 'Informaci&oacute;n',
                msg: 'Debe seleccionar un operador y los valores para el filtro seleccionado.',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });
            mask.hide();
            return;
        }
        ;
        var filter = {
            url: 'app/resultfilteroperators',
            method: 'POST',
            scope: this,
            params: {
                'idregistro': idrecordsection,
                'idsection': idsection,
                'idseccionpadre': idparentsection,
                'idpadreregistro': idregisterparent,
                'idmenu': idmenu,
                'accion': '2',
                'data': Ext.encode(data),
                'totales': MasterApp.util.getTotalsBySection()
            },
            callback: function (options, success, response) {
                mask.hide();
                var json = Ext.JSON.decode(response.responseText);
                var data = json.datos;
                MasterApp.globals.setRecordSection(null);
                if (data != null) {
                    this.configuredData();
                    store.commitChanges();
                    gridsection.getStore().loadData(data);
                    if (json.totales.datos)
                        MasterApp.totals.changeIconsTotals(json.totales.datos);
                } else {
                    MasterApp.util.showMessageInfo(json.message);
                    gridsection.getStore().removeAll();
                }
            }
        };
        Ext.Ajax.request(filter);
    },

    new: function () {
        var grid = Ext.ComponentQuery.query('#filter-view')[0];
        var store = grid.getStore();
        store.each(function (rec) {
            rec.set('operador', '');
            rec.set('valor1', '');
            rec.set('valor2', '');
            rec.commit();
        });
        var gridsection = MasterApp.globals.getGridSection();
        var window = gridsection.up('window');
        this.cleanArrayData(window);
        MasterApp.totals.new();
        MasterApp.section.refreshSectionActive(window);
    },

    cleanArrayData: function (window) {
        var arrayFilter = MasterApp.globals.getArrayFilter();
        var idsection = MasterApp.util.getIdSectionActive();
        for (var j = 0; j < arrayFilter.length; j++) {
            if (arrayFilter[j]['id'] == window.idmenu) {
                var registers = arrayFilter[j]['registers'];
                for (var i = 0; i < registers.length; i++) {
                    if (registers[i]['id'] == idsection) {
                        if (registers[i]['filters']) {
                            registers[i]['filters'] = [];
                            registers[i]['id'] = null;
                        }
                    }
                }
            }
        }
    },

    //configurar arreglo por registro y ventana
    configuredData: function () {
        var data = this.getAllData();
        var idsection = MasterApp.util.getIdSectionActive();
        var gridsection = MasterApp.globals.getGridSection();
        var window = gridsection.up('window');
        var array = MasterApp.globals.getArrayFilter();
        var exists = false;
        var existsReg = false;
        for (var j = 0; j < array.length; j++) {
            if (array[j]['id'] == window.idmenu) {
                exists = true;
                var registers = array[j]['registers'];
                existsReg = false;
                for (var i = 0; i < registers.length; i++) {
                    if (registers[i]['id'] == idsection) {
                        registers[i]['filters'] = data;
                        existsReg = true;
                    }
                }
                if (!existsReg) {
                    array[j]['registers'].push({
                        id: idsection,
                        filters: data
                    })
                }
            }
        }
        ;
        if (!exists) {
            array.push({
                id: window.idmenu,
                registers: [{
                    id: idsection,
                    filters: data
                }]
            })
        }
    },

    //conforma arreglo de filtros a guardar
    getData: function (store) {
        var data = [];
        var rec;
        store.each(function (record) {
            rec = record;
            var valor1 = MasterApp.util.getVal(rec, rec.data.valor1);
            var valor2 = MasterApp.util.getVal(rec, rec.data.valor2);
            var valid = (valor1 || (valor1 == false && rec.data.tipo === 'boolean'));
            if (valid) {
                var d = this.getIdOperator(rec, valor1);
                var idoperator = d[0];
                var cantparam = d[1];
                var real_name_in = MasterApp.util.getValProperty(rec.data.nombrecampo, 'real_name_in');
                var real_name_out = MasterApp.util.getValProperty(rec.data.nombrecampo, 'real_name_out');
                if (idoperator && valid) {
                    data.push({
                        idregister: rec.data.idregistro,
                        nombrecampo: rec.data.nombrecampo,
                        idtipodato: rec.data.idtipodato,
                        tipo: rec.data.tipo,
                        fk: rec.data.fk,
                        idoperador: idoperator,
                        operadores: rec.data.operadores,
                        idvalor: rec.data.idvalor,
                        real_name_in: real_name_in,
                        real_name_out: real_name_out,
                        valor1: valor1,
                        valor2: valor2,
                        cantparam: cantparam
                    })
                }
            }
        }, this);
        return data
    },

    // devuelve el data original con todos los valores de los filtros
    getAllData: function () {
        var datos = [];
        var grid = Ext.ComponentQuery.query('#filter-view')[0];
        var store = grid.getStore();
        store.each(function (rec) {
            var valor1 = MasterApp.util.getVal(rec, rec.data.valor1, true);
            var valor2 = MasterApp.util.getVal(rec, rec.data.valor2, true);
            var d = this.getIdOperator(rec, valor1);
            var idoperator = d[0];
            var cantparam = d[1];
            datos.push({
                idregister: rec.data.idregistro,
                nombrecampo: rec.data.nombrecampo,
                idtipodato: rec.data.idtipodato,
                tipo: rec.data.tipo,
                fk: rec.data.fk,
                idoperador: (valor1) ? idoperator : null,
                operador: (valor1) ? this.getOperator(rec, valor1) : null,
                operadores: rec.data.operadores,
                idvalor: rec.data.idvalor,
                valor1: valor1,
                valor2: valor2,
                cantparam: cantparam
            });
        }, this)
        return datos;
    },
    //devuelve el id del operador
    getIdOperator: function (rec, val) {
        var idoperator = null;
        var cantparam = 1;
        var operators = (rec.data.operadores) ? rec.data.operadores : new Array();
        if (val !== null && val !== '' && operators.length > 0) {
            var operator = (rec.data.operador) ? rec.data.operador : rec.data.operadores[0]['simbolo'];
            idoperator = this.getOperatorDefault(rec.data.operadores, operator);
            cantparam = this.getCantParam(rec.data.operadores, operator);
            if (val)
                rec.set('operador', operator);
        }
        return new Array(idoperator, cantparam);
    },

    //devuelve el operador
    getOperator: function (rec, val) {
        var operator = null;
        var operators = (rec.data.operadores) ? rec.data.operadores : new Array();
        if (val != null && val != '' && operators.length > 0) {
            operator = (rec.data.operador) ? rec.data.operador : rec.data.operadores[0]['simbolo'];
            if (val)
                rec.set('operador', operator);
        }
        return operator;
    },
    //devuelve operador por defecto
    getOperatorDefault: function (operators, operator) {
        var idoperator = null;
        for (var j = 0; j < operators.length; j++) {
            if (operators[j]['simbolo'] == operator) {
                idoperator = operators[j]['id'];
                break
            }
        }
        return idoperator;
    },

    //devuelve la cantidad parametros por registro para el arreglo virtual
    getCantParam: function (operators, operator) {
        var cantparam = 1;
        for (var j = 0; j < operators.length; j++) {
            if (operators[j]['simbolo'] == operator) {
                cantparam = operators[j]['cantidadparam'];
                break;
            }
        }
        return cantparam;
    },

    setNumberField: function (rec, column) {
        var edit = Ext.create('Ext.form.field.Number', {
            decimalPrecision: 2,
            name: 'fieldFilter',
            selectOnFocus: true,
            decimalSeparator: '.',
            listeners: {
                specialkey: this.specialKey
            }
        });
        column.setEditor(edit);
    },

    setTextField: function (column) {
        var edit = Ext.create('Ext.form.field.Text', {
            name: 'fieldFilter',
            selectOnFocus: true,
            enableKeyEvents: true,
            listeners: {
                specialkey: this.specialKey
            }
        });
        column.setEditor(edit);
    },

    setCheckbox: function (column) {
        var edit = Ext.create('Ext.form.field.Checkbox', {
            name: 'fieldFilter',
            listeners: {
                specialkey: this.specialKey
            }
        });
        column.setEditor(edit);
    },

    setDateField: function (rec, column) {
        var edit = Ext.create('Ext.form.field.Date', {
            format: 'd/m/Y',
            listeners: {
                specialkey: this.specialKey
            }
        });
        var date = '';
        if (column.dataIndex === 'valor1') {
            date = (rec.data.valor2) ? new Date(rec.data.valor2) : '';
            edit.setMaxValue(date);
        }
        ;
        if (column.dataIndex === 'valor2') {
            date = (rec.data.valor1) ? new Date(rec.data.valor1) : '';
            edit.setMinValue(date);
        }
        ;
        column.setEditor(edit);
    },

    setDateTimeField: function (rec, column) {
        var edit = Ext.create('MasterSol.view.plugins.DateTime',{
            className:'MasterSol.controller.magnament.FilterController'
        });
        var date = '';
        if (column.dataIndex === 'valor1') {
            date = (rec.data.valor2) ? new Date(rec.data.valor2) : '';
            edit.setMaxValue(date);
        }
        ;
        if (column.dataIndex === 'valor2') {
            date = (rec.data.valor1) ? new Date(rec.data.valor1) : '';
            edit.setMinValue(date);
        }
        ;
        column.setEditor(edit);
        Ext.defer(()=>{
            edit.dateField.focus('', false);
        },1);
    },

    specialKey: function (field, e) {
        var grid = Ext.ComponentQuery.query('#filter-view')[0];
        var rows = grid.getStore().getCount();
        var store = grid.getStore();
        if (e.getKey() == e.ENTER) {
            e.stopEvent();
            var edit = grid.plugins[0];
            var row = edit.context.rowIdx;
            var col = edit.context.colIdx;
            var rec = store.getAt(row);
            var cantparam = (rec.data.cantparam)?rec.data.cantparam:1;
            if (col == 1) {
                col = 2;
            } else if (col == 2 && cantparam == 1) {
                col = 2;
                row = row + 1;
            } else if (col == 2 && cantparam > 1) {
                col = 3;
            } else if (col == 3) {
                col = 2;
                row = row + 1;
            }
            row = (row == rows) ? 0 : row;
            edit.completeEdit();
            edit.startEditByPosition({
                row: row,
                column: col
            });
            grid.getSelectionModel().select(row);
        }
    },

    // verificar si existe el registro
    checkData: function () {
        var exists = false;
        var idsection = MasterApp.util.getIdSectionActive();
        var storeFilter = Ext.ComponentQuery.query('#filter-view')[0].getStore();
        var arrayFilter = MasterApp.globals.getArrayFilter();
        var gridsection = MasterApp.globals.getGridSection();
        var window = gridsection.up('window');
        for (var j = 0; j < arrayFilter.length; j++) {
            if (arrayFilter[j]['id'] == window.idmenu) {
                var data = arrayFilter[j]['registers'];
                for (var i = 0; i < data.length; i++) {
                    if (data[i]['id'] == idsection) {
                        if (data[i]['filters']) {
                            storeFilter.loadData(data[i]['filters']);
                            exists = true;
                        }
                    }
                }
            }
        }
        return exists;
    },

    renderVal: function (value, metaData, record) {
        if (record.data.fk == '1') {
            return value;
        }
        if (record.data.tipo == 'boolean') {
            if (value == true || value == 't' || value == 'true') {
                return '<div style="text-align: center"><img  src="html/assets/icon/others/activo.png"/></div>';
            } else {
                return '';
            }
        }
        if (record.data.tipo == 'date') {
            var retval = Ext.util.Format.date(value, 'd/m/Y');
            return retval;
        }
        if (record.data.tipo == 'datetime') {
            var retval = (Ext.isDate(value)) ? Ext.util.Format.date(value, 'd/m/Y H:i:s') : value;
            if (value)
                metaData.tdAttr = 'data-qtip="' + retval + '"';
            return retval;
        }
        return value;
    },

    //setear combo de funcion multiselect
    setComboFk: function (rec, column) {
        var idsection = MasterApp.util.getIdSectionActive();
        var combo = Ext.create('MasterSol.view.magnament.ComboFk', {
            //   multiSelect: (rec.data.tipo == 'array') ? true : false,
            multiSelect: true,
            listConfig: {
                loadingText: 'Buscando...',
                emptyText: 'No existen opciones....',
                itemSelector: '.search-item',
                width: 150
            },
            listeners: {
                scope: this,
                collapse: this.collapseFk,
                specialKey:this.specialKey,
                beforequery: function (record) {
                    record.query = new RegExp(record.query, 'ig');
                }
            }
        });
        var store = combo.getStore();
        var values = (Ext.isArray(rec.data.valor1)) ? rec.data.valor1.join(',') : rec.data.valor1;
        rec.set('valor1', values);
        store.proxy.url = 'app/foreignkey';
        store.proxy.extraParams = {
            idregistro: rec.data.idregistro,
            idsection: idsection
        };
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
        var grid = Ext.ComponentQuery.query('#filter-view')[0];
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
        recGrid.set('valor1', arrayText.join(','));
        recGrid.set('idvalor', arrayId.join(','));
    },

    clean: function () {
        var grid = Ext.ComponentQuery.query('#filter-view')[0];
        grid.getStore().removeAll();
    },
    //seleccionar operador
    selectOperator: function (combo, record) {
        var grid = Ext.ComponentQuery.query('#filter-view')[0];
        var selModel = grid.getSelectionModel();
        var index = selModel.selectionStartIdx;
        var sel = selModel.getSelection()[0];
        sel.set('cantparam', record.data.cantidadparam);
        var edit = grid.plugins[0];
        edit.startEditByPosition({
            row: index,
            column: 2
        });
    },

    // cuando se edita la seccion pone como editable la columna seleccionada.
    setFocusCell: function () {
        var grid = Ext.ComponentQuery.query('#filter-view')[0];
        var store = grid.getStore();
        store.load({
            scope: this,
            callback: function () {
                this.findIndexSetFocusField();
            }
        });
    },
    // buscar el campo que se le va a desplegar en dependecia de la columna seleccionado
    //en la seccion
    findIndexSetFocusField: function () {
        var gridsection = MasterApp.globals.getGridSection();
        var selModel = gridsection.getSelectionModel();
        var columnIndex = selModel.navigationModel.previousColumnIndex;
        var dataIndex = gridsection.columns[columnIndex].text;
        var gridfilter = Ext.ComponentQuery.query('#filter-view')[0];
        var store = gridfilter.getStore();
        var index = store.findBy(function (rec, ide) {
            return (rec.data.nombrecampo.toLowerCase() == dataIndex.toLowerCase())
        });
        if (index == -1)
            return;
        var edit = gridfilter.plugins[0];
        edit.startEditByPosition({
            row: index,
            column: 1
        });
        gridfilter.columns[1].getEditor().expand();
        MasterApp.globals.actionKeyCrtlF = false;
    },

    configureButtons: function () {
        var gridsection = MasterApp.globals.getGridSection();
        var store_section = gridsection.getStore();
        var disabled = (store_section.getCount() == 0) ? true : false;
        Ext.ComponentQuery.query('#filter-view toolbar button')[0].setDisabled(disabled);
        Ext.ComponentQuery.query('#filter-view toolbar button')[1].setDisabled(disabled);
    }
})