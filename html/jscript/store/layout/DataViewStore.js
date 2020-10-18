Ext.define('MasterSol.store.layout.DataViewStore', {
    extend: 'Ext.data.Store',
    alias: 'store.store_dataview_home',
    model: 'MasterSol.model.layout.DataViewModel',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'app/shortcut',
        reader: {
            type: 'json',
            rootProperty: ''
        }
    }
})