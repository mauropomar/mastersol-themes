Ext.define('MasterSol.controller.capsule.CapsuleExportController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    showWindow: function () {
        Ext.create('MasterSol.view.capsule.WindowExportCapsule', {
            id: 'window_export_capsule'
        });
        Ext.ComponentQuery.query('#field_name_export')[0].focus('');
        this.setNameFile('CapsuleX');
    },

    setNameFile: function (nameCapsule) {
        var date = Ext.Date.format(new Date(), 'Ymdhis');
        var name = nameCapsule + '_' + date;
        Ext.ComponentQuery.query('#field_name_export')[0].setValue(name);
    }
});