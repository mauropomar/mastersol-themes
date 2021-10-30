Ext.define('MasterSol.controller.chart.LineChartController', {
        extend: 'Ext.app.Controller',
        json: null,
        init: function () {

        },

        render: function (comp) {
            var window = comp.up('window');
            var json = MasterApp.getController('MasterSol.controller.chart.ChartController').jsonData;
            var chart = Ext.create('Ext.chart.CartesianChart', {
                reference: 'chart',
                store: this.getStore(json),
                legend: json['legend'],
                insetPadding: 40,
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
        },

        fireEventPrint: function (window, ext) {
            var chart = window.down('line-chart').items.items[0];
            var title = window.getTitle();
            var fileName = title + '.' + ext;
            MasterApp.getController('MasterSol.controller.chart.ChartController').saveBase64AsFile(chart.getImage("stream").data, fileName);
        }
    }
);
