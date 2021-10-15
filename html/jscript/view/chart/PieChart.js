Ext.define('MasterSol.view.chart.PieChart', {
    extend: 'Ext.Panel',
    xtype: 'pie-chart',
    layout: 'fit',
    border:false,
    listeners: {
        afterrender: function (comp) {
            MasterApp.getController('MasterSol.controller.chart.PieChartController').render(comp);
        }
    }
});
