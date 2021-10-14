Ext.define('MasterSol.view.chart.ColumnChart', {
    extend: 'Ext.Panel',
    xtype: 'column-chart',
    layout:'fit',
    border:'0',
    listeners: {
        afterrender: function (comp) {
            MasterApp.getController('MasterSol.controller.chart.ColumnChartController').render(comp);
        }
    }
});
