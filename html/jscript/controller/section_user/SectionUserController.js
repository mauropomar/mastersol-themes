Ext.define('MasterSol.controller.section_user.SectionUserController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    showWindow: function () {
        var grid = MasterApp.globals.getGridSection();
        var window = grid.up('window');
        Ext.create('MasterSol.view.section_user.WindowSectionUser', {
            idsection: window.idsection
        });
        this.loadViewCombo();
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
        var idsection = window.idsection;
        var data = this.getSection(idsection);
        // this.addRecord(idsection, name_section, default_section, data);
        var save = {
            url: 'app/savesection',
            method: 'POST',
            scope: this,
            timeout: 150000,
            params: {
                idsection: idsection,
                name: name_section,
                default: default_section,
                data: Ext.encode(data),
            },
            success: function (response) {
                mask.hide();
                var json = Ext.JSON.decode(response.responseText);
                if (json.success == true) {
                    Ext.toast('La sección fue guardada con éxito.');
                    this.loadViewCombo();
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

    getSection: function (idsection) {
        var window = Ext.ComponentQuery.query('window-menu[idsection=' + idsection + ']')[0];
        var data = this.getSectionPrimary(window);
        return data;
    },

    getSectionPrimary: function (window) {
        var idsection = window.idsection;
        var idmenu = window.idmenu;
        var grid = window.childs[0].down('gridpanel');
        var childrens = this.getSectionChildren(window);
        var obj = {
            'alerts_checked': grid.alerts_checked,
            'hidden': grid.hidden,
            'idpadre': grid.idparent,
            'id': grid.idsection,
            'niveles': grid.levels,
            'nombre': grid.name_section,
            'orderable': grid.orderable,
            'read_only': grid.read_only,
            'section_checked': grid.section_checked,
            'time_event': grid.time_event,
            'buttons': grid.btnTools,
            'columnas': this.getColumns(grid),
            'totals': this.getTotalSection(idmenu, grid.idsection),
            'filters': this.getFilterSection(idmenu, grid.idsection),
            'children': childrens
        };
        return obj;
    },

    getSectionChildren: function (window) {
        var idsection = window.idsection,
            idmenu = window.idmenu,
            grid,
            childrens = [],
            idTab,
            sections;
        var tabPanels = Ext.ComponentQuery.query('window-menu[idsection=' + idsection + '] tabpanel');
        for (var i = 0; i < tabPanels.length; i++) {
            idTab = tabPanels[i].id;
            sections = Ext.ComponentQuery.query('#' + idTab + ' gridpanel[name=grid-section]');
            for (var j = 0; j < sections.length; j++) {
                grid = sections[j];
                childrens.push({
                    'id': grid.idsection,
                    'idpadre': grid.idparent,
                    'nombre': grid.name_section,
                    'buttons': grid.btnTools,
                    'columnas': this.getColumns(grid),
                    'nivel': grid.level,
                    'leaf': grid.leaf,
                    'hidden':grid.hidden,
                    'max_lines': grid.max_lines,
                    'read_only': grid.read_only,
                    'totals': this.getTotalSection(idmenu, grid.idsection),
                    'filters': this.getFilterSection(idmenu, grid.idsection),
                });
            }
        }
        return childrens;
    },

    getColumns: function (gridSection) {
        var array = [];
        var cols = gridSection.getView().getHeaderCt().getGridColumns();
        for (var i = 0; i < cols.length; i++) {
            array.push({
                xtype: cols[i].xtype,
                dataIndex: cols[i].dataIndex,
                width: cols[i].width,
                text: cols[i].text,
                align: cols[i].align,
                dec_count: cols[i].dec_count,
                funcion: cols[i].functions,
                type: cols[i].type,
                sortable: cols[i].sortable,
                lockout: cols[i].lockable,
                lockout: cols[i].locked,
                idregister: cols[i].idregister,
                auditable: cols[i].audit,
                required: cols[i].required,
                id_datatype: cols[i].id_datatype,
                real_name_in: cols[i].real_name_in,
                n_column: cols[i].n_column,
                real_name_out: cols[i].real_name_out,
                link_parent: cols[i].link_parent,
                no_move: cols[i].no_move,
                fk: cols[i].fk
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
    },

    getFilterSection: function (idmenu, idsection) {
        var array = MasterApp.globals.getArrayFilter();
        var filters = [];
        for (var j = 0; j < array.length; j++) {
            if (array[j]['id'] == idmenu) {
                var registers = array[j]['registers'];
                for (var i = 0; i < registers.length; i++) {
                    if (registers[i]['id'] == idsection) {
                        if (registers[i]['filters']) {
                            var data = registers[i]['filters'];
                            for (var y = 0; y < data.length; y++) {
                                if (data[y].valor1 && data[y].valor1 !== null) {
                                    filters.push(data[y]);
                                }
                            }
                        }
                    }
                }
            }
        }
        return filters;
    },

    loadViewCombo: function () {
        var combo = Ext.ComponentQuery.query('#combo_view_section')[0];
        var store = combo.getStore();
        combo.reset();
        store.load();
    },

    showSection: function (window) {
        var combo = Ext.ComponentQuery.query('#combo_view_section')[0];
        if (combo.getValue() === '') {
            Ext.MessageBox.show({
                title: 'Información',
                msg: 'Debe seleccionar una vista.',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.INFO
            });
            return;
        }
    },

    addRecord: function (idsection, name_section, default_section, data) {
        var combo = Ext.ComponentQuery.query('#combo_view_section')[0];
        var store = combo.getStore();
        var rec = new Array({
            idsection: idsection,
            name: name_section,
            default: default_section,
            data: Ext.encode(data),
        });
        store.insert(0, rec);
    },

    selectView: function (combo, record) {
        var comp = combo.up('window');
        var json = Ext.JSON.decode(record.data.data);
        var windowSection = Ext.ComponentQuery.query('window[idsection=' + comp.idsection + ']')[0];
        windowSection.close();
        comp.close();
        var array = new Array(json);
        MasterApp.menu.showMenu(array);
    }
});
