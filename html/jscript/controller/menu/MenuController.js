/**
 * @author mauro
 */
Ext.define('MasterSol.controller.menu.MenuController', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.menu = {id: null, idsection: null, name: ''};
        this.json = [];
        this.windowParent = null; //variable utilizada para asociar cada seccion o tab a la ventana
        this.panelMenu = null;
    },

    select: function (view, record) {
        this.menu.id = record.data.id;
        this.menu.idsection = record.data.sectionId;
        this.menu.name = record.data.nombre;
        this.getData(record);
    },
    //obtiene los datos del menu seleccionado
    getData: function (record) {
        var panel = Ext.ComponentQuery.query('viewport')[0];
        var mask = new Ext.LoadMask(panel, {
            msg: 'Cargando...'
        });
        mask.show();
        var window = this.getWindow(record);
        if (window != null) {
            window.toFront();
            mask.hide();
            var grid = window.down('gridpanel');
            var panel = window.down('panel');
            MasterApp.globals.setGridSection(grid);
            MasterApp.util.setStyleWindow(panel);
            MasterApp.magnament.setActiveTabDefault(window);
            return;
        }
        var getdata = {
            url: 'app/sections',
            method: 'POST',
            scope: this,
            params: {
                sectionId: record.data.sectionId,
                alerta_user: false,
                start: 0,
                limit: 30
            },
            success: function (response) {
                mask.hide();
                var json = Ext.JSON.decode(response.responseText);
                if (json.datos.length > 0) {
                    this.json = json.datos;
                    this.showMenu(this.json);
                    if (json.isview)
                        MasterApp.getController('MasterSol.controller.section_user.SectionUserController').loadDataSectionUser(this.json);
                } else {
                    MasterApp.util.showMessageInfo('Este menú no tiene secciones disponibles.');
                }
            },
            failure: function (response) {
                mask.hide();
            }
        };
        Ext.Ajax.request(getdata);
    },

    showMenu: function (json, isAlert = false) {
        var panelmenu = Ext.ComponentQuery.query('#panel-center')[0];
        var window = Ext.create('MasterSol.view.menu.WindowMenu');
        var height = panelmenu.getHeight();
        var width = panelmenu.getWidth();
        window.setWidth(width);
        window.setHeight(height);
        window.setTitle(this.menu.name);
        window.idsection = this.menu.idsection;
        window.idmenu = this.menu.id;
        window.isAlert = isAlert;
        window.showAt(0, 38);
        if (json.length == 0) {
            MasterApp.tools.setButtonsDefault(window);
            return;
        }
        MasterApp.tools.setButtonsInit(window, json[0].buttons);
        this.windowParent = window;
        this.panelMenu = window.down('panel').down('container');
        this.generateLevels(json);
        this.configureSections(json);
        Ext.ComponentQuery.query('#btnEnRows')[0].setDisabled(false);
        Ext.ComponentQuery.query('#btnEnColumns')[0].setDisabled(false);
        Ext.ComponentQuery.query('#btnEnCascade')[0].setDisabled(false);
        MasterApp.util.setStyleWindow(MasterApp.globals.getSectionPrincipal());
        MasterApp.magnament.setActiveTabDefault(window);
    },
    //configurar la cantidad de niveles que va a tener el menu
    generateLevels: function (json) {
        var levels = json[0].niveles;
        var panel_contenedor = this.panelMenu;
        var height = panel_contenedor.getHeight();
        panel_contenedor.removeAll();
        if (levels < 2) {
            this.generateSectionPrincipal(json, height);
        } else {
            height = height / levels;
            for (var j = 0; j < levels; j++) {
                if (j == 0) {
                    this.generateSectionPrincipal(json, height);
                } else {
                    this.generateSections(j, height);
                }
            }
        }
    },
    //generar seccion principal y agregar a la opcion del combo de ventanas que esta en el footer
    generateSectionPrincipal: function (json, height) {
        var panel = MasterApp.containersections.getPanel('', json[0], [], height, 'section-principal', this.windowParent);
        var gridSectionPrincipal = panel.items.items[0];
        MasterApp.globals.setSectionPrincipal(gridSectionPrincipal);
        this.panelMenu.add(panel);
        MasterApp.footer.addWindow(this.menu);
        MasterApp.section.addEventClickSectionPrincipal(panel);
    },

    generateSections: function (level, height) {
        var tabpanel = Ext.create('Ext.tab.Panel', {
            activeTab: 0,
            split: true,
            resizable: false,
            level: level - 1,
            idmenu: this.windowParent.idmenu,
            name: 'tab-section',
            layout: 'fit',
            border: 1
        });
        this.panelMenu.add(tabpanel);
    },

    // configuracion y creacion de secciones
    configureSections: function (json) {
        var items = this.panelMenu.items.items;
        var tabs = this.getTabsOfPanel(items);
        var window = tabs[0].up('window');
        window.childs = items;
        window.tabs = tabs;
        var sections = (json[0].children) ? json[0].children : [];
        for (var i = 0; i < sections.length; i++) {
            var pos = sections[i].nivel - 1;
            if (tabs[pos])
                this.insertSection(sections[i], tabs[pos]);
        }
        if (json[0].niveles > 2) {
            this.setHeightTabs(window, 2);
        } else {
            this.setHeightTabs(window);
        }
    },
    // crea una seccion y la agrega al tab
    insertSection: function (section, tab) {
        var title = section.nombre;
        var height = tab.getHeight();
        var containerSection = MasterApp.containersections.getPanel(title, section, [], height, 'grid-section', this.windowParent);
        tab.add(containerSection);
        if (section.nivel >= 3) {
            tab.hide();
        }
        MasterApp.section.addEventClickTabSection(tab, containerSection);
    },


    getTabsOfPanel: function (items) {
        var tabs = [];
        for (var j = 0; j < items.length; j++) {
            if (items[j].componentCls === 'x-panel') {
                tabs.push(items[j]);
            }
        }
        return tabs;
    },
    // elimina todas la secciones y agregar las secciones correspondiente al padre
    addChildOfTab: function (tab, panel) {
        var level, tabs;
        var childs = tab.items.items;
        var insert = false;
        for (var j = 0; j < childs.length; j++) {
            if (childs[j].idparent === panel.idsection) {
                childs[j].tab.show();
                if (!insert) {
                    tab.suspendEvents();
                    tab.setActiveItem(childs[j]);
                    tab.resumeEvents();
                }
                insert = true;
            } else {
                childs[j].tab.hide();
            }
        }
        var window = tab.up('window');
        if (insert) {
            tab.show();
            tabs = MasterApp.util.getTabsOfWindow(window);
            level = tabs.length;
            this.setHeightTabs(window, level + 1);
        } else {
            tab.hide();
            tabs = MasterApp.util.getTabsOfWindow(window);
            level = tabs.length;
            if (!panel.up('tabpanel').expanded)
                this.setHeightTabs(window, level + 1);
            else {
                panel.up('tabpanel').setHeight('100%');
            }
        }
    },
    //verificar si la ventana existe para que no se repita
    getWindow: function (record) {
        var win = null;
        var windows = Ext.ComponentQuery.query('window[name=window-menu]');
        for (var j = 0; j < windows.length; j++) {
            if (windows[j]['idsection'] == record.data.sectionId) {
                win = windows[j];
                MasterApp.util.setWindowSize(win);
                break;
            }
        }
        return win;
    },

    setHeightTabs: function (window, nivel) {
        var p = MasterApp.globals.getPanelPrincipalByWindow(window);
        var tabs = MasterApp.util.getTabsOfWindow(window);
        var isSmallTheme = MasterApp.theme.isShortTheme();
        var heightPanel, heightTabs;
        // si tiene un solo nivel y el panel principal esta oculto
        if (tabs.length == 1 || p.hidden) {
            heightPanel = isSmallTheme ? '44%' : '43%';
            heightTabs = '55%';
        }
        // si tiene dos niveles y el panel principal esta visible
        if (tabs.length == 2 && !p.hidden) {
            heightPanel = isSmallTheme ? '28%' : '27%';
            heightTabs = '35%';
        }
        // si tiene tres niveles
        if (tabs.length == 3) {
            heightPanel = isSmallTheme ? '25%' : '24%';
            heightTabs = '25%';
        }
        p.setHeight(heightPanel);
        // si recorren los tabs y se le setea la altura
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].setHeight(heightTabs);
        }
    }
})
