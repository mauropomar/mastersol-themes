Ext.define('MasterSol.view.chart.AreaChart', {
    extend: 'Ext.Panel',
    xtype: 'area-chart',
    layout:'fit',
    border:false,
    listeners: {
        afterrender: function (comp) {
            MasterApp.getController('MasterSol.controller.chart.AreaChartController').render(comp);
        }
    }
});
