Ext.define('MasterSol.controller.chart.LineChartController', {
        extend: 'Ext.app.Controller',
        json: null,
        init: function () {

        },

        render: function () {
            var json = MasterApp.getController('MasterSol.controller.chart.ChartController').jsonData;
            var chart = Ext.create('Ext.chart.CartesianChart', {
                reference: 'chart',
                store: this.getStore(json),
                legend: {
                    type: 'sprite',
                    docked: json['legend_pos']
                },
                insetPadding: 40,
                sprites: [{
                    type: 'text',
                  //  text: 'Line Charts - Marked Lines',
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
                    fields: this.getYField(json),
                    position: 'left',
                    grid: true,
                    minimum: 0,
                    renderer: this.onAxisLabelRender,
                    title: {
                        text: json['label_y']
                    }
                }, {
                    type: 'category',
                    fields: this.getXField(json),
                    position: 'bottom',
                    grid: true,
                    title: {
                        text: json['label_x']
                    },
                    label: {
                        rotate: {
                            degrees: -45
                        }
                    }
                }],
                series: this.getSeries(json)
            });
            Ext.ComponentQuery.query('line-chart')[0].add(chart);
        },

        getStore: function (json) {
            var store = {
                fields: json.fields,
                data: json.value
            };
            return store;
        },

        onAxisLabelRender: function (axis, label, layoutContext) {
            return label.toFixed(label < 10 ? 1 : 0);
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
                    type: 'line',
                    title: fields[i],
                    xField: label,
                    yField: fields[i],
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
                        scope: this,
                        renderer: function (tooltip, record, item) {
                            var title = item.series.getTitle();
                            var l = this.getXField(json);
                            tooltip.setHtml(title + ' en ' + record.get(l) + ': ' +
                                record.get(item.series.getYField()));
                        }
                    }
                });
            }
            return series;
        }
    }
);