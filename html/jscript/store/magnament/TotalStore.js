Ext.define('MasterSol.store.magnament.TotalStore', {
    extend: 'Ext.data.Store',
    alias: 'store.store-total',
    //  groupField: 'padre',
    model:'MasterSol.model.magnament.TotalModel',
    sorters: [{
        property: 'orden',
        direction:'ASC'
    }],
    //   autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/manager/getfunctionsresume.php',
        reader: {
            type: 'json',
            rootProperty: ''
        }
    }
})