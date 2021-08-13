/**
 * Demonstrates a basic window control.
 */
Ext.define('MasterSol.view.chart.WindowChart', {
    extend: 'Ext.window.Window',
    xtype: 'window-chart',
    closable: false,
    closeAction: 'destroy',
    height: 500,
    width: 600,
    title: 'Gráficos',
    layout: 'fit',
    autoShow: true,
    items: [{
        xtype: 'panel',
        layout: 'border',
        items: [{
            region:'west',
            width:'20%',
            split:true,
            collapsible: true,
            collapseMode: 'mini',
        },{
            region: 'center',
            tbar: [{
                xtype: 'button',
                iconCls: 'fa fa-bar-chart'
            }, {
                xtype: 'button',
                iconCls: 'fa fa-line-chart'
            }, {
                xtype: 'button',
                iconCls: 'fa fa-pie-chart'
            },{
                xtype: 'button',
                iconCls: 'fa fa-area-chart'
            }]
        }]
    }],
    buttons: [{
        text: 'Cancelar',
        iconCls: 'fa fa-close',
        id: 'btn_cancelar_chart',
        handler: function () {
            MasterApp.getController('MasterSol.controller.chart.ChartController').cancel();
        }
    }]
});