Ext.define('MasterSol.controller.chart.PieChartController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    render: function () {
        var chart = Ext.create('Ext.chart.PolarChart', {
            reference: 'chart',
            store: this.getStore(),
            theme: 'default-gradients',
            insetPadding: 50,
            innerPadding: 20,
            legend: {
                docked: 'bottom'
            },
            interactions: ['rotate'],
            sprites: [{
                type: 'text',
                text: 'Pie Charts - Basic',
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
                angleField: 'data1',
                label: {
                    field: 'os',
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

    getStore: function () {
        var store = {
            fields: ['os', 'data1'],
            data: [
                {os: 'Android', data1: 68.3},
                {os: 'BlackBerry', data1: 1.7},
                {os: 'iOS', data1: 17.9},
                {os: 'Windows Phone', data1: 10.2},
                {os: 'Others', data1: 1.9}
            ]
        };
        return store;
    },

    onSeriesTooltipRender: function (tooltip, record, item) {
        tooltip.setHtml(record.get('os') + ': ' + record.get('data1') + '%');
    }
});