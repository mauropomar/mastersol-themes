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
    idmenumag: null,
    idsectionmag: null,
    header: false,
    requires: [
        'MasterSol.view.magnament.Register',
        'MasterSol.view.magnament.Total',
        'MasterSol.view.magnament.Filter',
        'MasterSol.view.magnament.Attached',
        "MasterSol.view.magnament.Note",
        "MasterSol.view.magnament.Audit",
        "MasterSol.view.magnament.ConfigReport"
    ],
    items: [{
        xtype: 'register-view',
        id: 'register-view'
    }, {
        xtype: 'filter-view',
        id: 'filter-view'
    }, {
        xtype: 'total-view',
        id: 'total-view'
    }, {
        xtype: 'attached-view',
        id: 'attached-view'
    }, {
        xtype: 'note-view',
        id: 'note-view'
    }, {
        xtype: 'audit-view',
        id: 'audit-view'
    }, {
        xtype: 'config-report-view',
        hidden: true,
        id: 'config-report-view'
    }]
});