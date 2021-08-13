Ext.define('MasterSol.view.chart.AreaChart', {
    extend: 'Ext.Panel',
    xtype: 'area-chart',
    html:'<div id="chartAreaContainer" style="height: 100%; width: 100%;"></div>',
    listeners: {
        afterrender: function () {
            MasterApp.getController('MasterSol.controller.chart.AreaChartController').render();
        }
    }
});