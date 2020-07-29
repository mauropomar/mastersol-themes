Ext.define('MasterSol.store.magnament.AuditStore', {
    extend: 'Ext.data.Store',
    alias: 'store.store-audit',
    model:'MasterSol.model.magnament.AuditModel',
    proxy: {
        type: 'ajax',
        url: 'php/manager/getauditorias.php',
        reader: {
            type: 'json',
            rootProperty: 'datos'
        }
    }
})