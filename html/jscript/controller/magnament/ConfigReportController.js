Ext.define('MasterSol.controller.magnament.ConfigReportController', {
    extend: 'Ext.app.Controller',
    isEdit: false,
    buttonReport: {},
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
            rec.set('valor', '');
            rec.commit();
        });
    },

    configReport: function () {
        var grid = MasterApp.globals.getGridSection();
        var mask = new Ext.LoadMask(grid, {
            msg: 'Cargando...'
        });
        mask.show();
        var idmenu = grid.idmenu;
        var idsection = grid.idsection;
        var record = MasterApp.globals.getRecordSection();
        var recordId = (record != null) ? record.data.id : null;
        var extra_params = MasterApp.tools.getExtraParams();
        var execute = {
            url: 'app/executebuttons',
            method: 'GET',
            scope: this,
            params: {
                idregister: recordId,
                idsection: idsection,
                idmenu: idmenu,
                idbutton: this.buttonReport.id,
                name: this.buttonReport.name,
                action: this.buttonReport.action,
                extra_params: extra_params,
                report_format: 'html'
            },
            success: function (response) {
                mask.hide();
                var params = response.request.params;
                var json = Ext.JSON.decode(response.responseText);
                if (json.success) {
                    if (json.type === 5) {
                        var extraParams = MasterApp.tools.getExtraParams();
                        MasterApp.report.removeAll();
                        MasterApp.report.generateReport(params, json.value, json.name, extraParams);
                    }
                } else {
                    Ext.MessageBox.show({
                        title: 'Error',
                        msg: json.msg,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.INFO
                    });
                }
            }
        };
        Ext.Ajax.request(execute);
    },

    loadValues: function (values, button) {
        this.buttonReport = button;
        var tabMagnament = Ext.ComponentQuery.query('#tabmagnament')[0];
        tabMagnament.child('#config-report-view').tab.show();
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
        var edit = grid.plugins[0];
        edit.startEditByPosition({
            row: 0,
            column: 1
        });
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

    getArrayStringKey: function () {
        var stringArray = '';
        var grid = Ext.ComponentQuery.query('#config-report-view')[0];
        var store = grid.getStore();
        store.each(function (rec) {
            var field = rec.data.name;
            var value = MasterApp.util.getVal(rec, rec.data.valor);
            stringArray += field + '=>' + value + ',';
        });
        stringArray = stringArray.substring(0, stringArray.length - 1);
        return stringArray;
    },

    generateReport: function (params, url, title, extraParams) {
        var format = 'html';
        var idregister = params.idregister;
        var idsection = params.idsection;
        var idmenu = params.idmenu;
        var idbutton = params.idbutton;
        var namebutton = params.name;
        var action = params.action;
        sData = "<form name='redirect' id='redirect' action='report.html' method='GET'>";
        sData = sData + "<input type='hidden' name='title' id='title' value='" + title + "' />";
        sData = sData + "<input type='hidden' name='idregister' id='idregister' value='" + idregister + "' />";
        sData = sData + "<input type='hidden' name='idsection' id='idsection' value='" + idsection + "' />";
        sData = sData + "<input type='hidden' name='idmenu' id='idmenu' value='" + idmenu + "' />";
        sData = sData + "<input type='hidden' name='idbutton' id='idbutton' value='" + idbutton + "' />";
        sData = sData + "<input type='hidden' name='namebutton' id='namebutton' value='" + namebutton + "' />";
        sData = sData + "<input type='hidden' name='action' id='action' value='" + action + "' />";
        sData = sData + "<input type='hidden' name='format' id='format' value='" + format + "' />";
        sData = sData + "<input type='hidden' name='url' id='url' value='" + url + "' />";
        sData = sData + "<input type='hidden' name='extra_params' id='extra_params' value='" + extraParams + "' />";
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
        var edit = Ext.create('MasterSol.view.plugins.DateTime', {
            className: 'MasterSol.controller.magnament.ConfigReportController'
        });
        column.setEditor(edit);
        Ext.defer(() => {
            edit.dateField.focus('', false);
        }, 1);
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
        rec.set('valor', values);
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
        var rows = grid.getStore().getCount();
        if (e.getKey() == e.ENTER) {
            e.stopEvent();
            var edit = grid.plugins[0];
            var row = edit.context.rowIdx;
            row = (row + 1 < rows) ? row + 1 : 0;
            var col = edit.context.colIdx;
            var rec = store.getAt(row);
            edit.completeEdit();
            edit.startEditByPosition({
                row: row,
                column: col
            });
            grid.getSelectionModel().select(row);
        }
    },

    removeAll: function () {
        var grid = Ext.ComponentQuery.query('#config-report-view')[0];
        var store = grid.getStore();
        store.loadData([]);
    }


});