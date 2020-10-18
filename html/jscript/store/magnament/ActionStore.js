Ext.define('MasterSol.store.magnament.ActionStore', {
    extend: 'Ext.data.Store',
    alias: 'store.store-action',
    fields:['id', 'nombre'],
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'app/actions',
        reader: {
            type: 'json',
            rootProperty: ''
        }
    }
})