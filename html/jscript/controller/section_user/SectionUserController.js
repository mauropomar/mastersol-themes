Ext.define('MasterSol.controller.section_user.SectionUserController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    showWindow: function () {
        var grid = MasterApp.globals.getGridSection();
        var window = grid.up('window');
        Ext.create('MasterSol.view.section_user.WindowSectionUser', {
            idmenu: window.idmenu
        });
    },

    click: function () {
        MasterApp.util.showMessageInfo('Succesful!!!');
    },

    saveData: function (window) {
        var mask = new Ext.LoadMask(window, {
            msg: 'Exportando. Espere unos minutos por favor...'
        });
        var default_section = Ext.ComponentQuery.query('#checkbox_default')[0].getValue();
        var comp_name = Ext.ComponentQuery.query('#txt_new_view_section')[0];
        var name_section = comp_name.getValue();
        if (name_section === '') {
            comp_name.markInvalid('Debe introducir un nombre a la sección.');
            mask.hide();
            return;
        }
        var idmenu = window.idmenu;
        var data = this.getSection(idmenu);
        var save = {
            url: 'app/savesection',
            method: 'POST',
            scope: this,
            timeout: 150000,
            params: {
                name: name_section,
                data: Ext.encode(data),
                default: default_section
            },
            success: function (response) {
                mask.hide();
                Ext.ComponentQuery.query('#btn_cancelar_capsule')[0].setDisabled(false);
                var json = Ext.JSON.decode(response.responseText);
                if (json.success == true) {
                    Ext.toast('La sección fue guardada con éxito.');
                } else {
                    Ext.MessageBox.show({
                        title: 'Información',
                        msg: json.datos,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.INFO
                    });
                }
            },
            failure: function (response) {
                mask.hide();
            }
        };
        Ext.Ajax.request(save);
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
                array[0].panels.push({
                    title: panels[i].title,
                    idsection: panels[i].idsection,
                    idparent: panels[i].idparent,
                    total: this.getTotalSection(idmenu, panels[i].idsection),
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
                        total: this.getTotalSection(idmenu, components[j].idsection),
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
        var columns = gridSection.getView().getHeaderCt().getGridColumns();
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

    getTotalSection: function (idmenu, idsection) {
        var array = MasterApp.globals.getArrayTotal();
        var totals = [];
        for (var j = 0; j < array.length; j++) {
            if (array[j]['id'] == idmenu) {
                var registers = array[j]['registers'];
                for (var i = 0; i < registers.length; i++) {
                    if (registers[i]['id'] == idsection) {
                        var data = registers[i]['totals'];
                        for (var y = 0; y < data.length; y++) {
                            if (data[y].idfuncion !== null) {
                                totals.push(data[y]);
                            }
                        }
                        break;
                    }
                }
            }
        }
        return totals;
    }
});
