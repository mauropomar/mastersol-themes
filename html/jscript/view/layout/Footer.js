Ext.define('MasterSol.view.layout.Footer', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'toolbar-footer',
    requires: [
        'MasterSol.view.layout.ComboWindow',
        'MasterSol.view.layout.ComboMenu',
    //    'MasterSol.controller.layout.FooterController',
        'MasterSol.view.layout.MenuPanel'
    ],
    items: [{
        xtype: 'button',
        iconCls: 'fa fa-bars',
        menu: [{
            xtype: 'menu-panel',
        }]
    }, {
        xtype: 'tbtext',
        text: 'Menú:',
        id: 'tbtext_menu'
    }, {
        xtype: 'combomenu',
        id: 'combomenu'
    }, '->', {
        xtype: 'combowindow',
        id: 'combowindow',
        /*  listeners:{
              select:'seleccionarVentana'
          }*/
    }]
})