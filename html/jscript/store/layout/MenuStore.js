Ext.define('MasterSol.store.layout.MenuStore', {
    extend: 'Ext.data.Store',
    alias: 'store.store_menu',
    model:'MasterSol.model.layout.MenuModel',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'app/filtermenus',
        reader: {
            type: 'json',
            rootProperty: ''
        }
    }
})