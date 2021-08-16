Ext.define('MasterSol.controller.chart.ColumnChartController', {
        extend: 'Ext.app.Controller',
        itemAnimationDuration: 0,
        chart: '',
        init: function () {

        },

        render: function () {
            this.chart = Ext.create('Ext.chart.CartesianChart', {
                reference: 'chart',
                store: this.getStore(),
                insetPadding: {
                    top: 40,
                    bottom: 40,
                    left: 20,
                    right: 40
                },
                interactions: {
                    type: 'itemedit',
                    tooltip: {
                        renderer: this.onEditTipRender
                    },
                    renderer: this.onColumnEdit
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
                        rangechange: this.onAxisRangeChange
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
                        renderer: this.onSeriesLabelRender
                    },
                    tooltip: {
                        trackMouse: true,
                        renderer: this.onTooltipRender
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
                    scope: this,
                    afterrender: this.onAfterRender,
                    beginitemedit: this.onBeginItemEdit,
                    enditemedit: this.onEndItemEdit
                }
            });
            Ext.ComponentQuery.query('column-chart')[0].add(this.chart);
        },

        getStore: function () {
            var store = {
                fields: [
                    'month',
                    'high',
                    'low',
                    {
                        name: 'highF',
                        calculate: function (data) {
                            return data.high * 1.8 + 32;
                        }
                    },
                    {
                        name: 'lowF',
                        calculate: function (data) {
                            return data.low * 1.8 + 32;
                        }
                    }
                ],
                data: [
                    {month: 'Jan', high: 14.7, low: 5.6},
                    {month: 'Feb', high: 16.5, low: 6.6},
                    {month: 'Mar', high: 18.6, low: 7.3},
                    {month: 'Apr', high: 20.8, low: 8.1},
                    {month: 'May', high: 23.3, low: 9.9},
                    {month: 'Jun', high: 26.2, low: 11.9},
                    {month: 'Jul', high: 27.7, low: 13.3},
                    {month: 'Aug', high: 27.6, low: 13.2},
                    {month: 'Sep', high: 26.4, low: 12.1},
                    {month: 'Oct', high: 23.6, low: 9.9},
                    {month: 'Nov', high: 17, low: 6.8},
                    {month: 'Dec', high: 14.7, low: 5.8}
                ]
            };
            return store;
        },

        // The 'target' here is an object that contains information
        // about the target value when the drag operation on the column ends.
        onEditTipRender: function (tooltip, item, target, e) {
            tooltip.setHtml('Temperature °F: ' + target.yValue.toFixed(1));
        },

        onSeriesLabelRender: function (value) {
            return value.toFixed(1);
        },

        onColumnEdit: function (chart, data) {
            var threshold = 65,
                delta = 20,
                yValue = data.target.yValue,
                coldness;

            if (yValue < threshold) {
                coldness = Ext.Number.constrain((threshold - yValue) / delta, 0, 1);
                return {
                    fillStyle: 'rgba(133, 231, 252, ' + coldness.toString() + ')'
                };
            } else {
                return {
                    fillStyle: 'none'
                };
            }
        },

        onAfterRender: function () {
            var me = this,
                chart = this.chart,
                axis = chart.getAxis(0),
                store = chart.getStore();

            function onAxisRangeChange() {
                me.onAxisRangeChange(axis);
            }

            store.on({
                datachanged: onAxisRangeChange,
                update: onAxisRangeChange
            });
        },

        onAxisRangeChange: function (axis, range) {
            // this.lookupReference('chart') will fail here,
            // as at the time of this call
            // the chart is not yet in the component tree,
            // so we have to use axis.getChart() instead.
            var chart = axis.getChart(),
                store = chart.getStore(),
                sum = 0,
                mean;

            store.each(function (rec) {
                sum += rec.get('highF');
            });

            mean = sum / store.getCount();

            axis.setLimits({
                value: mean,
                line: {
                    title: {
                        text: 'Average high: ' + mean.toFixed(2) + '°F'
                    },
                    lineDash: [2, 2]
                }
            });
        },


        // Disable item's animaton for editing.
        onBeginItemEdit: function (chart, interaction, item) {
            var itemsMarker = item.sprite.getMarker(item.category),
                fx = itemsMarker.getTemplate().fx; // animation modifier

            this.itemAnimationDuration = fx.getDuration();
            fx.setDuration(0);
        },

        // Restore item's animation when editing is done.
        onEndItemEdit: function (chart, interaction, item, target) {
            var itemsMarker = item.sprite.getMarker(item.category),
                fx = itemsMarker.getTemplate().fx;

            fx.setDuration(this.itemAnimationDuration);
        },

        onTooltipRender: function (tooltip, record, item) {
            tooltip.setHtml(record.get('month') + ': ' +
                Ext.util.Format.number(record.get('high'), '0,000 (millions of USD)'));
        },
    }
);