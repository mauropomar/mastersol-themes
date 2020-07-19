Ext.define('MasterSol.store.layout.LanguageStore', {
    extend: 'Ext.data.Store',
    alias: 'store.store_language',
    model:'MasterSol.model.layout.LanguageModel',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'php/manager/getlanguages.php',
        reader: {
            type: 'json',
            rootProperty: ''
        }
    }
})