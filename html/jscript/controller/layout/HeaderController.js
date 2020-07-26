/**
 * @author mauro
 */
Ext.define('MasterSol.controller.layout.HeaderController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    hideWindowProductos: function () {
        var windows = Ext.ComponentQuery.query('window-producto');
        for (var j = 0; j < windows.length; j++) {
            windows[j].close();
            windows[j].destroy();
        }
    },

    enCascade: function () {
        MasterApp.globales.setEnCascade(true);
        var win;
        var windows = this.getWindows();
        var height = Ext.ComponentQuery.query('#panel_producto')[0].getHeight();
        var width = Ext.ComponentQuery.query('#panel_producto')[0].getWidth();
        var posX = Ext.ComponentQuery.query('#panel_producto')[0].getX();
        var posY = Ext.ComponentQuery.query('#panel_producto')[0].getY();
        this.reposicionarWindows(height, width, posX, posY);
        var height = height / windows.length;
        for (var j = 0; j < windows.length; j++) {
            win = windows[j];
            win.setX(posX);
            win.setY(posY);
            posY = height + posY;
            win.setHeight(height);
            win.setWidth(width);
            win.isminimize = false;
            var controller = win.getController();
            var btnMinimizar = controller.getBtnTools(win, 'btn_minimizar');
            btnMinimizar.show();
            var arrayBtn = ['btn_minimizar', 'btn_trash', 'btn_add', 'btn_refresh', 'btn_download', 'btn_print'];
            controller.setVisibleBtn(win, arrayBtn, false);
            var btnMaximizar = controller.getBtnTools(win, 'btn_restore');
            btnMaximizar.hide();
        }
    },

    getWindows: function () {
        var allwindows = Ext.ComponentQuery.query('window-producto');
        var windowsNotMinimize = Ext.ComponentQuery.query('window-producto[isminimize=false]');
        if (allwindows.length > 0 && windowsNotMinimize.length == 0) {
            //devuelve todas las ventanas
            return allwindows;
        }
        //devuelveme solo las maximizadas
        return windowsNotMinimize;
    },

    enMosaico: function () {
        MasterApp.globales.setEnMosaico(true);
        var win;
        var windows = this.getWindows();
        var height = Ext.ComponentQuery.query('#panel_producto')[0].getHeight();
        var width = Ext.ComponentQuery.query('#panel_producto')[0].getWidth();
        var posX = Ext.ComponentQuery.query('#panel_producto')[0].getX();
        var posY = Ext.ComponentQuery.query('#panel_producto')[0].getY();
        this.reposicionarWindows(height, width, posX, posY);
        var width = width / windows.length;
        for (var j = 0; j < windows.length; j++) {
            win = windows[j];
            win.setX(posX);
            win.setY(posY);
            posX = width + posX;
            win.setHeight(height);
            win.setWidth(width);
            win.isminimize = false;
            var controller = win.getController();
            var arrayBtn = ['btn_minimizar', 'btn_trash', 'btn_add', 'btn_refresh', 'btn_download', 'btn_print'];
            controller.setVisibleBtn(win, arrayBtn, false);
            var btnMaximizar = controller.getBtnTools(win, 'btn_restore');
            btnMaximizar.hide();
        }
    },
})