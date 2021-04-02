Ext.define('MasterSol.view.layout.Viewport', {
    extend: 'Ext.container.Viewport',
    xtype: 'MainView',
    //   controller: 'home',
    requires: [
        'Ext.layout.container.Border',
        'MasterSol.view.layout.Header',
        'MasterSol.view.layout.Footer',
        'MasterSol.controller.layout.HomeController',
        'MasterSol.view.layout.DataView',
        'MasterSol.view.magnament.TabPanel'
    ],
    layout: {
        type: 'border'
    },
    items: [{
        xtype: 'toolbar-header',
        id: 'header-panel',
        region: 'north'
    }, {
        xtype: 'panel',
        region: 'center',
        layout: 'border',
        items: [{
            id: 'panel-center',
            region: 'center',
            width: '70%',
            layout: 'fit',
            items: [{
                xtype: 'dataview-home'
            }]
        }, {
            xtype: 'tabmagnament',
            id: 'tabmagnament',
            region: 'east',
            collapsible: true,
            collapseMode: 'mini',
            hidden: true,
            resize:true,
            split:true,
            collapsed: true,
            width: '30%',
        }]
    }, {
        xtype: 'toolbar-footer',
        id: 'footer-panel',
        region: 'south'
    }]
});
