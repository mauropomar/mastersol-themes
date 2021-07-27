Ext.define('Capsules.siembra.store.infiniteScroll.InfiniteStore', {
    extend: 'Ext.data.Store',
    alias: 'store.store_infinite_scroll',
    autoLoad:true,
    model: 'Capsules.siembra.model.infiniteScroll.InfiniteModel',
    remoteSort: true,
    pageSize: 100,
    proxy: {
        type: 'ajax',
        url: 'http://localhost:3001/dev/localization/countries/get?page=0&start=0&limit=20',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total'
        },
        simpleSortMode: true
    },
    sorters: [{
        property: 'name',
        direction: 'ASC'
    }],
});