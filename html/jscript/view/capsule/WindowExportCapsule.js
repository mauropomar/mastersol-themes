/**
 * Demonstrates a basic window control.
 */
Ext.define('MasterSol.view.capsule.WindowExportCapsule', {
    extend: 'Ext.window.Window',
    xtype: 'window-export-capsule',
    closable: true,
    closeAction: 'destroy',
    height: 300,
    width: 600,
    title: 'Exportar',
    layout: 'fit',
    autoShow: true,
    requires: [
        'MasterSol.store.capsule.CapsuleExportStore'
    ],
    items: [{
        xtype: 'gridpanel',
        tbar: [{
            xtype: 'tbtext',
            text: 'Nombre:'
        }, {
            xtype: 'textfield',
            id: 'field_name_export',
            width: '50%',
            allowBlank: false
        }],
        store: {
            type: 'store_export_capsule'
        },
        columns: [{
            text: 'Nombre',
            sortable: false,
            dataIndex: 'name',
            flex: 1
        }],
        viewConfig: {},
    }],
    buttons: [{
        text: 'Exportar',
        iconCls: 'fa fa-save'
        //   handler: 'firstFormSave'
    }, {
        text: 'Cancelar',
        iconCls: 'fa fa-close'
        //   handler: 'firstFormSave'
    }]
});
