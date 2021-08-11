/**
 * Demonstrates a basic window control.
 */
Ext.define('MasterSol.view.import.WindowImportCsv', {
    extend: 'Ext.window.Window',
    xtype: 'window-import-csv',
    closable: true,
    closeAction: 'destroy',
    floated:true,
    height: 115,
    width: 600,
    title: 'Importar CSV',
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
            emptyText: 'Seleccione...',
            fieldLabel: 'Fichero',
            name: 'file_csv',
            id:'file_csv',
            flex:2,
            buttonConfig: {
                text: '',
                iconCls: 'fa fa-file-zip-o'
            }
        }]
    }],
    buttons: [{
        text: 'Importar',
        id: 'btn_execute_import_csv',
        iconCls: 'fa fa-file-zip-o',
        handler: function () {
            MasterApp.getController('MasterSol.controller.import.ImportCsvController').import();
        }
    }, {
        text: 'Cancelar',
        iconCls: 'fa fa-close',
        id: 'btn_cancel_import_csv',
        handler: function () {
            MasterApp.getController('MasterSol.controller.import.ImportCsvController').cancel();
        }
    }]
});