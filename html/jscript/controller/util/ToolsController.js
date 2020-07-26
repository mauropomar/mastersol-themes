Ext.define('MasterSol.controller.util.ToolsController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    getArrayBtn:function(){
        var array =  ['btn_maximizar', 'btn_trash', 'btn_add', 'btn_refresh', 'btn_download', 'btn_print'];
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
            var query = 'name=' + tools[i]['name'];
            var btn = '[' + query + ']';
            header.remove(Ext.ComponentQuery.query(btn)[0]);
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
                tooltip: newbuttons[i].tooltip,
                url: newbuttons[i].url,
                scope: this,
                handler: function (evt, toolEl, owner, tool) {
                    this.callFuncion(evt, toolEl, owner, tool);
                }
            }
            header.add(obj);
        }
        var others = this.getButtonsDefaut();
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

    callFuncion: function (evt, toolEl, owner, button) {
    /*    var gridSection = MasterApp.globales.getGridSection();
        var mask = new Ext.LoadMask(gridSection, {
            msg: 'Cargando...'
        });
        mask.show();
        var idMenu = gridSection.idMenu;
        var idSection = gridSection.idSection;
        var record = MasterApp.globales.getRecordSection();
        var recordId = (record != null) ? record.data.id : null;
        var store = gridSection.getStore();
        var ejecutar = {
            url: 'php/manager/managerfunctions.php',
            method: 'GET',
            scope: this,
            params: {
                idregistro: recordId,
                idsection: idSection,
                idmenu: idMenu,
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
        Ext.Ajax.request(ejecutar);*/
    },

    getButtonsDefaut: function () {
        return [{
            iconCls: 'fa fa-refresh',
            tooltip: 'Refrescar',
            name: 'btn_refresh',
            handler: function (evt, toolEl, owner, tool) {
              //  var window = owner.up('window');
              //  window.getController().refreshSectionActive(this, window, evt, toolEl, owner, tool);
            }
        }, {
            iconCls: 'fa fa-plus',
            tooltip: 'Agregar',
            name: 'btn_add',
       //     handler: 'nuevoRegistro'
        }, {
            iconCls: 'fa fa-edit',
            hidden: true,
            // handler: 'onExpandAll',
            tooltip: 'Editar'
        }, {
            iconCls: 'fa fa-print',
            name: 'btn_print',
            //    handler: 'onExpandAll',
            tooltip: 'Imprimir'
        }, {
            iconCls: 'fa fa-download',
            name: 'btn_download',
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
                //disabled: true,
                name: 'btn_trash',
                // handler: 'onExpandAll',
                tooltip: 'Borrar',
                handler: function (evt, toolEl, owner, tool) {
                 /*   var window = owner.up('window');
                    window.getController().borrarFila(this, window, evt, toolEl, owner, tool);*/

                }
            }, {
                type: 'minimize',
                tooltip: 'Minimizar',
                name: 'btn_minimizar',
                handler: function (evt, toolEl, owner, tool) {
                    var window = owner.up('window');
                    MasterApp.section.minimize(this, evt, toolEl, owner, tool);
                }
            }, {
                iconCls: 'fa fa-expand',
                hidden: true,
                tooltip: 'Restaurar',
                name: 'btn_restore',
                handler: function (evt, toolEl, owner, tool) {
                /*    var window = owner.up('window');
                    window.getController().restore(this, evt, toolEl, owner, tool);*/

                }
            }, {
                iconCls: 'fa fa-clone',
                name: 'btn_clone',
                hidden: true,
                handler: function (evt, toolEl, owner, tool) {
                 /*   var window = owner.up('window');
                    window.getController().restoreDefault(this, evt, toolEl, owner, tool);*/
                }
            }, {
                iconCls: 'fa fa-square-o',
                tooltip: 'Maximizar',
                name: 'btn_maximizar',
                hidden: true,
                handler: function (evt, toolEl, owner, tool) {
              /*      var window = owner.up('window');
                    window.getController().maximizar(this, evt, toolEl, owner, tool);*/
                }
            }, {
                iconCls: 'fa fa-close',
                tooltip: 'Cerrar',
                name: 'btn_close',
                handler: function (evt, toolEl, owner, tool) {
                   var window = owner.up('window');
                    window.close();
                }
            }];
    },


});