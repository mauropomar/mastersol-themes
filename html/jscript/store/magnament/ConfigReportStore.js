Ext.define('MasterSol.store.magnament.ConfigReportStore', {
    extend: 'Ext.data.Store',
    alias: 'store.store-config-report',
    model:'MasterSol.model.magnament.ConfigReportModel',
   // groupField: 'padre',
    sorters: [{
        property: 'orden',
        direction:'ASC'
    }],
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'app/filtersoperators',
        reader: {
            type: 'json',
            rootProperty: ''
        }
    }
});