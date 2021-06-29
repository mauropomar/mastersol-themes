Ext.define('MasterSol.controller.capsule.CapsuleImportController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    showWindow: function () {
        Ext.create('MasterSol.view.capsule.WindowImportCapsule', {
            id: 'window_import_capsule'
        });
    },

    import:function(){

    },

    cancel:function(){

    }

});