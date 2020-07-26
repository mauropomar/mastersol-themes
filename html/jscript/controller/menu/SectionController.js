/**
 * @author mauro
 */
Ext.define('MasterSol.controller.menu.SectionController', {
    extend: 'Ext.app.Controller',
    IdRecParent:null,
    init: function () {
        this.control({
            'gridpanel[name=section-principal]': { // matches the view itself
                itemclick: 'clickSectionPrincipal',
                itemdblclick: 'dblclickSectionPrincipal',
           //     columnresize: 'columnresize'
            },
            'tabpanel[name=tab-section]': {
                tabchange:'tabChangeSection'
            },
        })
    },

    clickSectionPrincipal:function(grid, record){
        MasterApp.globals.setRecordSection(record);
        MasterApp.globals.setGridSection(grid.panel);
        this.IdRecParent = record.data.id;
        this.loadDataTabActive(grid, record, 0);
     //   this.limpiarDatosGestion();
      //  this.obtenerDatosGestion();
    },

    //activar y obtener los datos de la seccion hija activa
    loadDataTabActive: function (grid, rec, level) {
        var windowId = grid.panel.idsection;
        var tabs = Ext.ComponentQuery.query('tabpanel[idsection=' + windowId + ']');
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
        var count = this.getCountSections(grid.panel.idsection, level);
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

    resetAllSectionNotImediatly:function (tabs, level) {
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

    getCountSections:function(windowId, level){
        var count = 0;
        var tabs = Ext.ComponentQuery.query('tabpanel[idsection=' + windowId + ']');
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].level == level) {
                count = tabs[i].items.items.length;
            }
        }
        return count;
    },

    tabChangeSection:function(tabPanel, newCard){
        var gridsection = newCard.down('gridpanel');
        MasterApp.globals.setGridSection(gridsection);
        var idparent = newCard.idrecordparent;
        if (idparent == null)
            return;
        var store = gridsection.getStore();
        if (store.getCount() > 0)
            return;
        var window = gridsection.up('window');
        MasterApp.tools.setButtons(window, gridsection.btnTools);
        this.getData(idparent, newCard);
    },


    getData:function(idrecordparent, newCard){
        var mask = new Ext.LoadMask(newCard, {
            msg: 'Cargando...'
        });
        mask.show();
        var getdata = {
            url: 'php/manager/getregisters.php',
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
        Ext.Ajax.request(getdata);
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
        var panel = Ext.ComponentQuery.query('#panel-menu')[0];
        MasterApp.util.resizeWindow(window, panel);
    },


    minimize: function (button, evt, toolEl, owner, tool) {
        var panelMenu = Ext.ComponentQuery.query('#panel-menu')[0];
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
    },

    closeWindow: function (window) {
        MasterApp.footer.removeWindowCombo(window);
        window.destroy();
        var windows = Ext.ComponentQuery.query('window-menu');
        if (windows.length == 0) {
            Ext.ComponentQuery.query('#btnEnMosaic')[0].setDisabled(true);
            Ext.ComponentQuery.query('#btnEnCascade')[0].setDisabled(true);
        }
        this.adjustOtherWindowsMinimize();
        this.adjustOtherWindowsMaximize();
        /*     this.collapseTabGestion();
        MasterApp.globales.setRecordSection(null);
        MasterApp.globales.setGridSection(null);
        this.removeOfArrayGlobales(window);*/
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
    }
})