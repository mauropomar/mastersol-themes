/**
 * @author mauro
 */
Ext.define('MasterSol.controller.menu.SectionController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    minimize:function(button, evt, toolEl, owner, tool){
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
        var arrayBtn = MasterApp.tools.getArrayBtn();
        MasterApp.tools.setVisibleBtn(window, arrayBtn, true);
        window.alignTo(panelMenu, 'bl-bl');
        this.setPositionWindow(window);
        this.adjustOtherWindowsMaximize();
    },

    closeWindow: function (window) {
        MasterApp.footer.removeWindowCombo(window);
        window.destroy();
        var windows = Ext.ComponentQuery.query('window-menu');
        if (windows.length == 0) {
            Ext.ComponentQuery.query('#btnEnMosaic')[0].setDisabled(true);
            Ext.ComponentQuery.query('#btnEnCascade')[0].setDisabled(true);
        }
      /*  this.collapseTabGestion();
        this.adjustOtherWindowsMinimize();
        this.adjustOtherWindowsMaximize();
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
                Ext.ComponentQuery.query('toolbarheader')[0].controller.enMosaico();
                return;
            }
            var isCascade = MasterApp.globales.isCascade();
            if (isCascade) {
                Ext.ComponentQuery.query('toolbarheader')[0].controller.enCascada();
            }
        }
    }
})