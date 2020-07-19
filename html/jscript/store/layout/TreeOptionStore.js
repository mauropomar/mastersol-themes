/**
 * @author cplus JSCode-Generator 1.0.0
 */
Ext.define('MasterSol.store.layout.TreeOptionStore', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.tree_option_store',
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