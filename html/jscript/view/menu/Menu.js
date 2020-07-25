/**
 * This class is the layout view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('MasterSol.view.menu.Menu', {
    extend: 'Ext.panel.Panel',
    xtype: 'menu_view',
    requires: [
        'Ext.layout.container.Border',
        'MasterSol.view.layout.DataView',
       // 'MasterSol.view.gestion.TabPanel',
    ],
    layout: {
        type: 'border'
    },
    defaults: {
        split: true
    },
    items: [{
        xtype: 'panel',
        region: 'center',
        id: 'panel-menu',
        width: '70%',
        layout: 'fit',
        items: [{
            xtype: 'dataview-home'
        }]
    }, {
        xtype:'panel',
        region: 'east',
        collapsible: true,
        collapseMode: 'mini',
        hidden: true,
        collapsed: true,
        width: '30%',
    }]
});