/**
 * Demonstrates a basic window control.
 */
Ext.define('MasterSol.view.chart.WindowChart', {
    extend: 'Ext.window.Window',
    xtype: 'window-chart',
    closable: true,
    closeAction: 'destroy',
    height:'80%',
    width:'50%',
    modal:true,
    title: 'Gráficos',
    layout: 'fit',
    autoShow: true,
    requires: [
        'MasterSol.view.chart.ColumnChart',
    ],
    items: [{
        xtype: 'panel',
        layout: 'border',
        items: [{
            region: 'west',
            width: '20%',
            split: true,
            collapsible: true,
            collapseMode: 'mini',
        }, {
            region: 'center',
            layout: 'fit',
            id:'container_chart_panel',
            items: [{
                xtype:'column-chart'
            }],
            tbar: [{
                xtype: 'button',
                iconCls: 'fa fa-bar-chart',
                handler:function(){
                    MasterApp.getController('MasterSol.controller.chart.ChartController').addChart('column');
                }
            },'-',{
                xtype: 'button',
                iconCls: 'fa fa-line-chart',
                handler:function(){
                    MasterApp.getController('MasterSol.controller.chart.ChartController').addChart('line');
                }
            },'-',{
                xtype: 'button',
                iconCls: 'fa fa-pie-chart',
                handler:function(){
                    MasterApp.getController('MasterSol.controller.chart.ChartController').addChart('pie');
                }
            },'-',{
                xtype: 'button',
                iconCls: 'fa fa-area-chart',
                handler:function(){
                    MasterApp.getController('MasterSol.controller.chart.ChartController').addChart('area');
                }
            },'-',{
                xtype: 'button',
                iconCls: 'fa fa-align-left',
                handler:function(){
                    MasterApp.getController('MasterSol.controller.chart.ChartController').addChart('stackbar');
                }
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