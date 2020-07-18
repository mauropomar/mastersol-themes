Ext.define('MasterSol.view.layout.Header', {
    extend: 'Ext.toolbar.Toolbar',
    height: 50,
    xtype: 'header',
   // requires: ['MasterSol.view.layout.HeaderController', 'MasterSol.view.layout.ComboTemas'],
   // controller: 'header',

    items: [{
        xtype: 'tbtext',
        id:'tbtext-title',
        text: 'MasterSol ERM',
        style: {
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold'
        }
    },
        '->',
        {
            xtype: 'button',
            iconCls: 'x-fa fa-server',
            id: 'btnEnCascada',
            tooltip: 'En Cascada',
            tooltipType:'title',
            disabled: true,
            handler: 'enCascada'
        },
        {
            xtype: 'button',
            iconCls: 'x-fa fa-columns',
            id: 'btnEnMosaico',
            tooltip: 'En Mosaico',
            tooltipType:'title',
            disabled: true,
            handler: 'enMosaico'
        }, /*{
            xtype: 'combotemas',
            id: 'combotemas'
        },*/
        {
            xtype: 'button',
            iconCls: 'x-fa fa-home',
            handler: 'irInicio',
            tooltip: 'Ir a Inicio',
            tooltipType:'title',
        },
        {
            xtype: 'button',
            iconCls: 'x-fa fa-bell',
            tooltip: 'Alertas',
            tooltipType:'title',
            handler: 'mostrarAlerta'
        },
        {
            xtype: 'button',
            iconCls: 'x-fa fa-sign-out',
            tooltip: 'Cerrar Sesión',
            tooltipType:'title',
            handler: 'cerrarSesion'
        }
    ]
})