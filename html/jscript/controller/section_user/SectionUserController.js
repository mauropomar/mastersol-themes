Ext.define('MasterSol.controller.section_user.SectionUserController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    showWindow: function (grid) {
        var window = grid.up('window');
        Ext.create('MasterSol.view.section_user.WindowSectionUser', {
            idmenu: window.idmenu
        });
    },

    click: function () {
        MasterApp.util.showMessageInfo('Succesful!!!');
    },

    saveData: function (window) {
        var idmenu = window.idmenu;
        var winSections = this.getSection(idmenu);
        var json = {
            sections: winSections
        };
        console.log(Ext.encode(json));
    },

    getSection: function (idmenu) {
        var menus = Ext.ComponentQuery.query('window-menu[idmenu=' + idmenu + ']')[0];
        var array = [];
        var panels = menus.items.items[0].items.items[0].items.items;
        var comp, columns, recSel;
        array.push({
            title: menus.title,
            idsection: menus.idsection,
            idmenu: menus.idmenu,
            collapsed: menus.collapsed,
            panels: []
        });
        for (var i = 0; i < panels.length; i++) {
            var type = panels[i].name;
            if (type === 'panel_section') {
                comp = panels[i].items.items[0];
                columns = this.getColumns(comp);
                recSel = [];
                array[0].panels.push({
                    title: panels[i].title,
                    idsection: panels[i].idsection,
                    idparent: panels[i].idparent,
                    columns: columns
                });
            }
            if (type === 'tab-section') {
                var components = panels[i].items.items;
                for (var j = 0; j < components.length; j++) {
                    comp = components[j].items.items[0];
                    columns = this.getColumns(comp);
                    array[0].panels.push({
                        title: components[j].title,
                        idsection: components[j].idsection,
                        idparent: components[j].idparent,
                        columns: columns
                    });
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
        if (filter.type === 'date') {
            array.push({
                type: 'date'
            });
        }
        if (filter.type === 'datetime') {
            array.push({
                type: 'datetime'
            });
        }
        if (filter.type === 'string') {
            array.push({
                type: 'string'
            });
        }
        if (filter.type === 'string') {
            array.push({
                type: 'string'
            });
        }
        return array;
    },


});
