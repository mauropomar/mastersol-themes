/**
 * Demonstrates a basic window control.
 */
Ext.define('MasterSol.view.layout.WindowImageDesktop', {
    extend: 'Ext.window.Window',
    xtype: 'window-image-desktop',
    closable: true,
    floated:true,
    closeAction: 'destroy',
    //  height: 80,
    width: 600,
    title: 'Seleccione una imagen',
    autoShow: true,
    items: [{
        xtype: 'form',
        layout: 'fit',
        bodyPadding: 10,
        labelAlign: 'top',
        items: [{
            xtype: 'filefield',
            emptyText: 'Seleccione una imagen de fondo..',
            fieldLabel: 'Imagen',
            id:'file_image_desktop',
            name: 'photo-path',
            flex: 2,
            buttonConfig: {
                text: '',
                iconCls: 'fa fa-file-image-o'
            }
        }]
    }],
    buttons: [{
        text: 'Guardar',
        iconCls: 'fa fa-save',
        id:'btn_save_image_desktop',
        handler: function () {
            MasterApp.header.changeImageDesktop();
        }
    }, {
        text: 'Cancelar',
        iconCls: 'fa fa-close',
        id:'btn_cancel_image_desktop',
        handler: function () {
            MasterApp.header.cancelImageDesktop();
        }
    }]
});
