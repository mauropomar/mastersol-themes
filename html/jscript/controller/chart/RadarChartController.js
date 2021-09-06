Ext.define('MasterSol.controller.chart.RadarChartController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    render: function () {
        var json = MasterApp.getController('MasterSol.controller.chart.ChartController').jsonData;
        json['fields'] = ['label', 'valor'];
        var chart = Ext.create('Ext.chart.PolarChart', {
            reference: 'chart',
            store: this.getStore(json),
            insetPadding: '40 40 60 40',
            interactions: ['rotate'],
            sprites: [{
                type: 'text',
                text: 'Radar Charts - Basic',
                fontSize: 22,
                width: 100,
                height: 30,
                x: 40, // the sprite x position
                y: 20  // the sprite y position
            }, {
                type: 'text',
                text: 'Data: Browser Stats 2012 - Internet Explorer',
                fontSize: 10,
                x: 12,
                y: 480
            }, {
                type: 'text',
                text: 'Source: http://www.w3schools.com/',
                fontSize: 10,
                x: 12,
                y: 495
            }],
            axes: [{
                type: 'numeric',
                position: 'radial',
                fields: this.getYField(json),
                renderer: this.onAxisLabelRender,
                grid: true,
                minimum: 0,
                maximum: 25,
                majorTickSteps: 4
            }, {
                type: 'category',
                position: 'angular',
                grid: true
            }],
            series: [{
                type: 'radar',
                angleField: this.getXField(json),
                radiusField: this.getYField(json),
                style: {
                    opacity: 0.80
                },
                highlight: {
                    fillStyle: '#000',
                    lineWidth: 2,
                    strokeStyle: '#fff'
                }
            }]
        });
        Ext.ComponentQuery.query('radar-chart')[0].add(chart);
    },

    getStore: function (json) {
        var store = {
            fields:json.fields,
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
        return layoutContext.renderer(label) + '%';
    },

    onMultiAxisLabelRender: function (axis, label, layoutContext) {
        return label === 'Jan' ? '' : label;
    },

    onSeriesLabelRender: function (tooltip, record, item) {
        tooltip.setHtml(record.get('label') + ': ' + record.get(item.field) + '%');
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
    }
});