Ext.define('MasterSol.controller.chart.LineChartController', {
        extend: 'Ext.app.Controller',
        chart: '',
        init: function () {

        },

        render: function () {
            var chart = Ext.create('Ext.chart.CartesianChart', {
                reference: 'chart',
                store: this.getStore(),
                legend: {
                    type: 'sprite',
                    docked: 'right'
                },
                insetPadding: 40,
                sprites: [{
                    type: 'text',
                    text: 'Line Charts - Marked Lines',
                    fontSize: 22,
                    width: 100,
                    height: 30,
                    x: 40, // the sprite x position
                    y: 20  // the sprite y position
                }, {
                    type: 'text',
                    text: 'Data: Browser Stats 2012',
                    fontSize: 10,
                    x: 12,
                    y: 470
                }, {
                    type: 'text',
                    text: 'Source: http://www.w3schools.com/',
                    fontSize: 10,
                    x: 12,
                    y: 485
                }],
                axes: [{
                    type: 'numeric',
                    fields: ['data1', 'data2', 'data3', 'data4'],
                    position: 'left',
                    grid: true,
                    minimum: 0,
                    renderer: this.onAxisLabelRender
                }, {
                    type: 'category',
                    fields: 'month',
                    position: 'bottom',
                    grid: true,
                    label: {
                        rotate: {
                            degrees: -45
                        }
                    }
                }],
                series: [{
                    type: 'line',
                    title: 'IE',
                    xField: 'month',
                    yField: 'data1',
                    marker: {
                        type: 'square',
                        fx: {
                            duration: 200,
                            easing: 'backOut'
                        }
                    },
                    highlightCfg: {
                        scaling: 2
                    },
                    tooltip: {
                        trackMouse: true,
                        renderer: this.onSeriesTooltipRender
                    }
                }, {
                    type: 'line',
                    title: 'Firefox',
                    xField: 'month',
                    yField: 'data2',
                    marker: {
                        type: 'triangle',
                        fx: {
                            duration: 200,
                            easing: 'backOut'
                        }
                    },
                    highlightCfg: {
                        scaling: 2
                    },
                    tooltip: {
                        trackMouse: true,
                        renderer: this.onSeriesTooltipRender
                    }
                }, {
                    type: 'line',
                    title: 'Chrome',
                    xField: 'month',
                    yField: 'data3',
                    marker: {
                        type: 'arrow',
                        fx: {
                            duration: 200,
                            easing: 'backOut'
                        }
                    },
                    highlightCfg: {
                        scaling: 2
                    },
                    tooltip: {
                        trackMouse: true,
                       renderer: this.onSeriesTooltipRender
                    }
                }, {
                    type: 'line',
                    title: 'Safari',
                    xField: 'month',
                    yField: 'data4',
                    marker: {
                        type: 'cross',
                        fx: {
                            duration: 200,
                            easing: 'backOut'
                        }
                    },
                    highlightCfg: {
                        scaling: 2
                    },
                    tooltip: {
                        trackMouse: true,
                        renderer: this.onSeriesTooltipRender
                    }
                }]
            });
            Ext.ComponentQuery.query('line-chart')[0].add(chart);
        },

        getStore: function () {
            var store = {
                fields: ['month', 'data1', 'data2', 'data3', 'data4', 'other'],
                data: [
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
                ]
            };
            return store;
        },

        onAxisLabelRender: function (axis, label, layoutContext) {
            return label.toFixed(label < 10 ? 1 : 0) + '%';
        },

        onSeriesTooltipRender: function (tooltip, record, item) {
            var title = item.series.getTitle();

            tooltip.setHtml(title + ' on ' + record.get('month') + ': ' +
                record.get(item.series.getYField()) + '%');
        },

        onColumnRender: function (v) {
            return v + '%';
        },

        onToggleMarkers: function () {
            var chart = this.lookupReference('chart'),
                seriesList = chart.getSeries(),
                ln = seriesList.length,
                i = 0,
                series;

            for (; i < ln; i++) {
                series = seriesList[i];
                series.setShowMarkers(!series.getShowMarkers());
            }

            chart.redraw();
        },

        onPreview: function () {
            if (Ext.isIE8) {
                Ext.Msg.alert('Unsupported Operation', 'This operation requires a newer version of Internet Explorer.');
                return;
            }
            var chart = this.lookupReference('chart');
            chart.preview();
        }
    }
);