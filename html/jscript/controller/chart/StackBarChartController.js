Ext.define('MasterSol.controller.chart.StackBarChartController', {
        extend: 'Ext.app.Controller',
        init: function () {

        },

        render: function (comp) {
            var window = comp.up('window');
            var json = MasterApp.chart.jsonData;
            var chart = Ext.create('Ext.chart.CartesianChart', {
                flipXY: true,
                showLabel: true,
                displayInsideEnd: true,
                height: 500,
                insetPadding: 40,
                store: this.getStore(json),
                legend: json['legend'],
                axes: [{
                    type: 'numeric',
                    position: 'bottom',
                    grid: true,
                    minimum: 0,
                    title: {
                        text: json['label_y']
                    }
                }, {
                    type: 'category',
                    position: 'left',
                    title: {
                        text: json['label_x']
                    },
                    label: {
                        textPadding: 0,
                        rotate: {
                            degrees: -45
                        }
                    }
                }],
                sprites: [{
                    type: 'text',
                    text: window.title,
                    fontSize: 22,
                    width: 100,
                    height: 30,
                    x: 40, // the sprite x position
                    y: 20  // the sprite y position
                }],
                //define the actual bar series.
                series: [{
                    type: 'bar',
                    xField: this.getXField(json),
                    yField: this.getYField(json),
                    axis: 'bottom',
                    // Cycles the green and blue fill mode over 2008 and 2009
                    // subStyle parameters also override style parameters
                    subStyle: {
                        fill: ["#94ae0a", "#115fa6"]
                    },
                    label: {
                        display: 'insideEnd',
                        field: this.getYField(json),
                        renderer: this.onSeriesLabelRender
                    },
                    tooltip: {
                        trackMouse: true,
                        scope: this,
                        renderer: function (tooltip, record, item) {
                            var label = this.getXField(json);
                            tooltip.setHtml(record.get(label) + ': ' +
                                Ext.util.Format.number(record.get(item.field)));
                        }
                    }
                }]
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

        onTooltipRender: function (tooltip, record, item) {
            tooltip.setHtml(record.get('label') + ': ' +
                Ext.util.Format.number(record.get(item.field)));
        },

        fireEventPrint: function (window, ext) {
            var chart = window.down('stack-chart').items.items[0];
            var title = window.getTitle();
            var fileName = title + '.' + ext;
            MasterApp.getController('MasterSol.controller.chart.ChartController').saveBase64AsFile(chart.getImage("stream").data, fileName);
        },

        onSeriesLabelRender: function (value) {
            return value.toFixed(1);
        }
    }
);
