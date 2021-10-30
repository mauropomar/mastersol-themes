Ext.define('MasterSol.controller.chart.PieChartController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    render: function (comp) {
        var window = comp.up('window');
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
                text: window.title,
                fontSize: 22,
                width: 100,
                height: 30,
                x: 40, // the sprite x position
                y: 20  // the sprite y position
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

    onSeriesTooltipRender: function (tooltip, record, item) {
        tooltip.setHtml(record.get('label') + ': ' + record.get(item.field));
    },

    fireEventPrint: function (window, ext) {
        var chart = window.down('pie-chart').items.items[0];
        var title = window.getTitle();
        var fileName = title + '.' + ext;
        MasterApp.chart.saveBase64AsFile(chart.getImage("stream").data, fileName);
    }
});
