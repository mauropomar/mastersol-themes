Ext.define('MasterSol.store.magnament.PropertyStore', {
    extend: 'Ext.data.Store',
    alias: 'store.store-property',
    model:'MasterSol.model.magnament.PropertyModel',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'app/getproperties',
        reader: {
            type: 'json',
            rootProperty: ''
        }
    }
})