Ext.define('MasterSol.view.chart.StackBarChart', {
    extend: 'Ext.Panel',
    xtype: 'stack-chart',
    layout:'fit',
    listeners: {
        afterrender: function () {
            MasterApp.getController('MasterSol.controller.chart.StackBarChartController').render();
        }
    }
});