Ext.define('MasterSol.controller.chart.ChartController', {
    extend: 'Ext.app.Controller',
    jsonData: null,
    type:'column',
    init: function () {

    },

    addChart: function (type) {
        var panel;
        this.type = type;
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

    printChart:function(ext){
        var type = this.type;
        if (type === 'column') {
            MasterApp.getController('MasterSol.controller.chart.ColumnChartController').fireEventPrint(ext);
        } else if (type === 'line') {
            MasterApp.getController('MasterSol.controller.chart.LineChartController').fireEventPrint(ext);
        } else if (type === 'pie') {
            MasterApp.getController('MasterSol.controller.chart.PieChartController').fireEventPrint(ext);
        } else if (type === 'area') {
            MasterApp.getController('MasterSol.controller.chart.AreaChartController').fireEventPrint(ext);
        } else if (type === 'stackbar') {
            MasterApp.getController('MasterSol.controller.chart.StackBarChartController').fireEventPrint(ext);
        } else if (type === 'radar') {
            MasterApp.getController('MasterSol.controller.chart.RadarChartController').fireEventPrint(ext);
        }
    },

    showWindow: function (json) {
        json['fields'] = MasterApp.util.getObjectKey(json.value);
        json['legend'] = this.getLegend(json);
        this.jsonData = json;
        Ext.create('MasterSol.view.chart.WindowChart', {
            id: 'window_chart',
            title: json.name
        });
    },

    cancel: function () {
        Ext.ComponentQuery.query('#window_chart')[0].close();
    },

    getLegend: function (json) {
        var docked = 'right';
        if (!json['legend'])
            return null;
        if (json['legend_pos'] === 'I')
            docked = 'left';
        if (json['legend_pos'] === 'T')
            docked = 'top';
        if (json['legend_pos'] === 'B')
            docked = 'bottom';
        return {
            type: 'sprite',
            docked: docked
        };
    },

    saveBase64AsFile: function (base64, fileName) {
        var link = document.createElement("a");
        link.setAttribute("href", base64);
        link.setAttribute("download", fileName);
        link.click();
    }

});