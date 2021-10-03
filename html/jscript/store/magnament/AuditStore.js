Ext.define('MasterSol.store.magnament.AuditStore', {
    extend: 'Ext.data.Store',
    alias: 'store.store-audit',
    model:'MasterSol.model.magnament.AuditModel',
    sorters: [{
        property: 'fecha',
        direction: 'DESC'
    }],
    proxy: {
        type: 'ajax',
        url: 'app/auditorias',
        reader: {
            type: 'json',
            rootProperty: 'datos'
        }
    }
})