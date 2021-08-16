Ext.define('MasterSol.controller.chart.RadarChartController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    render: function () {
        var chart = Ext.create('Ext.chart.PolarChart', {
            reference: 'chart',
            store: this.getStore(),
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
                fields: 'data1',
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
                angleField: 'month',
                radiusField: 'data1',
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

    getStore: function () {
        var store = {
            fields: ['month', 'data1', 'data2', 'data3', 'data4', 'other'],
            data: [
                { month: 'Jan', data1: 20, data2: 37, data3: 35, data4: 4, other: 4 },
                { month: 'Feb', data1: 20, data2: 37, data3: 36, data4: 5, other: 2 },
                { month: 'Mar', data1: 19, data2: 36, data3: 37, data4: 4, other: 4 },
                { month: 'Apr', data1: 18, data2: 36, data3: 38, data4: 5, other: 3 },
                { month: 'May', data1: 18, data2: 35, data3: 39, data4: 4, other: 4 },
                { month: 'Jun', data1: 17, data2: 34, data3: 42, data4: 4, other: 3 },
                { month: 'Jul', data1: 16, data2: 34, data3: 43, data4: 4, other: 3 },
                { month: 'Aug', data1: 16, data2: 33, data3: 44, data4: 4, other: 3 },
                { month: 'Sep', data1: 16, data2: 32, data3: 44, data4: 4, other: 4 },
                { month: 'Oct', data1: 16, data2: 32, data3: 45, data4: 4, other: 3 },
                { month: 'Nov', data1: 15, data2: 31, data3: 46, data4: 4, other: 4 },
                { month: 'Dec', data1: 15, data2: 31, data3: 47, data4: 4, other: 3 }]
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
        tooltip.setHtml(record.get('month') + ': ' + record.get(item.field) + '%');
    }
});