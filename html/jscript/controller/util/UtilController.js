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
    }




});