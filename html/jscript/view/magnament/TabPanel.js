/**
 * This class is the layout view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('MasterSol.view.magnament.TabPanel', {
    extend: 'Ext.tab.Panel',
    xtype: 'tabmagnament',
    idmenu:null,
    header:false,
    requires: ['MasterSol.view.magnament.Register',
        /*'MasterSol.view.gestion.FilterView',
        'MasterSol.view.gestion.TotalView',
        'MasterSol.view.gestion.AdjuntoView',
        "MasterSol.view.gestion.NotasView",
        "MasterSol.view.gestion.AuditoriaView"*/],
    items:[{
        xtype:'register-view',
        id:'register-view'
    },/*{
        xtype:'filter-view',
        id:'filter-view'
    },{
        xtype:'total-view',
        id:'total-view'
    },{
        xtype:'adjunto-view',
        id:'adjunto-view'
    },{
        xtype:'notas-view',
        id:'notas-view'
    },{
        xtype:'auditoria-view',
        id:'auditoria-view'
    }*/]
});