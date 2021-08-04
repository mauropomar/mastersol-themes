/**
 * @author mauro
 */
Ext.define('MasterSol.controller.menu.SectionController', {
    extend: 'Ext.app.Controller',
    IdRecParent: null,
    posYFirts: null,
    init: function () {
        this.control({
            'gridpanel[name=section-principal]': { // matches the view itself
                cellclick: 'clickSectionPrincipal',
                celldblclick: 'dblclickSectionPrincipal',
                columnresize: 'columnresize',
                afterrender: 'afterrender'
            },
            'tabpanel[name=tab-section]': {
                tabchange: 'tabChangeSection'
            },
            'panel[name=panel_section]': {
                resize: 'resizeSection'
            },
            'gridpanel[name=grid-section]': { // matches the view itself
                cellclick: 'clickSection',
                celldblclick: 'dblclickSection',
                columnresize: 'columnresize'
            },
        });
    },

    clickSectionPrincipal: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        MasterApp.globals.setRecordSection(record);
        MasterApp.globals.setGridSection(grid.panel);
        this.IdRecParent = record.data.id;
        MasterApp.util.setAplyMaxLine();
        this.loadDataTabActive(grid, record, 0);
        MasterApp.util.setStyleWindow(grid.panel);
        MasterApp.util.setStyleSection();
        MasterApp.magnament.getData(grid.panel);
        MasterApp.tools.setButtons();
    },

    dblclickSectionPrincipal: function (grid, td, cellIndex, record) {
        MasterApp.magnament.getData(grid.panel, cellIndex);
        MasterApp.globals.setGridSection(grid.panel, cellIndex);
    },

    clickSection: function (grid, td, cellIndex, record) {
        MasterApp.globals.setLoading(true);
        MasterApp.globals.setGridSection(grid.panel);
        MasterApp.globals.setRecordSection(record);
        var level = grid.up('tabpanel').level + 1;
        this.loadDataTabActive(grid, record, level);
        MasterApp.util.setAplyMaxLine();
        MasterApp.util.setStyleWindow(grid.panel);
        var container = grid.panel.up('panel');
        MasterApp.util.setStyleSection(container);
        MasterApp.magnament.getData(grid.panel);
        MasterApp.tools.setButtons();

        //  grid.resumeEvents();
    },

    dblclickSection: function (grid, td, cellIndex, record) {
        MasterApp.globals.setGridSection(grid.panel, cellIndex);
        MasterApp.globals.setRecordSection(record);
        MasterApp.magnament.getData(grid.panel, cellIndex);
    },

    // activar y obtener los datos de la seccion hija activa
    loadDataTabActive: function (grid, rec, level) {
        var windowId = (grid.panel) ? grid.panel.idmenu : grid.idmenu;
        var idsection = (grid.panel) ? grid.panel.idsection : grid.idsection;
        var tabs = Ext.ComponentQuery.query('tabpanel[idmenu=' + windowId + ']');
        if (tabs[level] && tabs[level].items.items.length > 0) {//si existe el tabs en ese nivel y tiene secciones hijas
            var panel = tabs[level].getActiveTab();
            if (!panel) {
                panel = tabs[level].items.items[0];
            }
            // se verifica que la sesion que se esta seleccionando tenga hijo
            if (grid.panel.idsection == panel.idparent) {
                this.setIdRecordParent(tabs[level]);
                this.getData(this.IdRecParent, panel);
                this.resetAllSectionNotImediatly(tabs, level);
            }
        }

        var count = this.getCountSections(idsection, level);
        var disabled = (count == 0) ? false : true;
        var btn = MasterApp.tools.getBtnTools(grid, 'btn_trash');
        if (!tabs[level]) {
            MasterApp.util.setStyleSection();
        }
    },

    setIdRecordParent: function (tab) {
        var sections = tab.items.items;
        for (var j = 0; j < sections.length; j++) {
            sections[j]['idrecordparent'] = this.IdRecParent;
        }
    },

    resetAllSectionNotImediatly: function (tabs, level) {
        level = level + 1;
        var tab = tabs[level];
        if (!tab)
            return;
        var paneles = tab.items.items;
        for (var i = 0; i < paneles.length; i++) {
            var panel = paneles[i];
            var gridsection = panel.down('gridpanel');
            if (panel.down('gridpanel')) {
                var store = gridsection.getStore();
                store.removeAll();
            }
        }
    },

    getCountSections: function (windowId, level) {
        var count = 0;
        var tabs = Ext.ComponentQuery.query('tabpanel[idsection=' + windowId + ']');
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].level == level) {
                count = tabs[i].items.items.length;
            }
        }
        return count;
    },

    tabChangeSection: function (tabPanel, newCard) {
        var gridsection = newCard.down('gridpanel');
        MasterApp.globals.setGridSection(gridsection);
        MasterApp.globals.setRecordSection(null);
        this.findChildOfSection(tabPanel, newCard);
        MasterApp.magnament.getData(gridsection);
        var idparent = newCard.idrecordparent;
        if (idparent == null)
            return;
        var window = gridsection.up('window');
        this.getData(idparent, newCard);
        var tabMagnament = Ext.ComponentQuery.query('tabmagnament')[0];
        tabMagnament.idmenumag = tabPanel.idmenu;
        tabMagnament.idsectionmag = newCard.idsection;
        MasterApp.util.setAplyMaxLine();
    },

    findChildOfSection: function (tabPanel, newCard) {
        var level = tabPanel.level;
        var panelcont = tabPanel.up('panel');
        var idpanelcont = panelcont.id;
        var queryId = '#' + idpanelcont + ' tabpanel';
        var next = level + 1;
        if (Ext.ComponentQuery.query(queryId)[next]) {
            var tabNext = Ext.ComponentQuery.query(queryId)[next];
            MasterApp.menu.addChildOfTab(tabNext, newCard);
        }
    },

    getData: function (idrecordparent, newCard) {
        var mask = new Ext.LoadMask(newCard, {
            msg: 'Cargando...'
        });
        mask.show();
        var getdata = {
            url: 'app/getregisters',
            method: 'GET',
            scope: this,
            params: {
                idseccion: newCard.idsection,  //id de la seccion activa que va a cargar los datos
                idseccionpadre: newCard.idparent, //id del padre
                idproducto: idrecordparent,
                filtros: MasterApp.util.getFilterBySection(),
                start: 0,
                limit:15
            },
            success: function (response) {
                mask.hide();
                var json = Ext.JSON.decode(response.responseText);
                var grid = newCard.down('gridpanel');
                grid.getStore().loadData(json);
                MasterApp.globals.setLoading(false);
            },
            failure: function (response) {
                mask.hide();
            }
        };
        Ext.Ajax.request(getdata);
    },

    refreshSectionActive: function (window) {
        var grid = MasterApp.globals.getGridSection();
        var panel = grid.up('panel');
        var idrecordparent = panel.idrecordparent;
        if (window.idmenu == grid.idmenu) {
            if (grid.name == 'section-principal')   //si es la seccion principal
                this.reloadSectionPrincipal(grid);
            else
                this.getDataSection(idrecordparent, panel); //si es una seccion hija
        } else {
            //devuelve la seccion principal de la ventana actual, en caso de hayan muchas ventanas abiertas
            grid = MasterApp.globals.getSectionPrincipalByWindow(window);
            this.reloadSectionPrincipal(grid);
        }
    },

    restore: function (button, evt, toolEl, owner, tool) {
        var window = owner.up('window');
        window.expand('', false);
        window.isminimize = false;
        button.hide();
        var btn = MasterApp.tools.getBtnTools(window, 'btn_minimize');
        btn.show();
        var arrayBtn = ['btn_minimize', 'btn_trash', 'btn_add', 'btn_refresh', 'btn_download', 'btn_print'];
        MasterApp.tools.setVisibleBtn(window, arrayBtn, false);
        this.adjustOtherWindowsMinimize();
        var panel = Ext.ComponentQuery.query('#panel-center')[0];
        MasterApp.util.resizeWindow(window, panel);
        MasterApp.tools.showButtonsNotDefault(window, true);
    },

    minimize: function (button, evt, toolEl, owner, tool) {
        var window = owner.up('window');
        window.collapse();
        window.isminimize = true;
        winWidth = window.getWidth();
        winHeight = window.getHeight();
        window.setWidth(300);
        button.hide();
        MasterApp.theme.setHeaderHeightWindowCollpase(window);
        this.setPositionWindow(window);
        MasterApp.magnament.isMenuTabMagnament(window);
        this.adjustOtherWindowsMaximize();
    },

    maximize: function (button, evt, toolEl, owner, tool) {
        var window = owner.up('window');
        button.hide();
        button.previousSibling().show();
        var btn = MasterApp.tools.getBtnTools(window, 'btn_restore');
        btn.hide();
        btn = MasterApp.tools.getBtnTools(window, 'btn_minimize');
        btn.hide();
        window.expand('', false);
        window.isminimize = false;
        var panel = Ext.ComponentQuery.query('MainView')[0];
        MasterApp.util.resizeWindow(window, panel);
        MasterApp.tools.showButtonsNotDefault(window, true);
    },

    closeWindow: function (window) {
        MasterApp.magnament.isMenuTabMagnament(window);
        MasterApp.footer.removeWindowCombo(window);
        var windows = Ext.ComponentQuery.query('window-menu');
        if (windows.length == 0) {
            Ext.ComponentQuery.query('#btnEnRows')[0].setDisabled(true);
            Ext.ComponentQuery.query('#btnEnColumns')[0].setDisabled(true);
            Ext.ComponentQuery.query('#btnEnCascade')[0].setDisabled(true);
        }
        this.adjustOtherWindowsMinimize();
        this.adjustOtherWindowsMaximize();
        this.removeOfArrayGlobals(window);
    },

    //funcion que cuando se cierra la ventana elimina los arreglos globales de la ventana seleccionada
    removeOfArrayGlobals: function (window) {
        var arrayTotals = MasterApp.globals.getArrayTotal();
        var arrayFilter = MasterApp.globals.getArrayFilter();
        for (var j = 0; j < arrayTotals.length; j++) {
            if (window.idmenu == arrayTotals[j]['id']) {
                arrayTotals.splice(j, 1);
            }
        }
        for (var j = 0; j < arrayFilter.length; j++) {
            if (window.idmenu == arrayFilter[j]['id']) {
                arrayFilter.splice(j, 1);
            }
        }
    },

    //posicionar ventana minimizada
    setPositionWindow: function (win) {
        var windows = Ext.ComponentQuery.query('window[name=window-menu]');
        var cant = 0;
        for (var j = 0; j < windows.length; j++) {
            if (windows[j].collapsed) {
                cant++;
                if (cant == 1)
                    this.posYFirts = windows[j].getY();
            }

        }
        var posX = (cant == 1) ? 0 : (cant - 1) * 300;
        if (cant < 5) {
            win.setX(posX);
            return;
        }
        ;
        if (cant < 10) {
            var posX = (cant == 5) ? 0 : (cant - 5) * 300;
            var posY = this.posYFirts - 50;
            win.setPosition(posX, posY);
            return;
        }
        ;
        if (cant < 15) {
            var posX = (cant == 5) ? 0 : (cant - 10) * 300;
            var posY = this.posYFirts - 100;
            win.setPosition(posX, posY);
        }
        ;
    },
    //reorganiza las otras ventanas minimizadas
    adjustOtherWindowsMinimize: function () {
        var cant = 0;
        var windows = Ext.ComponentQuery.query('window-menu[isminimize=true]');
        for (var j = 0; j < windows.length; j++) {
            cant++;
            var posX = (cant == 1) ? 0 : (cant - 1) * 300;
            if (cant < 5) {
                windows[j].setX(posX);
                windows[j].setY(this.posYFirts);
            }
        }
    },
    //reorganiza las otras ventanas maximizadas
    adjustOtherWindowsMaximize: function () {
        var windows = Ext.ComponentQuery.query('window-menu[isminimize=false]');
        for (var j = 0; j < windows.length; j++) {
            var isRows = MasterApp.globals.isRows();
            if (isRows) {
                MasterApp.header.applyRows();
                return;
            }
            var isColumns = MasterApp.globals.isColumns();
            if (isColumns) {
                MasterApp.header.applyColumns();
            }
        }
    },

    // le pone el mismo ancho de la columna al grid de totales
    columnresize: function (ct, column, width, eOpts) {
        var panel = ct.up('panel').up('panel');
        var grid_total = panel.items.items[1];
        var columns = grid_total.getColumns();
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].dataIndex == column.dataIndex) {
                var width = column.getWidth();
                columns[i].setWidth(width);
                break
            }
        }
    },

    deleteRow: function (button, window) {
        var gridsection = MasterApp.globals.getGridSection();
        if (window.idmenu != gridsection.idmenu) {
            gridsection = MasterApp.globals.getSectionPrincipalByWindow(window);
        }
        var hasSelection = gridsection.getSelectionModel().hasSelection();
        if (!hasSelection) {
            MasterApp.util.showMessageInfo('Debe seleccionar un registro.');
            return
        }
        ;
        var selects = gridsection.getSelectionModel().getSelection();
        var msg = (selects.length == 1) ? 'el registro seleccionado' : 'los registros seleccionados.';
        Ext.Msg.confirm('Confirmaci&oacute;n', '&iquest;Est&aacute; seguro que desea eliminar ' + msg + '?', function (conf) {
            if (conf == 'yes') {
                var mask = new Ext.LoadMask(gridsection, {
                    msg: 'Eliminando...'
                });
                mask.show();
                var store = gridsection.getStore();
                var idsection = MasterApp.util.getIdSectionActive();
                var data = [];
                for (var j = 0; j < selects.length; j++) {
                    data.push(selects[j]['id']);  //los id de los seleccionados
                }
                var remove = {
                    url: 'app/crudregister',
                    method: 'POST',
                    scope: this,
                    params: {
                        idsection: idsection,
                        id: Ext.encode(data),
                        accion: '7'
                    },
                    success: function (response) {
                        mask.hide();
                        var json = Ext.JSON.decode(response.responseText);
                        if (json.success == true) {
                            for (var j = 0; j < selects.length; j++) {
                                store.remove(selects[j]);
                                this.afterDelete()
                            }
                            button.setDisabled(true);
                        } else {
                            Ext.Msg.show({
                                title: 'Informaci&oacute;n',
                                msg: json.message,
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.INFO
                            });
                        }
                    },
                    failure: function (response) {
                        mask.hide();
                    }
                };
                Ext.Ajax.request(remove);
            }
        }, this);
    },
    //despues de eliminar una fila de una seccion deshabilitar las secciones dependientes.
    afterDelete: function () {
        MasterApp.magnament.cleanAll();
        var gridsection = MasterApp.globals.getGridSection();
        var tabpanel = gridsection.up('tabpanel'); //tab panel actual
        if (tabpanel) {
            var level = tabpanel.level + 1;
            var windowId = gridsection.idsection;
            var tabs = Ext.ComponentQuery.query('tabpanel[idsection=' + windowId + ']');
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].level == level) {
                    var panelActive = tabs[i].getActiveTab();
                    var grid = panelActive.items.items[0];
                    grid.getStore().removeAll();
                }
            }
        }
    },

    //recargar section
    reloadSectionPrincipal: function (grid) {
        var mask = new Ext.LoadMask(grid, {
            msg: 'Cargando...'
        });
        mask.show();
        var load = {
            url: 'app/sections',
            method: 'POST',
            scope: this,
            params: {
                sectionId: grid.idsection,
                filtros: MasterApp.util.getFilterBySection()
            },
            success: function (response) {
                mask.hide();
                var json = Ext.JSON.decode(response.responseText);
                var data = json[0].datos;
                grid.getStore().loadData(data);

            },
            failure: function (response) {
                mask.hide();
            }
        };
        Ext.Ajax.request(load);
    },

    getDataSection: function (idrecordparent, newCard) {
        var mask = new Ext.LoadMask(newCard, {
            msg: 'Cargando...'
        });
        mask.show();
        var getData = {
            url: 'app/getregisters',
            method: 'GET',
            scope: this,
            params: {
                idseccion: newCard.idsection,  //id de la seccion activa que va a cargar los datos
                idseccionpadre: newCard.idparent, //id del padre
                idproducto: idrecordparent,
                filtros: MasterApp.util.getFilterBySection(),
                start: 0,
                limit:15
            },
            success: function (response) {
                mask.hide();
                var json = Ext.JSON.decode(response.responseText);
                var grid = newCard.down('gridpanel');
                grid.getStore().loadData(json);
            },
            failure: function (response) {
                mask.hide();
            }
        };
        Ext.Ajax.request(getData);
    },
    // funcion para capturar el click en el tab seleccionados para tenerlo como referencia
    addEventClickTabSection: function (tabPanel, newCard) {
        var comp = tabPanel.getEl();
        this.onClickTab(comp);
        this.onDoubleClick(comp);
    },

    onClickTab: function (comp) {
        comp.on('click', function (e) {
            var isLoading = MasterApp.globals.isLoading;
            if (isLoading)
                return;
            MasterApp.globals.setLoading(true);
            var idtab = comp.id;
            setTimeout(function () {
                var sectionActive = Ext.ComponentQuery.query('#' + idtab)[0].getActiveTab();
                if (sectionActive) {
                    var gridsection = sectionActive.down('gridpanel');
                    MasterApp.globals.setGridSection(gridsection);
                    MasterApp.globals.setRecordSection(null);
                    MasterApp.magnament.getData(gridsection);
                    MasterApp.globals.setLoading(false);
                    var container = gridsection.up('panel');
                    MasterApp.util.setStyleSection(container);
                    //   var height = Ext.ComponentQuery.query('#' + idtab)[0].getHeight();
                    //    gridsection.setHeight(500);
                }
            }, 500);
        }, comp);
    },

    onDoubleClick: function (comp) {
        comp.on('dblclick', function (e) {
            MasterApp.section.setFullSectionOfWindow(this);
            e.cancelEvents();
        }, comp);
    },

    resizeSection: function (panel, info, eOpts) {
        var gridsection = panel.items.items[0];
        var gridtotal = panel.items.items[1];
        var height = panel.getHeight();
        height = (gridtotal.isVisible()) ? height - 30 : height;
        gridsection.setHeight(height);
    },

    resizeWindow: function (win) {
        var widthPanel = Ext.ComponentQuery.query('#panel-center')[0].getWidth() / 2.5;
        var width = win.getWidth();
        var arrayBtn = ['btn_restore'];
        var isExpanded = MasterApp.util.isWindowExpand(win);
        MasterApp.tools.setVisibleBtn(win, arrayBtn, isExpanded);
        arrayBtn = ['btn_trash', 'btn_add', 'btn_refresh', 'btn_download', 'btn_print', 'btn_export_capsule', 'btn_import_capsula', 'btn_report', 'btn_save_bd', 'btn_restore_bd'];
        if (widthPanel >= width) {
            MasterApp.tools.setVisibleBtn(win, arrayBtn, true);
            MasterApp.tools.showButtonsNotDefault(win, false);
        } else {
            MasterApp.tools.setVisibleBtn(win, arrayBtn, false);
            MasterApp.tools.showButtonsNotDefault(win, true);
        }
    },

    afterrender: function (panel) {
        //  this.actionKey(panel);
    },

    actionKey: function (panel) {
        Ext.create('Ext.util.KeyMap', {
            target: Ext.getBody(),
            binding: [{
                key: "f",
                ctrl: true,
                fn: function (e) {
                    MasterApp.globals.actionKeyCrtlF = true;
                    var tabMagnament = Ext.ComponentQuery.query('tabmagnament')[0];
                    var activeTab = tabMagnament.getActiveTab();
                    if (activeTab.xtype == 'filter-view') {
                        MasterApp.filter.setFocusCell();
                    } else {
                        tabMagnament.setActiveTab(1);
                    }
                }
            }]
        });
    },

    dblClickHeader: function (window) {
        if (!window.isminimize) {
            var panelMenu = Ext.ComponentQuery.query('#panel-center')[0];
            window.collapse();
            window.isminimize = true;
            winWidth = window.getWidth();
            winHeight = window.getHeight();
            window.setWidth(300);
            var btn = MasterApp.tools.getBtnTools(window, 'btn_minimize');
            btn.hide();
            window.alignTo(panelMenu, 'bl-bl');
            this.setPositionWindow(window);
            MasterApp.magnament.isMenuTabMagnament(window);
            this.adjustOtherWindowsMaximize();
        } else {
            window.expand('', false);
            window.isminimize = false;
            var btn = MasterApp.tools.getBtnTools(window, 'btn_restore');
            btn.show();
            btn = MasterApp.tools.getBtnTools(window, 'btn_minimize');
            btn.show();
            var arrayBtn = ['btn_minimize', 'btn_trash', 'btn_add', 'btn_refresh', 'btn_download', 'btn_print', 'btn_export_capsule', 'btn_import_capsula', 'btn_report', 'btn_save_bd', 'btn_restore_bd'];
            MasterApp.tools.setVisibleBtn(window, arrayBtn, false);
            this.adjustOtherWindowsMinimize();
            var panel = Ext.ComponentQuery.query('#panel-center')[0];
            MasterApp.util.resizeWindow(window, panel);
            MasterApp.tools.showButtonsNotDefault(window, true);
        }
    },

    setFullSectionOfWindow: function (me) {
        var tabpanel = Ext.ComponentQuery.query('#' + me.id)[0];
        var window = tabpanel.up('window');
        var panel_principal = window.down('panel[name=panel_section]');
        var height;
        // si es el primer tabpanel, ocultar el panel principal guardando su altura original, para utilizarla despues
        if (tabpanel.level == 0) {
            if (!panel_principal.isHidden()) {
                height = panel_principal.getHeight() + tabpanel.getHeight();
                panel_principal['lastHeight'] = panel_principal.getHeight();
                tabpanel['lastHeight'] = tabpanel.getHeight();
                panel_principal.setHeight(0);
                panel_principal.hide();
                tabpanel.setHeight(height);
                tabpanel['expanded'] = true;
            } else {
                panel_principal.setHeight(panel_principal['lastHeight']);
                tabpanel.setHeight(tabpanel['lastHeight']);
                tabpanel['expanded'] = false;
                panel_principal.show();
            }
        }
        ;
        if (tabpanel.level === 1) {
            var firstTabPanel = window.down('tabpanel');
            if (!firstTabPanel.isHidden()) {
                firstTabPanel['lastHeight'] = firstTabPanel.getHeight();
                panel_principal['lastHeight'] = (panel_principal.getHeight() === 0) ? '33%' : panel_principal.getHeight();
                tabpanel['lastHeight'] = tabpanel.getHeight();
                height = panel_principal.getHeight() + firstTabPanel.getHeight() + tabpanel.getHeight();
                panel_principal.setHeight(0);
                firstTabPanel.setHeight(0);
                panel_principal.hide();
                firstTabPanel.hide();
                tabpanel.setHeight(height);
                tabpanel['expanded'] = true;
            } else {
                panel_principal.show();
                firstTabPanel.show();
                panel_principal.setHeight('33%');
                firstTabPanel.setHeight('33%');
                tabpanel.setHeight('33%');
                tabpanel['expanded'] = false;
            }
        }
    },

    paginate: function (grid) {
        var Mask = new Ext.LoadMask(grid, {
            msg: 'Cargando...'
        });
        Mask.show();
        var store = grid.getStore();
        var total = store.getCount();
        var panel = grid.up('panel');
        var idparent = (panel.idparent === null) ? null : panel.idparent;
        var idrecordparent = (panel.idrecordparent === null) ? null : panel.idrecordparent;
        var start = 15 * grid.page;
        var load = {
            url: 'app/getregisters',
            method: 'GET',
            scope: this,
            params: {
                idseccion: grid.idsection,  //id de la seccion activa que va a cargar los datos
                idseccionpadre: idparent, //id del padre
                idproducto: idrecordparent,
                filtros: MasterApp.util.getFilterBySection(),
                start: start,
                limit:start + 15
            },
            success: function (response) {
                Mask.hide();
                var json = Ext.JSON.decode(response.responseText);
                var data = json;
                if (data.length > 0) {
                    var j = total;
                    for (var i = 0; i < data.length; i++) {
                        store.insert(j + 1, data[i]);
                        j++;
                    }
                    grid.page++;
                }
            }
        };
        Ext.Ajax.request(load);
    }
})