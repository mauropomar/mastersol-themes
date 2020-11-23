/**
 * This example shows using multiple sorters on a Store attached to a DataView.
 *
 * We're also using the reorderable toolbar plugin to make it easy to reorder the sorters
 * with drag and drop. To change the sort order, just drag and drop the "Type" or "Name"
 * field.
 */
Ext.define('MasterSol.view.layout.DataView', {
    extend: 'Ext.panel.Panel',
    xtype: 'dataview-home',
    overflowY: 'auto',
    layout: 'fit',
    requires: [
        'MasterSol.store.layout.DataViewStore',
        'MasterSol.controller.menu.MenuController'
    ],
    items: {
        xtype: 'dataview',
        reference: 'dataview',
        name: 'principal',
        itemSelector: 'div.x-center-principal',
        trackOver: false,
        viewConfig: {
            loadMask: false,
            loadingText: 'Cargando...'
        },
        tpl: Ext.create('Ext.XTemplate',
            '<tpl for=".">',
            '<div class="x-center-principal">',
            '<div class="x-image-principal">',
            '<img style="width:90px;height:90px" src="{icon}" />',
            '</div>',
            '<div class="x-body-principal">',
            '<span class="principal-name center-text" style="color: black;font-size: 13px">{nombre}</span>',
            '</div>',
            '</div>',
            '</tpl>'
        ),
        store: {
            type: 'store_dataview_home'
        },
        listeners: {
            scope:this,
            itemmouseenter: function (view, item) {
              //  MasterApp.global.setOptionSelect(item);
            },
            afterrender: function(view){
                 MasterApp.getController('MasterSol.controller.layout.HomeController').renderDataView(view);
            },
            itemcontextmenu: function(view, rec, node, index, e){
                MasterApp.getController('MasterSol.controller.layout.HomeController').showContextMenuDataview(view, rec, node, index, e);
            },
            itemclick: function(view, rec, node, index, e){
                MasterApp.menu.select(view, rec);
            },
        }
    }
});