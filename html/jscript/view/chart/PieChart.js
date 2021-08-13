Ext.define('MasterSol.view.chart.PieChart', {
    extend: 'Ext.Panel',
    xtype: 'pie-chart',
    html:'<div id="chartPieContainer" style="height: 100%; width: 100%;"></div>',
    listeners: {
        afterrender: function () {
            MasterApp.getController('MasterSol.controller.chart.PieChartController').render();
        }
    }
});