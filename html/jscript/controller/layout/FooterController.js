Ext.define('MasterSol.controller.layout.FooterController', {
        extend: 'Ext.app.Controller',
        init: function () {

        },

        tabchange: function (tab, panel) {
            if (panel.xtype == 'tree-config')
                MasterApp.login.getConfigure();
            if (panel.xtype == 'tree-options')
                MasterApp.login.getOptions();
        },

        clickAccessDirect: function (tree, record) {
            if (record.isLeaf()) {
                var controller = Ext.ComponentQuery.query('tree-options')[0].controller;
                controller.record.id = record.data.id;
                controller.record.nombre = record.data.text;
                controller.record.idsection = record.data.sectionId;
                // controller.obtenerProducto(record);
            } else {
                // MasterApp.util.showMessageInfo('Debe seleccionar una opción a último nivel');
            }
        }
        ,
        tabChangeMenu: function (tabPanel, newCard) {
            if (newCard.xtype == 'tree-opciones') {
                // MasterApp.getController('MasterSol.view.login.LoginController').obtenerOpciones();
            }
            if (newCard.xtype == 'tree-config') {
                //  MasterApp.getController('MasterSol.view.login.LoginController').obtenerAccesos();
            }
        }
        ,
        //seleccionar menu en el combo de busqueda de menu
        selectMenu: function (combo, record) {
            var controller = MasterApp.menu;
            controller.menu.id = record.data.id;
            controller.menu.idsection = record.data.sectionId;
            controller.menu.name = record.data.nombre;
            controller.getData(record);
            combo.reset();
        }
        ,
        //seleccionar menu en el combo de ventana expandiendo
        selectWindow: function (combo, record) {
            var panelmenu = Ext.ComponentQuery.query('#panel-menu')[0];
            var window = MasterApp.util.getMenuByName(record.data.name);
            var height = panelmenu.getHeight();
            var width = panelmenu.getWidth();
            window.setWidth(width);
            window.setHeight(height);
            window.setPosition(0, 38);
            window.toFront();
        }
        ,

        addWindow: function (menu) {
            var combo = Ext.ComponentQuery.query('#combowindow')[0];
            var store = combo.getStore();
            var count = store.getCount();
            var rec = new MasterSol.model.layout.WindowModel({
                id: menu.id,
                name: menu.name
            });
            store.insert(count, rec);
        }
        ,
        //borrar el menu del combo de ventana
        removeWindowCombo: function (window) {
            var combo = Ext.ComponentQuery.query('#combowindow')[0];
            var store = combo.getStore();
            var idx = store.findExact('id', window.idmenu);
            if (idx > -1) {
                store.removeAt(idx);
                combo.reset();
                Ext.ComponentQuery.query('#combomenu')[0].reset();
            }
        }
    }
)