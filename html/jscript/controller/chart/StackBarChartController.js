Ext.define('MasterSol.controller.chart.StackBarChartController', {
        extend: 'Ext.app.Controller',
        init: function () {

        },

        render: function () {
            var json = MasterApp.getController('MasterSol.controller.chart.ChartController').jsonData;
            var chart = Ext.create('Ext.chart.CartesianChart', {
                flipXY: true,
                store: this.getStore(json),
                legend: {
                    docked: json['legend_pos']
                },
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
                    }
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
                        fill: ["#115fa6", "#94ae0a"]
                    },
                    tooltip: {
                        trackMouse: true,
                        scope:this,
                        renderer: function (tooltip, record, item) {
                            var label = this.getXField(json);
                            tooltip.setHtml(record.get(label) + ': ' +
                                Ext.util.Format.number(record.get(item.field)));
                        },
                    }
                }]
            });
            Ext.ComponentQuery.query('stack-chart')[0].add(chart);
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
    }
);