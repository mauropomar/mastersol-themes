/**
 * Demonstrates a basic window control.
 */
Ext.define('MasterSol.view.database.WindowSaveDatabase', {
    extend: 'Ext.window.Window',
    xtype: 'window-save-database',
    closable: false,
    closeAction: 'destroy',
    height: 300,
    width: 600,
    title: 'Salvar Base de Datos',
    layout: 'fit',
    autoShow: true,
    tbar: [{
        xtype: 'tbtext',
        text: 'Nombre:'
    }, {
        xtype: 'textfield',
        id: 'field_name_save_database',
        width: '50%',
        allowBlank: false
    }],
    requires: [
       // 'MasterSol.store.capsule.CapsuleExportStore'
    ],
    items: [{
        xtype:'form',
        items:[{
            xtype: 'displayfield',
            id: 'display_process_save_database'
        }]
    }],
    buttons: [{
        text: 'Salvar',
        id: 'btn_save_database',
        iconCls: 'fa fa-save',
        handler: function () {
            MasterApp.getController('MasterSol.controller.database.DatabaseSaveController').save();
        }
    }, {
        text: 'Cancelar',
        iconCls: 'fa fa-close',
        id: 'btn_cancelar_save_database',
        handler: function () {
            MasterApp.getController('MasterSol.controller.database.DatabaseSaveController').cancel();
        }
    }]
});