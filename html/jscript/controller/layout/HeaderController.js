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
        MasterApp.globals.setEnCascade(true);
        var win;
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
            var arrayBtn = MasterApp.tools.getArrayBtn();
            MasterApp.tools.setVisibleBtn(win, arrayBtn, false);
            var btnMaximize = MasterApp.tools.getBtnTools(win, 'btn_restore');
            btnMaximize.hide();
        }
    },

    applyMosaic: function () {
        MasterApp.globals.setEnMosaic(true);
        var win;
        var windows = this.getWindows();
        var height = Ext.ComponentQuery.query('#panel-center')[0].getHeight();
        var width = Ext.ComponentQuery.query('#panel-center')[0].getWidth();
        var posX = Ext.ComponentQuery.query('#panel-center')[0].getX();
        var posY = Ext.ComponentQuery.query('#panel-center')[0].getY();
        this.reconfigureWindows(height, width, posX, posY);
        var width = width / windows.length;
        for (var j = 0; j < windows.length; j++) {
            win = windows[j];
            win.setX(posX);
            win.setY(posY);
            posX = width + posX;
            win.setHeight(height);
            win.setWidth(width);
            win.isminimize = false;
            var arrayBtn = MasterApp.tools.getArrayBtn();
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
    }
})