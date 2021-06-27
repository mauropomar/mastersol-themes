Ext.define('MasterSol.store.capsule.CapsuleExportStore', {
    extend: 'Ext.data.Store',
    alias: 'store.store_export_capsule',
    model:'MasterSol.model.capsule.CapsuleExportModel',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'app/languages',
        reader: {
            type: 'json',
            rootProperty: ''
        }
    }
});