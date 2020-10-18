Ext.define('MasterSol.controller.util.ToolsController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    getArrayBtn:function(){
        var array =  ['btn_maximize', 'btn_trash', 'btn_add', 'btn_refresh', 'btn_download', 'btn_print'];
        return array;
    },

    setVisibleBtn: function (window, array, hide) {
        var btn;
        for (var i = 0; i < array.length; i++) {
            btn = this.getBtnTools(window, array[i]);
            btn.setVisible(!hide);
        }
    },

    setButtons:function (window, newbuttons) {
        this.removeAll(window);
        this.add(window, newbuttons);
    },

    removeAll: function (window) {
        var header = window.getHeader();
        var tools = window.getHeader().tools;
        for (var i = 0; i < tools.length; i++) {
            var query = '#' + tools[i]['id'];
            header.remove(Ext.ComponentQuery.query(query)[0]);
        }
    },

    add: function (window, newbuttons) {
        var header = window.getHeader();
        for (var i = 0; i < newbuttons.length; i++) {
            var obj = {
                action: newbuttons[i].action,
                iconCls: newbuttons[i].iconCls,
                name: newbuttons[i].name,
                enable: newbuttons[i].enable,
                default:false,
                tooltip: newbuttons[i].tooltip,
                url: newbuttons[i].url,
                scope: this,
                handler: function (evt, toolEl, owner, tool) {
                    this.callFunction(evt, toolEl, owner, tool);
                }
            }
            header.add(obj);
        }
        var others = this.getButtonsDefaut(window);
        for (var i = 0; i < others.length; i++) {
            header.add(others[i]);
        }
    },

    //devuelve un boton del tool de la ventana especifico
    getBtnTools: function (comp, text) {
        var tools = (comp.xtype === 'window-menu') ? comp.tools : comp.up('window').tools;
        var btn;
        for (var j = 0; j < tools.length; j++) {
            if (tools[j].name == text)
                btn = tools[j];
        }
        return btn;
    },

    callFunction: function (evt, toolEl, owner, button) {
     var grid = MasterApp.globals.getGridSection();
        var mask = new Ext.LoadMask(grid, {
            msg: 'Cargando...'
        });
        mask.show();
        var idmenu = grid.idmenu;
        var idsection = grid.idsection;
        var record = MasterApp.globals.getRecordSection();
        var recordId = (record != null) ? record.data.id : null;
        var store = grid.getStore();
        var execute = {
            url: 'app/managerfunctions',
            method: 'GET',
            scope: this,
            params: {
                idregister: recordId,
                idsection: idsection,
                idmenu: idmenu,
                url: button.url,
                name: button.name,
                action: button.action
            },
            success: function (response) {
                mask.hide();
                var json = Ext.JSON.decode(response.responseText);
                var datos = json[0].data;
                store.loadData(datos);
            }
        };
        Ext.Ajax.request(execute);
    },

    showButtonsNotDefault:function(window, show){
        var tools = window.tools;
        for (var j = 0; j < tools.length; j++) {
            if (!tools[j].default){
                var query = '#' + tools[j]['id'];
                Ext.ComponentQuery.query(query)[0].setVisible(show);
            }
        }
    },

    getButtonsDefaut: function (win) {
        return [{
            iconCls: 'fa fa-refresh',
            tooltip: 'Refrescar',
            default:true,
            name: 'btn_refresh',
            handler: function (evt, toolEl, owner, tool) {
                var window = owner.up('window');
                MasterApp.section.refreshSectionActive(window);
            }
        }, {
            iconCls: 'fa fa-plus',
            tooltip: 'Agregar',
            hidden:win.isAlert,
            default:true,
            name: 'btn_add',
            handler: function(evt, toolEl, owner, tool){
                var window = owner.up('window');
                MasterApp.magnament.newRegister(window);
            }
        }, {
            iconCls: 'fa fa-edit',
            hidden: true,
            default:true,
            // handler: 'onExpandAll',
            tooltip: 'Editar'
        }, {
            iconCls: 'fa fa-print',
            name: 'btn_print',
            default:true,
            //    handler: 'onExpandAll',
            tooltip: 'Imprimir'
        }, {
            iconCls: 'fa fa-download',
            name: 'btn_download',
            default:true,
            //  handler: 'onExpandAll',
            listeners: {
                'render': function (c) {
                    Ext.create('Ext.tip.ToolTip', {
                        target: c.getEl(),
                        autoHide: false,
                        items: [{
                            xtype: 'button',
                            tooltip: 'Exportar a excel',
                        //    cls: 'x-button-menu-modulo',
                            scope: this,
                            iconCls: 'fa fa-file-excel-o',
                            handler: function (evt, toolEl, owner, tool) {
                           /*     var window = this.up('window');
                                var grid = MasterApp.globales.getSectionPrincipalByWindow(window);
                                MasterApp.getController('MasterSol.controller.genericas.GridController').downloadExcelXml(false, grid);*/
                            }
                        }, {
                            xtype: 'button',
                            tooltip: 'Exportar a word',
                        //    cls: 'x-button-menu',
                            iconCls: 'fa fa-file-word-o'
                        }, {
                            xtype: 'button',
                            tooltip: 'Exportar a pdf',
                        //    cls: 'x-button-menu',
                            iconCls: 'fa fa-file-pdf-o'
                        }, {
                            xtype: 'button',
                            tooltip: 'Exportar a odt',
                      //      cls: 'x-button-menu',
                            iconCls: 'fa fa-file-text-o'
                        }, {
                            xtype: 'button',
                            tooltip: 'Exportar a cvs',
                        //    cls: 'x-button-menu',
                            iconCls: 'fa fa-file-zip-o'
                        }]
                    })
                }
            }
        }
            , {
                iconCls: 'fa fa-trash',
                name: 'btn_trash',
                default:true,
                tooltip: 'Borrar',
                handler: function (evt, toolEl, owner, tool) {
                    var window = owner.up('window');
                   MasterApp.section.deleteRow(this, window, evt, toolEl, owner, tool);

                }
            }, {
                type: 'minimize',
                tooltip: 'Minimizar',
                default:true,
                name: 'btn_minimize',
                handler: function (evt, toolEl, owner, tool) {
                    MasterApp.section.minimize(this, evt, toolEl, owner, tool);
                }
            }, {
                iconCls: 'fa fa-expand',
                hidden: true,
                tooltip: 'Restaurar',
                default:true,
                name: 'btn_restore',
                handler: function (evt, toolEl, owner, tool) {
                    MasterApp.section.restore(this, evt, toolEl, owner, tool);

                }
            }, {
                iconCls: 'fa fa-clone',
                name: 'btn_clone',
                default:true,
                hidden: true,
                handler: function (evt, toolEl, owner, tool) {
                 /*   var window = owner.up('window');
                    window.getController().restoreDefault(this, evt, toolEl, owner, tool);*/
                }
            }, {
                iconCls: 'fa fa-square-o',
                tooltip: 'Maximizar',
                name: 'btn_maximize',
                default:true,
                hidden: true,
                handler: function (evt, toolEl, owner, tool) {
                    MasterApp.section.maximize(this, evt, toolEl, owner, tool);
                }
            }, {
                iconCls: 'fa fa-close',
                tooltip: 'Cerrar',
                default:true,
                name: 'btn_close',
                handler: function (evt, toolEl, owner, tool) {
                   var window = owner.up('window');
                    window.close();
                }
            }];
    },


});