/**
 * Demonstrates a basic window control.
 */
Ext.define('MasterSol.view.capsule.WindowExportCapsule', {
    extend: 'Ext.window.Window',
    xtype: 'window-export-capsule',
    closable: false,
    closeAction: 'destroy',
    height: 300,
    width: 600,
    title: 'Exportar capsula',
    layout: 'fit',
    autoShow: true,
    requires: [
        'MasterSol.store.capsule.CapsuleExportStore'
    ],
    items: [{
        xtype: 'gridpanel',
        id: 'grid_list_capsules',
      /*  tbar: [{
            xtype: 'tbtext',
            text: 'Nombre:'
        }, {
            xtype: 'textfield',
            id: 'field_name_export',
            width: '50%',
            allowBlank: false
        }],*/
        store: {
            type: 'store_export_capsule'
        },
        columns: [{
            text: 'Nombre',
            sortable: false,
            dataIndex: 'namex',
            flex: 1
        }, {
            text: 'Descripción',
            sortable: false,
            dataIndex: 'description',
            flex: 2
        }],
        viewConfig: {},
    }],
    buttons: [{
        text: 'Exportar',
        id: 'btn_exportar_capsule',
        disabled: true,
        iconCls: 'fa fa-save',
        handler: function () {
            MasterApp.getController('MasterSol.controller.capsule.CapsuleExportController').export();
        }
    }, {
        text: 'Cancelar',
        iconCls: 'fa fa-close',
        id: 'btn_cancelar_capsule',
        handler: function () {
           MasterApp.getController('MasterSol.controller.capsule.CapsuleExportController').cancel();
        }
    }]
});
