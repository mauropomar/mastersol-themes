Ext.define('MasterSol.view.chart.LineChart', {
    extend: 'Ext.Panel',
    xtype: 'line-chart',
    html: '<div id="chartLineContainer" style="height: 100%; width: 100%;"></div>',
    listeners: {
        afterrender: function () {
            MasterApp.getController('MasterSol.controller.chart.LineChartController').render();
        }
    }
});