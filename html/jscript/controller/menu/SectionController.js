/**
 * @author mauro
 */
Ext.define('MasterSol.controller.menu.SectionController', {
    extend: 'Ext.app.Controller',
    IdRecParent: null,
    posYFirts: null,
    hasClickedSectionPrincipal: false,
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
        e.stopEvent();
        MasterApp.globals.setRecordSection(record);
        var index = grid.panel.getStore().findExact('id', record.getId());
        grid.panel.getSelectionModel().select(index);
        MasterApp.globals.setGridSection(grid.panel);
        this.IdRecParent = record.data.id;
        this.loadDataTabActive(grid, record, 0);
        MasterApp.util.setStyleWindow(grid.panel);
        MasterApp.util.setStyleSection();
        MasterApp.magnament.getData(grid.panel);
        MasterApp.tools.setButtons();
        return false;
    },

    dblclickSectionPrincipal: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        e.stopEvent();
        MasterApp.magnament.getData(grid.panel, cellIndex);
        MasterApp.globals.setGridSection(grid.panel, cellIndex);
        return false;
    },

    clickSection: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        e.stopEvent();
        MasterApp.globals.setGridSection(grid.panel);
        var index = grid.panel.getStore().findExact('id', record.getId());
        grid.panel.getSelectionModel().select(index);
        MasterApp.globals.setRecordSection(record);
        var level = grid.up('tabpanel').level + 1;
        this.loadDataTabActive(grid, record, level);
        MasterApp.util.setStyleWindow(grid.panel);
        var container = grid.panel.up('panel');
        MasterApp.util.setStyleSection(container);
        MasterApp.magnament.getData(grid.panel);
        MasterApp.tools.setButtons();
        return false;
    },

    dblclickSection: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        e.stopEvent();
        MasterApp.globals.setGridSection(grid.panel, cellIndex);
        MasterApp.globals.setRecordSection(record);
        MasterApp.magnament.getData(grid.panel, cellIndex);
        return false;
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
                limit: 30
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
        //  this.adjustOtherWindowsMinimize();
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
        window.toBack();
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
        //     this.adjustOtherWindowsMinimize();
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
        var posX = 0,
            posY = 0,
            cant = 0,
            i = 1;
        rest = (MasterApp.theme.isShortTheme()) ? 25 : 45,
            windows = Ext.ComponentQuery.query('window[name=window-menu]');
        for (var j = 0; j < windows.length; j++) {
            if (windows[j].collapsed) {
                cant++;
                i = (cant == 1 || cant == 5 || cant == 9 || cant == 13) ? 0 : i + 1;
                posX = (cant == 1 || cant == 5 || cant == 9 || cant == 13) ? 0 : i * 300;
                windows[j].setX(posX);
                if (cant >= 5 && cant <= 8) {
                    posY = windows[0].getY() - rest;
                    windows[j].setY(posY);
                }
                if (cant >= 9 && cant <= 11) {
                    posY = windows[4].getY() - rest;
                    windows[j].setY(posY);
                }
                if (cant >= 12 && cant <= 15) {
                    posY = windows[8].getY() - rest;
                    windows[j].setY(posY);
                }
            }
        }
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
    }
    ,
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
    }
    ,

    // le pone el mismo ancho de la columna al grid de totales
    columnresize: function (ct, column, width, eOpts) {
        var panel = ct.up('panel').up('panel');
        var grid_total = panel.items.items[1];
        var columns = grid_total.getColumns();
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].dataIndex == column.dataIndex) {
                var width = column.getWidth();
                columns[i].setWidth(width);
                break;
            }
        }
    }
    ,

    deleteRow: function (button, window) {
        var gridsection = MasterApp.globals.getGridSection();
        var idrecordparent = gridsection.up('panel').idrecordparent;
        var idregisterparent = (idrecordparent) ? idrecordparent : 0;
        if (window.idmenu != gridsection.idmenu) {
            gridsection = MasterApp.globals.getSectionPrincipalByWindow(window);
        }
        var hasSelection = gridsection.getSelectionModel().hasSelection();
        if (!hasSelection) {
            MasterApp.util.showMessageInfo('Debe seleccionar un registro.');
            return;
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
                        idpadreregistro: idregisterparent,
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
                                this.afterDelete();
                            }
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
    }
    ,
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
    }
    ,

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
                if (json.isview) {
                    MasterApp.getController('MasterSol.controller.section_user.SectionUserController').loadDataSectionUser(json.datos);
                } else {
                    var data = json.datos[0].datos;
                    if (data)
                        grid.getStore().loadData(data);
                }
            },
            failure: function (response) {
                mask.hide();
            }
        };
        Ext.Ajax.request(load);
    },
    // Obtiene los datos de la seccion
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
                limit: 30
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
    }
    ,
    // Evento para capturar el click en el cuerpo de la sesion principal
    addEventClickSectionPrincipal: function (panel) {
        var comp = panel.getEl();
        comp.on('click', function (e) {
            e.stopEvent();
            if (e.event.target.dataset.ref == 'triggerEl')
                return false;
            var idpanel = this.id;
            var p = Ext.ComponentQuery.query('#' + idpanel)[0];
            var grid = p.down('gridpanel');
            var hasSelection = grid.getSelectionModel().hasSelection();
            if (hasSelection) {
                var rec = grid.getSelectionModel().getSelection()[0];
                MasterApp.globals.setRecordSection(rec);
            }
            MasterApp.globals.setGridSection(grid);
            MasterApp.magnament.getData(grid);
            MasterApp.tools.setButtons();
            MasterApp.util.setStyleWindow(grid);
        });
    }
    ,

    // funcion para capturar el click en el tab seleccionados para tenerlo como referencia
    addEventClickTabSection: function (tabPanel, containerSection) {
        var comp = tabPanel.getEl();
        this.onClickTab(tabPanel);
        this.onClickSection(comp);
        this.onDoubleClickTab(tabPanel);
    }
    ,
    // Evento para capturar el click en el tab de las sesion
    onClickTab: function (tabPanel) {
        var comp = tabPanel.tabBar.getEl();
        comp.on('click', function (e) {
            e.stopEvent();
            if (!e.event.target.dataset.ref || e.event.target.dataset.ref == 'triggerEl')
                return false;
            MasterApp.util.selectSection(this.id, true);
            return false;
        }, comp);
    },
    // Evento para capturar el click en el cuerpo de las sesion
    onClickSection: function (comp) {
        comp.on('click', function (e) {
            e.stopEvent();
            if (e.event.target.dataset.ref === 'triggerEl')
                return false;
            MasterApp.util.selectSection(this.id, false);
            return false;
        });
    },
    // Evento para capturar el doble click en el tab title de las sesion
    onDoubleClickTab: function (tabPanel) {
        var comp = tabPanel.tabBar.getEl();
        comp.on('dblclick', function (e) {
            if (!e.event.target.dataset.ref || e.event.target.dataset.ref == 'triggerEl')
                return false;
            MasterApp.section.setFullSectionOfWindow(tabPanel.getEl());
            return false;
        }, comp);
    },

    resizeSection: function (panel, info, eOpts) {
        var gridsection = panel.items.items[0];
        var gridtotal = panel.items.items[1];
        var height = panel.getHeight();
        height = (gridtotal.isVisible()) ? height - 30 : height;
        gridsection.setHeight(height);
    }
    ,

    resizeWindow: function (win) {
        var widthPanel = Ext.ComponentQuery.query('#panel-center')[0].getWidth() / 2.5;
        var width = win.getWidth();
        var arrayBtn = ['btn_restore'];
        var isExpanded = MasterApp.util.isWindowExpand(win);
        MasterApp.tools.setVisibleBtn(win, arrayBtn, isExpanded);
        arrayBtn = MasterApp.tools.getArrayBtnDefault();
        if (widthPanel >= width) {
            MasterApp.tools.setVisibleBtn(win, arrayBtn, true);
            MasterApp.tools.showButtonsNotDefault(win, false);
        } else {
            MasterApp.tools.setVisibleBtn(win, arrayBtn, false);
            MasterApp.tools.showButtonsNotDefault(win, true);
        }
    }
    ,

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
    }
    ,

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
            MasterApp.theme.setHeaderHeightWindowCollpase(window);
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
            var arrayBtn = ['btn_minimize'];
            arrayBtn = arrayBtn.concat(MasterApp.tools.getArrayBtnDefault());
            MasterApp.tools.setVisibleBtn(window, arrayBtn, false);
            this.adjustOtherWindowsMinimize();
            var panel = Ext.ComponentQuery.query('#panel-center')[0];
            MasterApp.util.resizeWindow(window, panel);
            MasterApp.tools.showButtonsNotDefault(window, true);
        }
    }
    ,

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
                var hasChild = MasterApp.util.hasChildSection(tabpanel);
                if (!hasChild)
                    tabpanel.setHeight('100%');
                else
                    tabpanel.setHeight(height);
                tabpanel['expanded'] = true;
                MasterApp.util.getIdentifier(tabpanel);
            } else {
                panel_principal.setHeight(panel_principal['lastHeight']);
                tabpanel.setHeight(tabpanel['lastHeight']);
                tabpanel['expanded'] = false;
                panel_principal.show();
                window.setTitle(window.originalTitle);
            }
            return;
        }
        ;
        if (tabpanel.level === 1) {
            var firstTabPanel = window.down('tabpanel');
            if (!firstTabPanel.isHidden()) {
                firstTabPanel['lastHeight'] = firstTabPanel.getHeight();
                panel_principal['lastHeight'] = (panel_principal.getHeight() === 0) ? '33%' : panel_principal.getHeight();
                tabpanel['lastHeight'] = tabpanel.getHeight();
                panel_principal.setHeight(0);
                firstTabPanel.setHeight(0);
                panel_principal.hide();
                firstTabPanel.hide();
                tabpanel.setHeight('100%');
                tabpanel['expanded'] = true;
                MasterApp.util.getIdentifier(tabpanel);
            } else {
                panel_principal.show();
                firstTabPanel.show();
                panel_principal.setHeight('33%');
                firstTabPanel.setHeight('33%');
                tabpanel.setHeight('33%');
                tabpanel['expanded'] = false;
                window.setTitle(window.originalTitle);
            }
        }
    }
    ,

    paginate: function (grid) {
        var Mask = new Ext.LoadMask(grid, {
            msg: 'Cargando...'
        });
        Mask.show();
        var store = grid.getStore();
        var total = store.getCount();
        var panel = grid.up('panel');
        var idparent = (panel.idparent == null) ? null : panel.idparent;
        var idrecordparent = (panel.idrecordparent == null) ? null : panel.idrecordparent;
        var start = 30 * grid.page;
        var load = {
            url: this.getUrlPaginate(idparent),
            method: this.getMethodPaginate(idparent),
            scope: this,
            params: this.getParamsPaginate(grid, idparent, idrecordparent, start),
            success: function (response) {
                Mask.hide();
                var json = Ext.JSON.decode(response.responseText);
                var data = (idparent == null) ? json[0].datos : json;
                if (data == null)
                    return;
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
    ,

    getUrlPaginate: function (idparent) {
        var url = (idparent == null) ? 'app/sections' : 'app/getregisters';
        return url;
    }
    ,

    getMethodPaginate: function (idparent) {
        var method = (idparent == null) ? 'POST' : 'GET';
        return method;
    }
    ,

    getParamsPaginate: function (grid, idparent, idrecordparent, start) {
        if (idparent == null) {
            var isAlert = grid.up('window').isAlert;
            return {
                sectionId: grid.idsection,
                alerta_user: isAlert,
                start: start,
                limit: 30
            }
        } else {
            return {
                idseccion: grid.idsection,  //id de la seccion activa que va a cargar los datos
                idseccionpadre: idparent, //id del padre
                idproducto: idrecordparent,
                filtros: MasterApp.util.getFilterBySection(),
                start: start,
                limit: 30
            }
        }
    }
    ,

    updateRowOrder: function (recordDrag, recordDrop) {
        var idsection = MasterApp.util.getIdSectionActive();
        var save = {
            url: 'app/updateorder',
            method: 'POST',
            scope: this,
            params: {
                idsection: idsection,
                idfirst: recordDrag.data.id,
                idsecond: recordDrop.data.id
            },
            callback: function (options, success, response) {
                var json = Ext.JSON.decode(response.responseText);
                if (json.success == true) {
                    Ext.toast(json.datos);
                } else {
                    Ext.Msg.show({
                        title: 'Informaci&oacute;n',
                        msg: json.datos,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }
            }
        };
        Ext.Ajax.request(save);
    }
    ,

    updateColumn: function (fields) {
        var idsection = MasterApp.util.getIdSectionActive();
        var save = {
            url: 'app/updatecolumn',
            method: 'POST',
            scope: this,
            params: {
                idsection: idsection,
                namex: fields.join(',')
            },
            callback: function (options, success, response) {
                var json = Ext.JSON.decode(response.responseText);
                if (json.success == true) {
                    Ext.toast(json.datos);
                } else {
                    Ext.Msg.show({
                        title: 'Informaci&oacute;n',
                        msg: json.datos,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }
            }
        };
        Ext.Ajax.request(save);
    }
});
