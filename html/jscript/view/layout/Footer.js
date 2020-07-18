Ext.define('MasterSol.view.layout.Footer', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'toolbarfooter',
    requires:[
       /* 'MasterSol.view.layout.ComboMenu',
        'MasterSol.view.layout.ComboVentana',
        'MasterSol.view.layout.MenuPanel',
        'MasterSol.view.layout.OpcionesController',
        'MasterSol.view.layout.FooterController'*/
    ],
  //  controller:'opciones',

    items: [{
        xtype: 'button',
        iconCls: 'x-fa fa-bars',
       /* menu:[{
            xtype:'menu-panel',
        }]*/
    }, {
        xtype: 'tbtext',
        text: 'Menú:',
        id:'tbtext_menu',
        style: {
            color: 'white'
        }
    },/* {
        xtype: 'combomenu',
        id:'combomenu',
        listeners:{
            select:'seleccionarMenu'
        }
    },'->',{
        xtype: 'comboventana',
        id:'comboventana',
        listeners:{
            select:'seleccionarVentana'
        }
    }*/]
})