Ext.define('MasterSol.controller.chart.PieChartController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    render: function () {
        var json = MasterApp.getController('MasterSol.controller.chart.ChartController').jsonData;
        var chart = Ext.create('Ext.chart.PolarChart', {
            reference: 'chart',
            store: this.getStore(json),
            theme: 'default-gradients',
            insetPadding: 50,
            innerPadding: 20,
            legend: json['legend'],
            interactions: ['rotate'],
            sprites: [{
                type: 'text',
                fontSize: 22,
                width: 100,
                height: 30,
                x: 40, // the sprite x position
                y: 20  // the sprite y position
            }, {
                type: 'text',
                text: 'Data: IDC Predictions - 2017',
                x: 12,
                y: 425
            }, {
                type: 'text',
                text: 'Source: Internet',
                x: 12,
                y: 440
            }],
            series: [{
                type: 'pie',
                angleField: this.getYField(json),
                label: {
                    field: this.getXField(json),
                    calloutLine: {
                        length: 60,
                        width: 3
                        // specifying 'color' is also possible here
                    }
                },
                highlight: true,
                tooltip: {
                    trackMouse: true,
                    renderer: this.onSeriesTooltipRender
                }
            }]
        });
        Ext.ComponentQuery.query('pie-chart')[0].add(chart);
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

    onSeriesTooltipRender: function (tooltip, record, item) {
        tooltip.setHtml(record.get('label') + ': ' + record.get(item.field));
    }
});