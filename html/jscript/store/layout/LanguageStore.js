Ext.define('MasterSol.store.layout.LanguageStore', {
    extend: 'Ext.data.Store',
    alias: 'store.store_language',
    model:'MasterSol.model.layout.LanguageModel',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'app/languages',
        reader: {
            type: 'json',
            rootProperty: ''
        }
    }
})