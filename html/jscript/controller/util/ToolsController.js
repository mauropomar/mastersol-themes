Ext.define('MasterSol.controller.util.ToolsController', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.lastIdSectionSelct = null;
    },

    getArrayBtn: function () {
        var array = ['btn_maximize', 'btn_trash', 'btn_add', 'btn_download', 'btn_print', 'btn_export_capsule', 'btn_import_capsula', 'btn_save_bd', 'btn_restore_bd'];
        return array;
    },

    setVisibleBtn: function (window, array, hide) {
        var btn;
        for (var i = 0; i < array.length; i++) {
            btn = this.getBtnTools(window, array[i]);
            if (btn) {
                if (btn.name === 'btn_add' && window.isAlert)
                    btn.setVisible(false);
                else
                    btn.setVisible(!hide);
            }
        }
    },

    setButtons: function () {
        var grid = MasterApp.globals.getGridSection();
        var idsection = grid.idsection;
        if (grid) {
            var window = grid.up('window');
            if (idsection !== this.lastIdSectionSelct) {
                var newTools = grid.btnTools;
                this.removeAll(window);
                this.add(window, newTools);
                this.lastIdSectionSelct = idsection;
            }
        }
    },

    setButtonsInit: function (window, newbuttons) {
        this.removeAll(window);
        this.add(window, newbuttons, true);

    },

    removeAll: function (window) {
        var header = window.getHeader();
        var tools = window.getHeader().tools;
        for (var i = tools.length - 1; i >= 0; i--) {
            var query = '#' + tools[i]['id'];
            if (tools[i].url) {
                header.remove(Ext.ComponentQuery.query(query)[0]);
                tools.splice(i, 1);
            }
        }
    },

    add: function (window, newbuttons, addDefault) {
        if (newbuttons == null)
            return;
        var header = window.getHeader();
        var array = [];
        for (var i = 0; i < newbuttons.length; i++) {
            var obj = {
                action: newbuttons[i].action,
                iconCls: newbuttons[i].iconCls,
                name: newbuttons[i].name,
                enable: newbuttons[i].enable,
                default: false,
                id: newbuttons[i].id,
                tooltip: newbuttons[i].tooltip,
                url: newbuttons[i].url,
                scope: this,
                handler: function (evt, toolEl, owner, tool) {
                    this.callFunction(evt, toolEl, owner, tool);
                }
            };
            array.push(obj);
        }
        header.add(1, array);
        if (addDefault) {
            var others = this.getButtonsDefaut(window);
            for (var i = 0; i < others.length; i++) {
                header.add(others[i]);
            }
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
        var extra_params = this.getExtraParams();
        var execute = {
            url: 'app/executebuttons',
            method: 'GET',
            scope: this,
            params: {
                idregister: recordId,
                idsection: idsection,
                idmenu: idmenu,
                idbutton: button.id,
                name: button.name,
                action: button.action,
                extra_params: extra_params,
                report_format: 'html'
            },
            success: function (response) {
                mask.hide();
                var params = response.request.params;
                var json = Ext.JSON.decode(response.responseText);
                if (json.success) {
                    if (json.type === 4) {
                        var tabMagnament = Ext.ComponentQuery.query('#tabmagnament')[0];
                        tabMagnament.show();
                        tabMagnament.setActiveTab(6);
                        tabMagnament.expand(false);
                        tabMagnament.setDisabled(false);
                        MasterApp.report.loadValues(json.value);
                    }
                    if (json.type === 5) {
                        var extraParams = MasterApp.tools.getExtraParams();
                        MasterApp.report.removeAll();
                        MasterApp.report.generateReport(params, json.value, json.name, extraParams);
                    }
                } else {
                    Ext.MessageBox.show({
                        title: 'Error',
                        msg: json.msg,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.INFO
                    });
                }
            }
        };
        Ext.Ajax.request(execute);
    },

    showButtonsNotDefault: function (window, show) {
        var tools = window.tools;
        for (var j = 0; j < tools.length; j++) {
            if (!tools[j].default) {
                var query = '#' + tools[j]['id'];
                if (Ext.ComponentQuery.query(query)[0])
                    Ext.ComponentQuery.query(query)[0].setVisible(show);
                else
                    console.log(tools[j]['name']);
            }
        }
    },

    getButtonsDefaut: function (win) {
        return [{
            iconCls: 'fa fa-floppy-o',
            tooltip: 'Salvar sistema y base de datos',
            default: true,
            name: 'btn_save_bd',
            handler: function (evt, toolEl, owner, tool) {
                var window = owner.up('window');
                MasterApp.getController('MasterSol.controller.database.DatabaseSaveController').showWindow();
            }
        }, {
            iconCls: 'fa fa-database',
            tooltip: 'Restaurar sistema y base de datos',
            default: true,
            name: 'btn_restore_bd',
            handler: function (evt, toolEl, owner, tool) {
                var window = owner.up('window');
                MasterApp.getController('MasterSol.controller.database.DatabaseRestoreController').showWindow();
            }
        }, {
            iconCls: 'fa fa-list-alt',
            tooltip: 'Exportar Capsula',
            default: true,
            name: 'btn_export_capsule',
            handler: function (evt, toolEl, owner, tool) {
                var window = owner.up('window');
                MasterApp.getController('MasterSol.controller.capsule.CapsuleExportController').showWindow();
            }
        }, {
            iconCls: 'fa fa-hdd-o',
            tooltip: 'Importar Capsula',
            default: true,
            name: 'btn_import_capsula',
            handler: function (evt, toolEl, owner, tool) {
                var window = owner.up('window');
                MasterApp.getController('MasterSol.controller.capsule.CapsuleImportController').showWindow();
            }
        }, {
            iconCls: 'fa fa-plus',
            tooltip: 'Agregar',
            hidden: win.isAlert,
            default: true,
            name: 'btn_add',
            handler: function (evt, toolEl, owner, tool) {
                var window = owner.up('window');
                MasterApp.magnament.newRegister(window);
            }
        }, {
            iconCls: 'fa fa-edit',
            hidden: true,
            default: true,
            // handler: 'onExpandAll',
            tooltip: 'Editar'
        }, {
            iconCls: 'fa fa-print',
            name: 'btn_print',
            default: true,
            //    handler: 'onExpandAll',
            tooltip: 'Imprimir'
        }, {
            iconCls: 'fa fa-download',
            name: 'btn_download',
            default: true,
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
        }, {
            iconCls: 'fa fa-trash',
            name: 'btn_trash',
            default: true,
            tooltip: 'Borrar',
            handler: function (evt, toolEl, owner, tool) {
                var window = owner.up('window');
                MasterApp.section.deleteRow(this, window, evt, toolEl, owner, tool);

            }
        }, {
            type: 'minimize',
            tooltip: 'Minimizar',
            default: true,
            name: 'btn_minimize',
            handler: function (evt, toolEl, owner, tool) {
                MasterApp.section.minimize(this, evt, toolEl, owner, tool);
            }
        }, {
            iconCls: 'fa fa-expand',
            hidden: true,
            tooltip: 'Restaurar',
            default: true,
            name: 'btn_restore',
            handler: function (evt, toolEl, owner, tool) {
                MasterApp.section.restore(this, evt, toolEl, owner, tool);

            }
        }, {
            iconCls: 'fa fa-clone',
            name: 'btn_clone',
            default: true,
            hidden: true,
            handler: function (evt, toolEl, owner, tool) {
                /*   var window = owner.up('window');
                   window.getController().restoreDefault(this, evt, toolEl, owner, tool);*/
            }
        }, {
            iconCls: 'fa fa-square-o',
            tooltip: 'Maximizar',
            name: 'btn_maximize',
            default: true,
            hidden: true,
            handler: function (evt, toolEl, owner, tool) {
                MasterApp.section.maximize(this, evt, toolEl, owner, tool);
            }
        }, {
            iconCls: 'fa fa-close',
            tooltip: 'Cerrar',
            default: true,
            name: 'btn_close',
            handler: function (evt, toolEl, owner, tool) {
                var window = owner.up('window');
                window.close();
                MasterApp.section.adjustOtherWindowsMaximize();
            }
        }];
    },

    getExtraParams: function () {
        var params = MasterApp.report.getArrayStringKey();
        params = (params === '') ? '' : params;
        return params;
    }
})
;