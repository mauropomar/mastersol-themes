Ext.define('MasterSol.view.chart.RadarChart', {
    extend: 'Ext.Panel',
    xtype: 'radar-chart',
    layout:'fit',
    border:false,
    listeners: {
        afterrender: function (comp) {
            MasterApp.getController('MasterSol.controller.chart.RadarChartController').render(comp);
        }
    }
});
