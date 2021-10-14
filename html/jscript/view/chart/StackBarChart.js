Ext.define('MasterSol.view.chart.StackBarChart', {
    extend: 'Ext.Panel',
    xtype: 'stack-chart',
    layout:'fit',
    listeners: {
        afterrender: function (comp) {
            MasterApp.getController('MasterSol.controller.chart.StackBarChartController').render(comp);
        }
    }
});
