Ext.define('MasterSol.view.layout.Header', {
    extend: 'Ext.toolbar.Toolbar',
    height: 40,
    xtype: 'toolbar-header',
    requires: [/*'MasterSol.view.layout.HeaderController', 'MasterSol.view.layout.ComboTemas'*/, 'MasterSol.view.plugins.Badgeable'],
    // controller: 'header',
    items: [{
        xtype: 'tbtext',
        id: 'tbtext-title',
        text: 'MasterSol ERM',
        style: {
            color: MasterApp.theme.getTextColor(),
            fontSize: '20px',
            fontWeight: 'bold'
        }
    },
        '->',
        {
            xtype: 'button',
            iconCls: 'fa fa-server',
            id: 'btnEnCascada',
            tooltip: 'En Cascada',
            tooltipType: 'title',
            disabled: true,
            handler: 'enCascada'
        },
        {
            xtype: 'button',
            iconCls: 'fa fa-columns',
            id: 'btnEnMosaico',
            tooltip: 'En Mosaico',
            tooltipType: 'title',
            disabled: true,
            handler: 'enMosaico'
        }, /*{
            xtype: 'combotemas',
            id: 'combotemas'
        },*/
        {
            xtype: 'button',
            iconCls: 'fa fa-home',
            handler: 'irInicio',
            tooltip: 'Ir a Inicio',
            tooltipType: 'title',
        },
        {
            xtype:'button',
            iconCls: 'fa fa-bell',
            tooltip: 'Alertas',
            tooltipType: 'title',
            handler: 'mostrarAlerta',
            badgeText: '2'
        },
        {
            xtype: 'button',
            iconCls: 'fa fa-sign-out',
            tooltip: 'Cerrar Sesión',
            tooltipType: 'title',
            handler: 'cerrarSesion'
        }
    ]
})