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
        })
    },

    clickSectionPrincipal: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        MasterApp.globals.setRecordSection(record);
        MasterApp.globals.setGridSection(grid.panel);
        this.IdRecParent = record.data.id;
        MasterApp.util.setAplyMaxLine();
        this.loadDataTabActive(grid, record, 0);
        MasterApp.util.setStyleWindow(grid.panel);
        MasterApp.magnament.getData(grid.panel);
    },

    dblclickSectionPrincipal: function (grid, td, cellIndex, record) {
        MasterApp.magnament.getData(grid.panel, cellIndex);
    },

    clickSection: function (grid, td, cellIndex, record) {
        MasterApp.globals.setGridSection(grid.panel);
        MasterApp.globals.setRecordSection(record);
        var level = grid.up('tabpanel').level + 1;
        this.loadDataTabActive(grid, record, level);
        MasterApp.util.setAplyMaxLine();
        MasterApp.util.setStyleWindow(grid.panel);
        MasterApp.magnament.getData(grid.panel);
        var window = grid.up('window');
        var panel = grid.up('panel');
        MasterApp.tools.setButtons(window, panel.btnTools);
    },

    dblclickSection: function (grid, td, cellIndex, record) {
        MasterApp.globals.setGridSection(grid.panel);
        MasterApp.globals.setRecordSection(record);
        MasterApp.magnament.getData(grid.panel, cellIndex);
    },

    // activar y obtener los datos de la seccion hija activa
    loadDataTabActive: function (grid, rec, level) {
        var windowId = (grid.panel)?grid.panel.idmenu:grid.idmenu;
        var idsection = (grid.panel)?grid.panel.idsection:grid.idsection;
        var tabs = Ext.ComponentQuery.query('tabpanel[idmenu=' + windowId + ']');
        if (tabs[level] && tabs[level].items.items.length > 0) {//si existe el tabs en ese nivel y tiene secciones hijas
            var panel = tabs[level].getActiveTab();
            if (!panel) {
                panel = tabs[level].items.items[0];
                tabs[level].setActiveTab(0);
            }
            this.setIdRecordParent(tabs[level]);
            this.getData(this.IdRecParent, panel);
            this.resetAllSectionNotImediatly(tabs, level);
        }
        var count = this.getCountSections(idsection, level);
        var disabled = (count == 0) ? false : true;
        var btn = MasterApp.tools.getBtnTools(grid, 'btn_trash');
        btn.setDisabled(disabled);
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
        this.addEventClickTabSection(tabPanel, newCard);
        this.findChildOfSection(tabPanel, newCard);
        MasterApp.magnament.getData(gridsection);
        var idparent = newCard.idrecordparent;
        if (idparent == null)
            return;
        var window = gridsection.up('window');
        //    MasterApp.tools.setButtons(window, gridsection.btnTools);
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
                filtros: MasterApp.util.getFilterBySection()
            },
            success: function (response) {
                mask.hide();
                var json = Ext.JSON.decode(response.responseText);
                var grid = newCard.down('gridpanel');
                grid.getStore().loadData(json);
                MasterApp.util.setAplyMaxLine();
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
        var panelMenu = Ext.ComponentQuery.query('#panel-center')[0];
        var window = owner.up('window');
        window.collapse();
        window.isminimize = true;
        winWidth = window.getWidth();
        winHeight = window.getHeight();
        window.setWidth(300);
        button.hide();
        var btn = MasterApp.tools.getBtnTools(window, 'btn_restore');
        btn.show();
        var arrayBtn = ['btn_maximize', 'btn_trash', 'btn_add', 'btn_refresh', 'btn_download', 'btn_print'];
        MasterApp.tools.setVisibleBtn(window, arrayBtn, true);
        window.alignTo(panelMenu, 'bl-bl');
        this.setPositionWindow(window);
        MasterApp.magnament.isMenuTabMagnament(window);
        this.adjustOtherWindowsMaximize();
        MasterApp.tools.showButtonsNotDefault(window, false);
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
        var tabmagnament = Ext.ComponentQuery.query('tabmagnament')[0];
        MasterApp.footer.removeWindowCombo(window);
        window.destroy();
        var windows = Ext.ComponentQuery.query('window-menu');
        if (windows.length == 0) {
            Ext.ComponentQuery.query('#btnEnMosaic')[0].setDisabled(true);
            Ext.ComponentQuery.query('#btnEnCascade')[0].setDisabled(true);
        }
        this.adjustOtherWindowsMinimize();
        this.adjustOtherWindowsMaximize();
        MasterApp.globals.setRecordSection(null);
        MasterApp.globals.setGridSection(null);
        if (window.idmenu == tabmagnament.idmenumag) {  //collapsar el tab de gestion que tiene los datos de la ventana que se cierra
            tabmagnament.collapse();
            tabmagnament.hide();
        }
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
            var isMosaic = MasterApp.globals.isMosaic();
            if (isMosaic) {
                MasterApp.header.applyMosaic();
                return;
            }
            var isCascade = MasterApp.globals.isCascade();
            if (isCascade) {
                MasterApp.header.applyCascade();
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
                filtros: MasterApp.util.getFilterBySection()
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
        comp.on('click', function () {
            var idtab = comp.id;
            var sectionActive = Ext.ComponentQuery.query('#' + idtab)[0].getActiveTab();
            var gridsection = sectionActive.down('gridpanel');
            MasterApp.globals.setGridSection(gridsection);
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
        arrayBtn = ['btn_trash', 'btn_add', 'btn_refresh', 'btn_download', 'btn_print'];
        if (widthPanel >= width) {
            MasterApp.tools.setVisibleBtn(win, arrayBtn, true);
            MasterApp.tools.showButtonsNotDefault(win, false);
        } else {
            MasterApp.tools.setVisibleBtn(win, arrayBtn, false);
            MasterApp.tools.showButtonsNotDefault(win, true);
        }
    },

    afterrender: function (panel) {
        this.actionKey(panel);
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
    }
})