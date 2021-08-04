/**
 * Demonstrates a basic window control.
 */
Ext.define('MasterSol.view.capsule.WindowImportCapsule', {
    extend: 'Ext.window.Window',
    xtype: 'window-import-capsule',
    closable: true,
    floated:true,
    closeAction: 'destroy',
    height: 300,
    width: 600,
    title: 'Importar Capsula',
    layout: 'border',
    autoShow: true,
    requires: [
        'MasterSol.store.capsule.CapsuleExportStore'
    ],
    items: [{
        xtype: 'form',
        layout: 'fit',
        region:'north',
        frame:true,
        bodyPadding: 10,
        labelAlign:'top',
        items: [{
            xtype: 'filefield',
            emptyText: 'Seleccione la capsula a importar..',
            fieldLabel: 'Fichero',
            name: 'file_capsule',
            id:'file_capsule',
            flex:2,
            buttonConfig: {
                text: '',
                iconCls: 'fa fa-file-text'
            }
        }]
    },{
        xtype: 'form',
        layout: 'fit',
        region:'center',
        bodyPadding: 10,
        labelAlign:'top',
        items: [{
            xtype:'displayfield',
            id:'display_proccess_import_capsule'
        }]
    }],
    buttons: [{
        text: 'Importar',
        id: 'btn_execute_importar_capsule',
        iconCls: 'fa fa-save',
        handler: function () {
            MasterApp.getController('MasterSol.controller.capsule.CapsuleImportController').import();
        }
    }, {
        text: 'Cancelar',
        iconCls: 'fa fa-close',
        id: 'btn_cancelar_import_capsule',
        handler: function () {
            MasterApp.getController('MasterSol.controller.capsule.CapsuleImportController').cancel();
        }
    }]
});