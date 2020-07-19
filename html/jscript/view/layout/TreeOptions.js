Ext.define('MasterSol.view.layout.TreeOptions', {
    extend: 'Ext.tree.Panel',
    controller: 'footer',
    xtype: 'tree-options',
    requires:['MasterSol.store.layout.TreeOptionStore', 'MasterSol.view.layout.FooterController'],
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
  /*  listeners: {
        itemclick: 'itemclick',
        afterrender:'renderTreeOpciones',
        itemexpand:'itemexpand'
    }*/
})