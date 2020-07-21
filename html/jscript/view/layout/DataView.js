/**
 * This example shows using multiple sorters on a Store attached to a DataView.
 *
 * We're also using the reorderable toolbar plugin to make it easy to reorder the sorters
 * with drag and drop. To change the sort order, just drag and drop the "Type" or "Name"
 * field.
 */
Ext.define('MasterSol.view.layout.DataView', {
    extend: 'Ext.panel.Panel',
    autoScroll: true,
    xtype: 'dataview-home',
    overflowY: 'auto',
    layout: 'fit',
    requires: [
        'MasterSol.store.layout.DataViewStore'
    ],
    items: {
        xtype: 'dataview',
        reference: 'dataview',
        name: 'principal',
        itemSelector: 'div.x-central-principal',
        trackOver: false,
        tpl: Ext.create('Ext.XTemplate',
            '<tpl for=".">',
            '<div class="x-central-principal">',
            '<div class="x-image-principal">',
            '<img style="width:90px;height:90px" src="{icon}" />',
            '</div>',
            '<div class="x-body-principal">',
            '<span class="principal-name center-text">{nombre}</span>',
            '</div>',
            '</div>',
            '</tpl>'
        ),
        store: {
            type: 'store_dataview_home'
        },
       /* listeners: {
            itemmouseenter: function (view, item) {
                MasterApp.global.setOptionSelect(item);
            },
            afterrender: 'renderDataView',
            itemcontextmenu: 'showContextMenuDataview',
            itemclick: 'selectAccess'
        }*/
    }
});