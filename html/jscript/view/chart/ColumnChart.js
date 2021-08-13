Ext.define('MasterSol.view.chart.ColumnChart', {
    extend: 'Ext.Panel',
    xtype: 'column-chart',
    tbar: [
        '->',

        {
            text: 'Recargar',
            handler: function () {

            }
        }
    ],

    items: {
        xtype: 'cartesian',
        reference: 'chart',
        store: {
            type: 'climate'
        },
        insetPadding: {
            top: 40,
            bottom: 40,
            left: 20,
            right: 40
        },
        interactions: {
            type: 'itemedit',
            tooltip: {
                renderer: function (tooltip, item, target, e) {
                    MasterApp.getController('MasterSol.controller.chart.ColumnChartController').onEditTipRender(tooltip, item, target, e);
                }
            },
            renderer: function (chart, data) {
                MasterApp.getController('MasterSol.controller.chart.ColumnChartController').onColumnEdit(chart, data);
            }
        },
        axes: [{
            type: 'numeric',
            position: 'left',
            minimum: 30,
            titleMargin: 20,
            title: {
                text: 'Temperature in °F'
            },
            listeners: {
                rangechange: function (axis, range) {
                    MasterApp.getController('MasterSol.controller.chart.ColumnChartController').onAxisRangeChange(axis, range);
                }
            }
        }, {
            type: 'category',
            position: 'bottom'
        }],
        animation: Ext.isIE8 ? false : true,
        series: {
            type: 'bar',
            xField: 'month',
            yField: 'highF',
            style: {
                minGapWidth: 20
            },
            highlight: {
                strokeStyle: 'black',
                fillStyle: 'gold'
            },
            label: {
                field: 'highF',
                display: 'insideEnd',
                renderer: function (value) {
                    MasterApp.getController('MasterSol.controller.chart.ColumnChartController').onSeriesLabelRender(value);
                }
            }
        },
        sprites: {
            type: 'text',
            text: 'Redwood City Climate Data',
            fontSize: 22,
            width: 100,
            height: 30,
            x: 40, // the sprite x position
            y: 20  // the sprite y position
        },
        listeners: {
            afterrender: function () {
                MasterApp.getController('MasterSol.controller.chart.ColumnChartController').onAfterRender();
            },
            beginitemedit: function (chart, interaction, item) {
                MasterApp.getController('MasterSol.controller.chart.ColumnChartController').onBeginItemEdit(chart, interaction, item);
            },
            enditemedit: function (chart, interaction, item, target) {
                MasterApp.getController('MasterSol.controller.chart.ColumnChartController').onEndItemEdit(chart, interaction, item, target);
            },
        }
    }

});