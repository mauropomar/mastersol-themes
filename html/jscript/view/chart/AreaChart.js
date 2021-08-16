Ext.define('MasterSol.view.chart.AreaChart', {
    extend: 'Ext.Panel',
    xtype: 'area-chart',
    layout:'fit',
    listeners: {
        afterrender: function () {
            MasterApp.getController('MasterSol.controller.chart.AreaChartController').render();
        }
    }
});