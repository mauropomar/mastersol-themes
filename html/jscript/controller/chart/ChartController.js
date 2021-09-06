Ext.define('MasterSol.controller.chart.ChartController', {
    extend: 'Ext.app.Controller',
    jsonData: null,
    init: function () {

    },

    addChart: function (type) {
        var panel;
        Ext.ComponentQuery.query('#container_chart_panel')[0].removeAll();
        if (type === 'column') {
            panel = Ext.create('MasterSol.view.chart.ColumnChart');
            Ext.ComponentQuery.query('#container_chart_panel')[0].add(panel);
        } else if (type === 'line') {
            panel = Ext.create('MasterSol.view.chart.LineChart');
            Ext.ComponentQuery.query('#container_chart_panel')[0].add(panel);
        } else if (type === 'pie') {
            panel = Ext.create('MasterSol.view.chart.PieChart');
            Ext.ComponentQuery.query('#container_chart_panel')[0].add(panel);
        } else if (type === 'area') {
            panel = Ext.create('MasterSol.view.chart.AreaChart');
            Ext.ComponentQuery.query('#container_chart_panel')[0].add(panel);
        } else if (type === 'stackbar') {
            panel = Ext.create('MasterSol.view.chart.StackBarChart');
            Ext.ComponentQuery.query('#container_chart_panel')[0].add(panel);
        } else if (type === 'radar') {
            panel = Ext.create('MasterSol.view.chart.RadarChart');
            Ext.ComponentQuery.query('#container_chart_panel')[0].add(panel);
        }
    },

    showWindow: function (json) {
        this.jsonData = json;
        Ext.create('MasterSol.view.chart.WindowChart', {
            id: 'window_chart'
        });
    },


    cancel: function () {
        Ext.ComponentQuery.query('#window_chart')[0].close();
    }

});