Ext.define('MasterSol.controller.chart.RadarChartController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    render: function (comp) {
        var window = comp.up('window');
        var json = MasterApp.getController('MasterSol.controller.chart.ChartController').jsonData;
        var chart = Ext.create('Ext.chart.PolarChart', {
            reference: 'chart',
            store: this.getStore(json),
            insetPadding: '40 40 60 40',
            interactions: ['rotate'],
            legend: json['legend'],
            sprites: [{
                type: 'text',
                text: window.title,
                fontSize: 22,
                width: 100,
                height: 30,
                x: 40, // the sprite x position
                y: 20  // the sprite y position
            }],
            axes: [{
                type: 'numeric',
                position: 'radial',
                fields: this.getYField(json)[0],
                renderer: this.onAxisLabelRender,
                grid: true,
                minimum: 0,
                maximum: json['sql_label'],
                majorTickSteps: 4,
            }, {
                type: 'category',
                position: 'angular',
                grid: true,
                label: {
                    textPadding: 0,
                    rotate: {
                        degrees: -45
                    }
                }
            }],
            series: this.getSeries(json)
        });
        MasterApp.chart.chartSelect = chart;
        comp.add(chart);
    },

    getStore: function (json) {
        var store = {
            fields: json.fields,
            data: json.value
        };
        return store;
    },


    onAxisLabelRender: function (axis, label, layoutContext) {
        // Custom renderer overrides the native axis label renderer.
        // Since we don't want to do anything fancy with the value
        // ourselves except appending a '%' sign, but at the same time
        // don't want to loose the formatting done by the native renderer,
        // we let the native renderer process the value first.
        return layoutContext.renderer(label);
    },

    onMultiAxisLabelRender: function (axis, label, layoutContext) {
        return label === 'Jan' ? '' : label;
    },

    getXField: function (json) {
        var fields = json.fields;
        return fields[0];
    },

    getYField: function (json) {
        var f = [];
        var fields = json.fields;
        for (var i = 1; i < fields.length; i++) {
            f.push(fields[i]);
        }
        return f;
    },

    getSeries: function (json) {
        var label = this.getXField(json);
        var fields = this.getYField(json);
        var series = [];
        for (var i = 0; i < fields.length; i++) {
            series.push({
                type: 'radar',
               // title: fields[i],
                angleField: label,
                radiusField: fields[i],
                style: {
                    lineWidth: 2,
                    fillStyle: 'none'
                },
                marker: true,
                highlightCfg: {
                    radius: 6,
                    fillStyle: 'yellow'
                },
                tooltip: {
                    trackMouse: true,
                    renderer: function (tooltip, record, item) {
                        var l = this.getXField(json);
                        tooltip.setHtml(record.get(l) + ': ' + record.get(item.field));
                    }
                }
            });
        }
        return series;
    },

    fireEventPrint: function (window, ext) {
        var chart = window.down('radar-chart').items.items[0];
        var title = window.getTitle();
        var fileName = title + '.' + ext;
        MasterApp.getController('MasterSol.controller.chart.ChartController').saveBase64AsFile(chart.getImage("stream").data, fileName);
    }
});
