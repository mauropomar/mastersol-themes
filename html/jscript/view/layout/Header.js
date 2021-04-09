Ext.define('MasterSol.view.layout.Header', {
    extend: 'Ext.toolbar.Toolbar',
    height: 40,
    xtype: 'toolbar-header',
    requires: ['MasterSol.view.plugins.Badgeable'],
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
            id: 'btnEnCascade',
            tooltip: 'En Cascada',
            tooltipType: 'title',
            disabled: true,
            width: 40,
            handler: function () {
                MasterApp.header.applyCascade();
            }
        },
        {
            xtype: 'button',
            iconCls: 'fa fa-columns',
            id: 'btnEnMosaic',
            tooltip: 'En Mosaico',
            tooltipType: 'title',
            disabled: true,
            width: 40,
            handler: function () {
                MasterApp.header.applyMosaic();
            }
        },
        {
            xtype: 'button',
            iconCls: 'fa fa-home',
            handler: 'irInicio',
            tooltip: 'Ir a Inicio',
            tooltipType: 'title',
            width: 40,
            handler: function () {
                MasterApp.header.goHome();
            }
        },
        {
            xtype: 'button',
            iconCls: 'fa fa-bell',
            tooltip: 'Alertas',
            id: 'btn-alert',
            tooltipType: 'title',
            badgeText: '',
            width: 40,
            handler: function () {
                MasterApp.header.showAlerts();
            }
        },
        {
            xtype: 'button',
            iconCls: 'fa fa-sign-out',
            tooltip: 'Cerrar Sesión',
            tooltipType: 'title',
            width: 40,
            handler: function () {
                MasterApp.header.logout();
            }
        }
    ]
})