/**
 * Demonstrates a basic window control.
 */
Ext.define('MasterSol.view.layout.WindowImageDesktop', {
    extend: 'Ext.window.Window',
    xtype: 'window-image-desktop',
    closable: true,
    closeAction: 'destroy',
  //  height: 80,
    width: 600,
    title: 'Seleccione una imagen',
    autoShow: true,
    items: [{
        xtype: 'form',
        layout: 'fit',
        bodyPadding: 10,
        labelAlign:'top',
        items: [{
            xtype: 'filefield',
            emptyText: 'Seleccione una imagen de fondo..',
            fieldLabel: 'Imagen',
            name: 'photo-path',
            flex:2,
            buttonConfig: {
                text: '',
                iconCls: 'fa fa-file-image-o'
            }
        }]
    }],
    buttons: [{
        text: 'Guardar',
        iconCls:'fa fa-save'
        //   handler: 'firstFormSave'
    },{
        text: 'Cancelar',
        iconCls:'fa fa-close'
        //   handler: 'firstFormSave'
    }]
});
