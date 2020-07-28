Ext.define('MasterSol.store.magnament.FunctionStore', {
    extend: 'Ext.data.Store',
    alias: 'store.store-function',
    model:'MasterSol.model.magnament.FunctionModel',
    sorters: [{
        property: 'orden',
        direction:'DESC'
    }],
    proxy: {
        type: 'ajax',
        url: 'php/manager/getfunctionsresume.php',
        reader: {
            type: 'json',
            rootProperty: ''
        }
    }
})