Ext.define('MasterSol.view.chart.ColumnChart', {
    extend: 'Ext.Panel',
    xtype: 'column-chart',
    html:'<div id="chartColumnContainer" style="height: 100%; width: 100%;"></div>',
    listeners: {
        afterrender: function () {
            MasterApp.getController('MasterSol.controller.chart.ColumnChartController').render();
        }
    }
});