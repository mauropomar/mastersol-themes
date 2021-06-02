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

    edit: function (editor, obj) {
        var record = obj.record;
        if ((obj.value === null || obj.value === '') && record.previousValues) {
            record.set('valor', record.previousValues.valor);
        }
        if (record.data[obj.field] == obj.originalValue)
            return;
    },

    new: function () {
        var grid = Ext.ComponentQuery.query('#config-report-view')[0];
        var store = grid.getStore();
        store.each(function (rec) {
            rec.set('valor1', '');
            rec.commit();
        });
    },


    loadValues: function (values) {
        var grid = Ext.ComponentQuery.query('#config-report-view')[0];
        var store = grid.getStore();
        store.removeAll();
        var array = [];
        for (var i = 0; i < values.length; i++) {
            var elem = values[i];
            array.push({
                id: elem.id,
                name: elem.name,
                tipo: elem.datatype,
                valor: ''
            });
        }
        store.loadData(array);
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

    getArrayStringKey: function () {
        var stringArray = '';
        var grid = Ext.ComponentQuery.query('#config-report-view')[0];
        var store = grid.getStore();
        store.each(function (rec) {
            if(rec.data.valor != null && rec.data.valor !== '') {
                var field = rec.data.name;
                var value = MasterApp.util.getVal(rec, rec.data.valor);
                stringArray += field + ':' + value + ',';
            }
        });
        stringArray = stringArray.substring(0, stringArray.length - 1);
        return stringArray;
    },

    generateReport: function (params, html = '') {
        var format = 'html';
        var title = 'Producción Agropecuaria';
        var idregister = params.idregister;
        var idsection = params.idsection;
        var idmenu = params.idmenu;
        var idbutton = params.idbutton;
        var namebutton = params.name;
        var action = params.action;
        var extra_params = MasterApp.tools.getExtraParams();
        sData = "<form name='redirect' id='redirect' action='report.html' method='GET'>";
        sData = sData + "<input type='hidden' name='title' id='title' value='" + title + "' />";
        sData = sData + "<input type='hidden' name='idregister' id='idregister' value='" +idregister + "' />";
        sData = sData + "<input type='hidden' name='idsection' id='idsection' value='" +idsection + "' />";
        sData = sData + "<input type='hidden' name='idmenu' id='idmenu' value='" +idmenu + "' />";
        sData = sData + "<input type='hidden' name='idbutton' id='idbutton' value='" +idbutton + "' />";
        sData = sData + "<input type='hidden' name='namebutton' id='namebutton' value='" +namebutton + "' />";
        sData = sData + "<input type='hidden' name='action' id='action' value='" +action + "' />";
        sData = sData + "<input type='hidden' name='format' id='format' value='" +format + "' />";
        sData = sData + "<input type='hidden' name='html' id='html' value='" +html+ "' />";
        sData = sData + "<input type='hidden' name='extra_params' id='extra_params' value='" +extra_params+ "' />";
        sData = sData + "</form>";
        sData = sData + "<script type='text/javascript'>";
        sData = sData + "document.redirect.submit();</script>";
        name_windows = window.open("", "_blank");
        name_windows.document.write(sData);
        name_windows.document.close();
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
        column.setEditor(edit);
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

    setDateTimeField: function (rec, column) {
        var edit = Ext.create('MasterSol.view.plugins.DateTime');
        column.setEditor(edit);
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
        var grid = Ext.ComponentQuery.query('#config-report-view')[0];
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

    specialKey: function (field, e) {
        var grid = Ext.ComponentQuery.query('#config-report-view')[0];
        var store = grid.getStore();
        if (e.getKey() == e.ENTER) {
            e.stopEvent();
            var edit = grid.plugins[0];
            var row = edit.context.rowIdx;
            var col = edit.context.colIdx;
            var rec = store.getAt(row);
            edit.cancelEdit();
            edit.startEditByPosition({
                row: row + 1,
                column: col
            });
        }
    },


});