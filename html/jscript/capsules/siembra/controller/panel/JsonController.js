Ext.define('Capsules.siembra.controller.panel.JsonController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    sendJson: function () {
        var winSections = this.getWindows();
        var accessDirect = this.getDesktop();
        var menuCombo = this.getMenuCombo();
        var winCombo = this.getWindowCombo();
    },

    getDesktop: function () {
        var dataview = Ext.ComponentQuery.query('dataview[name=principal]')[0];
        var store = dataview.getStore();
        var array = [];
        store.each(function (rec) {
            array.push({
                id: rec.data.id,
                name: rec.data.nombre,
                idsection: rec.data.sectionId,
                icon: rec.data.icon
            });
        });
        return array;
    },

    getMenuCombo: function () {
        var combo = Ext.ComponentQuery.query('#combomenu')[0];
        var store = combo.getStore();
        var array = [];
        store.each(function (rec) {
            array.push({
                id: rec.data.id,
                name: rec.data.nombre,
                idsection: rec.data.sectionId
            });
        });
        return array;
    },

    getWindowCombo: function () {
        var combo = Ext.ComponentQuery.query('#combowindow')[0];
        var store = combo.getStore();
        var array = [];
        store.each(function (rec) {
            array.push({
                id: rec.data.id,
                name: rec.data.name
            });
        });
        return array;
    },

    getWindows: function () {
        var menus = Ext.ComponentQuery.query('window-menu');
        var array = [];
        for (var m = 0; m < menus.length; m++) {
            var panels = menus[m].items.items[0].items.items[0].items.items;
            var comp, columns, data, obj, recSel;
            array.push({
                title: menus[m].title,
                idsection: menus[m].idsection,
                idmenu: menus[m].idmenu,
                collapsed: menus[m].collapsed,
                panels: []
            });
            for (var i = 0; i < panels.length; i++) {
                var type = panels[i].name;
                if (type === 'panel_section') {
                    comp = panels[i].items.items[0];
                    columns = this.getColumns(comp);
                    data = this.getData(comp);
                    recSel = this.getRecordSelected(comp);
                    array[m].panels.push({
                        title: panels[i].title,
                        idsection: panels[i].idsection,
                        idparent: panels[i].idparent,
                        selected: recSel,
                        data: data,
                        columns: columns
                    });
                }
                if (type === 'tab-section') {
                    var components = panels[i].items.items;
                    for (var j = 0; j < components.length; j++) {
                        comp = components[j].items.items[0];
                        columns = this.getColumns(comp);
                        data = this.getData(comp);
                        recSel = this.getRecordSelected(comp);
                        array[m].panels.push({
                            title: components[j].title,
                            idsection: components[j].idsection,
                            idparent: components[j].idparent,
                            selected: recSel,
                            data: data,
                            columns: columns
                        });
                    }
                }
            }
        }
        return array;
    },

    getColumns: function (panel) {
        var array = [];
        var gridSection = panel;
        var columns = gridSection.columns;
        for (var i = 0; i < columns.length; i++) {
            var filter = this.getFilterByColumn(columns[i]);
            array.push({
                xtype: columns[i].xtype,
                type: columns[i].type,
                dataIndex: columns[i].dataIndex,
                width: columns[i].width,
                text: columns[i].text,
                align: columns[i].align,
                funcion: columns[i].functions,
                sortable: columns[i].sortable,
                lockout: columns[i].lockable,
                locked: columns[i].locked,
                idregister: columns[i].idregister,
                auditable: columns[i].audit,
                required: columns[i].required,
                id_datatype: columns[i].id_datatype,
                real_name_in: columns[i].real_name_in,
                n_column: columns[i].n_column,
                real_name_out: columns[i].real_name_out,
                fk: columns[i].fk,
                filter: filter
            });
        }
        return array;
    },

    getFilterByColumn: function (column) {
        var array = [];
        var filter = column.filter;
        if (filter.type === 'boolean') {
            array.push({
                type: 'boolean'
            });
        }
        ;
        if (filter.type === 'date') {
            array.push({
                type: 'date'
            });
        }
        ;
        if (filter.type === 'datetime') {
            array.push({
                type: 'datetime'
            });
        }
        ;
        if (filter.type === 'string') {
            array.push({
                type: 'string'
            });
        }
        ;
        if (filter.type === 'string') {
            array.push({
                type: 'string'
            });
        }
        ;
        return array;
    },

    getData: function (panel) {
        var array = [];
        var gridSection = panel.items.items[0];
        var store = gridSection.getStore();
        var fields = store.model.fields;
        var items = store.data.items;
        for (var i = 0; i < items.length; i++) {
            var record = items[i];
            var obj = {};
            for (var j = 0; j < fields.length; j++) {
                var name = fields[j].name;
                obj[name] = record.data[name];
            }
            ;
            array.push(obj);
        }
        return array;
    },

    getRecordSelected: function (grid) {
        var hasSelection = grid.getSelectionModel().hasSelection();
        if (hasSelection) {
            return grid.getSelectionModel().getSelection();
        }
        return [];
    },

    render: function (comp) {
        Ext.ComponentQuery.query('tabmagnament')[0].add(comp);
    },

    click: function () {
        MasterApp.util.showMessageInfo('Succesful!!!');
    }
});