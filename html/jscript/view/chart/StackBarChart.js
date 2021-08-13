Ext.define('MasterSol.view.chart.StackBarChart', {
    extend: 'Ext.Panel',
    xtype: 'stack-chart',
    html:'<div id="chartStackBarContainer" style="height: 100%; width: 100%;"></div>',
    listeners: {
        afterrender: function () {
            MasterApp.getController('MasterSol.controller.chart.StackBarChartController').render();
        }
    }
});