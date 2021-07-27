Ext.define('Capsules.siembra.store.infiniteScroll.InfiniteStore', {
    extend: 'Ext.data.Store',
    alias: 'store.store_infinite_scroll',
    autoLoad:true,
    model: 'Capsules.siembra.model.infiniteScroll.InfiniteModel',
    remoteSort: true,
    pageSize: 100,
    proxy: {
        type: 'jsonp',
        url: 'http://www.sencha.com/forum/remote_topics/index.php',
        reader: {
            rootProperty: 'topics',
            totalProperty: 'totalCount'
        },
        simpleSortMode: true
    },
    sorters: [{
        property: 'lastpost',
        direction: 'DESC'
    }],
});