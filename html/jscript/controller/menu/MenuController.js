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
            mask.hide();
            return;
        }
        var getdata = {
            url: 'php/manager/getsections.php',
            method: 'POST',
            scope: this,
            params: {
                sectionId: record.data.sectionId,
                alerta_user: false
            },
            success: function (response) {
                mask.hide();
                var json = Ext.JSON.decode(response.responseText);
                this.json = json;
                if (json != null) {
                    this.showMenu(json);
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
        Ext.ComponentQuery.query('#panel-center')[0].removeAll();
        Ext.ComponentQuery.query('#panel-center')[0].add(Ext.create('MasterSol.view.menu.Menu'));
        var panelmenu = Ext.ComponentQuery.query('#panel-menu')[0];
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
        MasterApp.tools.setButtons(window, json[0].buttons);
        this.windowParent = window;
        this.panelMenu = window.down('panel').down('container');
        this.generateLevels(json);
        this.configureSections(json);
        //   this.obtenerButtons(window);
        Ext.ComponentQuery.query('#btnEnMosaic')[0].setDisabled(false);
        Ext.ComponentQuery.query('#btnEnCascade')[0].setDisabled(false);
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
    },

    generateSections: function (level, height) {
        var tabpanel = Ext.create('Ext.tab.Panel', {
            height: height,
            activeTab: 0,
            split: true,
            resizable: true,
            level: level - 1,
            idsection: this.windowParent.idsection,
            idmenu: this.windowParent.idmenu,
            name: 'tab-section',
            border: 1
        });
        this.panelMenu.add(tabpanel);
    },

    // configuracion y creacion de secciones
    configureSections: function (json) {
        var items = this.panelMenu.items.items;
        var tabs = this.getTabsOfPanel(items);
        var sections = (json[0].children) ? json[0].children : [];
        for (var i = 0; i < sections.length; i++) {
            var pos = sections[i].nivel - 1;
            if (tabs[pos])
                this.insertSection(sections[i], tabs[pos]);
        }
    },
    // crea una seccion y la agrega al tab
    insertSection(section, tab) {
        var title = section.nombre;
        var height = tab.getHeight() - 50;
        var containerSection = MasterApp.containersections.getPanel(title, section, [], height, 'grid-section', this.windowParent);
        tab.add(containerSection);
    },
    // activa el primer panel de cada tab.
    activeFirstTab: function () {
        var items = this.panelMenu.items.items;
        var tabs = this.getTabsOfPanel(items);
        tabs[1].setActiveTab(0);
    },

    getTabsOfPanel: function (items) {
        var tabs = [];
        for (var j = 0; j < items.length; j++) {
            if (items[j].componentCls === 'x-panel') {
                tabs.push(items[j])
            }
        }
        return tabs;
    },
    // elimina todas la secciones y agregar las secciones correspondiente al padre
    addChildOfTab: function (tab, panel) {
        var childs = (this.json[0].children) ? this.json[0].children : [];
        tab.removeAll();
        for (var j = 0; j < childs.length; j++) {
            if (childs[j].idpadre === panel.idsection) {
                this.insertSection(childs[j], tab);
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
                break
            }
        }
        return win;
    }
})