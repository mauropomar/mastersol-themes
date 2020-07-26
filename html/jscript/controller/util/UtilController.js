Ext.define('MasterSol.controller.util.UtilController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    getDataIndex: function (col) {
        return (col.fk == 1) ? col['n_fk'] : col.dataIndex;
    },

    getMenuByName:function(name){
        var windows = Ext.ComponentQuery.query('window[name=window-menu]');
        for (var j = 0; j < windows.length; j++) {
            if (windows[j].getTitle() == name) {
                return windows[j];
            }
        }
    },

    setWindowSize:function(window){
        var height = Ext.ComponentQuery.query('#panel-menu')[0].getHeight();
        var width = Ext.ComponentQuery.query('#panel-menu')[0].getWidth();
        var posX = Ext.ComponentQuery.query('#panel-menu')[0].getX();
        var posY = Ext.ComponentQuery.query('#panel-menu')[0].getY();
        window.setX(posX);
        window.setY(posY);
        posX = width + posX;
        window.setHeight(height);
        window.setWidth(width);
        window.expand('', false);
        window.isminimize = false;
        var arrayBtn = MasterApp.tools.getArrayBtn();
        MasterApp.tools.setVisibleBtn(window, arrayBtn, false);
        var btnMaximize = MasterApp.tools.getBtnTools(window, 'btn_restore');
        btnMaximize.hide();
    }




});