Ext.define('MasterSol.store.layout.RolStore', {
    extend: 'Ext.data.Store',
    alias: 'store.store_rol',
    model:'MasterSol.model.layout.RolModel',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'app/roles',
        reader: {
            type: 'json',
            rootProperty: ''
        }
    }
})