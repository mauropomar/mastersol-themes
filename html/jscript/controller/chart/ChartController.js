Ext.define('MasterSol.controller.chart.ChartController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    showWindow: function () {
        Ext.create('MasterSol.view.chart.WindowChart', {
            id: 'window_chart'
        });
        MasterApp.getController('MasterSol.controller.chart.ColumnChartController').render();
    },


    cancel: function () {
        Ext.ComponentQuery.query('#window_chart')[0].close();
    }

});