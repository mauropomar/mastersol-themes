Ext.define('MasterSol.controller.layout.FooterController', {
        extend: 'Ext.app.Controller',
        init: function () {

        },

        expandMenu: function () {
            Ext.ComponentQuery.query('menu-panel')[0].setActiveTab(0);
            MasterApp.option.getOptions();
        },

        tabchange: function (tab, panel) {
            if (panel.xtype == 'form-user')
                MasterApp.user.loadFields();
            if (panel.xtype == 'tree-config')
                MasterApp.config.getConfigure();
            if (panel.xtype == 'tree-options')
                MasterApp.option.getOptions();
        },

        clickAccessDirect: function (tree, record) {
            if (record.isLeaf()) {
                var controller = Ext.ComponentQuery.query('tree-options')[0].controller;
                controller.record.id = record.data.id;
                controller.record.nombre = record.data.text;
                controller.record.idsection = record.data.sectionId;
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
            var panelmenu = Ext.ComponentQuery.query('#panel-center')[0];
            var window = MasterApp.util.getMenuByName(record.data.name);
            var height = panelmenu.getHeight();
            var width = panelmenu.getWidth();
            var arrayBtn = ['btn_minimize', 'btn_trash', 'btn_add', 'btn_refresh', 'btn_download', 'btn_print', 'btn_export_capsule', 'btn_import_capsula', 'btn_save_bd', 'btn_restore_bd', 'btn_report'];
            MasterApp.tools.setVisibleBtn(window, arrayBtn, false);
            var btn = MasterApp.tools.getBtnTools(window, 'btn_restore');
            btn.hide();
            window.setWidth(width);
            window.setHeight(height);
            window.expand('', false);
            window.isminimize = false;
            window.setPosition(0, 38);
            window.toFront();
            var panel = window.down('panel');
            var grid = panel.down('gridpanel');
            MasterApp.globals.setGridSection(grid);
            MasterApp.util.setStyleWindow(panel);
            MasterApp.magnament.setActiveTabDefault(window);
            combo.reset();
        },

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