/**
 * Demonstrates a basic window control.
 */
Ext.define('MasterSol.view.database.WindowRestoreDatabase', {
    extend: 'Ext.window.Window',
    xtype: 'window-restore-database',
    closable: true,
    closeAction: 'destroy',
    height: 300,
    width: 600,
    title: 'Restaurar base de datos',
    layout: 'border',
    autoShow: true,
    items: [{
        xtype: 'form',
        layout: 'fit',
        region:'north',
        frame:true,
        bodyPadding: 10,
        labelAlign:'top',
        items: [{
            xtype: 'filefield',
            emptyText: 'Seleccione la base de datos a importar..',
            fieldLabel: 'Fichero',
            name: 'file_database',
            id:'file_database',
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
            id:'display_proccess_restore_database'
        }]
    }],
    buttons: [{
        text: 'Restaurar',
        id: 'btn_execute_restore_database',
        iconCls: 'fa fa-save',
        handler: function () {
            MasterApp.getController('MasterSol.controller.database.DatabaseRestoreController').import();
        }
    }, {
        text: 'Cancelar',
        iconCls: 'fa fa-close',
        id: 'btn_cancel_restore_database',
        handler: function () {
            MasterApp.getController('MasterSol.controller.database.DatabaseRestoreController').cancel();
        }
    }]
});