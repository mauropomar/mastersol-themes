Ext.define('MasterSol.controller.chart.AreaChartController', {
    extend: 'Ext.app.Controller',
    json: null,
    chart:'',
    init: function () {

    },
    render: function (comp) {
        this.json = MasterApp.getController('MasterSol.controller.chart.ChartController').jsonData;
        this.chart = Ext.create('Ext.chart.CartesianChart', {
            reference: 'chart',
            store: this.getStore(this.json),
            insetPadding: '40 40 40 40',
            legend: this.json['legend'],
            sprites: [],
            axes: [{
                type: 'numeric',
                position: 'left',
                fields: this.getYField(this.json),
                grid: true,
                minimum: 0,
                maximum: this.json['sql_label'],
                majorTickSteps: 10,
                renderer: this.onAxisLabelRender,
                title: {
                    text: this.json['label_y']
                }
            }, {
                type: 'category',
                position: 'bottom',
                fields: this.getXField(this.json),
                title: {
                    text: this.json['label_x']
                },
                label: {
                    rotate: {
                        degrees: -45
                    }
                }
            }]
        });
        comp.add(this.chart);
        this.onAfterRender();
    },

    getStore: function (json) {
        var store = {
            fields: json.fields,
            data: json.value
        };
        return store;
    },

    onAxisLabelRender: function (axis, label, layoutContext) {
        var value = layoutContext.renderer(label);
        return  value;
    },

    onPreview: function () {
        var chart = this.lookupReference('chart');
        chart.preview();
    },

    getSeriesConfig: function (field, title) {
        return {
            type: 'area',
            title: title,
            xField: this.getXField(this.json),
            yField: field,
            style: {
                opacity: 0.60
            },
            marker: {
                opacity: 0,
                scaling: 0.01,
                fx: {
                    duration: 200,
                    easing: 'easeOut'
                }
            },
            highlightCfg: {
                opacity: 1,
                scaling: 1.5
            },
            tooltip: {
                trackMouse: true,
                scope:this,
                renderer: function (tooltip, record, item) {
                    var label = this.getXField(this.json);
                    tooltip.setHtml(title + ' (' + record.get(label) + '): ' + record.get(field));
                }
            }
        };
    },

    onAfterRender: function () {
        var fields = this.getYField(this.json);
        var series = new Array();
        for(var i = fields.length - 1 ; i >= 0; i--){
            var s = this.getSeriesConfig(fields[i], fields[i].toLowerCase());
            series.push(s);
        }
        this.chart.setSeries(series);
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

    fireEventPrint: function (window, ext) {
        var chart = window.down('area-chart').items.items[0];
        var title = window.getTitle();
        var fileName = title + '.' + ext;
        MasterApp.getController('MasterSol.controller.chart.ChartController').saveBase64AsFile(chart.getImage("stream").data, fileName);
    }
});
