Ext.define('MasterSol.view.chart.LineChart', {
    extend: 'Ext.Panel',
    xtype: 'line-chart',
    layout:'fit',
    listeners: {
        afterrender: function () {
            MasterApp.getController('MasterSol.controller.chart.LineChartController').render();
        }
    }
});