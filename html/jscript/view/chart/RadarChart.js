Ext.define('MasterSol.view.chart.RadarChart', {
    extend: 'Ext.Panel',
    xtype: 'radar-chart',
    layout:'fit',
    listeners: {
        afterrender: function () {
            MasterApp.getController('MasterSol.controller.chart.RadarChartController').render();
        }
    }
});