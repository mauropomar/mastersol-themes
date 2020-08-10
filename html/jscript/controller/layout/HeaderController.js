/**
 * @author mauro
 */
Ext.define('MasterSol.controller.layout.HeaderController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    goHome: function () {
        this.hideAllWindowsMenu();
        Ext.ComponentQuery.query('#panel-center')[0].removeAll();
        Ext.ComponentQuery.query('#panel-center')[0].add(Ext.create('MasterSol.view.layout.DataView'));
        Ext.ComponentQuery.query('#combomenu')[0].reset();
        Ext.ComponentQuery.query('#combowindow')[0].getStore().removeAll();
    },

    hideAllWindowsMenu: function () {
        var windows = Ext.ComponentQuery.query('window-menu');
        for (var j = 0; j < windows.length; j++) {
            windows[j].close();
            windows[j].destroy();
        }
    },

    applyCascade: function () {
        var win;
        MasterApp.globals.setEnCascade(true);
        var windows = this.getWindows();
        var height = Ext.ComponentQuery.query('#panel-menu')[0].getHeight();
        var width = Ext.ComponentQuery.query('#panel-menu')[0].getWidth();
        var posX = Ext.ComponentQuery.query('#panel-menu')[0].getX();
        var posY = Ext.ComponentQuery.query('#panel-menu')[0].getY();
        this.reconfigureWindows(height, width, posX, posY);
        var height = height / windows.length;
        for (var j = 0; j < windows.length; j++) {
            win = windows[j];
            win.setX(posX);
            win.setY(posY);
            posY = height + posY;
            win.setHeight(height);
            win.setWidth(width);
            win.isminimize = false;
            var btnMinimize = MasterApp.tools.getBtnTools(win, 'btn_minimize');
            btnMinimize.show();
            var arrayBtn = ['btn_minimize', 'btn_trash', 'btn_add', 'btn_refresh', 'btn_download', 'btn_print'];
            MasterApp.tools.setVisibleBtn(win, arrayBtn, false);
            var btnMaximize = MasterApp.tools.getBtnTools(win, 'btn_restore');
            btnMaximize.hide();
        }
    },

    applyMosaic: function () {
        var win;
        MasterApp.globals.setEnMosaic(true);
        var windows = this.getWindows();
        var height = Ext.ComponentQuery.query('#panel-menu')[0].getHeight();
        var width = Ext.ComponentQuery.query('#panel-menu')[0].getWidth();
        var posX = Ext.ComponentQuery.query('#panel-menu')[0].getX();
        var posY = Ext.ComponentQuery.query('#panel-menu')[0].getY();
        this.reconfigureWindows(height, width, posX, posY);
        var width = width / windows.length;
        for (var j = 0; j < windows.length; j++) {
            win = windows[j];
            win.setHeight(height);
            win.setWidth(width);
            win.setX(posX);
            win.setY(posY);
            posX = width + posX;
            win.isminimize = false;
            var arrayBtn = ['btn_minimize', 'btn_trash', 'btn_add', 'btn_refresh', 'btn_download', 'btn_print'];
            MasterApp.tools.setVisibleBtn(win, arrayBtn, false);
            var btnMaximize = MasterApp.tools.getBtnTools(win, 'btn_restore');
            btnMaximize.hide();
        }
    },

    getWindows: function () {
        var allwindows = Ext.ComponentQuery.query('window-menu');
        var windowsNotMinimize = Ext.ComponentQuery.query('window-menu[isminimize=false]');
        if (allwindows.length > 0 && windowsNotMinimize.length == 0) {
            //devuelve todas las ventanas
            return allwindows;
        }
        //devuelveme solo las maximizadas
        return windowsNotMinimize;
    },

    reconfigureWindows: function (height, width, posX, posY) {
        var windows = this.getWindows();
        for (var j = 0; j < windows.length; j++) {
            windows[j].setX(posX);
            windows[j].setY(posY);
            windows[j].setHeight(height);
            windows[j].setWidth(width);
            windows[j].expand('', false);
            var btn = MasterApp.tools.getBtnTools(windows[j], 'btn_restore');
            btn.show();
        }
    },

    logout: function () {
        var viewport = Ext.ComponentQuery.query('viewport')[0];
        var Mask = new Ext.LoadMask(viewport, {
            msg: 'Cerrando sesi&oacute;n...'
        });
        Mask.show();
        var close = {
            url: 'php/logout.php',
            method: 'POST',
            scope: this,
            callback: function (options, success, response) {
                Mask.hide();
                location.href = 'index.html';
            }
        };
        Ext.Ajax.request(close);
    },

    showAlerts: function () {
        var panel = Ext.ComponentQuery.query('viewport')[0];
        var mask = new Ext.LoadMask(panel, {
            msg: 'Cargando...'
        });
        mask.show();
        MasterApp.globals.moveColumns = false;
        var alert = {
            url: 'php/manager/getsections.php',
            method: 'POST',
            scope: this,
            params: {
                sectionId: '3a7c9ace-c91b-4a9a-adb5-71f372318a68',
                alerta_user: true
            },
            success: function (response) {
                mask.hide();
                var json = Ext.JSON.decode(response.responseText);
                var controller = MasterApp.menu;
                controller.menu.id = json[0].id;
                controller.menu.idsection = json[0].id;
                controller.menu.name = json[0].nombre;
                controller.json = json;
                controller.showMenu(json, true);
          //      Ext.ComponentQuery.query('#register-view')[0].hide();
            },
            failure: function (response) {
                mask.hide();
            }
        };
        Ext.Ajax.request(alert);
    },
})