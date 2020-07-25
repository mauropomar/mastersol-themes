Ext.define('MasterSol.view.layout.Viewport', {
    extend: 'Ext.container.Viewport',
    xtype: 'MainView',
 //   controller: 'home',
    requires: [
        'Ext.layout.container.Border',
        'MasterSol.view.layout.Header',
        'MasterSol.view.layout.Footer',
        'MasterSol.controller.layout.HomeController',
        'MasterSol.view.layout.DataView'
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
        id: 'panel-center',
        layout: 'fit',
        items: [{
            xtype: 'dataview-home'
        }]
    }, {
        xtype: 'toolbar-footer',
        id: 'footer-panel',
        region: 'south'
    }]
});
