Ext.define('MasterSol.controller.magnament.TotalController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    beforeedit: function (editor, obj, eOpts) {
        Ext.ComponentQuery.query('total-view toolbar button')[0].setDisabled(false);
        this.loadFunctions(obj);
    },

    loadFunctions: function (obj) {
        var record = obj.record;
        var column = obj.column;
        var edit = column.getEditor();
        var store = edit.getStore();
        var data = (record.data.funciones == null) ? [] : record.data.funciones;
        store.loadData(data);
    },

    getAll: function () {
        var grid = Ext.ComponentQuery.query('total-view')[0];
        var store = grid.getStore();
        var idsection = MasterApp.util.getIdSectionActive();
        var idmenu = MasterApp.util.getIdMenuActive();
        this.configureButtons();
        if (this.checkData())
            return;
        store.proxy.extraParams = {
            idmenu: idmenu,
            idsection: idsection
        };
        store.load({
            callback: function () {
                var edit = grid.getPlugin();
                var n_column = MasterApp.util.getNColumnSection();
                if (this.getCount() > 0 && n_column != null) {
                    var index = this.findExact('nombrecampo', n_column);
                    edit.startEditByPosition({
                        row: index,
                        column: 1
                    });
                }
            }
        });
        var title = MasterApp.util.getTitleSectionSelected();
        Ext.ComponentQuery.query('#tbtext_magnament_total')[0].setText('Totales: ' + title);
    },

    checkData: function () {
        var exists = false;
        var store = Ext.ComponentQuery.query('#total-view')[0].getStore();
        var arrayTotal = MasterApp.globals.getArrayTotal();
        var idsection = MasterApp.util.getIdSectionActive();
        var gridSection = MasterApp.globals.getGridSection();
        var window = gridSection.up('window');
        for (var j = 0; j < arrayTotal.length; j++) {
            if (arrayTotal[j]['id'] == window.idmenu) {
                var data = arrayTotal[j]['registers'];
                for (var i = 0; i < data.length; i++) {
                    var totals = data[i]['totals'];
                    if (data[i]['id'] == idsection && totals.length > 0) {
                        store.loadData(totals);
                        exists = true;
                    }
                }
            }
        }
        return exists;
    },

    saveChanges: function () {
        var gridsection = MasterApp.globals.getGridSection();
        var grid = Ext.ComponentQuery.query('#total-view')[0];
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
        idrecordsection = record.data.id;
        var save = {
            url: 'app/resultfilterfunctions',
            method: 'POST',
            scope: this,
            params: {
                'idregistro': idrecordsection,
                'idsection': idsection,
                'idseccionpadre': idparentsection,
                'idpadreregistro': idregisterparent,
                'idmenu': idmenu,
                'accion': '3',
                'data': Ext.encode(data),
                'filtros': MasterApp.util.getFilterBySection()
            },
            callback: function (options, success, response) {
                mask.hide();
                var json = Ext.JSON.decode(response.responseText);
                var data = json.datos;
                if (data != null) {
                    store.commitChanges();
                    this.configuredData();
                    this.changeIconsTotals(data);
                } else {
                    MasterApp.util.showMessageInfo('No existen datos con ese criterio de búsqueda.');
                }
            }
        };
        Ext.Ajax.request(save);
    },
    //datos que se van a guardar en la base de datos.
    getData: function (store) {
        var data = [];
        store.each(function (rec) {
            var idfuncion = this.getIdFunction(rec);
            if (idfuncion != null) {
                data.push({
                    id: rec.data.idregistro,
                    nombrecampo: rec.data.nombrecampo,
                    tipodato: rec.data.tipodato,
                    idfuncion: idfuncion,
                    nombrefuncion: rec.data.nombrefuncion,
                    funciones: rec.data.funciones,
                    idregistro: rec.data.idregistro
                })
            }
        }, this);
        return data
    },

    // devuelve el data original con todos los valores de los totales
    getAllData: function () {
        var datos = [];
        var grid = Ext.ComponentQuery.query('#total-view')[0];
        var store = grid.getStore();
        store.each(function (rec) {
            datos.push({
                id: rec.data.idregistro,
                nombrecampo: rec.data.nombrecampo,
                tipodato: rec.data.tipodato,
                idfuncion: this.getIdFunction(rec),
                nombrefuncion: rec.data.nombrefuncion,
                funciones: rec.data.funciones,
                idregistro: rec.data.idregistro
            })
        }, this)
        return datos;
    },

    getIdFunction: function (record) {
        var id = null;
        var store = Ext.ComponentQuery.query('#total-view')[0].getStore();
        var idx = store.findExact('idregistro', record.data.idregistro);
        if (idx > -1) {
            var rec = store.getAt(idx);
            var funciones = (rec.data.funciones == null) ? [] : rec.data.funciones;
            for (var i = 0; i < funciones.length; i++) {
                if (record.data.nombrefuncion == funciones[i]['nombre']) {
                    id = funciones[i]['id'];
                    break
                }
            }
        }
        return id;
    },

    //limpiar filtro
    new: function () {
        var grid = Ext.ComponentQuery.query('#total-view')[0];
        var store = grid.getStore();
        store.each(function (rec) {
            rec.set('tipodato', '');
            rec.set('idfuncion', '');
            rec.set('nombrefuncion', '');
            rec.commit();
        });
        var gridsection = MasterApp.globals.getGridSection();
        var window = gridsection.up('window');
        this.cleanArrayData(window);
        this.hideGridTotals(gridsection);
    },

    hideGridTotals: function (gridsection) {
        var panel = gridsection.up('panel');
        var grid = panel.items.items[1];
        var height = gridsection.getHeight() + 15;
        gridsection.setHeight(height);
        grid.setHeight(0);
        grid.setVisible(false);
        this.cleanDataTotal(grid);
    },

    cleanDataTotal(grid) {
        var store = grid.getStore();
        var record = store.getAt(0);
        var columns = grid.columns;
        for (var i = 0; i < columns.length; i++) {
            record.set(columns[i].dataIndex, 0);
            columns[i]['funcion'] = undefined;
        }
        record.commit();
        Ext.ComponentQuery.query('total-view toolbar button')[0].setDisabled(true);
        Ext.ComponentQuery.query('total-view toolbar button')[1].setDisabled(true);
    },

    //configurar arreglo por registro y ventana
    configuredData: function () {
        var data = this.getAllData();
        var idsection = MasterApp.util.getIdSectionActive();
        var gridsection = MasterApp.globals.getGridSection();
        var window = gridsection.up('window');
        var array = MasterApp.globals.getArrayTotal();
        var exists = false;
        var existsReg = false;
        for (var j = 0; j < array.length; j++) {
            if (array[j]['id'] == window.idmenu) {
                exists = true;
                var registers = array[j]['registers'];
                existsReg = false;
                for (var i = 0; i < registers.length; i++) {
                    if (registers[i]['id'] == idsection) {
                        registers[i]['totals'] = data;
                        existsReg = true;
                    }
                }
                if (!existsReg) {
                    array[j]['registers'].push({
                        id: idsection,
                        totals: data
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
                    totals: data
                }]
            })
        }
    },

    //cambiar los iconos de totales al guardar cambios
    changeIconsTotals: function (data) {
        var gridsection = MasterApp.globals.getGridSection();
        var panel = gridsection.up('panel');
        var gridtotal = panel.items.items[1];
        var store = gridtotal.getStore();
        var columns = gridtotal.getColumns();
        for (var i = 0; i < data.length; i++) {
            var name = data[i]['dataIndex'];
            for (var j = 0; j < columns.length; j++) {
                if (name.toLocaleLowerCase() == columns[j].dataIndex) {
                    columns[j]['funcion'] = data[i]['funcion'];
                    var record = store.getAt(0);
                    record.set(name, data[i]['valor']);
                    record.commit();
                }
            }
        }
        if (gridtotal.getHeight() == 0) {
            var height_theme = (MasterApp.theme.isShortTheme()) ? 25 : 40;
            var height = gridsection.getHeight() - height_theme;
            gridsection.setHeight(height);
            gridtotal.setHeight(height_theme);
            gridtotal.show();
            gridtotal.getView().refresh();
            gridtotal.getView().focusRow(0);
            Ext.ComponentQuery.query('total-view toolbar button')[1].setDisabled(false);
        }
    },

    clean: function () {
        var grid = Ext.ComponentQuery.query('#total-view')[0];
        grid.getStore().removeAll();
    },

    cleanArrayData: function () {
        var idsection = MasterApp.util.getIdSectionActive();
        var gridsection = MasterApp.globals.getGridSection();
        var window = gridsection.up('window');
        var array = MasterApp.globals.getArrayTotal();
        for (var j = 0; j < array.length; j++) {
            if (array[j]['id'] == window.idmenu) {
                var registers = array[j]['registers'];
                for (var i = 0; i < registers.length; i++) {
                    if (registers[i]['id'] == idsection) {
                        registers[i]['totals'] = [];
                    }
                }
            }
        }
        ;
    },

    specialKey: function (field, e) {
        var grid = Ext.ComponentQuery.query('#total-view')[0];
        var rows = grid.getStore().getCount()
        if (e.getKey() == e.ENTER) {
            var edit = grid.plugins[0];
            var row = edit.context.rowIdx;
            var combo = grid.columns[1].getEditor();
            if (combo.lastSelection) {
                var rec = grid.getStore().getAt(row);
                var id = combo.lastSelection[0].data.id;
                var nombre = combo.lastSelection[0].data.nombre;
                rec.set('idfuncion', id);
                rec.set('nombrefuncion', nombre);
            }
            var row = (row + 1 < rows) ? row + 1 : 0;
            edit.cancelEdit();
            edit.startEditByPosition({
                row: row,
                column: 1
            })
        }
    },

    configureButtons: function () {
        var gridsection = MasterApp.globals.getGridSection();
        var store_section = gridsection.getStore();
        var disabled = (store_section.getCount() == 0) ? true : false;
        Ext.ComponentQuery.query('#total-view toolbar button')[0].setDisabled(disabled);
        Ext.ComponentQuery.query('#total-view toolbar button')[1].setDisabled(disabled);
    }
})