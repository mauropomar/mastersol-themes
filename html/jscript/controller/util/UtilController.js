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

    resizeWindow: function (window, panel) {
        var height = panel.getHeight();
        var width = panel.getWidth();
        window.setWidth(width);
        window.setHeight(height);
        window.show();
        var x = panel.getX();
        var y = panel.getY();
        window.setPosition(x, y);
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
    },

    getFilterBySection: function () {
        var idsection = this.getIdSectionActive();
        var gridSection = MasterApp.globals.getGridSection();
        var window = gridSection.up('window');
        var arrayFilter = MasterApp.globals.getArrayFilter();
        var filters = [];
        for (var j = 0; j < arrayFilter.length; j++) {
            if (arrayFilter[j]['idmenu'] == window.idmenu) {
                var register = arrayFilter[j]['register'];
                for (var i = 0; i < register.length; i++) {
                    if (register[i]['id'] == idsection) {
                        var array = register[i]['filter'];
                        for (var h = 0; h < array.length; h++) {
                            if (array[h]['idoperator'] != null) {
                                filters.push(array[h]);
                            }
                        }
                        break;
                    }
                }
            }
        }
        return Ext.encode(filters);
    },

    getIdSectionActive: function () {
        var id;
        var gridSection = MasterApp.globals.getGridSection();
        if (gridSection.name == 'grid-section') {
            var panel = gridSection.up('panel');
            id = panel.idsection;
        } else {
            id = gridSection.up('window').idsection;
        }
        return id;
    },




});