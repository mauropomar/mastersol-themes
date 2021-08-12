/**
 * Demonstrates a basic window control.
 */
Ext.define('MasterSol.view.import.WindowImportExcel', {
    extend: 'Ext.window.Window',
    xtype: 'window-import-excel',
    closable: true,
    closeAction: 'destroy',
    floated:true,
    height: 115,
    width: 600,
    title: 'Importar Excel',
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
            name: 'file_excel',
            id:'file_excel',
            flex:2,
            buttonConfig: {
                text: '',
                iconCls: 'fa fa-file-excel-o'
            }
        }]
    }],
    buttons: [{
        text: 'Importar',
        id: 'btn_execute_import_excel',
        iconCls: 'fa fa-file-excel-o',
        handler: function () {
            MasterApp.getController('MasterSol.controller.import.ImportExcelController').import();
        }
    }, {
        text: 'Cancelar',
        iconCls: 'fa fa-close',
        id: 'btn_cancel_import_excel',
        handler: function () {
            MasterApp.getController('MasterSol.controller.import.ImportExcelController').cancel();
        }
    }]
});