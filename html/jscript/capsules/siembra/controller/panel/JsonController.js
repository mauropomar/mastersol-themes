Ext.define('Capsules.siembra.controller.panel.JsonController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    sendJson: function () {
        var menus = Ext.ComponentQuery.query('window-menu');
        var panels = menus[0].items.items[0].items.items[0].items.items;
        for (var i = 0; i < panels.length; i++) {
            var type = panels[0].name;
            if (type === 'tab_section') {

            } else {
                var columns = this.getColumns(panels[0]);
                var data = this.getData(panels[0]);
            }
        }

    },

    getColumns: function (panel) {
        var array = [];
        var gridSection = panel.items.items[0];
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
        for(var i = 0; i < items.length; i++){
            var record = items[i];
            var obj = {};
            for(var j = 0; j < fields.length; j++){
                var name = fields[j].name;
                obj[name] = record.data[name];
            };
            array.push(obj);
        }
        return array;
    },

    render: function (comp) {
        Ext.ComponentQuery.query('tabmagnament')[0].add(comp);
    },

    click: function () {
        MasterApp.util.showMessageInfo('Succesful!!!');
    }
});