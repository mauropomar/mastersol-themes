Ext.define('MasterSol.store.magnament.FilterStore', {
    extend: 'Ext.data.Store',
    alias: 'store.store-filter',
    groupField: 'padre',
    model:'MasterSol.model.magnament.FilterModel',
    sorters: [{
        property: 'orden',
        direction:'ASC'
    }],
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'php/manager/getFiltersOperators.php',
        reader: {
            type: 'json',
            rootProperty: ''
        }
    }
});