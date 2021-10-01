Ext.define('MasterSol.controller.chart.RadarChartController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    render: function () {
        var json = MasterApp.getController('MasterSol.controller.chart.ChartController').jsonData;
        /*  json.fields = ['month', 'data1', 'data2', 'data3', 'data4', 'other'];
          json.value = [
              {month: 'Jan', data1: 20, data2: 37, data3: 35, data4: 4, other: 4},
              {month: 'Feb', data1: 20, data2: 37, data3: 36, data4: 5, other: 2},
              {month: 'Mar', data1: 19, data2: 36, data3: 37, data4: 4, other: 4},
              {month: 'Apr', data1: 18, data2: 36, data3: 38, data4: 5, other: 3},
              {month: 'May', data1: 18, data2: 35, data3: 39, data4: 4, other: 4},
              {month: 'Jun', data1: 17, data2: 34, data3: 42, data4: 4, other: 3},
              {month: 'Jul', data1: 16, data2: 34, data3: 43, data4: 4, other: 3},
              {month: 'Aug', data1: 16, data2: 33, data3: 44, data4: 4, other: 3},
              {month: 'Sep', data1: 16, data2: 32, data3: 44, data4: 4, other: 4},
              {month: 'Oct', data1: 16, data2: 32, data3: 45, data4: 4, other: 3},
              {month: 'Nov', data1: 15, data2: 31, data3: 46, data4: 4, other: 4},
              {month: 'Dec', data1: 15, data2: 31, data3: 47, data4: 4, other: 3}
          ];*/
        var chart = Ext.create('Ext.chart.PolarChart', {
            reference: 'chart',
            store: this.getStore(json),
            insetPadding: '40 40 60 40',
            interactions: ['rotate'],
            legend: {
                docked: json['legend_pos']
            },
            sprites: [],
            axes: [{
                type: 'numeric',
                position: 'radial',
                fields: this.getYField(json)[0],
                renderer: this.onAxisLabelRender,
                grid: true,
                minimum: 0,
                maximum: 25,
                majorTickSteps: 4,
                title: {
                    text: json['label_y']
                }
            }, {
                type: 'category',
                position: 'angular',
                grid: true,
                title: {
                    text: json['label_x']
                }
            }],
            series: this.getSeries(json)
        });
        Ext.ComponentQuery.query('radar-chart')[0].add(chart);
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
    }
});