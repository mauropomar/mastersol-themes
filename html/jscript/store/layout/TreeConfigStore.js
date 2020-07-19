Ext.define('MasterSol.store.layout.TreeConfigStore', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.tree_config_store',
    nodeParam:'id',
    fields: [
        'id', 'text', 'leaf'
    ],
    autoLoad:false,
    root: {
        text: 'Opciones',
        expanded: true
    },
    folderSort: true,
    sorters: [{
        property: 'text',
        direction: 'ASC'
    }]
});