/**
 * @author mauro
 */
Ext.define('MasterSol.controller.menu.SectionController', {
    extend: 'Ext.app.Controller',
    init: function () {

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