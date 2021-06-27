Ext.define('MasterSol.store.capsule.CapsuleExportStore', {
    extend: 'Ext.data.Store',
    alias: 'store.store_export_capsule',
    model:'MasterSol.model.capsule.CapsuleExportModel',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'app/capsules',
        reader: {
            type: 'json',
            rootProperty: 'datos'
        }
    }
});