Ext.define('MasterSol.controller.chart.ColumnChartController', {
    extend: 'Ext.app.Controller',
    itemAnimationDuration: 0,
    init: function () {

    },


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
            chart = this.lookupReference('chart'),
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
                lineDash: [2,2]
            }
        });
    },



    onBeginItemEdit: function (chart, interaction, item) {
        var itemsMarker = item.sprite.getMarker(item.category),
            fx = itemsMarker.getTemplate().fx; // animation modifier

        this.itemAnimationDuration = fx.getDuration();
        fx.setDuration(0);
    },


    onEndItemEdit: function (chart, interaction, item, target) {
        var itemsMarker = item.sprite.getMarker(item.category),
            fx = itemsMarker.getTemplate().fx;

        fx.setDuration(this.itemAnimationDuration);
    }

});