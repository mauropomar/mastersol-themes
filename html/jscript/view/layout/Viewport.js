Ext.define('MasterSol.view.layout.Viewport', {
    extend: 'Ext.container.Viewport',
    xtype: 'MainView',
   // controller: 'home',
    requires: [
        'Ext.layout.container.Border',
        'MasterSol.view.layout.Header',
        'MasterSol.view.layout.Footer'
    ],
    layout: {
        type: 'border'
    },
    items: [{
        xtype: 'toolbarheader',
        id: 'header-panel',
        region: 'north'
    }, {
        xtype: 'panel',
        region: 'center',
        id: 'center-panel',
    }, {
        xtype: 'toolbarfooter',
        id: 'footer-panel',
        region: 'south'
    }]
});
