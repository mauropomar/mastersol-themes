Ext.define('MasterSol.controller.chart.AreaChartController', {
    extend: 'Ext.app.Controller',
    chart: '',
    init: function () {

    },
    render: function () {
        this.chart = Ext.create('Ext.chart.CartesianChart', {
            reference: 'chart',
            store: this.getStore(),
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
                fields: ['china', 'japan', 'usa'],
                title: 'GDP in billions of US Dollars',
                grid: true,
                minimum: 0,
                maximum: 20000,
                majorTickSteps: 10,
                renderer: this.onAxisLabelRender
            }, {
                type: 'category',
                position: 'bottom',
                fields: 'year',
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

    getStore: function () {
        var store = {
            fields: ['year', 'china', 'japan', 'usa'],
            data: [
                {
                    "year": 1984,
                    "china": "546.877",
                    "japan": "1444.45",
                    "usa": "4040.70"
                },
                {
                    "year": 1985,
                    "china": "640.568",
                    "japan": "1585.09",
                    "usa": "4346.75"
                },
                {
                    "year": 1986,
                    "china": "710.989",
                    "japan": "1662.82",
                    "usa": "4590.13"
                },
                {
                    "year": 1987,
                    "china": "813.716",
                    "japan": "1775.31",
                    "usa": "4870.23"
                },
                {
                    "year": 1988,
                    "china": "937.369",
                    "japan": "1968.77",
                    "usa": "5252.63"
                },
                {
                    "year": 1989,
                    "china": "1013.75",
                    "japan": "2155.16",
                    "usa": "5657.70"
                },
                {
                    "year": 1990,
                    "china": "1091.19",
                    "japan": "2359.41",
                    "usa": "5979.58"
                },
                {
                    "year": 1991,
                    "china": "1231.24",
                    "japan": "2518.99",
                    "usa": "6174.05"
                },
                {
                    "year": 1992,
                    "china": "1438.13",
                    "japan": "2597.52",
                    "usa": "6539.30"
                },
                {
                    "year": 1993,
                    "china": "1678.47",
                    "japan": "2663.86",
                    "usa": "6878.70"
                },
                {
                    "year": 1994,
                    "china": "1938.76",
                    "japan": "2744.05",
                    "usa": "7308.78"
                },
                {
                    "year": 1995,
                    "china": "2195.57",
                    "japan": "2855.69",
                    "usa": "7664.05"
                },
                {
                    "year": 1996,
                    "china": "2459.20",
                    "japan": "2983.71",
                    "usa": "8100.18"
                },
                {
                    "year": 1997,
                    "china": "2733.93",
                    "japan": "3083.22",
                    "usa": "8608.53"
                },
                {
                    "year": 1998,
                    "china": "2979.16",
                    "japan": "3054.24",
                    "usa": "9089.15"
                },
                {
                    "year": 1999,
                    "china": "3254.63",
                    "japan": "3094.80",
                    "usa": "9660.63"
                },
                {
                    "year": 2000,
                    "china": "3608.29",
                    "japan": "3236.67",
                    "usa": "10284.75"
                },
                {
                    "year": 2001,
                    "china": "3996.84",
                    "japan": "3322.20",
                    "usa": "10621.83"
                },
                {
                    "year": 2002,
                    "china": "4427.49",
                    "japan": "3382.97",
                    "usa": "10977.53"
                },
                {
                    "year": 2003,
                    "china": "4967.80",
                    "japan": "3508.57",
                    "usa": "11510.68"
                },
                {
                    "year": 2004,
                    "china": "5619.96",
                    "japan": "3690.16",
                    "usa": "12274.93"
                },
                {
                    "year": 2005,
                    "china": "6456.26",
                    "japan": "3858.50",
                    "usa": "13093.70"
                },
                {
                    "year": 2006,
                    "china": "7498.22",
                    "japan": "4044.39",
                    "usa": "13855.90"
                },
                {
                    "year": 2007,
                    "china": "8790.82",
                    "japan": "4243.03",
                    "usa": "14477.63"
                },
                {
                    "year": 2008,
                    "china": "9826.85",
                    "japan": "4281.20",
                    "usa": "14718.58"
                },
                {
                    "year": 2009,
                    "china": "10813.81",
                    "japan": "4075.29",
                    "usa": "14418.73"
                },
                {
                    "year": 2010,
                    "china": "12085.45",
                    "japan": "4316.98",
                    "usa": "14964.40"
                },
                {
                    "year": 2011,
                    "china": "13482.08",
                    "japan": "4386.15",
                    "usa": "15517.93"
                },
                {
                    "year": 2012,
                    "china": "14774.38",
                    "japan": "4530.29",
                    "usa": "16163.15"
                },
                {
                    "year": 2013,
                    "china": "16149.09",
                    "japan": "4667.55",
                    "usa": "16768.05"
                },
                {
                    "year": 2014,
                    "china": "17632.01",
                    "japan": "4788.03",
                    "usa": "17416.25"
                }
            ]
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
                    tooltip.setHtml(title + ' (' + record.get('year') + '): ' + record.get(field));
                }
            }
        };
    },

    onAfterRender: function () {
        this.chart.setSeries([
            this.getSeriesConfig('usa', 'USA'),
            this.getSeriesConfig('china', 'China'),
            this.getSeriesConfig('japan', 'Japan')
        ]);
    }
});