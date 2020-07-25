Ext.define('MasterSol.view.layout.TreeConfig', {
    extend: 'Ext.tree.Panel',
    xtype: 'tree-config',
    rootVisible: false,
    requires:['MasterSol.store.layout.TreeConfigStore', 'MasterSol.controller.layout.FooterController'],
    store: {
        type:'tree_config_store'
    },
    viewConfig: {
        plugins: {
            ptype: 'treeviewdragdrop',
            ddGroup: 'two-tree-dataview',
            appendOnly: false,
            sortOnDrop: true,
            containerScroll: true
        }
    },
    listeners: {
        itemclick: 'clickAccessDirect'
    }
})