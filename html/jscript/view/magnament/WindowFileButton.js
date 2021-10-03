/**
 * Demonstrates a basic window control.
 */
Ext.define('MasterSol.view.magnament.WindowFileButton', {
    extend: 'Ext.window.Window',
    xtype: 'window-file-button',
    closable: false,
    closeAction: 'destroy',
    width: 150,
    height: 15,
    header: false,
    autoShow: true,
    items: [{
        xtype: 'filefield',
        buttonOnly: true,
        hideLabel: true,
        allowBlank: true,
        buttonConfig: {
            text: 'Seleccione Imagen...',
            iconCls: 'fa fa-image',
            tooltip: 'Subir archivo',
        },
        listeners: {
            change: function () {
            }
        }
    }],
    listeners: {
        focusleave: function (cmp) {
            alert('dsafsd')
           // cmp.close();
        }
    }
});


