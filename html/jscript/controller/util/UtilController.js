Ext.define('MasterSol.controller.util.UtilController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },
    
    addButtonTools:function () {

    },

    getDataIndex: function (col) {
        return (col.fk == 1) ? col['n_fk'] : col.dataIndex;
    }




});