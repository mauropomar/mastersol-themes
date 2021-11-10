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
    //  height: '100%',
    //  width: '100%',
    layout: 'fit',
    autoShow: true,
    border: false,
    constrain: true,
    constrainTo: 'panel-center',
    requires: [
        'MasterSol.view.chart.ColumnChart',
    ],
    tools: [{
        type: 'minimize',
        tooltip: 'Minimizar',
        default: true,
        name: 'btn_minimize',
        handler: function (evt, toolEl, owner, tool) {
            MasterApp.chart.minimize(this, evt, toolEl, owner, tool);
        },
    }, {
        iconCls: 'fa fa-expand',
        hidden: true,
        tooltip: 'Restaurar',
        default: true,
        name: 'btn_restore',
        handler: function (evt, toolEl, owner, tool) {
            MasterApp.chart.restore(this, evt, toolEl, owner, tool);

        }
    }],
    items: [{
        xtype: 'panel',
        layout: 'border',
        items: [{
            region: 'west',
            width: 100,
            collapsible: true,
            title: 'Opciones',
            split: true,
            items: [{
                xtype: 'segmentedbutton',
                vertical: true,
                width: '100%',
                allowToggle: true,
                items: [{
                    text: 'Leyenda',
                    menu: [
                        {
                            text: 'Mostrar u Ocultar',
                            checked: true,
                            handler: function (btn) {
                                MasterApp.chart.showLegend(btn);
                            }
                        },
                        {
                            text: 'Derecha',
                            name: 'right-legend',
                            action: 'legend',
                            checked: true,
                            handler: function () {
                                MasterApp.chart.setLegendPosition('right');
                            }
                        },
                        {
                            text: 'Izquierda',
                            name: 'left-legend',
                            action: 'legend',
                            checked: false,
                            handler: function (btn) {
                                btn.setChecked(true);
                                MasterApp.chart.setLegendPosition('left');
                            }
                        },
                        {
                            text: 'Arriba',
                            name: 'top-legend',
                            action: 'legend',
                            checked: false,
                            handler: function () {
                                MasterApp.chart.setLegendPosition('top');
                            }
                        },
                        {
                            text: 'Abajo',
                            name: 'bottom-legend',
                            action: 'legend',
                            checked: false,
                            handler: function () {
                                MasterApp.chart.setLegendPosition('bottom');
                            }
                        }
                    ]
                }, {
                    text: 'Valores',
                    menu: [{
                        text: 'Mostrar/Ocultar',
                        checked: false,
                        handler: function (btn) {
                            MasterApp.chart.showSeriesLabel(btn);
                        }
                    }, /*{
                        text: 'Dentro o Fuera',
                        pressed: false,
                        handler: function (btn) {
                            MasterApp.chart.showSeriesInsideLabel(btn);
                        }
                    }*/]
                }, {
                    text: 'Etiquetas',
                    menu: [
                        {
                            text: 'Mostrar u Ocultar Eje X',
                            checked: false,
                            handler: function (btn) {
                                MasterApp.chart.showLabel(1);
                            }
                        }, {
                            text: 'Mostrar u Ocultar Eje Y',
                            checked: false,
                            handler: function (btn) {
                                MasterApp.chart.showLabel(0);
                            }
                        }, {
                            text: 'Vertical',
                            name: 'vertical-label',
                            action: 'label',
                            checked: false,
                            handler: function (btn) {
                                MasterApp.chart.showLabelPosition('vertical');
                            }
                        }, {
                            text: 'Horizontal',
                            name: 'horizontal-label',
                            action: 'label',
                            checked: false,
                            handler: function (btn) {
                                MasterApp.chart.showLabelPosition('horizontal');
                            }
                        }, {
                            text: 'Inclinado',
                            name: 'inclinado-label',
                            action: 'label',
                            checked: false,
                            handler: function (btn) {
                                MasterApp.chart.showLabelPosition('inclinado');
                            }
                        }]
                }]
            }]
        }, {
            region: 'center',
            layout: 'fit',
            name: 'container_chart_panel',
            items: [],
            split: true,
            tbar: [{
                xtype: 'button',
                tooltip: 'Gráficos de Columnas',
                tooltipType: 'title',
                iconCls: 'fa fa-bar-chart',
                handler: function (btn) {
                    var window = btn.up('window');
                    MasterApp.getController('MasterSol.controller.chart.ChartController').addChart(window, 'column');
                }
            }, '-', {
                xtype: 'button',
                tooltip: 'Gráficos de Línea',
                tooltipType: 'title',
                iconCls: 'fa fa-line-chart',
                handler: function (btn) {
                    var window = btn.up('window');
                    MasterApp.getController('MasterSol.controller.chart.ChartController').addChart(window, 'line');
                }
            }, '-', {
                xtype: 'button',
                tooltip: 'Gráficos de Pie',
                tooltipType: 'title',
                iconCls: 'fa fa-pie-chart',
                handler: function (btn) {
                    var window = btn.up('window');
                    MasterApp.getController('MasterSol.controller.chart.ChartController').addChart(window, 'pie');
                }
            }, '-', {
                xtype: 'button',
                tooltip: 'Gráficos de Área',
                tooltipType: 'title',
                iconCls: 'fa fa-area-chart',
                handler: function (btn) {
                    var window = btn.up('window');
                    MasterApp.getController('MasterSol.controller.chart.ChartController').addChart(window, 'area');
                }
            }, '-', {
                xtype: 'button',
                tooltip: 'Gráficos de Barras',
                tooltipType: 'title',
                iconCls: 'fa fa-align-left',
                handler: function (btn) {
                    var window = btn.up('window');
                    MasterApp.getController('MasterSol.controller.chart.ChartController').addChart(window, 'stackbar');
                }
            }, '-', {
                xtype: 'button',
                tooltip: 'Gráficos Radar',
                tooltipType: 'title',
                iconCls: 'fa fa-chrome',
                handler: function (btn) {
                    var window = btn.up('window');
                    MasterApp.getController('MasterSol.controller.chart.ChartController').addChart(window, 'radar');
                }
            }, '->', {
                text: 'Guardar',
                iconCls: 'fa fa-save',
                xtype: 'splitbutton',
                menu: [{
                    text: 'PNG',
                    iconCls: 'fa fa-image',
                    handler: function (btn) {
                        var window = btn.up('window');
                        MasterApp.getController('MasterSol.controller.chart.ChartController').printChart(window, 'png');
                    }
                }, {
                    text: 'JPG',
                    iconCls: 'fa fa-image',
                    handler: function (btn) {
                        var window = btn.up('window');
                        MasterApp.getController('MasterSol.controller.chart.ChartController').printChart(window, 'jpg');
                    }
                }]
            }, {
                xtype: 'button',
                text: 'Cerrar',
                iconCls: 'fa fa-close',
                //   id: 'btn_cancelar_chart',
                handler: function (btn) {
                    var window = btn.up('window');
                    MasterApp.getController('MasterSol.controller.chart.ChartController').cancel(window);
                }
            }]
        }]
    }],
    listeners: {
        resize: function (window) {
            MasterApp.getController('MasterSol.controller.chart.ChartController').resizeWindow(window);
        },
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
