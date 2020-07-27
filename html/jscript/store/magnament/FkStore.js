Ext.define('MasterSol.store.magnament.FkStore', {
    extend: 'Ext.data.Store',
    alias: 'store.store-fK',
    model:'MasterSol.model.magnament.FkModel',
    sorters: [{
        property: 'orden',
        direction:'DESC'
    }]
})