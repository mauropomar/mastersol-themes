Ext.define('MasterSol.controller.chart.PieChartController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    render: function () {
        var _this = this;
        var chart = new CanvasJS.Chart("chartPieContainer", {
            exportEnabled: true,
            animationEnabled: true,
            title: {
                text: "State Operating Funds"
            },
            legend: {
                cursor: "pointer",
                itemclick: function (e) {
                    _this.explodePie(e);
                }
            },
            data: [{
                type: "pie",
                showInLegend: true,
                toolTipContent: "{name}: <strong>{y}%</strong>",
                indexLabel: "{name} - {y}%",
                dataPoints: [
                    {y: 26, name: "School Aid", exploded: true},
                    {y: 20, name: "Medical Aid"},
                    {y: 5, name: "Debt/Capital"},
                    {y: 3, name: "Elected Officials"},
                    {y: 7, name: "University"},
                    {y: 17, name: "Executive"},
                    {y: 22, name: "Other Local Assistance"}
                ]
            }]
        });
        chart.render();
        document.getElementsByClassName('canvasjs-chart-credit')[0].innerHTML = '';
    },

    explodePie: function (e) {
        if (typeof (e.dataSeries.dataPoints[e.dataPointIndex].exploded) === "undefined" || !e.dataSeries.dataPoints[e.dataPointIndex].exploded) {
            e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
        } else {
            e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
        }
        e.chart.render();

    }
});