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
        layout: 'fit',
        items: [{
            region: 'center',
            layout: 'fit',
            id:'container_chart_panel',
            items: [{
                xtype:'column-chart'
            }],
            tbar: [{
                xtype: 'button',
                tooltip:'Gráficos de Columnas',
                tooltipType:'title',
                iconCls: 'fa fa-bar-chart',
                handler:function(){
                    MasterApp.getController('MasterSol.controller.chart.ChartController').addChart('column');
                }
            },'-',{
                xtype: 'button',
                tooltip:'Gráficos de Línea',
                tooltipType:'title',
                iconCls: 'fa fa-line-chart',
                handler:function(){
                    MasterApp.getController('MasterSol.controller.chart.ChartController').addChart('line');
                }
            },'-',{
                xtype: 'button',
                tooltip:'Gráficos de Pie',
                tooltipType:'title',
                iconCls: 'fa fa-pie-chart',
                handler:function(){
                    MasterApp.getController('MasterSol.controller.chart.ChartController').addChart('pie');
                }
            },'-',{
                xtype: 'button',
                tooltip:'Gráficos de Área',
                tooltipType:'title',
                iconCls: 'fa fa-area-chart',
                handler:function(){
                    MasterApp.getController('MasterSol.controller.chart.ChartController').addChart('area');
                }
            },'-',{
                xtype: 'button',
                tooltip:'Gráficos de Barras',
                tooltipType:'title',
                iconCls: 'fa fa-align-left',
                handler:function(){
                    MasterApp.getController('MasterSol.controller.chart.ChartController').addChart('stackbar');
                }
            },'-',{
                xtype: 'button',
                tooltip:'Gráficos Radar',
                tooltipType:'title',
                iconCls: 'fa fa-chrome',
                handler:function(){
                    MasterApp.getController('MasterSol.controller.chart.ChartController').addChart('radar');
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