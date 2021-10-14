Ext.define('MasterSol.controller.chart.ColumnChartController', {
        extend: 'Ext.app.Controller',
        itemAnimationDuration: 0,
        chart: '',
        title: '',
        init: function () {

        },

        render: function (comp) {
            var json = MasterApp.getController('MasterSol.controller.chart.ChartController').jsonData;
            this.chart = Ext.create('Ext.chart.CartesianChart', {
                reference: 'chart',
                store: this.getStore(json),
                insetPadding: {
                    top: 40,
                    bottom: 40,
                    left: 20,
                    right: 40
                },
                legend: json['legend'],
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
                        text: json['label_y']
                    },
                    listeners: {
                        rangechange: this.onAxisRangeChange
                    }
                }, {
                    type: 'category',
                    position: 'bottom',
                    title: {
                        text: json['label_x']
                    }
                }],
                animation: Ext.isIE8 ? false : true,
                series: {
                    type: 'bar',
                    xField: this.getXField(json),
                    yField: this.getYField(json),
                    style: {
                        minGapWidth: 20
                    },
                    highlight: {
                        strokeStyle: 'black',
                        fillStyle: 'gold'
                    },
                    label: {
                        field: this.getYField(json),
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
                    //  text: json['label_y'],
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
            comp.add(this.chart);
        },

        getStore: function (json) {
            var store = {
                fields: json.fields,
                data: json.value
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
                sum += rec.get('valor');
            });

            mean = sum / store.getCount();
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
            tooltip.setHtml(record.get('label') + ': ' +
                Ext.util.Format.number(record.get(item.field)));
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
            var title = window.getTitle();
            var fileName = title + '.' + ext;
            MasterApp.getController('MasterSol.controller.chart.ChartController').saveBase64AsFile(this.chart.getImage("stream").data, fileName);
        }
    }
);
