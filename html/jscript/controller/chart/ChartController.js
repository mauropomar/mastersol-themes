Ext.define('MasterSol.controller.chart.ChartController', {
    extend: 'Ext.app.Controller',
    jsonData: null,
    type: 'column',
    init: function () {

    },

    addChart: function (window, type) {
        var container = window.down('panel[name=container_chart_panel]');
        var panel;
        this.type = type;
        container.removeAll();
        if (type === 'column') {
            panel = Ext.create('MasterSol.view.chart.ColumnChart');
            container.add(panel);
        } else if (type === 'line') {
            panel = Ext.create('MasterSol.view.chart.LineChart');
            container.add(panel);
        } else if (type === 'pie') {
            panel = Ext.create('MasterSol.view.chart.PieChart');
            container.add(panel);
        } else if (type === 'area') {
            panel = Ext.create('MasterSol.view.chart.AreaChart');
            container.add(panel);
        } else if (type === 'stackbar') {
            panel = Ext.create('MasterSol.view.chart.StackBarChart');
            container.add(panel);
        } else if (type === 'radar') {
            panel = Ext.create('MasterSol.view.chart.RadarChart');
            container.add(panel);
        }
    },

    printChart: function (window, ext) {
        var type = this.type;
        if (type === 'column') {
            MasterApp.getController('MasterSol.controller.chart.ColumnChartController').fireEventPrint(window, ext);
        } else if (type === 'line') {
            MasterApp.getController('MasterSol.controller.chart.LineChartController').fireEventPrint(window, ext);
        } else if (type === 'pie') {
            MasterApp.getController('MasterSol.controller.chart.PieChartController').fireEventPrint(window, ext);
        } else if (type === 'area') {
            MasterApp.getController('MasterSol.controller.chart.AreaChartController').fireEventPrint(window, ext);
        } else if (type === 'stackbar') {
            MasterApp.getController('MasterSol.controller.chart.StackBarChartController').fireEventPrint(window, ext);
        } else if (type === 'radar') {
            MasterApp.getController('MasterSol.controller.chart.RadarChartController').fireEventPrint(window, ext);
        }
    },

    showWindow: function (json) {
        var panelmenu = Ext.ComponentQuery.query('#panel-center')[0];
        json['fields'] = MasterApp.util.getObjectKey(json.value);
        json['legend'] = this.getLegend(json);
        json.value = this.formatValues(json.value, json.fields);
        this.jsonData = json;
        var id = Math.random();
        var window = Ext.create('MasterSol.view.chart.WindowChart', {
            title: json.name,
            height: panelmenu.getHeight(),
            width: panelmenu.getWidth(),
            idmenu: id
        });
        MasterApp.chart.addChart(window, 'column');
        json['id'] = id;
        this.addWindow(json);
    },

    cancel: function (window) {
        window.close();
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
    },

    minimize: function (button, evt, toolEl, owner, tool) {
        var window = owner.up('window');
        window.collapse();
        window.isminimize = true;
        window.attributes.width = window.getWidth();
        window.attributes.height = window.getHeight();
        window.attributes.posX = window.getX();
        window.attributes.posY = window.getY();
        window.setWidth(300);
        window.toBack();
        button.hide();
        MasterApp.tools.getBtnTools(window, 'btn_restore').show();
        MasterApp.theme.setHeaderHeightWindowCollpase(window);
        MasterApp.section.setPositionWindow(window);
    },

    restore: function (button, evt, toolEl, owner, tool) {
        var window = owner.up('window');
        button.hide();
        var width = Ext.ComponentQuery.query('#panel-center')[0].getWidth();
        var height = Ext.ComponentQuery.query('#panel-center')[0].getWidth();
        MasterApp.tools.getBtnTools(window, 'btn_restore').hide();
        MasterApp.tools.getBtnTools(window, 'btn_minimize').show();
        window.expand('', false);
        window.toFront();
        window.setWidth(width);
        window.setHeight(height);
        window.setPosition(window.attributes.posX, window.attributes.posY);
        window.isminimize = false;
    },

    resizeWindow: function (win) {
        var widthPanel = Ext.ComponentQuery.query('#panel-center')[0].getWidth();
        var width = win.getWidth();
        if (widthPanel > width) {
            MasterApp.tools.getBtnTools(win, 'btn_restore').show();
        } else {
            MasterApp.tools.getBtnTools(win, 'btn_restore').hide();
        }
    },

    addWindow: function (menu) {
        var combo = Ext.ComponentQuery.query('#combowindow')[0];
        var store = combo.getStore();
        var count = store.getCount();
        var rec = new MasterSol.model.layout.WindowModel({
            id: menu.id,
            name: menu.name,
            type: 'chart'
        });
        store.insert(count, rec);
    },

    dblClickHeader: function (window) {
        if (!window.isminimize) {
            window.collapse();
            window.isminimize = true;
            window.attributes.width = window.getWidth();
            window.attributes.height = window.getHeight();
            window.attributes.posX = window.getX();
            window.attributes.posY = window.getY();
            window.setWidth(300);
            window.toBack();
            var btn = MasterApp.tools.getBtnTools(window, 'btn_restore');
            btn.show();
            btn = MasterApp.tools.getBtnTools(window, 'btn_minimize');
            btn.hide();
            MasterApp.theme.setHeaderHeightWindowCollpase(window);
            MasterApp.section.setPositionWindow(window);
        } else {
            var btn = MasterApp.tools.getBtnTools(window, 'btn_restore');
            btn.hide();
            btn = MasterApp.tools.getBtnTools(window, 'btn_minimize');
            btn.show();
            window.expand('', false);
            window.toFront();
            window.setWidth(window.attributes.width);
            window.setHeight(window.attributes.height);
            window.setPosition(window.attributes.posX, window.attributes.posY);
            window.isminimize = false;
        }
    },

    formatValues: function (values, fields) {
        for (var i = 0; i < values.length; i++) {
            for (var j = 0; j < fields.length; j++) {
                var y = fields[j];
                values[i][y] = (values[i][y] != null) ? values[i][y] : 0;
            }
        }
        return values;
    },

    setLegendPosition: function (position) {
        var chart = Ext.ComponentQuery.query('cartesian')[0];
        chart.setLegend({
            type: 'sprite',
            docked: position
        });
    },

    showLegend: function (btn) {
        var legend;
        var chart = Ext.ComponentQuery.query('cartesian')[0];
        if (btn.text === 'Mostrar') {
            legend = {
                type: 'sprite',
                docked: 'right'
            };
            btn.setText('Ocultar');
        } else {
            legend = null;
            btn.setText('Mostrar');
        }
        chart.setLegend(legend);
    },

    showSeriesLabel: function (btn) {
        var chart = Ext.ComponentQuery.query('cartesian')[0];
        var series = chart.series;
        for (var j = 0; j < series.length; j++) {
            series[j].setLabel({
                hidden: chart.showLabel
            });
        }
        chart.showLabel = !chart.showLabel;
    },

    showSeriesInsideLabel:function(btn){
        var chart = Ext.ComponentQuery.query('cartesian')[0];
        var series = chart.series;
        var display = (chart.displayInsideEnd)?'outsideEnd':'insideEnd';
        for (var j = 0; j < series.length; j++) {
            series[j].setLabel({
                hidden: false,
                display:display
            });
        }
        chart.displayInsideEnd = (chart.displayInsideEnd === 'insideEnd')?true:false;
    }

});
