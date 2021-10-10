/**
 * Demonstrates a basic window control.
 */
Ext.define('MasterSol.view.chart.WindowChart', {
    extend: 'Ext.window.Window',
    xtype: 'window-chart',
    closable: true,
    name: 'window-menu',
    idmenu: '',
    isminimize: false,
    attributes: {
        posX: 0,
        posY: 0,
        width: 0,
        height: 0
    },
    closeAction: 'destroy',
    height: '80%',
    width: '50%',
    layout: 'fit',
    autoShow: true,
    requires: [
        'MasterSol.view.chart.ColumnChart',
    ],
    tools: [{
        type: 'minimize',
        tooltip: 'Minimizar',
        default: true,
        name: 'btn_minimize',
        handler: function (evt, toolEl, owner, tool) {
            MasterApp.getController('MasterSol.controller.chart.ChartController').minimize(this, evt, toolEl, owner, tool);
        },
    }, {
        iconCls: 'fa fa-expand',
        hidden: true,
        tooltip: 'Restaurar',
        default: true,
        name: 'btn_restore',
        handler: function (evt, toolEl, owner, tool) {
            MasterApp.getController('MasterSol.controller.chart.ChartController').restore(this, evt, toolEl, owner, tool);

        }
    }],
    items: [{
        xtype: 'panel',
        layout: 'fit',
        items: [{
            region: 'center',
            layout: 'fit',
            id: 'container_chart_panel',
            items: [{
                xtype: 'column-chart'
            }],
            tbar: [{
                xtype: 'button',
                tooltip: 'Gráficos de Columnas',
                tooltipType: 'title',
                iconCls: 'fa fa-bar-chart',
                handler: function () {
                    MasterApp.getController('MasterSol.controller.chart.ChartController').addChart('column');
                }
            }, '-', {
                xtype: 'button',
                tooltip: 'Gráficos de Línea',
                tooltipType: 'title',
                iconCls: 'fa fa-line-chart',
                handler: function () {
                    MasterApp.getController('MasterSol.controller.chart.ChartController').addChart('line');
                }
            }, '-', {
                xtype: 'button',
                tooltip: 'Gráficos de Pie',
                tooltipType: 'title',
                iconCls: 'fa fa-pie-chart',
                handler: function () {
                    MasterApp.getController('MasterSol.controller.chart.ChartController').addChart('pie');
                }
            }, '-', {
                xtype: 'button',
                tooltip: 'Gráficos de Área',
                tooltipType: 'title',
                iconCls: 'fa fa-area-chart',
                handler: function () {
                    MasterApp.getController('MasterSol.controller.chart.ChartController').addChart('area');
                }
            }, '-', {
                xtype: 'button',
                tooltip: 'Gráficos de Barras',
                tooltipType: 'title',
                iconCls: 'fa fa-align-left',
                handler: function () {
                    MasterApp.getController('MasterSol.controller.chart.ChartController').addChart('stackbar');
                }
            }, '-', {
                xtype: 'button',
                tooltip: 'Gráficos Radar',
                tooltipType: 'title',
                iconCls: 'fa fa-chrome',
                handler: function () {
                    MasterApp.getController('MasterSol.controller.chart.ChartController').addChart('radar');
                }
            }, '->', {
                text: 'Guardar',
                iconCls: 'fa fa-save',
                xtype: 'splitbutton',
                menu: [{
                    text: 'PNG',
                    iconCls: 'fa fa-image',
                    handler: function () {
                        MasterApp.getController('MasterSol.controller.chart.ChartController').printChart('png');
                    }
                }, {
                    text: 'JPG',
                    iconCls: 'fa fa-image',
                    handler: function () {
                        MasterApp.getController('MasterSol.controller.chart.ChartController').printChart('jpg');
                    }
                }]
            }, {
                xtype: 'button',
                text: 'Cancelar',
                iconCls: 'fa fa-close',
                id: 'btn_cancelar_chart',
                handler: function () {
                    MasterApp.getController('MasterSol.controller.chart.ChartController').cancel();
                }
            }]
        }]
    }],
    listeners: {
        close: function (window) {
            MasterApp.footer.removeWindowCombo(window);
        },
        afterrender: function (win) {
            win.header.el.on('dblclick', function () {
                MasterApp.getController('MasterSol.controller.chart.ChartController').dblClickHeader(win);
            });
        }
    }
});
