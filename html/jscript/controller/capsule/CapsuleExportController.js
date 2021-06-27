Ext.define('MasterSol.controller.capsule.CapsuleExportController', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            '#grid_list_capsules': { // matches the view itself
                itemclick:'clickCapsule'
            }
        });
    },

    showWindow: function () {
        Ext.create('MasterSol.view.capsule.WindowExportCapsule', {
            id: 'window_export_capsule'
        });
        Ext.ComponentQuery.query('#field_name_export')[0].focus('');
     //   this.setNameFile('CapsuleX');
    },

    setNameFile: function (nameCapsule) {
        var date = Ext.Date.format(new Date(), 'Ymdhis');
        var name = nameCapsule + '_' + date;
        Ext.ComponentQuery.query('#field_name_export')[0].setValue(name);
    },

    clickCapsule:function(grid, record){
        var name = record.data.namex;
        this.setNameFile(name);
        Ext.ComponentQuery.query('#btn_exportar_capsule')[0].setDisabled(false);
    },

    export:function(){

    },

    cancel:function(){
        Ext.ComponentQuery.query('window-export-capsule')[0].close();
    }
});