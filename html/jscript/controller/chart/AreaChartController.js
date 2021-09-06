Ext.define('MasterSol.controller.chart.AreaChartController', {
    extend: 'Ext.app.Controller',
    chart: '',
    init: function () {

    },
    render: function () {
        var json = MasterApp.getController('MasterSol.controller.chart.ChartController').jsonData;
        this.chart = Ext.create('Ext.chart.CartesianChart', {
            reference: 'chart',
            store: this.getStore(json),
            insetPadding: '40 40 40 40',
            legend: {
                docked: 'bottom'
            },
            sprites: [{
                type: 'text',
                text: 'Economic Development in the USA, Japan and China',
                fontSize: 22,
                width: 100,
                height: 30,
                x: 40, // the sprite x position
                y: 20  // the sprite y position
            }, {
                type: 'text',
                text: 'Data: Gross domestic product based on purchasing-power-parity (PPP) valuation of country GDP. Figures for FY2014 are forecasts.',
                fontSize: 10,
                x: 12,
                y: 525
            }, {
                type: 'text',
                text: 'Source: http://www.imf.org/ World Economic Outlook Database October 2014.',
                fontSize: 10,
                x: 12,
                y: 540
            }],
            axes: [{
                type: 'numeric',
                position: 'left',
                fields: this.getYField(json),
                title: 'GDP in billions of US Dollars',
                grid: true,
                minimum: 0,
                maximum: 20000,
                majorTickSteps: 10,
                renderer: this.onAxisLabelRender
            }, {
                type: 'category',
                position: 'bottom',
                fields: this.getXField(json),
                label: {
                    rotate: {
                        degrees: -45
                    }
                }
            }]
        });
        Ext.ComponentQuery.query('area-chart')[0].add(this.chart);
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
        // Custom renderer overrides the native axis label renderer.
        // Since we don't want to do anything fancy with the value
        // ourselves except appending a '%' sign, but at the same time
        // don't want to loose the formatting done by the native renderer,
        // we let the native renderer process the value first.
        var value = layoutContext.renderer(label);
        return value !== '0' ? (value / 1000 + ',000') : value;
    },

    onPreview: function () {
        var chart = this.lookupReference('chart');
        chart.preview();
    },

    getSeriesConfig: function (field, title) {
        return {
            type: 'area',
            title: title,
            xField: 'year',
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
                renderer: function (tooltip, record, item) {
                    tooltip.setHtml(title + ' (' + record.get('label') + '): ' + record.get(field));
                }
            }
        };
    },

    onAfterRender: function () {
        this.chart.setSeries([
            this.getSeriesConfig('valor', 'Valor')
        ]);
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