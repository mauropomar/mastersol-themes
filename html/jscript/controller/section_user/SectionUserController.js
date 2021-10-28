Ext.define('MasterSol.controller.section_user.SectionUserController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },
    // Muestra ventana para salvar la vista de la sección
    showWindow: function () {
        var grid = MasterApp.globals.getGridSection();
        var window = grid.up('window');
        Ext.create('MasterSol.view.section_user.WindowSectionUser', {
            idsection: window.idsection
        });
        this.loadViewCombo(window.idsection);
    },

    showView: function (window) {
        var combo = Ext.ComponentQuery.query('#combo_view_section')[0];
        var idSectionView = combo.getValue();
        if (idSectionView === null) {
            Ext.MessageBox.show({
                title: 'Información',
                msg: 'Debe seleccionar una vista de la sección.',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.INFO
            });
            return;
        }
        var mask = new Ext.LoadMask(window, {
            msg: 'Cargando...'
        });
        mask.show();
        var windowSection = Ext.ComponentQuery.query('window[idsection=' + window.idsection + ']')[0];
        windowSection.close();
        var getview = {
            url: 'app/showviews',
            method: 'GET',
            scope: this,
            timeout: 5000,
            params: {
                idregister: idSectionView,
            },
            success: function (response) {
                mask.hide();
                var json = Ext.JSON.decode(response.responseText);
                if (json.datos.length > 0) {
                    window.close();
                    var data = json.datos;
                    MasterApp.menu.showMenu(data);
                    this.loadDataSectionUser(data);
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
        Ext.Ajax.request(getview);
    },
    // Salva la vista de la sección en formato JSON
    saveData: function (window) {
        var mask = new Ext.LoadMask(window, {
            msg: 'Guardando. Espere unos minutos por favor...'
        });
        mask.show();
        var default_section = Ext.ComponentQuery.query('#checkbox_default')[0].getValue();
        var comp_name = Ext.ComponentQuery.query('#txt_new_view_section')[0];
        var name_section = comp_name.getValue();
        var combo = Ext.ComponentQuery.query('#combo_view_section')[0];
        if (name_section === '' && combo.getValue() === null) {
            comp_name.markInvalid('Debe introducir un nombre a la vista de la sección.');
            mask.hide();
            return;
        }
        var idsection = window.idsection;
        var data = this.getSection(idsection);
        var save = {
            url: 'app/savesection',
            method: 'POST',
            scope: this,
            timeout: 50000,
            params: {
                idsection: idsection,
                name: (name_section !== '') ? name_section : combo.lastSelection[0].data.nombre,
                default: default_section,
                data: Ext.encode(data),
            },
            success: function (response) {
                mask.hide();
                var json = Ext.JSON.decode(response.responseText);
                if (json.success == true) {
                    Ext.toast('La sección fue guardada con éxito.');
                    Ext.ComponentQuery.query('#txt_new_view_section')[0].reset();
                    this.loadViewCombo(idsection);
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

    deleteView: function (window) {
        var combo = Ext.ComponentQuery.query('#combo_view_section')[0];
        var idSectionView = combo.getValue();
        if (idSectionView === null) {
            Ext.MessageBox.show({
                title: 'Información',
                msg: 'Debe seleccionar una vista de la sección.',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.INFO
            });
            return;
        }
        var mask = new Ext.LoadMask(window, {
            msg: 'Eliminando. Espere unos minutos por favor...'
        });
        mask.show();
        Ext.Msg.confirm('Confirmaci&oacute;n', '&iquest;Est&aacute; seguro que desea eliminar la vista seleccionada?', function (conf) {
            if (conf == 'yes') {
                Ext.Ajax.request({
                    url: 'app/deleteview',
                    method: 'post',
                    params: {
                        id: idSectionView
                    },
                    success: function (resp, o) {
                        mask.hide();
                        var json = Ext.JSON.decode(resp.responseText);
                        if (json.success == true) {
                            Ext.toast('La vista de la sección fue eliminada con éxito.');
                            combo.reset();
                            combo.getStore().reload();
                        } else {
                            Ext.MessageBox.show({
                                title: 'Información',
                                msg: json.datos,
                                buttons: Ext.Msg.OK,
                                icon: Ext.Msg.INFO
                            });
                        }
                    }
                })
            }
        }, this);
    },

    // Obtiene la ventana que contiene a las secciones
    getSection: function (idsection) {
        var window = Ext.ComponentQuery.query('window-menu[idsection=' + idsection + ']')[0];
        var data = this.getSectionPrimary(window);
        return data;
    },
    // Obtiene la seccion principal
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
            'idmenu': window.idmenu,
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
    // Obtiene la secciones hijas
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
                    'hidden': grid.hidden,
                    'max_lines': grid.max_lines,
                    'read_only': grid.read_only,
                    'totals': this.getTotalSection(idmenu, grid.idsection),
                    'filters': this.getFilterSection(idmenu, grid.idsection),
                });
            }
        }
        return childrens;
    },
    // Obtiene la las columnas de seccion
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
    // Obtiene los tipos de filtro de cada seccion
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
    // Obtiene los totales de la seccion
    getTotalSection: function (idmenu, idsection) {
        var array = MasterApp.globals.getArrayTotal();
        var totals = [];
        for (var j = 0; j < array.length; j++) {
            if (array[j]['id'] == idmenu) {
                var registers = array[j]['registers'];
                for (var i = 0; i < registers.length; i++) {
                    if (registers[i]['id'] == idsection) {
                        var data = registers[i]['totals'];
                        totals = data;
                        break;
                    }
                }
            }
        }
        return totals;
    },
    // Obtiene los filtros de cada seccion
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
                            filters = data;
                            break;
                        }
                    }
                }
            }
        }
        return filters;
    },
    // Cargas las vistas guardadas de la seccion en el combo
    loadViewCombo: function (idsection) {
        var combo = Ext.ComponentQuery.query('#combo_view_section')[0];
        var store = combo.getStore();
        store.proxy.extraParams = {
            idsection: idsection
        };
        combo.reset();
        store.load();
    },
    // Una vez que se muestra la seccion guardada, se cargan los datos de la seccion principal
    // con sus filtros y totales en caso de tenerlos
    loadDataSectionUser: function (data) {
        var gridsection = MasterApp.globals.getGridSection();
        var idsection = data[0].id;
        var idmenu = data[0].idmenu;
        var filters = this.getFiltersOnlyFunctions(data[0]);
        var totals = this.getTotalsOnlyFunctions(data[0]);
        var load = {
            url: 'app/resultfilteroperators',
            method: 'POST',
            scope: this,
            params: {
                'idregistro': 0,
                'idsection': idsection,
                'idseccionpadre': 0,
                'idpadreregistro': 0,
                'idmenu': idmenu,
                'accion': '2',
                'data': Ext.encode(filters),
                'totales': Ext.encode(totals)
            },
            callback: function (options, success, response) {
                var json = Ext.JSON.decode(response.responseText);
                if (json.datos != null) {
                    gridsection.getStore().loadData(json.datos);
                    var ts = json.totales.datos;
                    if (ts.length > 0)
                        MasterApp.totals.changeIconsTotals(ts);

                }
            }
        };
        Ext.Ajax.request(load);
    },
    // Obtiene los filtros validos que hayan sido configurados
    getFiltersOnlyFunctions: function (info) {
        var filters = info.filters;
        var data = [];
        var arrayFilters = MasterApp.globals.getArrayFilter();
        arrayFilters.push({
            id: info.idmenu,
            registers: [{
                id: info.id,
                filters: filters
            }]
        });
        for (var i = 0; i < filters.length; i++) {
            var elem = filters[i];
            if (elem.idoperador != null) {
                data.push({
                    idregister: elem.idregistro,
                    nombrecampo: elem.nombrecampo,
                    idtipodato: elem.idtipodato,
                    tipo: elem.tipo,
                    fk: elem.fk,
                    idoperador: elem.idoperador,
                    operador: elem.operador,
                    operadores: elem.operadores,
                    real_name_in: elem.real_name_in,
                    real_name_out: elem.real_name_out,
                    idvalor: elem.idvalor,
                    valor1: elem.valor1,
                    valor2: elem.valor2,
                    cantparam: elem.cantparam
                });
            }
        }
        return data;
    },
    // Obtiene los totales validos que hayan sido configurados
    getTotalsOnlyFunctions: function (info) {
        var totals = info.totals;
        var data = [];
        var arrayTotals = MasterApp.globals.getArrayTotal();
        arrayTotals.push({
            id: info.idmenu,
            registers: [{
                id: info.id,
                totals: totals
            }]
        });
        for (var i = 0; i < totals.length; i++) {
            var elem = totals[i];
            if (elem.idfuncion != null) {
                data.push({
                    id: elem.idregistro,
                    nombrecampo: elem.nombrecampo,
                    tipodato: elem.tipodato,
                    idfuncion: elem.idfuncion,
                    nombrefuncion: elem.nombrefuncion,
                    funciones: elem.funciones,
                    idregistro: elem.idregistro
                });
            }
        }
        return data;
    },
});
