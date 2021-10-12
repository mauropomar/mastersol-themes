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
        id: 'register-view',
        tabConfig: {
            tooltip: 'Registros (F2)'
        }
    }, {
        xtype: 'filter-view',
        id: 'filter-view',
        tabConfig: {
            tooltip: 'Filtros (F3)'
        }
    }, {
        xtype: 'total-view',
        id: 'total-view',
        tabConfig: {
            tooltip: 'Totales (F4)'
        }
    }, {
        xtype: 'attached-view',
        id: 'attached-view',
        tabConfig: {
            tooltip: 'Adjuntos (F5)'
        }
    }, {
        xtype: 'note-view',
        id: 'note-view',
        tabConfig: {
            tooltip: 'Notas (F6)'
        }
    }, {
        xtype: 'audit-view',
        id: 'audit-view',
        layout: 'fit',
        tabConfig: {
            tooltip: 'Auditoría (F7)'
        }
    }, {
        xtype: 'config-report-view',
        hidden: true,
        id: 'config-report-view'
    }]
});