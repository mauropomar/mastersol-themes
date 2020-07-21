Ext.define('MasterSol.store.layout.DataViewStore', {
    extend: 'Ext.data.Store',
    alias: 'store.store_dataview_home',
    model: 'MasterSol.model.layout.DataViewModel',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/manager/getshortcut.php',
        reader: {
            type: 'json',
            rootProperty: ''
        }
    }
})