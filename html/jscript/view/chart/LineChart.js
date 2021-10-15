Ext.define('MasterSol.view.chart.LineChart', {
    extend: 'Ext.Panel',
    xtype: 'line-chart',
    layout:'fit',
    border:false,
    listeners: {
        afterrender: function (comp) {
            MasterApp.getController('MasterSol.controller.chart.LineChartController').render(comp);
        }
    }
});
