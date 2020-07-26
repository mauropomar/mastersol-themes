Ext.define('MasterSol.view.layout.TreeOptions', {
    extend: 'Ext.tree.Panel',
    xtype: 'tree-options',
    requires:['MasterSol.store.layout.TreeOptionStore', 'MasterSol.controller.layout.FooterController'],
    rootVisible: false,
    store: {
        type:'tree_option_store'
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
        itemclick: function(tree, record){
            MasterApp.option.select(record);
        },
        afterrender:function(tree){
            MasterApp.option.render(tree);
        },
        itemexpand:function(node){
            MasterApp.option.expandNode(node);
        }
    }
})